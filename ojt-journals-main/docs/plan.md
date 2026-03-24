# 📘 OJT Daily Journal System – Project Plan

## 🎯 Project Goal

To develop a **web-based daily journal system** for OJT students where:

* Students submit **daily work journals**
* An admin reviews, categorizes, and monitors submissions
* Journals are checked **weekly** based on school requirements

---

## 🧑‍💻 Tech Stack

* **Frontend**: HTML, CSS, JavaScript (static)
* **Hosting**: GitHub Pages
* **Backend**: Firebase

  * Firebase Authentication
  * Firestore Database
* **Roles**: Admin, Student

---

## 👥 User Roles & Responsibilities


* Login to the system
* View personal profile (read-only)
* Write **one journal per day**
* Edit own journal entries (until reviewed)
* View journal history

---

### 🧑‍💼 Admin

* Login as administrator (single account)
* Add and manage OJT students
* View all journals
* Search & filter students
* Categorize journal submissions
* Identify who **passed / incomplete / no submission**

---

## 🧱 Data Structure Design

### 1️⃣ Users Collection (`users`)

**Student Document**

```json
{
  "role": "student",
  "studentId": "2021-04567",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "section": "BSIT-4A",
  "company": "ABC Corp",
  "position": "IT Intern",
  "email": "juan@email.com",
  "isActive": true,
  "createdAt": "timestamp"
}
```

**Admin Document**

```json
{
  "role": "admin",
  "name": "OJT Coordinator",
  "email": "admin@ojt.com"
}
```

---

### 2️⃣ Journals Collection (`journals`)

```json
{
  "userId": "firebaseUID",
  "date": "2026-02-13",
  "week": 6,
  "content": "Worked on system documentation",
  "submitted": true,
  "reviewed": false,
  "remarks": "",
  "createdAt": "timestamp"
}
```

---

## 🔐 Authentication & Access Control Plan

1. **Admin account**

   * Manually created in Firebase Auth
   * Assigned `admin` role via **custom claims**
   * No admin registration page

2. **Student accounts**

   * Created by admin
   * Email + temporary password
   * Student cannot change role or student ID

3. **Access rules**

   * Students → access only their data
   * Admin → access all users and journals

---

## 🖥️ System Pages & Flow

### 🌐 Public

* `/login.html`

---

### 👨‍🎓 Student Pages

* `/dashboard.html`

  * Journal summary (this week)
* `/journal.html`

  * Date picker
  * Journal editor
* `/profile.html`

  * Student details (read-only)

---

### 🧑‍💼 Admin Pages

* `/admin-dashboard.html`

  * Student overview
* `/admin-students.html`

  * Add / search / filter students
* `/admin-student.html`

  * Individual student journals
* `/admin-journals.html`

  * Weekly journal review
  * Passed / incomplete / no submission

---

## 🔍 Search, Filter & Categorization Logic

### 🔎 Search by:

* Student ID
* Full name
* Section
* Company

---

### 📊 Weekly Journal Status Logic

(Computed, not manually stored)

| Condition    | Status          |
| ------------ | --------------- |
| 5–7 journals | ✅ Passed        |
| 1–4 journals | ⚠️ Incomplete   |
| 0 journals   | ❌ No Submission |

This is calculated per week.

---

## 🛡️ Security Plan (High-level)

* Firebase Authentication for login
* Firestore rules enforce:

  * Students can read/write **own journals only**
  * Admin can read all journals & users
  * Student ID and role are **admin-only editable**

---

## 🧪 Testing Plan

* Login as student
* Submit daily journals
* Attempt duplicate journal (same date)
* Admin reviews journals
* Verify filters (section, passed/not passed)

---

## 🚀 Deployment Plan

1. Push frontend to GitHub
2. Enable GitHub Pages
3. Configure Firebase project
4. Connect frontend to Firebase
5. Create admin account
6. Add initial students

---

## 🎓 Ready-for-Defense Statement

> “The system digitizes daily OJT journal submission, allowing students to log activities daily while enabling administrators to monitor, categorize, and validate weekly compliance efficiently.”

---

