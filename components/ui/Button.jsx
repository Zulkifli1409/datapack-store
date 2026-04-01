import React from 'react'
import { clsx } from 'clsx'
import { Loader2 } from 'lucide-react'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  type = 'button',
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors rounded-xl outline-none disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-accent-primary text-white hover:bg-accent-primary/90",
    secondary: "bg-bg-subtle text-text-primary hover:bg-bg-subtle/80",
    outline: "border border-border-default text-text-primary hover:bg-bg-subtle",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "text-text-secondary hover:bg-bg-subtle hover:text-text-primary text-bg-base"
  }
  
  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2",
    xl: "text-lg px-8 py-4 gap-3"
  }

  return (
    <button
      type={type}
      className={clsx(
        baseStyle,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  )
}
