# ⚡ EPTMS - Enterprise Performance, Task & Leave Management System

A production-grade, full-stack enterprise resource and workflow management platform featuring a **4-tier Role-Based Access Control (RBAC)** architecture, sector-based project delegation, hierarchical leave governance, gamification XP scoring, and containerized deployment.

---

## 🏗️ Architecture & 4-Tier RBAC Hierarchy

           ┌───────────────────────┐
           │     Administrator     │  (Full governance, role transfers,
           └───────────┬───────────┘   audit logs, manager leaves)
                       │
           ┌───────────▼───────────┐
           │  Department Manager   │  (Macro deliverables, sector delegation,
           └───────────┬───────────┘   staff onboarding, TL leaves)
                       │
           ┌───────────▼───────────┐
           │      Team Leader      │  (Sprint Kanban, employee assignment,
           └───────────┬───────────┘   employee leave authorization)
                       │
           ┌───────────▼───────────┐
           │       Employee        │  (Task execution, progress milestones,
           └───────────────────────┘   XP accrual, leave submission)

---

## ✨ Key Features by Role

### 🛡️ System Administrator (`ROLE_ADMIN`)
* **Organization Governance**: Complete employee directory with profile inspection and instant position/role reassignment.
* **Global Task Monitoring**: Real-time audit of all tasks, priority levels, and assignments across all sectors.
* **Executive Leave Authorization**: Direct review and approval authority over Department Manager leaves.
* **Security Audit Trail**: Tamper-evident logging of role changes, access modifications, and administrative actions.

### 👔 Department Manager (`ROLE_MANAGER`)
* **Sector-Based Task Delegation**: Assigns high-level deliverables across enterprise sectors (*Core Architecture, Fintech API, Cloud Ops, UI/UX, Security*).
* **Staff Onboarding**: Directly provisions new Team Leaders and Employees with automatic organizational hierarchy mapping.
* **TL Leave Approval**: Reviews and authorizes leave applications submitted by direct Team Leaders.
* **Executive Leave Application**: Submits manager-level leave requests directed to the Administrator.

### 👥 Team Leader (`ROLE_TL`)
* **Team Sprint Management**: Live oversight of direct reports, productivity metrics, and gamification standings.
* **Interactive Kanban Board**: Manages task lifecycle stages (`ASSIGNED` → `IN_PROGRESS` → `IN_REVIEW` → `COMPLETED`).
* **Sub-Task Assignment**: Delegates granular sprint deliverables to specific team members with estimation and due dates.
* **Worker Leave Management**: Reviews and approves/rejects team member leave requests.

### 💼 Employee (`ROLE_EMPLOYEE`)
* **Personalized Workspace**: Dedicated overview of active tasks, leave balances (*Casual, Sick, Earned*), and performance score.
* **Interactive Task Execution**: Milestone progress updates (**25%**, **50%**, **75%**, **100%**) and task completion.
* **Gamification XP Engine**: Automatically earns **+15 XP** per completed deliverable with contributor tier progression.
* **Leave Application**: Submits leave requests directly to their designated Team Leader with live balance calculation.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | Spring Boot 3.3.x, Java 21 | RESTful API, Stateless Architecture |
| **Security** | Spring Security 6, JJWT | JWT Authentication & Method-Level Security |
| **Persistence** | Spring Data JPA, Hibernate | PostgreSQL with Relational Mapping |
| **Database** | PostgreSQL 16 Alpine | Containerized persistent storage |
| **Frontend** | React 18, Vite | Pure JavaScript (`.jsx`), SPA Architecture |
| **Styling** | Tailwind CSS, Lucide Icons | Clean, responsive light enterprise UI |
| **DevOps** | Docker, Docker Compose, Nginx | Multi-stage production containerization |

---

## 🚀 Quick Start & Deployment

### Prerequisites
* Docker Desktop (Docker & Docker Compose installed and running)
* *Optional for local dev*: Node.js 18+ and JDK 21+

### 1. Clone the Repository
```bash
git clone [https://github.com/gowtham250211-png/EPTMS-platform.git](https://github.com/gowtham250211-png/EPTMS-platform.git)
cd EPTMS-platform
2. Run with Docker Compose (Recommended)Launch the complete multi-container stack (Database, Backend API, and Frontend):Bashdocker compose up --build -d
Frontend UI: http://localhost:5173Backend REST API: http://localhost:8080/apiPostgreSQL Database: localhost:5432🔑 Pre-Seeded Demo CredentialsThe platform includes seed data ready for testing:RoleEmailPasswordDefault PermissionsAdministratoradmin@eptms.ioadmin123Full system control, role transfers, manager leavesManagermanager@eptms.iomanager123Department delegation, worker creation, TL leavesTeam Leadertl@eptms.iotl123Sprint Kanban, employee assignments, employee leavesEmployeeemployee@eptms.ioemp123Task execution, XP accrual, leave submission📡 Core API ReferencePlaintextPOST   /api/auth/login                - Authenticate user and receive JWT bearer token
GET    /api/admin/stats               - Organization aggregate KPI metrics
POST   /api/admin/change-role         - Reassign employee role clearance
GET    /api/admin/audit-logs          - Fetch immutable security audit records
GET    /api/manager/my-team-leads     - Retrieve TLs reporting to current manager
POST   /api/manager/create-worker     - Provision new employee or TL
GET    /api/tl/my-team                - Retrieve team members mapped to TL
GET    /api/tasks                     - Role-filtered task list
POST   /api/tasks                     - Assign new task deliverable
PATCH  /api/tasks/{id}/status         - Update milestone progress / mark complete
POST   /api/leave/apply               - Submit hierarchical leave request
GET    /api/leave/pending-approvals   - Get pending approvals for current role
PATCH  /api/leave/{id}/action         - Approve or reject leave request
