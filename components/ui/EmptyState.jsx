import Button from './Button'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mb-4">
          <Icon size={28} className="text-text-muted" />
        </div>
      )}
      <h3 className="font-display font-semibold text-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-text-muted max-w-xs mb-5">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action} size="sm">{actionLabel}</Button>
      )}
    </div>
  )
}
