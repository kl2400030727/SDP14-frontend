import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="page-wrapper">
      <Sidebar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <main className="main-content">{children}</main>
      </div>
    </div>
  )
}
