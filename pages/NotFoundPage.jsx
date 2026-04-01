import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 text-center">
      <div className="animate-slide-up">
        <div className="text-8xl font-display font-black gradient-text mb-4">404</div>
        <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Halaman tidak ditemukan</h1>
        <p className="text-text-muted text-sm mb-8">Ups, halaman yang kamu cari tidak ada.</p>
        <Button onClick={() => navigate('/')} leftIcon={<Home size={16} />}>Kembali ke Beranda</Button>
      </div>
    </div>
  )
}
