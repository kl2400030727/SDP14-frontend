import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Briefcase, FileText, Users, BarChart3,
  Settings, LogOut, GraduationCap, Building2, ClipboardList
} from 'lucide-react'

const navConfig = {
  ROLE_ADMIN: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
    { label: 'Users', icon: Users, to: '/admin/users' },
    { label: 'Students', icon: GraduationCap, to: '/admin/students' },
    { label: 'Job Postings', icon: Briefcase, to: '/admin/jobs' },
    { label: 'Applications', icon: FileText, to: '/admin/applications' },
  ],
  ROLE_STUDENT: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/student/dashboard' },
    { label: 'Browse Jobs', icon: Briefcase, to: '/student/jobs' },
    { label: 'My Applications', icon: FileText, to: '/student/applications' },
    { label: 'My Profile', icon: Settings, to: '/student/profile' },
  ],
  ROLE_EMPLOYER: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/employer/dashboard' },
    { label: 'Post a Job', icon: Briefcase, to: '/employer/post-job' },
    { label: 'My Postings', icon: ClipboardList, to: '/employer/jobs' },
    { label: 'Applications', icon: FileText, to: '/employer/applications' },
    { label: 'Company Profile', icon: Building2, to: '/employer/profile' },
  ],
  ROLE_PLACEMENT_OFFICER: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/officer/dashboard' },
    { label: 'All Jobs', icon: Briefcase, to: '/officer/jobs' },
    { label: 'Applications', icon: FileText, to: '/officer/applications' },
    { label: 'Placement Records', icon: ClipboardList, to: '/officer/records' },
    { label: 'Reports', icon: BarChart3, to: '/officer/reports' },
    { label: 'Students', icon: GraduationCap, to: '/officer/students' },
  ],
}

const roleLabel = {
  ROLE_ADMIN: 'Administrator',
  ROLE_STUDENT: 'Student',
  ROLE_EMPLOYER: 'Employer',
  ROLE_PLACEMENT_OFFICER: 'Placement Officer',
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const items = navConfig[user?.role] || []
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{
          width: 36, height: 36, background: 'var(--accent)',
          borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff'
        }}>P</div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>PlaceMe</span>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-title">Menu</p>
        {items.map(({ label, icon: Icon, to }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName}
            </div>
            <div className="user-role">{roleLabel[user?.role]}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline w-full mt-2"
          style={{ justifyContent: 'center', fontSize: 13 }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  )
}
