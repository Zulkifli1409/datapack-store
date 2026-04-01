import { clsx } from 'clsx'

const variants = {
  default: 'bg-bg-elevated text-text-secondary border-border-default',
  primary: 'bg-accent-dim text-accent-primary border-accent-primary/20',
  success: 'bg-emerald-dim text-emerald-accent border-emerald-accent/20',
  warning: 'bg-amber-dim text-amber-accent border-amber-accent/20',
  danger: 'bg-rose-dim text-rose-accent border-rose-accent/20',
  cyan: 'bg-cyan-dim text-cyan-accent border-cyan-accent/20',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}
