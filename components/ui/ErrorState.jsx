import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ error, onRetry, className = '' }) {
  const isNetwork = error?.message?.includes('server') || error?.message?.includes('terhubung')
  const Icon = isNetwork ? WifiOff : AlertCircle

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-rose-dim border border-rose-accent/20 flex items-center justify-center mb-4">
        <Icon size={28} className="text-rose-accent" />
      </div>
      <h3 className="font-display font-semibold text-text-primary mb-1">
        {isNetwork ? 'Koneksi Bermasalah' : 'Terjadi Kesalahan'}
      </h3>
      <p className="text-sm text-text-muted max-w-xs mb-5">
        {error?.message || 'Gagal memuat data. Periksa koneksi internet Anda.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />}>
          Coba Lagi
        </Button>
      )}
    </div>
  )
}
