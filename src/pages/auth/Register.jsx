import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ArrowRight } from 'lucide-react'

const ROLES = [
  { value: 'ROLE_STUDENT', label: '🎓 Student', desc: 'Browse jobs, apply, track applications' },
  { value: 'ROLE_EMPLOYER', label: '🏢 Employer', desc: 'Post jobs, review candidates' },
  { value: 'ROLE_PLACEMENT_OFFICER', label: '👔 Placement Officer', desc: 'Manage placements, reports' },
]

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: '', phone: '' })

  const roleRedirect = {
    ROLE_STUDENT: '/student/dashboard',
    ROLE_EMPLOYER: '/employer/dashboard',
    ROLE_PLACEMENT_OFFICER: '/officer/dashboard',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) return
    try {
      const data = await register(form)
      navigate(roleRedirect[data.role] || '/student/dashboard')
    } catch {}
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <div className="auth-logo-mark">P</div>
          <span className="auth-logo-text">PlaceMe</span>
        </div>

        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Create account</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
          Join the placement management platform
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Role selection */}
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ROLES.map(r => (
                <label key={r.value} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: form.role === r.value ? 'var(--accent-soft)' : 'var(--bg-secondary)',
                  border: `1px solid ${form.role === r.value ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <input type="radio" name="role" value={r.value}
                    checked={form.role === r.value}
                    onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    style={{ accentColor: 'var(--accent)' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="John Doe"
              value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-input" placeholder="+91 99999 99999"
              value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min. 6 characters"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              minLength={6} required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full"
            disabled={loading || !form.role} style={{ justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
