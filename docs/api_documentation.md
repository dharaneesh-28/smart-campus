# REST API Endpoint Documentation

This document lists the REST API routes exposed by the Node.js/Express backend server (`http://localhost:5000/api`).

All protected routes require standard JWT authorization headers in the format:
`Authorization: Bearer <jwt_token_value>`

---

## 🔐 1. Authentication Routes (`/auth`)

### 1.1 User Registration
- **HTTP Method**: `POST`
- **Path**: `/register`
- **Authentication**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "student@gmail.com",
    "password": "student123",
    "role": "student"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "user": { "id": "user_id_123", "name": "John Doe", "email": "student@gmail.com", "role": "student" },
    "token": "signed_jwt_token"
  }
  ```

### 1.2 User Login
- **HTTP Method**: `POST`
- **Path**: `/login`
- **Request Body**:
  ```json
  {
    "email": "student@gmail.com",
    "password": "student123"
  }
  ```
- **Success Response (200 OK)**: Identical to registration.

### 1.3 Get Current User Profile
- **HTTP Method**: `GET`
- **Path**: `/me`
- **Authentication**: Protected (All roles)
- **Success Response (200 OK)**: Full user profile details without password hash.

### 1.4 Update User Details
- **HTTP Method**: `PUT`
- **Path**: `/profile`
- **Authentication**: Protected (All roles)
- **Request Body**: Name, phone, department, bio, skills, github/linkedin urls.
- **Success Response (200 OK)**: Returns updated user profile.

---

## 📝 2. Assignment Routes (`/assignments`)

### 2.1 Get All Assignments
- **HTTP Method**: `GET`
- **Path**: `/`
- **Authentication**: Protected (All roles)
- **Success Response (200 OK)**: Array of published assignments.

### 2.2 Create Assignment
- **HTTP Method**: `POST`
- **Path**: `/`
- **Authentication**: Protected (`faculty`, `admin`)
- **Request Body**:
  ```json
  {
    "title": "React Portfolio Website",
    "description": "Build a response portfolio...",
    "course": "Web Development",
    "deadline": "2026-08-20T00:00:00.000Z",
    "maxMarks": 50
  }
  ```

### 2.3 Submit Solution
- **HTTP Method**: `POST`
- **Path**: `/:id/submit`
- **Authentication**: Protected (`student`)
- **Request Body**: GitHub repository URL, optional file attachment links.

### 2.4 Grade Submission
- **HTTP Method**: `PUT`
- **Path**: `/:id/grade/:submissionId`
- **Authentication**: Protected (`faculty`, `admin`)
- **Request Body**: `marks` (number) and `feedback` (string).

---

## 📋 3. Attendance Routes (`/attendance`)

### 3.1 Record Attendance Session
- **HTTP Method**: `POST`
- **Path**: `/session`
- **Authentication**: Protected (`faculty`, `admin`)
- **Request Body**:
  ```json
  {
    "course": "Data Structures & Algorithms",
    "date": "2026-08-14",
    "students": [
      { "student": "student_id_1", "status": "present" },
      { "student": "student_id_2", "status": "absent" }
    ]
  }
  ```

### 3.2 Student Self QR Check-In
- **HTTP Method**: `POST`
- **Path**: `/checkin`
- **Authentication**: Protected (`student`)
- **Request Body**: `{ "code": "Data Structures & Algorithms" }`

### 3.3 Get Student Attendance summary
- **HTTP Method**: `GET`
- **Path**: `/student/:studentId`
- **Authentication**: Protected (All roles)
- **Success Response (200 OK)**: Total lectures, present counts, percentage, and log arrays.

---

## 🎉 4. Event Routes (`/events`)

### 4.1 Get All Events
- **HTTP Method**: `GET`
- **Path**: `/`

### 4.2 Create Event
- **HTTP Method**: `POST`
- **Path**: `/`
- **Authentication**: Protected (`coordinator`, `admin`)

### 4.3 Register for Event
- **HTTP Method**: `POST`
- **Path**: `/:id/register`
- **Authentication**: Protected (`student`)

### 4.4 Cancel Registration
- **HTTP Method**: `POST`
- **Path**: `/:id/cancel`
- **Authentication**: Protected (`student`)

---

## 💼 5. Placement Routes (`/placements`)

### 5.1 Get Placements
- **HTTP Method**: `GET`
- **Path**: `/`

### 5.2 Dispatch placement notice
- **HTTP Method**: `POST`
- **Path**: `/`
- **Authentication**: Protected (`admin`)

### 5.3 Apply for Job
- **HTTP Method**: `POST`
- **Path**: `/:id/apply`
- **Authentication**: Protected (`student`)
- **Request Body**: `{ "resumeUrl": "https://..." }`
