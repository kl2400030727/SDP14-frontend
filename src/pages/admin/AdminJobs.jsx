import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { jobService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import { Briefcase, Search, CheckCircle, XCircle } from 'lucide-react'

export default function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    jobService.getAllJobs()
      .then(r => { setJobs(r.data.data || []); setFiltered(r.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = jobs
    if (filterStatus !== 'ALL') data = data.filter(j => j.status === filterStatus)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(j => j.title?.toLowerCase().includes(q) || j.companyName?.toLowerCase().includes(q))
    }
    setFiltered(data)
  }, [search, filterStatus, jobs])

  const handleApprove = async (id, approve) => {
    try {
      const r = await jobService.approveJob(id, approve)
      setJobs(prev => prev.map(j => j.id === id ? r.data.data : j))
      toast.success(approve ? 'Job approved!' : 'Job rejected')
    } catch { toast.error('Action failed') }
  }

  const statuses = ['ALL','PENDING_APPROVAL','ACTIVE','CANCELLED','CLOSED']

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Job Postings Management</h1>
        <p className="page-subtitle">{filtered.length} postings</p>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search by title or company..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width:200 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s.replace(/_/g,' ')}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Briefcase} title="No jobs found" />
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Title</th><th>Company</th><th>Location</th><th>Openings</th><th>Applicants</th><th>Deadline</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map(job => (
                    <tr key={job.id}>
                      <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{job.title}</td>
                      <td>{job.companyName || '—'}</td>
                      <td>{job.location || '—'}</td>
                      <td>{job.openings || '—'}</td>
                      <td>{job.applicationCount || 0}</td>
                      <td>{job.applicationDeadline || '—'}</td>
                      <td><StatusBadge status={job.status} /></td>
                      <td>
                        {job.status === 'PENDING_APPROVAL' && (
                          <div style={{ display:'flex', gap:6 }}>
                            <button className="btn btn-success btn-sm" onClick={() => handleApprove(job.id, true)}>
                              <CheckCircle size={13}/> Approve
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleApprove(job.id, false)}>
                              <XCircle size={13}/> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </DashboardLayout>
  )
}
