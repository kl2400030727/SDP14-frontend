import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminService } from '../../api/services'
import { officerService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Users, GraduationCap, Building2, Briefcase, CheckCircle, TrendingUp, IndianRupee, FileText } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([officerService.getDashboard(), adminService.getAllUsers()])
      .then(([s, u]) => { setStats(s.data.data); setUsers(u.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const cards = [
    { label:'Total Users', value: users.length, icon: Users, color:'purple', bg:'var(--accent-soft)', ic:'var(--accent)' },
    { label:'Students', value: users.filter(u => u.role === 'ROLE_STUDENT').length, icon: GraduationCap, color:'blue', bg:'rgba(76,201,240,0.1)', ic:'var(--info)' },
    { label:'Employers', value: users.filter(u => u.role === 'ROLE_EMPLOYER').length, icon: Building2, color:'gold', bg:'rgba(255,215,0,0.1)', ic:'var(--gold)' },
    { label:'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase, color:'green', bg:'rgba(67,233,123,0.1)', ic:'var(--success)' },
    { label:'Placed Students', value: stats?.placedStudents || 0, icon: CheckCircle, color:'green', bg:'rgba(67,233,123,0.1)', ic:'var(--success)' },
    { label:'Placement %', value:`${stats?.placementPercentage || 0}%`, icon: TrendingUp, color:'purple', bg:'var(--accent-soft)', ic:'var(--accent)' },
    { label:'Avg CTC (LPA)', value: stats?.averageCTC ? `₹${Number(stats.averageCTC).toFixed(1)}` : '—', icon: IndianRupee, color:'gold', bg:'rgba(255,215,0,0.1)', ic:'var(--gold)' },
    { label:'Total Applications', value: stats?.totalApplications || 0, icon: FileText, color:'blue', bg:'rgba(76,201,240,0.1)', ic:'var(--info)' },
  ]

  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
  const roleColor = { ROLE_ADMIN:'badge-red', ROLE_STUDENT:'badge-blue', ROLE_EMPLOYER:'badge-yellow', ROLE_PLACEMENT_OFFICER:'badge-purple' }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Full system overview and control</p>
      </div>

      <div className="grid-4" style={{ marginBottom:32 }}>
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.color}`}>
            <div className="stat-icon" style={{ background:c.bg }}><c.icon size={20} color={c.ic} /></div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Recently Registered Users</h3>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${roleColor[u.role] || 'badge-gray'}`}>{u.role?.replace('ROLE_','').replace('_',' ')}</span></td>
                  <td>
                    {u.enabled
                      ? <span className="badge badge-green">Active</span>
                      : <span className="badge badge-red">Disabled</span>}
                  </td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
