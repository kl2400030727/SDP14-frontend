import { X } from 'lucide-react'
export default function Modal({ title, onClose, children, size = 'md' }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: size === 'lg' ? '720px' : '560px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-outline btn-sm" onClick={onClose}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}
