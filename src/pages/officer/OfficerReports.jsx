import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { officerService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#6c63ff','#43e97b','#ff6584','#ffd700','#4cc9f0','#ff9f43','#a29bfe','#fd79a8']

export default function OfficerReports() {
  const [batchStats, setBatchStats] = useState([])
  const [deptStats, setDeptStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([officerService.getBatchStats(), officerService.getDepartmentStats()])
      .then(([b, d]) => { setBatchStats(b.data.data || []); setDeptStats(d.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const tStyle = { contentStyle:{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text-primary)' } }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Placement Reports</h1>
        <p className="page-subtitle">Analytics and statistics by batch and department</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {/* Batch-wise bar chart */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Batch-wise Placement Statistics</h3>
          {batchStats.length === 0
            ? <p style={{ color:'var(--text-muted)' }}>No batch data available</p>
            : (
              <>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={batchStats} margin={{ top:10, right:20, left:0, bottom:5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="batch" tick={{ fill:'var(--text-secondary)', fontSize:12 }} />
                    <YAxis tick={{ fill:'var(--text-secondary)', fontSize:12 }} />
                    <Tooltip {...tStyle} />
                    <Legend />
                    <Bar dataKey="total" fill="var(--border-light)" name="Total" radius={[4,4,0,0]} />
                    <Bar dataKey="placed" fill="var(--accent)" name="Placed" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="table-wrap" style={{ marginTop:20 }}>
                  <table>
                    <thead><tr><th>Batch</th><th>Total</th><th>Placed</th><th>Placement %</th></tr></thead>
                    <tbody>
                      {batchStats.map(b => (
                        <tr key={b.batch}>
                          <td style={{ fontWeight:600, color:'var(--text-primary)' }}>{b.batch}</td>
                          <td>{b.total}</td>
                          <td style={{ color:'var(--success)', fontWeight:600 }}>{b.placed}</td>
                          <td>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ flex:1, height:6, background:'var(--border)', borderRadius:3 }}>
                                <div style={{ width:`${b.percentage}%`, height:'100%', background:'var(--accent)', borderRadius:3 }} />
                              </div>
                              <span style={{ fontSize:12, fontWeight:600 }}>{b.percentage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
        </div>

        {/* Department pie + table */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Department-wise Placement Statistics</h3>
          {deptStats.length === 0
            ? <p style={{ color:'var(--text-muted)' }}>No department data available</p>
            : (
              <div className="grid-2">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={deptStats} dataKey="placed" nameKey="department" cx="50%" cy="50%" outerRadius={100} label={({ department, percentage }) => `${department} ${percentage}%`}>
                      {deptStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip {...tStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>Department</th><th>Total</th><th>Placed</th><th>%</th></tr></thead>
                    <tbody>
                      {deptStats.map((d, i) => (
                        <tr key={d.department}>
                          <td style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ width:10, height:10, borderRadius:2, background:COLORS[i % COLORS.length], display:'inline-block' }} />
                            {d.department}
                          </td>
                          <td>{d.total}</td>
                          <td style={{ color:'var(--success)', fontWeight:600 }}>{d.placed}</td>
                          <td style={{ fontWeight:600 }}>{d.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  )
}
