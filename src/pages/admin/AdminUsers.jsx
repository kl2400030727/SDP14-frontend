import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import { Users, Search, UserCheck, UserX } from 'lucide-react'

const roleColor = { ROLE_ADMIN:'badge-red', ROLE_STUDENT:'badge-blue', ROLE_EMPLOYER:'badge-yellow', ROLE_PLACEMENT_OFFICER:'badge-purple' }

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('ALL')

  useEffect(() => {
    adminService.getAllUsers()
      .then(r => { setUsers(r.data.data || []); setFiltered(r.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = users
    if (filterRole !== 'ALL') data = data.filter(u => u.role === filterRole)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(u => u.fullName?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
    }
    setFiltered(data)
  }, [search, filterRole, users])

  const toggleStatus = async (id, enabled) => {
    try {
      await adminService.toggleUserStatus(id, enabled)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, enabled } : u))
      toast.success(`User ${enabled ? 'enabled' : 'disabled'}`)
    } catch { toast.error('Failed to update user') }
  }

  const roles = ['ALL','ROLE_ADMIN','ROLE_STUDENT','ROLE_EMPLOYER','ROLE_PLACEMENT_OFFICER']

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">{filtered.length} users</p>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width:220 }} value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          {roles.map(r => <option key={r} value={r}>{r === 'ALL' ? 'All Roles' : r.replace('ROLE_','').replace('_',' ')}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={Users} title="No users found" />
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{u.fullName}</td>
                      <td>{u.email}</td>
                      <td><span className={`badge ${roleColor[u.role] || 'badge-gray'}`}>{u.role?.replace('ROLE_','').replace('_',' ')}</span></td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        {u.enabled
                          ? <span className="badge badge-green">Active</span>
                          : <span className="badge badge-red">Disabled</span>}
                      </td>
                      <td>
                        {u.role !== 'ROLE_ADMIN' && (
                          <button
                            className={`btn btn-sm ${u.enabled ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => toggleStatus(u.id, !u.enabled)}
                          >
                            {u.enabled ? <><UserX size={13}/> Disable</> : <><UserCheck size={13}/> Enable</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </DashboardLayout>
  )
}
