# PlaceMe — Placement Management System Frontend

A professional React + Vite frontend for the Placement Management System (FSAD-PS14).

## Tech Stack
- **React 18** with Vite
- **React Router DOM v6** — client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Recharts** — analytics charts
- **Lucide React** — icons
- **React Hot Toast** — notifications
- **Date-fns** — date formatting

## Setup in VS Code

### Step 1 — Open in VS Code
```
File → Open Folder → select placement-management-frontend folder
```

### Step 2 — Install dependencies
Open VS Code terminal (Ctrl + `) and run:
```bash
npm install
```

### Step 3 — Configure backend URL
The `.env` file is already set to:
```
VITE_API_BASE_URL=http://localhost:8080/api
```
Change the port if your Spring Boot runs elsewhere.

### Step 4 — Start Spring Boot backend first
Make sure your Spring Boot backend is running on port 8080.

### Step 5 — Start the frontend
```bash
npm run dev
```
Open: **http://localhost:3000**

## Default Login
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@placement.com | Admin@123 |

## Pages by Role

### Student
| Page | Route |
|------|-------|
| Dashboard | /student/dashboard |
| Browse Jobs | /student/jobs |
| My Applications | /student/applications |
| Profile | /student/profile |

### Employer
| Page | Route |
|------|-------|
| Dashboard | /employer/dashboard |
| Post Job | /employer/post-job |
| My Postings | /employer/jobs |
| Applications | /employer/applications |
| Company Profile | /employer/profile |

### Placement Officer
| Page | Route |
|------|-------|
| Dashboard | /officer/dashboard |
| All Jobs | /officer/jobs |
| Applications | /officer/applications |
| Placement Records | /officer/records |
| Reports | /officer/reports |
| Students | /officer/students |

### Admin
| Page | Route |
|------|-------|
| Dashboard | /admin/dashboard |
| Users | /admin/users |
| Students | /admin/students |
| Jobs | /admin/jobs |

## API Connection
All API calls are in `src/api/services.js`.
The axios instance with JWT auto-attach is in `src/api/axios.js`.
