export default function LoadingSpinner({ fullPage = false }) {
  if (fullPage) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
      <div className="spinner" />
    </div>
  )
  return <div className="loading-center"><div className="spinner" /></div>
}
