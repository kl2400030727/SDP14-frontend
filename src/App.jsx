import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Student
import StudentDashboard from './pages/student/StudentDashboard'
import BrowseJobs from './pages/student/BrowseJobs'
import MyApplications from './pages/student/MyApplications'
import StudentProfile from './pages/student/StudentProfile'

// Employer
import EmployerDashboard from './pages/employer/EmployerDashboard'
import PostJob from './pages/employer/PostJob'
import EmployerJobs from './pages/employer/EmployerJobs'
import EmployerApplications from './pages/employer/EmployerApplications'
import EmployerProfile from './pages/employer/EmployerProfile'

// Officer
import OfficerDashboard from './pages/officer/OfficerDashboard'
import OfficerJobs from './pages/officer/OfficerJobs'
import OfficerApplications from './pages/officer/OfficerApplications'
import PlacementRecords from './pages/officer/PlacementRecords'
import OfficerReports from './pages/officer/OfficerReports'
import OfficerStudents from './pages/officer/OfficerStudents'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminStudents from './pages/admin/AdminStudents'
import AdminJobs from './pages/admin/AdminJobs'

const Guard = ({ children, roles }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

const RoleRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const map = {
    ROLE_STUDENT: '/student/dashboard',
    ROLE_EMPLOYER: '/employer/dashboard',
    ROLE_PLACEMENT_OFFICER: '/officer/dashboard',
    ROLE_ADMIN: '/admin/dashboard',
  }
  return <Navigate to={map[user.role] || '/login'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#16161f', color: '#f0f0f8', border: '1px solid #2a2a3a' },
          success: { iconTheme: { primary: '#43e97b', secondary: '#16161f' } },
          error: { iconTheme: { primary: '#ff6584', secondary: '#16161f' } },
        }} />
        <Routes>
          {/* Public */}
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<Guard roles={['ROLE_STUDENT']}><StudentDashboard /></Guard>} />
          <Route path="/student/jobs" element={<Guard roles={['ROLE_STUDENT']}><BrowseJobs /></Guard>} />
          <Route path="/student/applications" element={<Guard roles={['ROLE_STUDENT']}><MyApplications /></Guard>} />
          <Route path="/student/profile" element={<Guard roles={['ROLE_STUDENT']}><StudentProfile /></Guard>} />

          {/* Employer */}
          <Route path="/employer/dashboard" element={<Guard roles={['ROLE_EMPLOYER']}><EmployerDashboard /></Guard>} />
          <Route path="/employer/post-job" element={<Guard roles={['ROLE_EMPLOYER']}><PostJob /></Guard>} />
          <Route path="/employer/jobs" element={<Guard roles={['ROLE_EMPLOYER']}><EmployerJobs /></Guard>} />
          <Route path="/employer/applications" element={<Guard roles={['ROLE_EMPLOYER']}><EmployerApplications /></Guard>} />
          <Route path="/employer/profile" element={<Guard roles={['ROLE_EMPLOYER']}><EmployerProfile /></Guard>} />

          {/* Officer */}
          <Route path="/officer/dashboard" element={<Guard roles={['ROLE_PLACEMENT_OFFICER','ROLE_ADMIN']}><OfficerDashboard /></Guard>} />
          <Route path="/officer/jobs" element={<Guard roles={['ROLE_PLACEMENT_OFFICER','ROLE_ADMIN']}><OfficerJobs /></Guard>} />
          <Route path="/officer/applications" element={<Guard roles={['ROLE_PLACEMENT_OFFICER','ROLE_ADMIN']}><OfficerApplications /></Guard>} />
          <Route path="/officer/records" element={<Guard roles={['ROLE_PLACEMENT_OFFICER','ROLE_ADMIN']}><PlacementRecords /></Guard>} />
          <Route path="/officer/reports" element={<Guard roles={['ROLE_PLACEMENT_OFFICER','ROLE_ADMIN']}><OfficerReports /></Guard>} />
          <Route path="/officer/students" element={<Guard roles={['ROLE_PLACEMENT_OFFICER','ROLE_ADMIN']}><OfficerStudents /></Guard>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<Guard roles={['ROLE_ADMIN']}><AdminDashboard /></Guard>} />
          <Route path="/admin/users" element={<Guard roles={['ROLE_ADMIN']}><AdminUsers /></Guard>} />
          <Route path="/admin/students" element={<Guard roles={['ROLE_ADMIN']}><AdminStudents /></Guard>} />
          <Route path="/admin/jobs" element={<Guard roles={['ROLE_ADMIN']}><AdminJobs /></Guard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
