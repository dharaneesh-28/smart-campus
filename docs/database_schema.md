# Database Entity Relationship (ER) Diagram

This document contains the Entity Relationship schema defining the collections utilized in the **Smart Campus** MongoDB database.

---

## 📊 Entity Relationship Model

```mermaid
erDiagram
    USER ||--o{ ATTENDANCE : "marked_in"
    USER ||--o{ ASSIGNMENT-SUBMISSION : "submits"
    USER ||--o{ EVENT-REGISTRATION : "registers"
    USER ||--o{ PLACEMENT-APPLICATION : "applies"
    USER ||--o{ NOTIFICATION : "receives"

    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string role "student/faculty/coordinator/admin"
        string phone
        string department
        string rollNumber
        int semester
        stringArray skills
        string linkedin
        string github
        string bio
        boolean isEmailVerified
    }

    ATTENDANCE {
        ObjectId _id PK
        string course
        ObjectId faculty FK "ref: USER"
        date date
        objectArray students "embeds student status list"
    }

    ASSIGNMENT {
        ObjectId _id PK
        string title
        string description
        string course
        ObjectId faculty FK "ref: USER"
        date deadline
        int maxMarks
        stringArray attachments
        objectArray submissions "embeds ASSIGNMENT-SUBMISSION list"
    }

    ASSIGNMENT-SUBMISSION {
        ObjectId student FK "ref: USER"
        string fileUrl
        string githubLink
        date submittedAt
        boolean isLate
        int marks
        string feedback
        string status "pending/reviewed/graded"
    }

    EVENT {
        ObjectId _id PK
        string title
        string description
        string banner
        string venue
        date date
        date registrationDeadline
        int totalSeats
        int registeredCount
        stringArray speakers
        ObjectId createdBy FK "ref: USER"
        objectArray registrations "embeds EVENT-REGISTRATION list"
    }

    EVENT-REGISTRATION {
        ObjectId student FK "ref: USER"
        date registeredAt
        string status "registered/cancelled"
    }

    PLACEMENT {
        ObjectId _id PK
        string company
        string logo
        string jobRole
        object eligibility "minCGPA, departments list, semester"
        string ctc
        date deadline
        string description
        objectArray applications "embeds PLACEMENT-APPLICATION list"
    }

    PLACEMENT-APPLICATION {
        ObjectId student FK "ref: USER"
        string resumeUrl
        date appliedAt
        string status "applied/shortlisted/rejected/selected"
    }

    NOTIFICATION {
        ObjectId _id PK
        ObjectId user FK "ref: USER"
        string title
        string message
        string type "assignment/attendance/event/placement/system"
        boolean isRead
    }
```

---

## 🗃️ Collection Descriptions

1. **Users**: Stores profile credentials, personal details, roles, and links for all members.
2. **Attendance**: Roster sheets referencing class attendance sessions marked by faculty.
3. **Assignments**: Homework specifications created by faculty, nesting the submissions array of students.
4. **Events**: Seminars and workshops posted by coordinators, nesting registrations.
5. **Placements**: Recruitment drives posted by admin, nesting applications.
6. **Notifications**: System alerts sent dynamically to students upon assignment releases, attendance marks, placement open notices, and registration confirmations.
