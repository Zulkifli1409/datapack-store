import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, CreditCard, ShieldCheck, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { useCheckoutStore } from '@/store/checkoutStore'
import { useAuthStore } from '@/store/authStore'
import { transactionService } from '@/services/transactionService'
import { formatCurrency, getProviderStyle, validators } from '@/utils/helpers'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { selectedPackage, isProcessing, phone, setPhone, startCheckout, finishCheckout, failCheckout } = useCheckoutStore()
  const user = useAuthStore(s => s.user)

  const [phoneError, setPhoneError] = useState('')
  const [optimisticSuccess, setOptimisticSuccess] = useState(false)

  useEffect(() => {
    if (!selectedPackage) navigate('/packages', { replace: true })
  }, [selectedPackage])

  useEffect(() => {
    if (user?.phone) setPhone(user.phone)
  }, [user])

  if (!selectedPackage) return null

  const style = getProviderStyle(selectedPackage.provider)

  const handleCheckout = async () => {
    const err = validators.phone(phone)
    if (err) { setPhoneError(err); return }
    setPhoneError('')

    const canProceed = startCheckout()
    if (!canProceed) {
      toast.error('Transaksi sedang diproses...')
      return
    }

    setOptimisticSuccess(true)

    try {
      const txn = await transactionService.createTransaction({
        userId: user.id,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        provider: selectedPackage.provider,
        quota: `${selectedPackage.quota === 999 ? 'Unlimited' : selectedPackage.quota + selectedPackage.quotaUnit}`,
        price: selectedPackage.price,
        phone,
        paymentMethod: 'Saldo DataPack',
      })

      finishCheckout(txn)
      toast.success('Paket berhasil diaktifkan!')
      navigate('/checkout/success', { state: { txn }, replace: true })
    } catch (err) {
      setOptimisticSuccess(false)
      failCheckout()
      toast.error(err.message || 'Checkout gagal. Coba lagi.')
    }
  }

  return (
    <div className="page-enter max-w-lg mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Checkout</h1>
        <p className="text-sm text-text-muted mt-0.5">Periksa pesanan sebelum konfirmasi</p>
      </div>

      {/* Order Summary */}
      <div className="glass-card overflow-hidden">
        <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${style.accent}, transparent)` }} />
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">Detail Paket</p>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
            >
              {selectedPackage.provider.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-text-primary">{selectedPackage.name}</p>
              <p className="text-sm text-text-secondary">
                {selectedPackage.quota === 999 ? 'Unlimited' : `${selectedPackage.quota}${selectedPackage.quotaUnit}`}
                {' · '}{selectedPackage.validDays} Hari · {selectedPackage.speed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Input */}
      <div className="glass-card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Nomor Tujuan</p>
        <Input
          label="Nomor HP"
          type="tel"
          placeholder="08123456789"
          value={phone}
          onChange={e => { setPhone(e.target.value); setPhoneError('') }}
          error={phoneError}
          leftIcon={<Phone size={16} />}
          hint="Pastikan nomor aktif dan sesuai provider"
        />
      </div>

      {/* Price Breakdown */}
      <div className="glass-card p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Rincian Harga</p>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Harga Paket</span>
          <span className="text-text-primary">{formatCurrency(selectedPackage.originalPrice || selectedPackage.price)}</span>
        </div>
        {selectedPackage.originalPrice > selectedPackage.price && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-accent">Diskon</span>
            <span className="text-emerald-accent">-{formatCurrency(selectedPackage.originalPrice - selectedPackage.price)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Biaya Layanan</span>
          <span className="text-emerald-accent">Gratis</span>
        </div>
        <div className="border-t border-border-subtle pt-3 flex justify-between">
          <span className="font-display font-bold text-text-primary">Total</span>
          <span className="font-display font-bold text-xl text-accent-primary">{formatCurrency(selectedPackage.price)}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="glass-card p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-dim border border-accent-primary/20 flex items-center justify-center flex-shrink-0">
          <CreditCard size={18} className="text-accent-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">Saldo DataPack</p>
          <p className="text-xs text-text-muted">Pembayaran instan</p>
        </div>
        <div className="ml-auto">
          <div className="w-4 h-4 rounded-full border-2 border-accent-primary flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent-primary" />
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-text-muted px-1">
        <ShieldCheck size={14} className="text-emerald-accent flex-shrink-0" />
        Transaksi aman & terenkripsi. Paket aktif dalam hitungan detik.
      </div>

      {/* Checkout Button */}
      <Button
        fullWidth
        size="xl"
        onClick={handleCheckout}
        loading={isProcessing && !optimisticSuccess}
        disabled={isProcessing}
        className="font-bold"

      >
        {optimisticSuccess ? 'Mengaktifkan Paket...' : `Bayar ${formatCurrency(selectedPackage.price)}`}
      </Button>
    </div>
  )
}
