import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { jobService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'
import { Plus, Edit2, Trash2, Users, MapPin, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function EmployerJobs() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [editJob, setEditJob] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    jobService.getMyPostings()
      .then(r => {
        console.log('API Response:', r);
        console.log('Jobs Data:', r.data);
        const data = r.data.data || [];
        console.log('Setting jobs:', data);
        setJobs(data);
        setFiltered(data);
      })
      .catch(err => {
        console.error('Error fetching jobs:', err);
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = jobs
    if (filterStatus !== 'ALL') data = data.filter(j => j.status === filterStatus)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(j => j.title?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q))
    }
    setFiltered(data)
  }, [search, filterStatus, jobs])

  const handleDelete = async (id) => {
    if (!confirm('Cancel this job posting?')) return
    try {
      await jobService.deleteJob(id)
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status:'CANCELLED' } : j))
      toast.success('Job posting cancelled')
    } catch { toast.error('Failed to cancel job') }
  }

  const openEdit = (job) => {
    setEditJob(job)
    setEditForm({
      title: job.title, description: job.description, requirements: job.requirements,
      location: job.location, minCTC: job.minCTC, maxCTC: job.maxCTC,
      openings: job.openings, skills: job.skills, minCGPA: job.minCGPA,
      applicationDeadline: job.applicationDeadline, driveDate: job.driveDate,
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const r = await jobService.updateJob(editJob.id, editForm)
      setJobs(prev => prev.map(j => j.id === editJob.id ? r.data.data : j))
      toast.success('Job updated successfully')
      setEditJob(null)
    } catch { toast.error('Failed to update job') }
    finally { setSaving(false) }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const statuses = ['ALL','PENDING_APPROVAL','ACTIVE','CANCELLED','CLOSED']

  return (
    <DashboardLayout>
      <div className="page-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="page-title">My Job Postings</h1>
          <p className="page-subtitle">{jobs.length} total postings</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/employer/post-job')}>
          <Plus size={16} /> Post New Job
        </button>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:200 }}>
          <input placeholder="Search by title or location..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ maxWidth:180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {statuses.map(s => <option key={s} value={s}>{s.replace('_',' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <EmptyState title="No job postings yet" desc="Click 'Post New Job' to get started" />
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {filtered.map(job => (
              <div key={job.id} className="card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <h3 style={{ fontSize:17, fontWeight:700 }}>{job.title}</h3>
                      <StatusBadge status={job.status} />
                      {!job.approvedByAdmin && job.status === 'PENDING_APPROVAL' &&
                        <span className="badge badge-yellow">Awaiting Approval</span>}
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:12, fontSize:13, color:'var(--text-muted)' }}>
                      {job.location && <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={13}/>{job.location}</span>}
                      {job.openings && <span style={{ display:'flex', alignItems:'center', gap:4 }}><Users size={13}/>{job.openings} openings</span>}
                      {job.applicationDeadline && <span style={{ display:'flex', alignItems:'center', gap:4 }}><Calendar size={13}/>Deadline: {job.applicationDeadline}</span>}
                      {job.maxCTC && <span>₹{job.minCTC}–{job.maxCTC} LPA</span>}
                    </div>
                    {job.skills && <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:8 }}>Skills: {job.skills}</p>}
                  </div>
                  <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'var(--text-secondary)' }}>
                      <Users size={14}/>{job.applicationCount || 0} applicants
                    </span>
                    {job.status !== 'CANCELLED' && (
                      <>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(job)}>
                          <Edit2 size={14}/> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(job.id)}>
                          <Trash2 size={14}/> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {editJob && (
        <Modal title="Edit Job Posting" onClose={() => setEditJob(null)} size="lg">
          <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { label:'Job Title', key:'title' },
              { label:'Location', key:'location' },
              { label:'Openings', key:'openings', type:'number' },
              { label:'Min CTC (LPA)', key:'minCTC', type:'number' },
              { label:'Max CTC (LPA)', key:'maxCTC', type:'number' },
              { label:'Min CGPA', key:'minCGPA', type:'number' },
              { label:'Application Deadline', key:'applicationDeadline', type:'date' },
            ].map(({ label, key, type='text' }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input type={type} className="form-input" value={editForm[key] || ''}
                  onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={editForm.description || ''}
                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setEditJob(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}
