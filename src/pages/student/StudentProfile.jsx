import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { profileService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { Save, User } from 'lucide-react'

// ✅ FIX: Move F outside
const F = ({ label, name, type = 'text', placeholder = '', value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      type={type}
      name={name}
      className="form-input"
      placeholder={placeholder}
      value={value || ''}
      onChange={onChange}
    />
  </div>
)

export default function StudentProfile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    profileService.getStudentProfile()
      .then(r => {
        setProfile(r.data.data)
        setForm(r.data.data || {})
      })
      .catch(() => setForm({}))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const r = await profileService.updateStudentProfile(form)
      setProfile(r.data.data)
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">
          Keep your profile updated for better job matches
        </p>
      </div>

      {profile?.placementStatus === 'PLACED' && (
        <div style={{
          padding: 16,
          marginBottom: 24,
          background: 'rgba(67,233,123,0.08)',
          border: '1px solid rgba(67,233,123,0.2)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}>
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <p style={{ fontWeight: 700, color: 'var(--success)' }}>
              Congratulations! You are Placed
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {profile.placedCompany} • ₹{profile.ctcOffered} LPA
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid-2" style={{ marginBottom: 24 }}>

          {/* Academic Info */}
          <div className="card">
            <h3 style={{
              fontSize: 15,
              fontWeight: 700,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <User size={16} /> Academic Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <F label="Roll Number" name="rollNumber" placeholder="CS21001" value={form.rollNumber} onChange={handleChange} />
              <F label="Department" name="department" placeholder="Computer Science" value={form.department} onChange={handleChange} />
              <F label="Batch" name="batch" placeholder="2021-2025" value={form.batch} onChange={handleChange} />
              <F label="CGPA" name="cgpa" type="number" placeholder="8.5" value={form.cgpa} onChange={handleChange} />
              <F label="Backlog Count" name="backlogCount" type="number" placeholder="0" value={form.backlogCount} onChange={handleChange} />
            </div>
          </div>

          {/* Professional Info */}
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>
              Professional Info
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <F label="Resume URL" name="resumeUrl" placeholder="https://drive.google.com/..." value={form.resumeUrl} onChange={handleChange} />
              <F label="LinkedIn Profile" name="linkedinUrl" placeholder="https://linkedin.com/in/..." value={form.linkedinUrl} onChange={handleChange} />
              <F label="GitHub Profile" name="githubUrl" placeholder="https://github.com/..." value={form.githubUrl} onChange={handleChange} />

              <div className="form-group">
                <label className="form-label">Skills (comma separated)</label>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Java, Spring Boot, React, MySQL..."
                  value={form.skills || ''}
                  onChange={(e) =>
                    setForm(prev => ({
                      ...prev,
                      skills: e.target.value
                    }))
                  }
                />
              </div>
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