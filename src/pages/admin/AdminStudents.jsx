import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { adminService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import { GraduationCap, Search, CheckCircle, XCircle } from 'lucide-react'

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('ALL')

  useEffect(() => {
    adminService.getAllStudents()
      .then(r => { 
        const studentsData = r.data.data || r.data || [];
        setStudents(studentsData); 
        setFiltered(studentsData); 
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let data = students
    if (filterDept !== 'ALL') data = data.filter(s => s.department === filterDept)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(s => s.fullName?.toLowerCase().includes(q) || s.rollNumber?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q))
    }
    setFiltered(data)
  }, [search, filterDept, students])

  const toggleEligibility = async (id, eligible) => {
    try {
      await adminService.toggleEligibility(id, eligible)
      setStudents(prev => prev.map(s => s.userId === id ? { ...s, eligible } : s))
      toast.success(`Eligibility ${eligible ? 'granted' : 'revoked'}`)
    } catch { toast.error('Failed to update') }
  }

  const depts = ['ALL', ...new Set(students.map(s => s.department).filter(Boolean))]

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title" style={{fontFamily: 'Montserrat, var(--font-display), sans-serif', textTransform: 'capitalize', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1.1}}>Student Management</h1>
        <p className="page-subtitle">{filtered.length} students</p>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search name, roll number, email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width:200 }} value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          {depts.map(d => <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <EmptyState icon={GraduationCap} title="No students found" />
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Student</th><th>Roll No</th><th>Dept</th><th>Batch</th><th>CGPA</th><th>Placement</th><th>Eligible</th><th></th></tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.userId}>
                      <td>
                        <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{s.fullName}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.email}</div>
                      </td>
                      <td>{s.rollNumber || '—'}</td>
                      <td>{s.department || '—'}</td>
                      <td>{s.batch || '—'}</td>
                      <td>{s.cgpa || '—'}</td>
                      <td>
                        {s.placementStatus === 'PLACED'
                          ? <span className="badge badge-green">{s.placedCompany || 'PLACED'}</span>
                          : <span className="badge badge-gray">{s.placementStatus?.replace(/_/g,' ') || '—'}</span>}
                      </td>
                      <td>
                        {s.eligible
                          ? <span className="badge badge-green">Yes</span>
                          : <span className="badge badge-red">No</span>}
                      </td>
                      <td>
                        <button className={`btn btn-sm ${s.eligible ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleEligibility(s.userId, !s.eligible)}>
                          {s.eligible ? <><XCircle size={13}/> Revoke</> : <><CheckCircle size={13}/> Allow</>}
                        </button>
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
