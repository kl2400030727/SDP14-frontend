import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { profileService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { Building2, Save } from 'lucide-react'

export default function EmployerProfile() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    profileService.getEmployerProfile()
      .then(r => setForm(r.data.data || {}))
      .catch(() => setForm({}))
      .finally(() => setLoading(false))
  }, [])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await profileService.updateEmployerProfile(form)
      toast.success('Company profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const F = ({ label, name, placeholder='', type='text' }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input type={type} className="form-input" placeholder={placeholder} value={form[name] || ''} onChange={set(name)} />
    </div>
  )

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Company Profile</h1>
        <p className="page-subtitle">Update your company information visible to students</p>
      </div>

      {form.verified && (
        <div style={{ padding:14, marginBottom:24, background:'rgba(67,233,123,0.08)', border:'1px solid rgba(67,233,123,0.2)', borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
          <span>✅</span>
          <p style={{ fontSize:14, color:'var(--success)', fontWeight:600 }}>Verified Company</p>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid-2" style={{ gap:24, marginBottom:24 }}>
          <div className="card">
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>
              <Building2 size={16} /> Company Details
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <F label="Company Name *" name="companyName" placeholder="Acme Corporation" />
              <F label="Industry" name="industry" placeholder="Information Technology" />
              <F label="Company Size" name="companySize" placeholder="500-1000 employees" />
              <F label="Website" name="website" placeholder="https://company.com" />
              <F label="Logo URL" name="logoUrl" placeholder="https://..." />
              <div className="form-group">
                <label className="form-label">Company Description</label>
                <textarea className="form-input" rows={4} placeholder="Tell students about your company..."
                  value={form.description || ''} onChange={set('description')} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>Location</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <F label="Address" name="address" placeholder="123 Tech Park" />
              <F label="City" name="city" placeholder="Bangalore" />
              <F label="Country" name="country" placeholder="India" />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </DashboardLayout>
  )
}
