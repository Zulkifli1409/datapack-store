import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList, Search, Copy } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { transactionService } from '@/services/transactionService'
import { formatCurrency, formatDate, getProviderStyle } from '@/utils/helpers'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Input from '@/components/ui/Input'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const STATUS = {
  // Minimal/no color pop: keep statuses consistent
  success: { label: 'Berhasil', color: 'text-text-primary', bg: 'bg-bg-elevated' },
  failed: { label: 'Gagal', color: 'text-text-primary', bg: 'bg-bg-elevated' },
  pending: { label: 'Proses', color: 'text-text-primary', bg: 'bg-bg-elevated' },
}

const FILTERS = ['all', 'success', 'failed']

const TransactionSkeleton = () => (
  <div className="glass-card p-4 space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right space-y-2">
         <Skeleton className="h-4 w-20 ml-auto" />
         <Skeleton className="h-5 w-16 rounded-full ml-auto" />
      </div>
    </div>
  </div>
)

export default function TransactionsPage() {
  const user = useAuthStore(s => s.user)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { data: txns, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: () => transactionService.getTransactions(user?.id),
    enabled: !!user?.id,
  })

  const filtered = useMemo(() => {
    if (!txns) return []
    let result = txns
    if (statusFilter !== 'all') result = result.filter(t => t.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.packageName.toLowerCase().includes(q) ||
        t.transactionCode.toLowerCase().includes(q) ||
        t.provider.toLowerCase().includes(q)
      )
    }
    return result
  }, [txns, statusFilter, search])

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Kode disalin!')
  }

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Riwayat Transaksi</h1>
        <p className="text-sm text-text-muted mt-1">
          Semua riwayat pembelian paket data kamu
          {txns && <span className="text-text-secondary ml-1 font-medium">({txns.length} total)</span>}
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Cari nama paket, kode transaksi..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        leftIcon={<Search size={16} />}
      />

      {/* Status filter */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium border transition-all',
              statusFilter === f
                ? 'bg-bg-elevated border-border-default text-text-primary'
                : 'border-border-default text-text-secondary hover:border-border-strong'
            )}
          >
            {f === 'all' ? 'Semua' : STATUS[f]?.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <div className="space-y-2">
          {Array(5).fill(0).map((_, i) => <TransactionSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Tidak ada transaksi"
          description={search || statusFilter !== 'all' ? 'Coba ubah filter pencarian' : 'Belum ada transaksi yang dilakukan'}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(txn => {
            const status = STATUS[txn.status] || STATUS.pending
            const style = getProviderStyle(txn.provider)
            return (
              <div key={txn.id} className="glass-card p-4 hover:border-border-default transition-all space-y-3">
                <div className="flex items-center gap-3">
                  {/* Provider avatar */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 border border-border-subtle"
                    style={{ background: style.bg, color: style.text, borderColor: style.border }}
                  >
                    {txn.provider.slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{txn.packageName}</p>
                    <p className="text-xs text-text-muted">{txn.phone}</p>
                  </div>

                  {/* Price + status */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-text-primary">{formatCurrency(txn.price)}</p>
                    <span
                      className={clsx(
                        'text-xs font-medium px-2 py-0.5 rounded-full border',
                        'border-border-subtle',
                        status.bg,
                        status.color
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                  <p className="text-xs text-text-muted">{formatDate(txn.createdAt)}</p>
                  <button
                    onClick={() => copyCode(txn.transactionCode)}
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary font-mono transition-colors"
                  >
                    <Copy size={11} />
                    {txn.transactionCode}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
