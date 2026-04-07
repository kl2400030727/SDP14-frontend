import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { jobService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import { CheckCircle, XCircle, Briefcase } from 'lucide-react'

export default function OfficerJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    jobService.getAllJobs()
      .then(r => setJobs(r.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id, approve) => {
    try {
      const r = await jobService.approveJob(id, approve)
      setJobs(prev => prev.map(j => j.id === id ? r.data.data : j))
      toast.success(approve ? 'Job approved and is now live!' : 'Job rejected.')
    } catch { toast.error('Action failed') }
  }

  const filtered = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter)

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">All Job Postings</h1>
        <p className="page-subtitle">Review and approve employer job postings</p>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {['ALL','PENDING_APPROVAL','ACTIVE','CANCELLED'].map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setFilter(s)}>
            {s.replace(/_/g,' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Briefcase} title="No jobs found" />
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {filtered.map(job => (
              <div key={job.id} className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                      <h3 style={{ fontSize:16, fontWeight:700 }}>{job.title}</h3>
                      <StatusBadge status={job.status} />
                      {job.approvedByAdmin && <span className="badge badge-green">Approved</span>}
                    </div>
                    <p style={{ fontSize:13, color:'var(--text-secondary)' }}>
                      {job.companyName || 'Unknown Company'} • {job.location || 'Location TBD'}
                    </p>
                    <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>
                      {job.openings} openings • {job.applicationCount || 0} applicants • Deadline: {job.applicationDeadline || 'N/A'}
                    </p>
                  </div>
                  {job.status === 'PENDING_APPROVAL' && (
                    <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                      <button className="btn btn-success btn-sm" onClick={() => handleApprove(job.id, true)}>
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleApprove(job.id, false)}>
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
    </DashboardLayout>
  )
}
