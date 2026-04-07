import { Inbox } from 'lucide-react'
export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here', desc = '' }) {
  return (
    <div className="empty-state">
      <Icon size={48} />
      <h4 style={{ fontSize:'16px', fontWeight:600, color:'var(--text-secondary)' }}>{title}</h4>
      {desc && <p>{desc}</p>}
    </div>
  )
}
