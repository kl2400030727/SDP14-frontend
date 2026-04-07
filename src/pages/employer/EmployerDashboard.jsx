import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { jobService, applicationService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Briefcase, Users, CheckSquare, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobService.getMyPostings()
      .then(r => setJobs(r.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const active = jobs.filter(j => j.status === 'ACTIVE')
  const pending = jobs.filter(j => j.status === 'PENDING_APPROVAL')
  const totalApps = jobs.reduce((s, j) => s + (j.applicationCount || 0), 0)

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Employer Dashboard</h1>
        <p className="page-subtitle">Welcome, {user?.fullName}</p>
      </div>

      <div className="grid-4" style={{ marginBottom:32 }}>
        {[
          { label:'Total Postings', value:jobs.length, icon:Briefcase, color:'purple', bg:'var(--accent-soft)', ic:'var(--accent)' },
          { label:'Active Jobs', value:active.length, icon:CheckSquare, color:'green', bg:'rgba(67,233,123,0.1)', ic:'var(--success)' },
          { label:'Pending Approval', value:pending.length, icon:Clock, color:'gold', bg:'rgba(255,215,0,0.1)', ic:'var(--gold)' },
          { label:'Total Applicants', value:totalApps, icon:Users, color:'blue', bg:'rgba(76,201,240,0.1)', ic:'var(--info)' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-icon" style={{ background:s.bg }}>
              <s.icon size={20} color={s.ic} />
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontSize:16, fontWeight:700 }}>Recent Job Postings</h3>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/employer/post-job')}>+ Post Job</button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/employer/jobs')}>View All</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job Title</th><th>Applicants</th><th>Status</th><th>Deadline</th><th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0,5).map(job => (
                <tr key={job.id}>
                  <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{job.title}</td>
                  <td>{job.applicationCount || 0}</td>
                  <td><StatusBadge status={job.status} /></td>
                  <td>{job.applicationDeadline || '—'}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('/employer/applications')}>
                      View <ArrowRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
