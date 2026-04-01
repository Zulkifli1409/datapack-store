import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, getDiscount, getProviderStyle } from '@/utils/helpers'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

const PackageCard = memo(function PackageCard({ pkg, compact = false }) {
  const navigate = useNavigate()
  const discount = getDiscount(pkg.originalPrice, pkg.price)
  const style = getProviderStyle(pkg.provider)

  return (
    <div
      className={clsx(
        'glass-card group relative overflow-hidden',
        'hover:border-border-default transition-all duration-200',
        'cursor-pointer',
        compact ? 'p-4' : 'p-5'
      )}
      onClick={() => navigate(`/packages/${pkg.id}`)}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary border border-border-subtle">
          {pkg.badge}
        </div>
      )}

      {/* Provider + discount */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 border border-border-subtle"
          style={{ background: style.bg, color: style.text, borderColor: style.border }}
        >
          {pkg.provider.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-text-muted">{pkg.provider}</p>
          <h3 className="text-sm font-display font-semibold text-text-primary leading-tight truncate pr-12">
            {pkg.name}
          </h3>
        </div>
      </div>

      {/* Quota */}
      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-display font-bold text-text-primary">
            {pkg.quota === 999 ? '∞' : pkg.quota}
          </span>
          <span className="text-sm font-medium text-text-secondary">
            {pkg.quota === 999 ? 'Unlimited' : pkg.quotaUnit}
          </span>
        </div>
        {pkg.bonus && <p className="text-xs text-text-muted mt-0.5">Bonus: {pkg.bonus}</p>}
      </div>

      {/* Meta */}
      <div className="text-xs text-text-muted mb-4">
        <span>{pkg.validDays === 1 ? '1 Hari' : `${pkg.validDays} Hari`}</span>
        <span className="mx-2">·</span>
        <span>{pkg.speed}</span>
        <span className="mx-2">·</span>
        <span>Rating {pkg.rating}</span>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-lg font-display font-bold text-text-primary">
            {formatCurrency(pkg.price)}
          </div>
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs line-through text-text-muted">{formatCurrency(pkg.originalPrice)}</span>
              <span className="text-xs font-semibold text-text-secondary">-{discount}%</span>
            </div>
          )}
        </div>
      </div>

      <Button
        fullWidth
        size="sm"
        variant="outline"
        className="group-hover:bg-bg-elevated transition-all duration-200"
        onClick={(e) => { e.stopPropagation(); navigate(`/packages/${pkg.id}`) }}
      >
        Lihat Detail
      </Button>
    </div>
  )
})

export default PackageCard
