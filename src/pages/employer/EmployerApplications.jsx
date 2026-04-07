import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { jobService, applicationService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'
import { FileText, ChevronDown } from 'lucide-react'

const STATUSES = ['APPLIED','SHORTLISTED','APTITUDE_TEST','TECHNICAL_ROUND','GD_ROUND','HR_ROUND','SELECTED','REJECTED']

export default function EmployerApplications() {
  const [jobs, setJobs] = useState([])
  const [selectedJobId, setSelectedJobId] = useState('')
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [appsLoading, setAppsLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [statusForm, setStatusForm] = useState({ status:'', remarks:'', aptitudeScore:'', technicalRound:'', hrRound:'', groupDiscussion:'' })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    jobService.getMyPostings()
      .then(r => setJobs(r.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedJobId) return
    setAppsLoading(true)
    applicationService.getApplicationsForJob(selectedJobId)
      .then(r => setApps(r.data.data || []))
      .catch(() => setApps([]))
      .finally(() => setAppsLoading(false))
  }, [selectedJobId])

  const openUpdate = (app) => {
    setSelected(app)
    setStatusForm({ status: app.status, remarks: app.remarks || '', aptitudeScore: app.aptitudeScore || '',
      technicalRound: app.technicalRound || '', hrRound: app.hrRound || '', groupDiscussion: app.groupDiscussion || '' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault(); setUpdating(true)
    try {
      const r = await applicationService.updateApplicationStatus(selected.id, statusForm)
      setApps(prev => prev.map(a => a.id === selected.id ? r.data.data : a))
      toast.success('Application status updated')
      setSelected(null)
    } catch { toast.error('Failed to update') }
    finally { setUpdating(false) }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Applications Received</h1>
        <p className="page-subtitle">Review and update candidate status</p>
      </div>

      <div className="card" style={{ marginBottom:24 }}>
        <div className="form-group" style={{ maxWidth:400 }}>
          <label className="form-label">Select Job Posting</label>
          <select className="form-input" value={selectedJobId} onChange={e => setSelectedJobId(e.target.value)}>
            <option value="">— Choose a job to view applications —</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title} ({j.applicationCount || 0} apps)</option>)}
          </select>
        </div>
      </div>

      {!selectedJobId
        ? <EmptyState icon={FileText} title="Select a job posting" desc="Choose a job above to view applications" />
        : appsLoading ? <LoadingSpinner />
        : apps.length === 0 ? <EmptyState title="No applications yet" />
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th><th>Roll No</th><th>CGPA</th><th>Department</th><th>Status</th><th>Applied</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{app.studentName}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{app.studentEmail}</div>
                      </td>
                      <td>{app.rollNumber || '—'}</td>
                      <td>{app.cgpa || '—'}</td>
                      <td>{app.department || '—'}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <button className="btn btn-primary btn-sm" onClick={() => openUpdate(app)}>
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {selected && (
        <Modal title={`Update: ${selected.studentName}`} onClose={() => setSelected(null)}>
          <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="form-group">
              <label className="form-label">Application Status *</label>
              <select className="form-input" value={statusForm.status} onChange={e => setStatusForm(p => ({ ...p, status: e.target.value }))} required>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            {[
              { label:'Aptitude Score', key:'aptitudeScore', placeholder:'e.g. 85/100' },
              { label:'Technical Round', key:'technicalRound', placeholder:'Pass / Score' },
              { label:'Group Discussion', key:'groupDiscussion', placeholder:'Pass / Remarks' },
              { label:'HR Round', key:'hrRound', placeholder:'Pass / Remarks' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" placeholder={placeholder} value={statusForm[key]}
                  onChange={e => setStatusForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Remarks / Feedback</label>
              <textarea className="form-input" rows={3} value={statusForm.remarks}
                onChange={e => setStatusForm(p => ({ ...p, remarks: e.target.value }))} />
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}
