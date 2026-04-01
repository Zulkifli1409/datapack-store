export const validators = {
  email: (val) => {
    if (!val) return 'Email wajib diisi'
    if (!/^\S+@\S+\.\S+$/.test(val)) return 'Format email tidak valid'
    return ''
  },
  password: (val) => {
    if (!val) return 'Password wajib diisi'
    if (val.length < 6) return 'Password minimal 6 karakter'
    return ''
  },
  phone: (val) => {
    if (!val) return 'Nomor HP wajib diisi'
    if (!val.startsWith('08')) return 'Nomor HP harus diawali 08'
    if (val.length < 10 || val.length > 13) return 'Panjang nomor HP tidak valid'
    return ''
  }
}

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const formatDateShort = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export const getDiscount = (price, originalPrice) => {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export const getProviderStyle = (provider) => {
  const p = (provider || '').toLowerCase()
  if (p.includes('telkomsel')) return { bg: '#FFE4E6', text: '#E11D48', border: '#FDA4AF', accent: '#E11D48' }
  if (p.includes('indosat')) return { bg: '#FEF9C3', text: '#D97706', border: '#FDE047', accent: '#F59E0B' }
  if (p.includes('xl') || p.includes('axis')) return { bg: '#DBEAFE', text: '#2563EB', border: '#93C5FD', accent: '#3B82F6' }
  if (p.includes('tri') || p.includes('3')) return { bg: '#333333', text: '#FFFFFF', border: '#111111', accent: '#000000' }
  if (p.includes('smartfren')) return { bg: '#FCE7F3', text: '#DB2777', border: '#F9A8D4', accent: '#EC4899' }
  return { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB', accent: '#6B7280' }
}
