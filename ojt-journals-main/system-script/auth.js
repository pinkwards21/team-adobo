
import { auth, db } from './firebase-core.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/**
 * Handles user authentication via email and password.
 * @param {string} email - Student or Admin email.
 * @param {string} password - User password.
 * @returns {Promise<Object>} - User object with associated Firestore data.
 * @throws {Error} - If authentication fails or user record is missing.
 */
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch role and other details from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            return { user, ...userDoc.data() };
        } else {
            throw new Error("User data not found in database.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        throw error;
    }
}

/**
 * Redirects the user to their designated dashboard based on their role.
 * @param {string} role - 'admin' or 'student'.
 */
export function redirectUserByRole(role) {
    const isSubfolder = window.location.pathname.includes('/admin-pages/') || window.location.pathname.includes('/student-pages/');
    const prefix = isSubfolder ? '../' : './';

    if (role === 'admin') {
        window.location.href = prefix + 'admin-pages/admin-dashboard.html';
    } else if (role === 'student') {
        window.location.href = prefix + 'student-pages/dashboard.html';
    } else {
        window.location.href = prefix + 'index.html';
    }
}

/**
 * Signs out the current user and redirects to the login page.
 * @returns {Promise<void>}
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        const isSubfolder = window.location.pathname.includes('/admin-pages/') || window.location.pathname.includes('/student-pages/');
        window.location.href = (isSubfolder ? '../' : './') + 'index.html';
    } catch (error) {
        console.error("Logout Error:", error);
    }
}

/**
 * Page-level security guard. Monitors authentication state and enforces role-based access.
 * If unauthorized, redirects to the login page.
 * @param {string|null} requiredRole - The role allowed on this page. If null, only auth is checked.
 */
export function guardPage(requiredRole = null) {
    onAuthStateChanged(auth, async (user) => {
        const path = window.location.pathname;
        const isIndex = path.endsWith('index.html') || path.endsWith('/') || path.split('/').pop() === '';

        if (!user) {
            // Redirect to index if not authenticated and not already on index
            if (!isIndex) {
                const isSubfolder = path.includes('/admin-pages/') || path.includes('/student-pages/');
                window.location.href = (isSubfolder ? '../' : './') + 'index.html';
            }
            return;
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Enforce role-based access
            if (requiredRole && userData.role !== requiredRole) {
                redirectUserByRole(userData.role);
            }

            // If we are on the login page but already logged in, redirect to respective dashboard
            if (isIndex) {
                redirectUserByRole(userData.role);
            }
        } else {
            // User authenticated but no Firestore record found - likely shouldn't happen
            logoutUser();
        }
    });
}
