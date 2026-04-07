import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { officerService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { ClipboardList, Search } from 'lucide-react'

export default function PlacementRecords() {
  const [records, setRecords] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [year, setYear] = useState('')
  const [search, setSearch] = useState('')

  const fetchRecords = (y) => {
    setLoading(true)
    officerService.getPlacementRecords(y || null)
      .then(r => { setRecords(r.data.data || []); setFiltered(r.data.data || []) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRecords('') }, [])

  useEffect(() => {
    if (!search) { setFiltered(records); return }
    const q = search.toLowerCase()
    setFiltered(records.filter(r =>
      r.studentName?.toLowerCase().includes(q) || r.companyName?.toLowerCase().includes(q) ||
      r.jobTitle?.toLowerCase().includes(q) || r.rollNumber?.toLowerCase().includes(q)
    ))
  }, [search, records])

  const years = [...new Set(records.map(r => r.academicYear).filter(Boolean))].sort().reverse()

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Placement Records</h1>
        <p className="page-subtitle">{filtered.length} placement records</p>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <div className="search-box" style={{ flex:1, minWidth:200 }}>
          <Search size={15} color="var(--text-muted)" />
          <input placeholder="Search student, company, roll number..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width:180 }} value={year} onChange={e => { setYear(e.target.value); fetchRecords(e.target.value) }}>
          <option value="">All Academic Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner />
        : filtered.length === 0
        ? <EmptyState icon={ClipboardList} title="No placement records found" />
        : (
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th><th>Roll No</th><th>Dept</th><th>CGPA</th>
                    <th>Company</th><th>Role</th><th>CTC (LPA)</th><th>Year</th><th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight:600, color:'var(--text-primary)' }}>{r.studentName}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)' }}>{r.studentEmail}</div>
                      </td>
                      <td>{r.rollNumber || '—'}</td>
                      <td>{r.department || '—'}</td>
                      <td>{r.cgpa || '—'}</td>
                      <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{r.companyName}</td>
                      <td>{r.jobTitle}</td>
                      <td>
                        {r.ctcOffered
                          ? <span style={{ color:'var(--success)', fontWeight:700 }}>₹{r.ctcOffered}</span>
                          : '—'}
                      </td>
                      <td>{r.academicYear || '—'}</td>
                      <td>{r.placementType
                        ? <span className="badge badge-blue">{r.placementType.replace(/_/g,' ')}</span>
                        : '—'}
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
