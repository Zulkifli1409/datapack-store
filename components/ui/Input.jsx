import { clsx } from 'clsx'

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={clsx('space-y-1.5', className)}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          className={clsx(
            'w-full bg-bg-elevated border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted',
            'transition-all duration-200 outline-none',
            'focus:border-accent-primary focus:bg-bg-overlay focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]',
            error ? 'border-rose-accent/60 focus:border-rose-accent focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]' : 'border-border-default hover:border-border-strong',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            inputClassName
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-accent flex items-center gap-1">⚠ {error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
}
