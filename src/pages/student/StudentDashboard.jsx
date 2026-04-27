import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { applicationService, jobService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Briefcase, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [apps, setApps] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([applicationService.getMyApplications(), jobService.getAllActiveJobs()])
      .then(([a, j]) => { setApps(a.data.data || []); setJobs(j.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const placed = apps.filter(a => a.status === 'SELECTED' || a.status === 'OFFER_ACCEPTED')
  const active = apps.filter(a => !['REJECTED','WITHDRAWN','OFFER_DECLINED'].includes(a.status))

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title" style={{fontFamily: 'Montserrat, var(--font-display), sans-serif', textTransform: 'capitalize', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1.1}}>Welcome, {user?.fullName?.split(' ')[0]} 👋</h1>
        <p className="page-subtitle">Here's your placement overview</p>
      </div>

      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Active Applications', value: active.length, icon: FileText, color: 'purple', bg: 'var(--accent-soft)', iconColor: 'var(--accent)' },
          { label: 'Jobs Available', value: jobs.length, icon: Briefcase, color: 'blue', bg: 'rgba(76,201,240,0.1)', iconColor: 'var(--info)' },
          { label: 'Interviews Scheduled', value: apps.filter(a => ['TECHNICAL_ROUND','HR_ROUND','GD_ROUND'].includes(a.status)).length, icon: Clock, color: 'gold', bg: 'rgba(255,215,0,0.1)', iconColor: 'var(--gold)' },
          { label: 'Offers Received', value: placed.length, icon: CheckCircle, color: 'green', bg: 'rgba(67,233,123,0.1)', iconColor: 'var(--success)' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={20} color={s.iconColor} />
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Applications */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:700 }}>Recent Applications</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/applications')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          {apps.length === 0 ? (
            <p style={{ color:'var(--text-muted)', fontSize:14 }}>No applications yet. Start applying!</p>
          ) : apps.slice(0,5).map(app => (
            <div key={app.id} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'12px 0', borderBottom:'1px solid var(--border)'
            }}>
              <div>
                <p style={{ fontSize:14, fontWeight:600 }}>{app.jobTitle}</p>
                <p style={{ fontSize:12, color:'var(--text-muted)' }}>{app.companyName}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
          ))}
        </div>

        {/* New Jobs */}
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h3 style={{ fontSize:16, fontWeight:700 }}>New Opportunities</h3>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/student/jobs')}>
              Browse All <ArrowRight size={14} />
            </button>
          </div>
          {jobs.slice(0,5).map(job => (
            <div key={job.id} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'12px 0', borderBottom:'1px solid var(--border)', cursor:'pointer'
            }} onClick={() => navigate('/student/jobs')}>
              <div>
                <p style={{ fontSize:14, fontWeight:600 }}>{job.title}</p>
                <p style={{ fontSize:12, color:'var(--text-muted)' }}>{job.companyName} • {job.location}</p>
              </div>
              {job.alreadyApplied
                ? <span className="badge badge-green">Applied</span>
                : <span className="badge badge-purple">New</span>}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
