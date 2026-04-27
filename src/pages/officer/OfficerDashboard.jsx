import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { officerService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { Users, Briefcase, CheckCircle, TrendingUp, IndianRupee, Building2, FileText, Award } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['#6c63ff','#43e97b','#ff6584','#ffd700','#4cc9f0']

export default function OfficerDashboard() {
  const [stats, setStats] = useState(null)
  const [batchStats, setBatchStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([officerService.getDashboard(), officerService.getBatchStats()])
      .then(([s, b]) => { setStats(s.data.data); setBatchStats(b.data.data || []) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  const pieData = [
    { name:'Placed', value: stats?.placedStudents || 0 },
    { name:'Not Placed', value: stats?.notPlacedStudents || 0 },
  ]

  const cards = [
    { label:'Total Students', value: stats?.totalStudents || 0, icon: Users, color:'purple', bg:'var(--accent-soft)', ic:'var(--accent)' },
    { label:'Placed Students', value: stats?.placedStudents || 0, icon: CheckCircle, color:'green', bg:'rgba(67,233,123,0.1)', ic:'var(--success)' },
    { label:'Placement %', value: `${stats?.placementPercentage || 0}%`, icon: TrendingUp, color:'gold', bg:'rgba(255,215,0,0.1)', ic:'var(--gold)' },
    { label:'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase, color:'blue', bg:'rgba(76,201,240,0.1)', ic:'var(--info)' },
    { label:'Total Applications', value: stats?.totalApplications || 0, icon: FileText, color:'purple', bg:'var(--accent-soft)', ic:'var(--accent)' },
    { label:'Selected', value: stats?.selectedApplications || 0, icon: Award, color:'green', bg:'rgba(67,233,123,0.1)', ic:'var(--success)' },
    { label:'Avg CTC (LPA)', value: stats?.averageCTC ? `₹${Number(stats.averageCTC).toFixed(2)}` : '—', icon: IndianRupee, color:'gold', bg:'rgba(255,215,0,0.1)', ic:'var(--gold)' },
    { label:'Total Companies', value: stats?.totalCompanies || 0, icon: Building2, color:'blue', bg:'rgba(76,201,240,0.1)', ic:'var(--info)' },
  ]

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title" style={{fontFamily: 'Montserrat, var(--font-display), sans-serif', textTransform: 'capitalize', fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1.1}}>Placement Officer Dashboard</h1>
        <p className="page-subtitle">Real-time placement analytics and statistics</p>
      </div>

      <div className="grid-4" style={{ marginBottom:32 }}>
        {cards.map(c => (
          <div key={c.label} className={`stat-card ${c.color}`}>
            <div className="stat-icon" style={{ background:c.bg }}><c.icon size={20} color={c.ic} /></div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Placement pie */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Placement Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Batch bar chart */}
        <div className="card">
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:20 }}>Batch-wise Placements</h3>
          {batchStats.length === 0
            ? <p style={{ color:'var(--text-muted)', fontSize:14 }}>No batch data available</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={batchStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="batch" tick={{ fill:'var(--text-muted)', fontSize:12 }} />
                  <YAxis tick={{ fill:'var(--text-muted)', fontSize:12 }} />
                  <Tooltip contentStyle={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8 }} />
                  <Bar dataKey="placed" fill="var(--accent)" radius={[4,4,0,0]} name="Placed" />
                  <Bar dataKey="total" fill="var(--border-light)" radius={[4,4,0,0]} name="Total" />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>
      </div>
    </DashboardLayout>
  )
}
