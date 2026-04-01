import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle2, Home, ClipboardList, Copy } from 'lucide-react'
import { formatCurrency, formatDate, getProviderStyle } from '@/utils/helpers'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function CheckoutSuccessPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const txn = state?.txn

  useEffect(() => {
    if (!txn) navigate('/dashboard', { replace: true })
  }, [])

  if (!txn) return null

  const style = getProviderStyle(txn.provider)

  const copyCode = () => {
    navigator.clipboard.writeText(txn.transactionCode)
    toast.success('Kode transaksi disalin!')
  }

  return (
    <div className="page-enter max-w-md mx-auto text-center space-y-6 pt-4">
      {/* Success Animation */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-emerald-dim border-2 border-emerald-accent/40 flex items-center justify-center animate-scale-in">
            <CheckCircle2 size={44} className="text-emerald-accent" />
          </div>
          {/* Rings */}
          <div className="absolute inset-0 rounded-full border border-emerald-accent/20 animate-ping" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">
            Pembayaran Berhasil! 🎉
          </h1>
          <p className="text-sm text-text-muted">
            Paket data kamu sudah aktif dan siap digunakan
          </p>
        </div>
      </div>

      {/* Transaction Card */}
      <div className="glass-card overflow-hidden text-left">
        <div className="h-0.5" style={{ background: `linear-gradient(90deg, #34d399, #22d3ee)` }} />
        <div className="p-5 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Detail Transaksi</p>

          {/* Package */}
          <div className="flex items-center gap-3 pb-4 border-b border-border-subtle">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
            >
              {txn.provider.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-display font-semibold text-text-primary">{txn.packageName}</p>
              <p className="text-sm text-text-secondary">{txn.quota} · {txn.provider}</p>
            </div>
          </div>

          {/* Details */}
          {[
            { label: 'Nomor HP', value: txn.phone },
            { label: 'Nominal', value: formatCurrency(txn.price) },
            { label: 'Metode Bayar', value: txn.paymentMethod },
            { label: 'Tanggal', value: formatDate(txn.createdAt) },
            { label: 'Status', value: (
              <span className="text-emerald-accent font-semibold bg-emerald-dim px-2 py-0.5 rounded-full text-xs">
                ✓ Berhasil
              </span>
            )},
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center text-sm">
              <span className="text-text-muted">{label}</span>
              <span className="text-text-primary font-medium">{value}</span>
            </div>
          ))}

          {/* Transaction Code */}
          <div className="bg-bg-elevated rounded-xl p-3 flex items-center justify-between border border-border-subtle">
            <div>
              <p className="text-xs text-text-muted">Kode Transaksi</p>
              <p className="text-sm font-mono font-semibold text-accent-primary">{txn.transactionCode}</p>
            </div>
            <button
              onClick={copyCode}
              className="p-2 rounded-lg hover:bg-bg-overlay text-text-muted hover:text-text-primary transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate('/transactions')}
          leftIcon={<ClipboardList size={16} />}
        >
          Riwayat
        </Button>
        <Button
          size="md"
          onClick={() => navigate('/dashboard')}
          leftIcon={<Home size={16} />}
        >
          Beranda
        </Button>
      </div>
    </div>
  )
}
