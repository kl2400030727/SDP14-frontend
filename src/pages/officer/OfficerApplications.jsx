import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { officerService, applicationService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'
import { FileText, Search } from 'lucide-react'

const STATUSES = ['APPLIED','SHORTLISTED','APTITUDE_TEST','TECHNICAL_ROUND','GD_ROUND','HR_ROUND','SELECTED','REJECTED']

export default function OfficerApplications() {
  const [apps, setApps] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [selected, setSelected] = useState(null)
  const [statusForm, setStatusForm] = useState({ status:'', remarks:'', aptitudeScore:'', technicalRound:'', hrRound:'', offerLetterUrl:'' })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    officerService.getAllApplications()
      .then(r => { setApps(r.data.data || []); setFiltered(r.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = apps
    if (filterStatus !== 'ALL') data = data.filter(a => a.status === filterStatus)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(a => a.studentName?.toLowerCase().includes(q) || a.jobTitle?.toLowerCase().includes(q) || a.companyName?.toLowerCase().includes(q))
    }
    setFiltered(data)
  }, [search, filterStatus, apps])

  const openUpdate = (app) => {
    setSelected(app)
    setStatusForm({ status: app.status, remarks: app.remarks || '', aptitudeScore: app.aptitudeScore || '', technicalRound: app.technicalRound || '', hrRound: app.hrRound || '', offerLetterUrl: app.offerLetterUrl || '' })
  }

  const handleUpdate = async (e) => {
    e.preventDefault(); setUpdating(true)
    try {
      const r = await applicationService.updateApplicationStatus(selected.id, statusForm)
      setApps(prev => prev.map(a => a.id === selected.id ? r.data.data : a))
      toast.success('Application updated')
      setSelected(null)
    } catch { toast.error('Update failed') }
    finally { setUpdating(false) }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">{filtered.length} of {apps.length} applications</p>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search student, job, company..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width:200 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={FileText} title="No applications found" />
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student</th><th>Job</th><th>Company</th><th>CGPA</th><th>Status</th><th>Applied</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map(app => (
                    <tr key={app.id}>
                      <td>
                        <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{app.studentName}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{app.rollNumber}</div>
                      </td>
                      <td style={{ color:'var(--text-primary)' }}>{app.jobTitle}</td>
                      <td>{app.companyName || '—'}</td>
                      <td>{app.cgpa || '—'}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                      <td><button className="btn btn-primary btn-sm" onClick={() => openUpdate(app)}>Update</button></td>
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
              <label className="form-label">Status *</label>
              <select className="form-input" value={statusForm.status} onChange={e => setStatusForm(p => ({ ...p, status: e.target.value }))} required>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
              </select>
            </div>
            {[
              { label:'Aptitude Score', key:'aptitudeScore' },
              { label:'Technical Round', key:'technicalRound' },
              { label:'HR Round', key:'hrRound' },
              { label:'Offer Letter URL', key:'offerLetterUrl' },
            ].map(({ label, key }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" value={statusForm[key]} onChange={e => setStatusForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <textarea className="form-input" rows={3} value={statusForm.remarks} onChange={e => setStatusForm(p => ({ ...p, remarks: e.target.value }))} />
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button type="button" className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={updating}>{updating ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  )
}
