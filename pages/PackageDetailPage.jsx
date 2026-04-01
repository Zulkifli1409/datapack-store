import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Star, Clock, Zap, CheckCircle2, Gift, ShoppingCart } from 'lucide-react'
import { packageService } from '@/services/packageService'
import { useCheckoutStore } from '@/store/checkoutStore'
import { formatCurrency, getDiscount, getProviderStyle } from '@/utils/helpers'
import Skeleton from '@/components/ui/Skeleton'
import ErrorState from '@/components/ui/ErrorState'
import Button from '@/components/ui/Button'

export default function PackageDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const setPackage = useCheckoutStore(s => s.setPackage)

  const { data: pkg, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['package', id],
    queryFn: () => packageService.getPackageById(id),
    enabled: !!id,
  })

  const handleBuy = () => {
    setPackage(pkg)
    navigate('/checkout')
  }

  if (isLoading) return (
    <div className="space-y-6 page-enter max-w-2xl mx-auto">
      <Skeleton className="h-8 w-48 rounded" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
    </div>
  )

  if (isError) return <ErrorState error={error} onRetry={refetch} />

  if (!pkg) return null

  const style = getProviderStyle(pkg.provider)
  const discount = getDiscount(pkg.originalPrice, pkg.price)

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      {/* Hero Card */}
      <div className="glass-card overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, ${style.accent}, ${style.accent}88)` }} />

        <div className="p-6">
          {/* Provider + Badge */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold"
                style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
              >
                {pkg.provider.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: style.text }}>{pkg.provider}</p>
                <h1 className="text-xl font-display font-bold text-text-primary">{pkg.name}</h1>
              </div>
            </div>
            {pkg.badge && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
              >
                {pkg.badge}
              </span>
            )}
          </div>

          {/* Quota Big Display */}
          <div className="flex items-end gap-4 mb-5 py-4 border-y border-border-subtle">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-display font-extrabold text-text-primary">
                  {pkg.quota === 999 ? '∞' : pkg.quota}
                </span>
                <span className="text-xl font-semibold text-text-secondary">
                  {pkg.quota === 999 ? 'Unlimited' : pkg.quotaUnit}
                </span>
              </div>
              {pkg.bonus && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Gift size={13} className="text-text-muted" />
                  <span className="text-sm text-text-secondary font-medium">+{pkg.bonus}</span>
                </div>
              )}
            </div>

            <div className="ml-auto text-right">
              <div className="text-3xl font-display font-bold text-text-primary">{formatCurrency(pkg.price)}</div>
              {discount > 0 && (
                <div className="flex items-center gap-2 justify-end mt-0.5">
                  <span className="text-sm line-through text-text-muted">{formatCurrency(pkg.originalPrice)}</span>
                  <span className="text-sm font-bold text-text-secondary bg-bg-elevated px-2 py-0.5 rounded-full border border-border-subtle">-{discount}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: Clock, label: 'Masa Aktif', value: `${pkg.validDays} Hari` },
              { icon: Zap, label: 'Kecepatan', value: pkg.speed },
              { icon: Star, label: 'Rating', value: `${pkg.rating} (${pkg.reviewCount})` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-bg-elevated rounded-xl p-3 text-center border border-border-subtle">
                <Icon size={16} className="text-accent-primary mx-auto mb-1" />
                <p className="text-xs text-text-muted">{label}</p>
                <p className="text-sm font-semibold text-text-primary">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed mb-5">{pkg.description}</p>

          {/* Features */}
          <div className="space-y-2 mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Yang kamu dapat</p>
            {pkg.features?.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={15} className="text-text-muted flex-shrink-0" />
                <span className="text-sm text-text-secondary">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            fullWidth
            size="xl"
            onClick={handleBuy}
            leftIcon={<ShoppingCart size={18} />}
            className="font-bold"
          >
            Beli Sekarang — {formatCurrency(pkg.price)}
          </Button>
        </div>
      </div>
    </div>
  )
}
