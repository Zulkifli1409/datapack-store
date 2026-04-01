import React from 'react'
import { X } from 'lucide-react'
import { clsx } from 'clsx'

export default function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={clsx("relative w-full max-w-md bg-bg-base rounded-2xl shadow-xl overflow-hidden glass-card neon-border", className)}>
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-border-subtle">
            <h2 className="text-lg font-bold text-text-primary">{title}</h2>
            <button 
              onClick={onClose}
              className="p-1 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-subtle"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
