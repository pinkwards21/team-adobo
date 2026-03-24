# 🗄️ Database Design & Data Dictionary

This document provides a detailed breakdown of the Firestore collections and their relationships for the **OJT Daily Journal System**.

## 📊 Database Schema Overview

The system uses a flat Firestore structure with two main collections.

### Relationships
| Source Collection | Relation | Target Collection | Key / Connection |
| :--- | :--- | :--- | :--- |
| `users` | 1 : N (One-to-Many) | `journals` | `users.uid` -> `journals.userId` |

### Key Mapping
*   **User Document ID**: Firebase Auth `uid`
*   **Journal Document ID**: `${userId}_${date}` (e.g., `abc123_2026-02-13`)

---

## 📘 Data Dictionary

### 1. `users` Collection
Stores authentication metadata and profile details.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `role` | `string` | Yes | `"admin"` or `"student"`. |
| `email` | `string` | Yes | User's login email. |
| `firstName` | `string` | Yes | |
| `lastName` | `string` | Yes | |
| `studentId` | `string` | Optional | Student's school-issued ID. |
| `section` | `string` | Optional | Academic section (e.g., BSIT-4A). |
| `company` | `string` | Optional | Assigned OJT company. |
| `position` | `string` | Optional | Role in the company. |
| `isActive` | `boolean` | Yes | Toggle for student account status. |
| `createdAt` | `timestamp` | Yes | Record creation date. |

---

### 2. `journals` Collection
Stores the daily logs submitted by students.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Yes | The `uid` of the student who owns the journal. |
| `date` | `string` | Yes | Local date in `YYYY-MM-DD` format. |
| `week` | `number` | Yes | The OJT week number (calculated at submission). |
| `content` | `string` | Yes | The body of the daily activity log. |
| `submitted` | `boolean` | Yes | `true` if finalized. |
| `reviewed` | `boolean` | Yes | `true` if an admin has checked it. |
| `remarks` | `string` | No | Feedback from the OJT Coordinator. |
| `timestamp` | `timestamp` | Yes | Server-side submission time. |
| `updatedAt` | `timestamp` | Yes | Last modification time. |

---

## 🔒 Security Summary
*   **Collection IDs**: Managed automatically by Firestore via `uid` (Users) or `${userId}_${date}` (Journals).
*   **Access**: Students are restricted to their own `uid`-matched documents. Admins have global read/write privileges.


eto ginawa ko sa firebase
sa users collection 
eto yung mga example data
1: eto yung sa users collection
company
"ABC Corp"
(string)


createdAt
February 14, 2026 at 10:37:51 AM UTC+8
(timestamp)


email
"juan@student.com"
(string)


firstName
"Juan"
(string)


isActive
true
(boolean)


lastName
"Dela Cruz"
(string)


position
"IT Intern"
(string)


role
"student"
(string)


section
"BSIT-4A"
(string)


studentId
"2021-04567"



----
OJT Coordinator
"admin@email.com"
(string)


createdAt
February 13, 2026 at 10:35:00 AM UTC+8
(timestamp)


isActive
true
(boolean)


name
"OJT Coordinator"
(string)


role
"admin"
--- 

2: eto yung sa journals collection
content
"Worked on backend validation"
(string)


date
"2026-02-13"
(string)


remarks
""
(string)


reviewed
false
(boolean)


submitted
true
(boolean)


timestamp
February 13, 2026 at 10:42:02 AM UTC+8
(timestamp)


updatedAt
February 13, 2026 at 10:42:11 AM UTC+8
(timestamp)


userId
"ltfU9DKVUaF5PuBQm0Mx"
(string)


week
6