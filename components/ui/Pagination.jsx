import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  const renderPages = () => {
    const result = []
    let prev = null
    for (const p of visiblePages) {
      if (prev && p - prev > 1) {
        result.push(<span key={`ellipsis-${p}`} className="px-2 text-text-muted text-sm">…</span>)
      }
      result.push(
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={clsx(
            'w-9 h-9 rounded-xl text-sm font-medium transition-all duration-150',
            p === page
                  ? 'bg-bg-elevated text-text-primary border border-border-default'
              : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
          )}
        >
          {p}
        </button>
      )
      prev = p
    }
    return result
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      {renderPages()}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-elevated hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
