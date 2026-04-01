import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, Wifi, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import { validators } from '@/utils/helpers'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {
      email: validators.email(form.email),
      password: validators.password(form.password),
    }
    setErrors(e)
    return !e.email && !e.password
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const { user, token } = await authService.login(form)
      setAuth(user, token)
      toast.success(`Selamat datang, ${user.name.split(' ')[0]}! 👋`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Login gagal.')
      setErrors({ password: err.message })
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setForm({ email: 'zul@demo.com', password: 'demo123' })
    setErrors({})
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="w-full max-w-sm relative animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-primary flex items-center justify-center shadow-glow-primary">
              <Wifi size={22} className="text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">
            Masuk ke DataPack
          </h1>
          <p className="text-sm text-text-muted">Beli paket data favorit dengan mudah</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 space-y-4 neon-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email}
              leftIcon={<Mail size={16} />}
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              error={errors.password}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="hover:text-text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight size={16} />}
              className="mt-2"
            >
              Masuk
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-xs text-text-muted">atau coba</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Demo login */}
          <button
            onClick={fillDemo}
            className="w-full py-2.5 rounded-xl border border-border-default hover:border-accent-primary/50 text-sm text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="text-base">🎭</span>
            Gunakan Akun Demo
          </button>
        </div>

        {/* Hint */}
        <div className="mt-5 glass-card p-3.5">
          <p className="text-xs text-text-muted text-center leading-relaxed">
            <span className="text-text-secondary font-medium">Demo:</span>{' '}
            budi@demo.com / demo123
          </p>
        </div>
      </div>
    </div>
  )
}
