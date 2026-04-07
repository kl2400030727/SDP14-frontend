import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../api/services'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await authService.login({ email, password })
      const data = res.data.data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      toast.success(`Welcome back, ${data.fullName}!`)
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      throw err
    } finally { setLoading(false) }
  }

  const register = async (formData) => {
    setLoading(true)
    try {
      const res = await authService.register(formData)
      const data = res.data.data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)
      toast.success('Registration successful! Please verify your email.')
      return data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      throw err
    } finally { setLoading(false) }
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }, [])

  const isRole = (role) => user?.role === role

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
