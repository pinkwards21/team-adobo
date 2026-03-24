
import { db, serverTimestamp } from './firebase-core.js';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Calculates the OJT week number based on the student's OJT start date.
 * @param {string} dateStr - The current journal date (YYYY-MM-DD).
 * @param {string} ojtStartDate - The student's official OJT start date.
 * @returns {number} - The week number (starting from 1).
 */
export function calculateWeekNumber(dateStr, ojtStartDate) {
    if (!ojtStartDate) return 1;

    const start = new Date(ojtStartDate);
    const current = new Date(dateStr);

    // Calculate difference in days
    const diffTime = current - start;
    if (diffTime < 0) return 1; // Before start date

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7) + 1;
}

/**
 * Determines if a specific date is a scheduled workday for a student.
 * Checks global 'workdays' overrides first, then falls back to student's work schedule.
 * @param {string} dateStr - The date to check (YYYY-MM-DD).
 * @param {string} userId - The student's unique ID.
 * @returns {Promise<boolean>} - True if it's a workday, false otherwise.
 */
export async function checkWorkday(dateStr, userId) {
    try {
        // 1. Check Global Overrides (Holidays/Admin defined)
        const workdayRef = doc(db, "workdays", dateStr);
        const workdaySnap = await getDoc(workdayRef);
        if (workdaySnap.exists()) {
            return workdaySnap.data().isWorkday;
        }

        // 2. Check Student individual schedule
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) return true;

        const userData = userDoc.data();
        const schedule = userData.workSchedule || [1, 2, 3, 4, 5]; // Default Mon-Fri
        const dayOfWeek = new Date(dateStr).getDay();

        return schedule.includes(dayOfWeek);
    } catch (error) {
        console.error("Check Workday Error:", error);
        return true;
    }
}

/**
 * Analyzes a student's submission progress.
 * Compares submitted journals against their expected work schedule.
 * @param {string} userId - The student's ID.
 * @returns {Promise<Object>} - Summary of submitted and missing journal dates.
 */
export async function getStudentProgress(userId) {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (!userDoc.exists()) throw new Error("User not found");

        const userData = userDoc.data();
        const ojtStart = userData.ojtStart;
        const schedule = userData.workSchedule || [1, 2, 3, 4, 5];

        const journals = await getStudentJournals(userId);
        const submittedDates = new Set(journals.filter(j => j.submitted).map(j => j.date));

        let missingDates = [];
        if (ojtStart) {
            const startDate = new Date(ojtStart);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Loop from start date to today
            let current = new Date(startDate);
            while (current <= today) {
                const dateStr = current.toISOString().split('T')[0];
                const dayOfWeek = current.getDay();

                // If it's a scheduled workday AND no journal exists
                if (schedule.includes(dayOfWeek) && !submittedDates.has(dateStr)) {
                    missingDates.push(dateStr);
                }

                current.setDate(current.getDate() + 1);
            }
        }

        return {
            totalSubmitted: submittedDates.size,
            totalMissing: missingDates.length,
            missingDates: missingDates,
            journals: journals,
            userData: userData
        };
    } catch (error) {
        console.error("Get Student Progress Error:", error);
        throw error;
    }
}

/**
 * Saves a journal entry (Draft or Submission).
 * Validates against OJT schedule and review status.
 * @param {string} userId - The student's ID.
 * @param {string} date - The journal date.
 * @param {string} content - Activity logs.
 * @param {boolean} submitted - Whether to finalize the submission.
 * @returns {Promise<Object>} - The saved journal data.
 */
export async function saveJournal(userId, date, content, submitted = false) {
    const isWorkday = await checkWorkday(date, userId);
    if (!isWorkday && submitted) {
        throw new Error("This date is not part of your OJT schedule.");
    }

    const userDoc = await getDoc(doc(db, "users", userId));
    const userData = userDoc.data();
    const week = calculateWeekNumber(date, userData?.ojtStart);

    const journalId = `${userId}_${date}`;
    const journalData = {
        userId,
        date,
        week,
        content,
        submitted,
        reviewed: false,
        remarks: "",
        updatedAt: serverTimestamp()
    };

    if (submitted) {
        journalData.timestamp = serverTimestamp();
    }

    try {
        const journalRef = doc(db, "journals", journalId);
        const journalDoc = await getDoc(journalRef);

        if (journalDoc.exists() && journalDoc.data().reviewed) {
            throw new Error("Cannot edit a journal that has already been reviewed.");
        }

        await setDoc(journalRef, journalData, { merge: true });
        return { id: journalId, ...journalData };
    } catch (error) {
        console.error("Save Journal Error:", error);
        throw error;
    }
}

/**
 * Retrieves all journal entries for a specific student.
 * @param {string} userId - The student's ID.
 * @returns {Promise<Array>} - List of journal objects, ordered by date.
 */
export async function getStudentJournals(userId) {
    try {
        const q = query(
            collection(db, "journals"),
            where("userId", "==", userId),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Get Student Journals Error:", error);
        throw error;
    }
}

/**
 * Fetches a single journal entry by user and date.
 * @param {string} userId - The student's ID.
 * @param {string} date - The date (YYYY-MM-DD).
 * @returns {Promise<Object|null>}
 */
export async function getJournal(userId, date) {
    const journalId = `${userId}_${date}`;
    const docRef = doc(db, "journals", journalId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}
