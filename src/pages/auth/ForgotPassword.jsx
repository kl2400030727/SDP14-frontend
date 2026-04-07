import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../../api/services'
import toast from 'react-hot-toast'
import { ArrowLeft, Send } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSent(true)
      toast.success('Reset link sent! Check your email.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">P</div>
          <span className="auth-logo-text">PlaceMe</span>
        </div>

        {sent ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📧</div>
            <h2 style={{ fontSize:22, marginBottom:8 }}>Check your inbox</h2>
            <p style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:24 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn btn-primary w-full" style={{ justifyContent:'center' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize:24, marginBottom:4 }}>Forgot password?</h1>
            <p style={{ color:'var(--text-secondary)', fontSize:14, marginBottom:28 }}>
              Enter your email and we'll send a reset link.
            </p>
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="you@college.edu"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}
                style={{ justifyContent:'center' }}>
                <Send size={16} /> {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p style={{ textAlign:'center', marginTop:20, fontSize:14 }}>
              <Link to="/login" style={{ color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
