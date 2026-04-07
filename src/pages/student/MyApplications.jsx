import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { applicationService } from '../../api/services'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import { FileText, X } from 'lucide-react'
import { format } from 'date-fns'

export default function MyApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    applicationService.getMyApplications()
      .then(r => setApps(r.data.data || []))
      .finally(() => setLoading(false))
  }, [])

  const withdraw = async (id) => {
    if (!confirm('Withdraw this application?')) return
    try {
      await applicationService.withdrawApplication(id)
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: 'WITHDRAWN' } : a))
      toast.success('Application withdrawn')
    } catch { toast.error('Failed to withdraw') }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const stageOrder = ['APPLIED','SHORTLISTED','APTITUDE_TEST','TECHNICAL_ROUND','GD_ROUND','HR_ROUND','SELECTED','OFFER_ACCEPTED']

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">{apps.length} total applications</p>
      </div>

      {apps.length === 0
        ? <EmptyState icon={FileText} title="No applications yet" desc="Browse jobs and apply to get started" />
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {apps.map(app => {
              const stageIdx = stageOrder.indexOf(app.status)
              const canWithdraw = !['SELECTED','REJECTED','WITHDRAWN','OFFER_ACCEPTED','OFFER_DECLINED'].includes(app.status)
              return (
                <div key={app.id} className="card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                    <div>
                      <h3 style={{ fontSize:17, fontWeight:700 }}>{app.jobTitle}</h3>
                      <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>
                        {app.companyName}
                      </p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <StatusBadge status={app.status} />
                      {canWithdraw && (
                        <button className="btn btn-danger btn-sm" onClick={() => withdraw(app.id)}>
                          <X size={14} /> Withdraw
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  {stageIdx >= 0 && (
                    <div style={{ marginTop:20 }}>
                      <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:10 }}>Application Progress</p>
                      <div style={{ display:'flex', gap:4 }}>
                        {stageOrder.map((s, i) => (
                          <div key={s} style={{ flex:1, height:4, borderRadius:2,
                            background: i <= stageIdx ? 'var(--accent)' : 'var(--border)' }} />
                        ))}
                      </div>
                      <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:6 }}>
                        Step {stageIdx + 1} of {stageOrder.length}
                      </p>
                    </div>
                  )}

                  <div style={{ display:'flex', gap:20, marginTop:16 }}>
                    {app.aptitudeScore && (
                      <div style={{ fontSize:12 }}>
                        <span style={{ color:'var(--text-muted)' }}>Aptitude: </span>
                        <span style={{ color:'var(--text-primary)', fontWeight:600 }}>{app.aptitudeScore}</span>
                      </div>
                    )}
                    {app.technicalRound && (
                      <div style={{ fontSize:12 }}>
                        <span style={{ color:'var(--text-muted)' }}>Technical: </span>
                        <span style={{ color:'var(--text-primary)', fontWeight:600 }}>{app.technicalRound}</span>
                      </div>
                    )}
                    {app.hrRound && (
                      <div style={{ fontSize:12 }}>
                        <span style={{ color:'var(--text-muted)' }}>HR: </span>
                        <span style={{ color:'var(--text-primary)', fontWeight:600 }}>{app.hrRound}</span>
                      </div>
                    )}
                  </div>

                  {app.remarks && (
                    <div style={{ marginTop:12, padding:'10px 14px', background:'var(--bg-secondary)',
                      borderRadius:8, fontSize:13, color:'var(--text-secondary)', fontStyle:'italic' }}>
                      "{app.remarks}"
                    </div>
                  )}

                  <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:12 }}>
                    Applied {app.appliedAt ? format(new Date(app.appliedAt), 'dd MMM yyyy') : ''}
                  </p>
                </div>
              )
            })}
          </div>
        )}
    </DashboardLayout>
  )
}
