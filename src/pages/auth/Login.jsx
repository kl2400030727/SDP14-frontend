import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const roleRedirect = {
    ROLE_ADMIN: '/admin/dashboard',
    ROLE_STUDENT: '/student/dashboard',
    ROLE_EMPLOYER: '/employer/dashboard',
    ROLE_PLACEMENT_OFFICER: '/officer/dashboard',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await login(form.email, form.password)
      navigate(roleRedirect[data.role] || '/student/dashboard')
    } catch {}
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">P</div>
          <span className="auth-logo-text">PlaceMe</span>
        </div>

        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Welcome back</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
          Sign in to your placement portal
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" className="form-input" placeholder="you@college.edu"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'} className="form-input"
                placeholder="••••••••" style={{ paddingRight: 44 }}
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', padding: 4
                }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: 'var(--accent)' }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}
            style={{ justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Signing in...' : <><span>Sign In</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Register</Link>
        </p>

        {/* Demo credentials */}
        <div style={{
          marginTop: 24, padding: 14, background: 'var(--bg-secondary)',
          borderRadius: 10, border: '1px solid var(--border)', fontSize: 12
        }}>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6 }}>Demo Credentials</p>
          <p style={{ color: 'var(--text-secondary)' }}>Admin: admin@placement.com / Admin@123</p>
        </div>
      </div>
    </div>
  )
}
