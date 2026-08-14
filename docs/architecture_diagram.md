# System Architecture & Workflow Diagram

This document details the software architecture layers and interaction workflows of the **Smart Campus Management Platform**.

---

## 🏗️ Architecture Design

The platform is designed as a decoupled **Client-Server Architecture** utilizing Next.js (frontend) and Node/Express (backend) communicating over secure JSON REST APIs.

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [Next.js Client Layer]
        LP[Landing Page / Theme Toggle]
        AuthForm[Login & Register Page]
        API[Central API Fetch Client - Bearer Tokens]
        Dashboards[Dashboards Layout Router]
        StuDash[Student Dashboard]
        FacDash[Faculty Dashboard]
        CooDash[Coordinator Dashboard]
        AdmDash[Admin Dashboard]
    end

    %% Network communication
    API -->|HTTPS Request with JWT| Express[Express Server Routing]

    %% Backend Layer
    subgraph Backend [Express API Layer]
        Express --> AuthMW[Protect & Role Middleware]
        AuthMW --> Controllers[Controllers & Business Logic]
        Controllers --> Models[Mongoose Schema Models]
    end

    %% Database Layer
    subgraph Database [Database Access Layer]
        Models --> MDB[(MongoDB Atlas / Local DB)]
    end

    %% Offline Demographics Fallback
    subgraph Fallback [Offline Mock Fallback]
        Controllers -.->|If readyState === 0| JSFallback[JS Mock Data Objects]
    end

    classDef layer fill:#3B82F6,stroke:#1D4ED8,stroke-width:2px,color:#fff;
    classDef serv fill:#8B5CF6,stroke:#6D28D9,stroke-width:2px,color:#fff;
    classDef db fill:#10B981,stroke:#047857,stroke-width:2px,color:#fff;
    
    class LP,AuthForm,API,Dashboards,StuDash,FacDash,CooDash,AdmDash layer;
    class Express,AuthMW,Controllers,Models,JSFallback serv;
    class MDB db;
```

---

## 🔄 Core Workflows

### 1. User Authentication
1. User enters credentials (Email/Password or mock Google login).
2. Backend validates password hash (bcrypt) or role matching.
3. Server signs a JWT token and stores it in cookies/headers.
4. Frontend stores the token in `localStorage` and appends it to subsequent request headers.
5. Router checks current user role and redirects to the appropriate dashboard portal.

### 2. Assignment Workflow
```mermaid
sequenceDiagram
    participant Student
    participant Server
    participant Database
    participant Faculty

    Faculty->>Server: POST /api/assignments (Create Task)
    Server->>Database: Save Assignment Schema
    Database-->>Server: Saved Status
    Server-->>Faculty: Published Success

    Student->>Server: GET /api/assignments (Fetch list)
    Server->>Database: Query assignments
    Database-->>Server: Return active roster
    Server-->>Student: Display pending list

    Student->>Server: POST /api/assignments/:id/submit (Upload GitHub Link)
    Server->>Database: Push submission record to array
    Database-->>Server: Saved Status
    Server-->>Student: Submission complete

    Faculty->>Server: PUT /api/assignments/:id/grade/:subId (Grade & Feedback)
    Server->>Database: Update submission status and marks
    Database-->>Server: Saved Status
    Server-->>Faculty: Graded Success
```

### 3. QR Code Attendance Check-In
1. **Faculty Session Creation**: Faculty specifies course code and date. Backend saves attendance roster session.
2. **Student Code Check-in**: Student types the session course code in their dashboard check-in widget.
3. **Validation**: Server searches for active attendance sheets matching the code. If found, student's status is toggled to `present`.
