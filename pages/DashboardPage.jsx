import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShoppingBag, ClipboardList, TrendingUp, Zap, ChevronRight, Wifi, Star } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { packageService } from '@/services/packageService'
import { transactionService } from '@/services/transactionService'
import { formatCurrency, formatDateShort, getProviderStyle } from '@/utils/helpers'
import PackageCard from '@/components/package/PackageCard'
import Skeleton from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { clsx } from 'clsx'

const STATUS_STYLE = {
  success: { color: 'text-emerald-accent', bg: 'bg-emerald-dim', label: 'Berhasil' },
  failed: { color: 'text-rose-accent', bg: 'bg-rose-dim', label: 'Gagal' },
  pending: { color: 'text-amber-accent', bg: 'bg-amber-dim', label: 'Proses' },
}

const PackageCardSkeleton = () => (
  <div className="glass-card p-5 space-y-4">
    <Skeleton className="h-10 w-24 rounded-xl" />
    <Skeleton className="h-12 w-32" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
)

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Selamat pagi' : hour < 17 ? 'Selamat siang' : 'Selamat malam'

  const { data: popularData, isLoading: loadingPkg } = useQuery({
    queryKey: ['packages', 'popular'],
    queryFn: () => packageService.getPopularPackages(12),
  })

  const { data: txns } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => transactionService.getTransactions(user?.id),
    enabled: !!user?.id,
  })

  const recentTxns = txns?.slice(0, 3) || []

  return (
    <div className="space-y-8 page-enter">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-bg-elevated via-bg-overlay to-bg-elevated border border-border-default p-6 md:p-8">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-accent/8 rounded-full blur-3xl -translate-x-10 translate-y-10" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/40 to-transparent" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-text-muted mb-1 flex items-center gap-2">
              <span>👋</span> {greeting},
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">
              {user?.name}
            </h1>
            <p className="text-text-secondary text-sm">
              Temukan paket data terbaik untuk aktivitasmu hari ini.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <Button
              onClick={() => navigate('/packages')}
              size="lg"
              rightIcon={<ChevronRight size={16} />}
              className="whitespace-nowrap"
            >
              Beli Paket Data
            </Button>
            <p className="text-xs text-text-muted text-center md:text-right">
              {txns?.length || 0} transaksi total
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: ShoppingBag, label: 'Total Pembelian', value: txns?.filter(t => t.status === 'success').length || 0, sub: 'transaksi', color: 'text-accent-primary', bg: 'bg-accent-dim' },
          { icon: TrendingUp, label: 'Total Pengeluaran', value: formatCurrency(txns?.filter(t => t.status === 'success').reduce((s, t) => s + t.price, 0) || 0), sub: 'all time', color: 'text-emerald-accent', bg: 'bg-emerald-dim' },
          { icon: Wifi, label: 'Provider Fav', value: (() => { const s = txns?.filter(t => t.status === 'success'); if (!s?.length) return '-'; const c = s.reduce((acc, t) => ({ ...acc, [t.provider]: (acc[t.provider] || 0) + 1 }), {}); return Object.entries(c).sort((a,b) => b[1]-a[1])[0]?.[0] || '-' })(), sub: 'terbanyak', color: 'text-cyan-accent', bg: 'bg-cyan-dim' },
          { icon: Star, label: 'Paket Populer', value: '12+', sub: 'tersedia', color: 'text-amber-accent', bg: 'bg-amber-dim' },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="glass-card p-4 space-y-3 flex flex-col items-center text-center">
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center', bg)}>
              <Icon size={16} className={color} />
            </div>
            <div>
              <div className="text-lg font-display font-bold text-text-primary leading-tight">{value}</div>
              <div className="text-xs text-text-muted">{sub}</div>
            </div>
            <div className="text-xs text-text-secondary">{label}</div>
          </div>
        ))}
      </div>

      {/* Popular Packages */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-text-primary">Paket Populer</h2>
            <p className="text-xs text-text-muted mt-0.5">Pilihan terlaris minggu ini</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/packages')}
            rightIcon={<ChevronRight size={14} />}
          >
            Lihat Semua
          </Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
          {loadingPkg
            ? Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-56">
                  <PackageCardSkeleton />
                </div>
              ))
            : popularData?.map(pkg => (
                <div key={pkg.id} className="flex-shrink-0 w-56">
                  <PackageCard pkg={pkg} />
                </div>
              ))
          }
        </div>
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-text-primary">Transaksi Terakhir</h2>
            <p className="text-xs text-text-muted mt-0.5">Riwayat 3 pembelian terbaru</p>
          </div>
          {txns?.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/transactions')}
              rightIcon={<ChevronRight size={14} />}
            >
              Semua
            </Button>
          )}
        </div>

        {recentTxns.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center mx-auto mb-3">
              <ClipboardList size={24} className="text-text-muted" />
            </div>
            <p className="font-display font-semibold text-text-primary text-sm mb-1">Belum ada transaksi</p>
            <p className="text-xs text-text-muted mb-4">Beli paket data pertamamu sekarang!</p>
            <Button size="sm" onClick={() => navigate('/packages')}>Beli Sekarang</Button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentTxns.map(txn => {
              const status = STATUS_STYLE[txn.status] || STATUS_STYLE.pending
              const pStyle = getProviderStyle(txn.provider)
              return (
                <div key={txn.id} className="glass-card p-4 flex items-center gap-4 hover:border-border-default transition-all">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: pStyle.bg, color: pStyle.text, border: `1px solid ${pStyle.border}` }}
                  >
                    {txn.provider.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{txn.packageName}</p>
                    <p className="text-xs text-text-muted">{formatDateShort(txn.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-text-primary">{formatCurrency(txn.price)}</p>
                    <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', status.bg, status.color)}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
