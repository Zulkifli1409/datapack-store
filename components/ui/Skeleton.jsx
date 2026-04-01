import React from 'react'
import { clsx } from 'clsx'

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={clsx("animate-pulse bg-border-subtle rounded-md", className)}
      {...props}
    />
  )
}
