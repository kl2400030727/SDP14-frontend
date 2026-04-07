import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Briefcase, FileText, User, Users,
  BarChart2, BookOpen, LogOut, Menu, X, Bell, ChevronRight,
  Award, Settings, ClipboardList
} from 'lucide-react'

const navConfig = {
  student: [
    { to: '/student/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/student/jobs',         label: 'Browse Jobs',  icon: Briefcase },
    { to: '/student/applications', label: 'My Applications', icon: FileText },
    { to: '/student/profile',      label: 'My Profile',   icon: User },
  ],
  employer: [
    { to: '/employer/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
    { to: '/employer/jobs',         label: 'Job Postings', icon: Briefcase },
    { to: '/employer/applications', label: 'Applications', icon: FileText },
    { to: '/employer/profile',      label: 'Company Profile', icon: User },
  ],
  officer: [
    { to: '/officer/dashboard',  label: 'Dashboard',         icon: LayoutDashboard },
    { to: '/officer/students',   label: 'Students',          icon: Users },
    { to: '/officer/placements', label: 'Placement Records', icon: Award },
    { to: '/officer/reports',    label: 'Reports',           icon: BarChart2 },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
    { to: '/admin/users',     label: 'Users',      icon: Users },
    { to: '/admin/jobs',      label: 'Job Postings', icon: Briefcase },
    { to: '/officer/placements', label: 'Placements', icon: Award },
    { to: '/officer/reports',    label: 'Reports',    icon: BarChart2 },
  ],
}

const roleLabel = {
  student: 'Student', employer: 'Employer',
  officer: 'Placement Officer', admin: 'Administrator',
}

export default function Layout({ role }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navItems = navConfig[role] || []

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ---- Sidebar ---- */}
      <aside style={{
        width: sidebarOpen ? '260px' : '72px',
        minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease',
        position: 'sticky', top: 0, height: '100vh',
        overflow: 'hidden', flexShrink: 0,
        zIndex: 100,
      }}>

        {/* Logo */}
        <div style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--white)' }}>
                Place<span style={{ color: 'var(--gold-400)' }}>Me</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {roleLabel[role]}
              </div>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', padding: '4px', borderRadius: '6px' }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: '12px', padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--gold-400)' : 'var(--slate-300)',
              background: isActive ? 'rgba(245,200,66,0.08)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--gold-400)' : '2px solid transparent',
              textDecoration: 'none', fontSize: '14px', fontWeight: 500,
              transition: 'all 0.15s', whiteSpace: 'nowrap', overflow: 'hidden',
            })}>
              <Icon size={18} style={{ flexShrink: 0 }} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-color)' }}>
          {sidebarOpen && (
            <div style={{
              padding: '12px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.03)',
              marginBottom: '8px',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.fullName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)',
            color: '#fca5a5', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            transition: 'background 0.15s', justifyContent: sidebarOpen ? 'flex-start' : 'center',
          }}>
            <LogOut size={16} />
            {sidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ---- Main Content ---- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top Bar */}
        <header style={{
          height: '64px', background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 28px', gap: '16px', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Welcome back, <span style={{ color: 'var(--gold-400)', fontWeight: 600 }}>{user?.fullName?.split(' ')[0]}</span>
          </div>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--navy-950)', fontWeight: 700, fontSize: '14px',
            fontFamily: 'var(--font-display)',
          }}>
            {user?.fullName?.[0]?.toUpperCase()}
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px 28px', overflow: 'auto' }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer style={{
          padding: '16px 28px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontSize: '12px', color: 'var(--text-muted)',
        }}>
          <span>© 2024 PlaceMe — Placement Management System</span>
          <span style={{ color: 'var(--gold-400)' }}>FSAD PS14</span>
        </footer>
      </div>
    </div>
  )
}
