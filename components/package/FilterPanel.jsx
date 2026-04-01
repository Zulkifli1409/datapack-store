import { memo } from 'react'
import { formatCurrency } from '@/utils/helpers'

const PROVIDERS = ['all', 'XL', 'Telkomsel', 'Indosat', 'Tri', 'Smartfren']
const QUOTA_OPTIONS = [
  { label: 'Semua', value: 0 },
  { label: '≥ 1 GB', value: 1 },
  { label: '≥ 5 GB', value: 5 },
  { label: '≥ 10 GB', value: 10 },
  { label: '≥ 20 GB', value: 20 },
]

const FilterPanel = memo(function FilterPanel({ filters, onChange, onReset }) {
  const hasFilter = filters.provider !== 'all' || filters.maxPrice < 150000 || filters.minQuota > 0

  return (
    <div className="glass-card p-5 space-y-6 sticky top-24">
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-sm text-text-primary">Filter</span>
        {hasFilter && (
          <button
            onClick={onReset}
            className="text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Provider */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Provider</p>
        <div className="flex flex-col gap-1.5">
          {PROVIDERS.map(p => (
            <button
              key={p}
              onClick={() => onChange({ provider: p })}
              className={`text-left px-3 py-2 rounded-xl text-sm transition-all ${
                filters.provider === p
                  ? 'bg-bg-elevated text-text-primary border border-border-default font-medium'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              }`}
            >
              {p === 'all' ? 'Semua Provider' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Harga Max */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Harga Maks</p>
          <span className="text-xs font-medium text-text-primary">{formatCurrency(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min={5000}
          max={150000}
          step={5000}
          value={filters.maxPrice}
          onChange={e => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-text-muted">
          <span>Rp 5rb</span>
          <span>Rp 150rb</span>
        </div>
      </div>

      {/* Minimum Quota */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Min. Kuota</p>
        <div className="grid grid-cols-2 gap-1.5">
          {QUOTA_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ minQuota: opt.value })}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                filters.minQuota === opt.value
                  ? 'bg-bg-elevated text-text-primary border border-border-default'
                  : 'bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle hover:border-border-default'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
})

export default FilterPanel
