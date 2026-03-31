# DataPack Store 📦

Aplikasi e-commerce untuk pembelian paket data internet — dibuat sebagai jawaban dari Frontend Developer Technical Test.

Dibangun dengan React 18 + Vite, Zustand, TanStack Query, Tailwind CSS, dan json-server sebagai mock backend.

---

## Cara Menjalankan Project

### Yang Perlu Disiapkan
- Node.js versi 18 ke atas
- npm versi 9 ke atas

### Langkah Instalasi

```bash
# Clone repository
git clone https://github.com/Zulkifli1409/datapack-store
cd datapack-store

# Install semua dependency
npm install

# Jalankan aplikasi (frontend + backend json-server sekaligus)
npm start
```

Setelah itu buka browser ke **http://localhost:5173**

Mock API berjalan di **http://localhost:3001**

### Akun Demo untuk Login

| Email | Password | Nama |
|-------|----------|------|
| zul@demo.com | demo123 | Zulkifli |
| joel@demo.com | demo123 | Joel |

---

## Struktur Folder

```
datapack-store/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx          # Navigasi utama + menu user
│   │   └── RouteGuard.jsx      # Protected & Guest route
│   ├── package/
│   │   ├── PackageCard.jsx     # Kartu paket (dipakai di Dashboard & List)
│   │   └── FilterPanel.jsx     # Panel filter provider/harga/kuota
│   └── ui/
│       ├── Button.jsx          # Tombol serba guna
│       ├── Input.jsx           # Input field dengan validasi
│       ├── Modal.jsx           # Modal reusable
│       ├── Badge.jsx           # Label/badge status
│       ├── Skeleton.jsx        # Skeleton loading
│       ├── Pagination.jsx      # Komponen halaman
│       ├── EmptyState.jsx      # Tampilan saat data kosong
│       └── ErrorState.jsx      # Tampilan saat terjadi error
├── pages/
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── PackagesPage.jsx
│   ├── PackageDetailPage.jsx
│   ├── CheckoutPage.jsx
│   ├── CheckoutSuccessPage.jsx
│   ├── TransactionsPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   ├── api.js                  # Axios instance (base URL, timeout)
│   ├── authService.js
│   ├── packageService.js
│   └── transactionService.js
├── store/
│   ├── authStore.js            # State login (Zustand + persist)
│   └── checkoutStore.js        # State checkout + race condition guard
├── utils/
│   └── helpers.js              # Format currency, tanggal, validator, dll
├── App.jsx                     # Routing
└── db.json                     # Database mock json-server
```

---

## UX & User Flow

### Siapa Penggunanya?

Saya membayangkan pengguna utama aplikasi ini seperti **Zulkifli, 22 tahun** — mahasiswa yang beli paket data hampir setiap bulan lewat HP. Dia bukan pengguna yang sabar; kalau proses belinya ribet atau lambat, dia langsung tutup tab.

**Masalah yang sering dialami saat beli paket data online:**
- Terlalu banyak pilihan paket, bingung mana yang worth it
- Form checkout yang terlalu panjang (kenapa harus isi nama, alamat, dll?)
- Tidak tahu apakah transaksi berhasil atau masih "loading" entah ke mana
- Tidak bisa membedakan provider satu dengan lainnya secara visual

### Strategi Perbaikan UX

| Masalah | Solusi yang Saya Terapkan |
|---------|--------------------------|
| Banyak pilihan membingungkan | Filter multi-dimensi (provider + harga + kuota) + badge "Populer" |
| Checkout panjang | Hanya butuh satu input: nomor HP. Sisanya sudah diketahui dari akun |
| Tidak ada feedback sukses | Halaman success yang jelas + toast notification instan |
| Tidak bisa bedain provider | Warna khas per provider (merah Telkomsel, biru XL, kuning Indosat, dll) |
| Takut salah beli | Halaman detail paket dengan spesifikasi lengkap + halaman konfirmasi |

### Alur Pengguna

```
Login
  ↓
Dashboard  ←──────────────────────────┐
  ↓                                   │
Browse Paket (filter + pagination)    │
  ↓                                   │
Detail Paket                          │
  ↓                                   │
Checkout (isi nomor HP)               │
  ↓                                   │
Sukses → Lihat Riwayat / Beli Lagi ──┘
```

### Bagaimana Meningkatkan Page Per Visit?

Ini bukan sekadar soal desain yang bagus, tapi soal bagaimana membuat pengguna *ingin* menjelajah lebih jauh:

1. **Dashboard sebagai hub** — Bukan halaman selamat datang biasa. Dashboard menampilkan paket populer, statistik pembelian, dan riwayat terakhir. Setiap section punya tombol "Lihat Semua" yang mengarah ke halaman lengkapnya.

2. **Setelah checkout, ada tawaran lanjutan** — Halaman sukses tidak hanya bilang "berhasil". Ada tombol "Lihat Riwayat" dan "Kembali ke Beranda" yang mendorong pengguna untuk tetap di aplikasi.

3. **Navbar selalu terlihat** — Navigasi sticky di atas memudahkan pengguna berpindah halaman kapanpun tanpa harus scroll ke atas atau menekan tombol back berkali-kali.

---

## Fitur yang Diimplementasikan

- ✅ Login page dengan dummy authentication dan validasi form
- ✅ Dashboard user dengan statistik pembelian
- ✅ Daftar paket data dengan **pagination dari API**
- ✅ Filter berdasarkan **Provider**, **Harga**, dan **Kuota**
- ✅ Halaman detail paket
- ✅ Checkout (input nomor HP + konfirmasi harga)
- ✅ Riwayat transaksi dengan filter status dan pencarian

---

## Engineering Quality

### Loading State
Saya pakai **skeleton loading**, bukan spinner biasa. Alasannya: skeleton mempertahankan struktur halaman sehingga pengguna tahu kira-kira konten apa yang akan muncul, dan UI tidak "loncat-loncat" saat data tiba. Teknik ini disebut *layout preservation*.

```jsx
{isLoading ? <PackageCardSkeleton /> : <PackageCard pkg={pkg} />}
```

### Empty State
Ada komponen `<EmptyState />` yang reusable untuk menangani saat data kosong, misalnya: tidak ada paket yang cocok dengan filter, atau belum ada riwayat transaksi. Komponen ini menerima props `icon`, `title`, `description`, dan `action` agar bisa disesuaikan di setiap konteks.

### Error State
Komponen `<ErrorState />` tampil ketika API gagal merespons. Di dalamnya ada tombol "Coba Lagi" yang memanggil fungsi `refetch()` dari TanStack Query, sehingga pengguna bisa mencoba kembali tanpa perlu refresh halaman.

### Validasi Form
Semua aturan validasi dipusatkan di `utils/helpers.js` dalam satu objek `validators`:

```js
validators.phone('081234')  // → "Nomor HP tidak valid" atau null
validators.email('x@y')    // → "Email tidak valid" atau null
```

Pendekatan ini memastikan logika validasi yang sama bisa dipakai di form manapun tanpa copy-paste kode.

### API Abstraction Layer (Service Pattern)
Komponen UI tidak boleh tahu detail implementasi HTTP. Semua panggilan API melewati *service layer*:

```
Komponen → useQuery (TanStack Query) → packageService → api (axios) → json-server
```

Contoh nyata di `packageService.js`:
```js
export const packageService = {
  getPackages: (params) => api.get('/packages', { params }).then(r => r.data),
  getPackageById: (id) => api.get(`/packages/${id}`).then(r => r.data),
}
```

Kalau suatu hari endpoint berubah, cukup ubah di satu file service — tidak perlu ubah di setiap komponen.

### Penggunaan Ulang Komponen

| Komponen | Dipakai di Halaman |
|----------|--------------------|
| `PackageCard` | Dashboard, Package List |
| `Button` | Hampir semua halaman |
| `Input` | Login, Checkout |
| `Skeleton` | Dashboard, Package List, Package Detail |
| `EmptyState` | Package List, Transactions, Dashboard |
| `Modal` | Package Detail (konfirmasi pembelian) |
| `Pagination` | Package List |

### Kenapa Memilih Struktur Folder Ini?

Saya menggunakan pendekatan **domain-first** — komponen dikelompokkan berdasarkan fungsi, bukan berdasarkan tipe file. Hasilnya:

- Fitur baru bisa ditambahkan tanpa "menyentuh" folder lain
- Developer baru lebih mudah orientasi karena struktur mengikuti cara pikir fitur
- Kalau suatu fitur dihapus, semua file terkaitnya ada di satu tempat

### Bagaimana Menghindari Prop Drilling?

Saya tidak mengoper props melewati banyak level komponen. Ada dua cara yang saya pakai:

1. **Zustand untuk global state** — Komponen mana pun bisa langsung akses data auth atau checkout tanpa perlu "dititipkan" dari parent ke child ke grandchild, cukup dengan `useAuthStore()` atau `useCheckoutStore()`.

2. **TanStack Query sebagai cache bersama** — Komponen yang berbeda bisa `useQuery` dengan *query key* yang sama dan otomatis mendapat data yang sama dari cache, tanpa perlu mengoper data itu melalui props.

### Kapan Perlu Memoization?

Saya tidak langsung pasang memoization di mana-mana karena itu justru bikin kode lebih kompleks tanpa keuntungan nyata. Saya pakai prinsip: **profilkan dulu, optimalkan kemudian**.

- **`useMemo`** → untuk kalkulasi berat di sisi klien, misalnya filter/sort daftar panjang yang tidak perlu dihitung ulang setiap render
- **`useCallback`** → untuk fungsi handler yang dioper ke child component yang sudah dibungkus `React.memo`, agar child tidak re-render gara-gara referensi fungsi berubah
- **`React.memo`** → untuk komponen yang sering di-render ulang padahal data yang ditampilkan tidak berubah

---

## State Management

### Strategi yang Digunakan

Saya memisahkan state ke tiga kategori dengan tools yang berbeda sesuai fungsinya:

| Jenis State | Tool yang Dipakai | Alasan |
|------------|-------------------|--------|
| Data dari server (paket, transaksi) | TanStack Query | Caching, refetch otomatis, loading/error built-in |
| State global sesi (login, checkout) | Zustand | Simpel, tidak butuh Provider, bisa persist ke localStorage |
| State lokal UI (input form, modal) | `useState` biasa | Tidak perlu dibagikan ke komponen lain |

**Kenapa Zustand dan bukan Redux?**

Redux butuh banyak boilerplate: action types, action creators, reducer, selector, middleware. Untuk skala project ini, overhead Redux tidak sebanding. Zustand memberikan hasil yang setara dengan kode yang jauh lebih sedikit dan lebih mudah dibaca.

**Kenapa TanStack Query dan bukan `useEffect + fetch` manual?**

Kalau manual, kita harus urus sendiri: state loading, state error, abort controller, caching, stale data, refetch on focus, retry on error. TanStack Query menyelesaikan semua itu secara deklaratif.

### Bagaimana Mencegah Re-render yang Tidak Perlu?

**Selector di Zustand** — Jangan subscribe ke seluruh store kalau hanya butuh satu nilai:

```js
// ✅ Hanya re-render jika 'user' berubah
const user = useAuthStore(state => state.user)

// ❌ Re-render setiap kali state apapun di store berubah
const store = useAuthStore()
```

**Pemisahan komponen** — Kalau ada komponen parent yang punya state berubah-ubah (misalnya input pencarian), pisahkan bagian data list ke komponen child terpisah agar tidak ikut re-render setiap ketikan.

### Bagaimana Menangani Race Condition (Klik Checkout 2x)?

Ini ditangani dengan **flag `isProcessing`** di `checkoutStore.js`:

```js
startCheckout: () => {
  if (get().isProcessing) return false  // Tolak request kedua
  set({ isProcessing: true })
  return true
}
```

Ketika tombol Bayar ditekan, komponen memanggil `startCheckout()`. Kalau mengembalikan `false` (artinya sudah ada proses yang berjalan), fungsi langsung dihentikan dan muncul toast error. Ini semacam *mutex* sederhana yang mencegah double-submit tanpa library tambahan. Tombol juga di-disable selama proses berlangsung sebagai lapisan perlindungan tambahan di sisi UI.

---

## Performance & Edge Case

### Kalau Paket Data Mencapai 10.000 Item

Untuk saat ini sudah ada server-side pagination menggunakan `_page` dan `_limit` di query params json-server — jadi yang dikirim ke browser hanya 8 item per halaman, bukan seluruh 10.000 data sekaligus.

Kalau benar-benar butuh menangani skala besar di production:
- **Virtual scrolling** dengan `@tanstack/react-virtual` — hanya render item yang terlihat di viewport
- **Debounce** pada input filter agar tidak trigger API call setiap keystroke
- **Index di database** untuk kolom yang sering difilter (provider, price, quota)

### Apakah Perlu Lazy Loading?

Ya, perlu — tapi untuk *code splitting* per halaman, bukan untuk gambar.

```jsx
const PackagesPage = lazy(() => import('./pages/PackagesPage'))
```

Dengan ini, kode halaman Packages tidak masuk ke bundle awal. Pengguna hanya men-download kode halaman yang benar-benar dikunjungi. Ini mempercepat *initial page load* secara signifikan.

Untuk gambar atau icon: icon yang dipakai di sini adalah SVG dari Lucide React yang sudah tree-shakable, jadi tidak ada overhead berarti.

### Kalau API Lambat Lebih dari 3 Detik

- **Skeleton loading** langsung muncul — pengguna melihat kerangka UI, bukan layar kosong
- **Timeout 5 detik** dikonfigurasi di Axios — lebih dari itu, request otomatis di-abort
- **Stale-while-revalidate** dari TanStack Query — kalau data lama masih ada di cache, ditampilkan dulu sembari fetch ulang di background
- **Tombol retry** tersedia di halaman error kalau fetch benar-benar gagal

### Kalau Koneksi Internet Mati (Network Failure)

1. **Toast error** muncul di pojok layar dengan pesan yang jelas
2. **Komponen ErrorState** menggantikan konten utama dan menawarkan tombol "Coba Lagi"
3. **TanStack Query** akan retry otomatis 1 kali sebelum menyerah (dikonfigurasi `retry: 1`)
4. Kalau kegagalan terjadi di tengah proses checkout, state `optimisticSuccess` di-reset dan tidak ada transaksi yang terbuat

---

## Bonus (Senior Level)

| Fitur | Status | Keterangan |
|-------|--------|------------|
| Optimistic UI saat checkout | ✅ | UI langsung berubah ke "Mengaktifkan..." sebelum API merespons. Kalau gagal, di-rollback. |
| Skeleton loading | ✅ | Dipakai di Dashboard, Package List, Package Detail |
| Protected route | ✅ | `ProtectedRoute` & `GuestRoute` di `components/layout/RouteGuard.jsx` |
| Reusable modal system | ✅ | `<Modal />` berbasis React Portal |

---

## Design Decisions & Trade-offs

### Tailwind CSS, Bukan MUI/Ant Design

MUI dan Ant Design memberikan komponen UI yang sudah jadi, tapi sangat opinionated soal tampilan. Untuk tes ini, saya ingin desain yang benar-benar custom dan bisa dikendalikan penuh. Tailwind dengan design token di `tailwind.config.js` memberikan fleksibilitas itu.

Trade-off: butuh lebih banyak waktu untuk membangun komponen dasar dari nol.

### Tidak Menggunakan TypeScript

Trade-off untuk kecepatan pengerjaan. Di project production, TypeScript sangat disarankan terutama untuk service layer dan Zustand store agar ada type safety.

### json-server dengan `--delay 500`

Sengaja ditambahkan delay 500ms untuk mensimulasikan kondisi jaringan nyata dan memastikan semua loading state bisa terlihat oleh reviewer.

---

## Estimasi Waktu Pengerjaan

Total pengerjaan sekitar **± 5–6 jam**, lebih cepat dari biasanya karena dibantu AI assistant untuk penulisan boilerplate UI dan mock data.

| Bagian | Waktu |
|--------|-------|
| Setup project + Tailwind design system | ~30 menit |
| Auth (login + route guard + store) | ~30 menit |
| Package list + filter + pagination | ~1 jam |
| Package detail + checkout flow | ~1 jam |
| Dashboard + halaman transaksi | ~45 menit |
| Komponen UI reusable | ~30 menit |
| Polish, bug fix, README | ~45 menit |
| **Total** | **~5 jam** |

Tanpa bantuan AI assistant, perkiraan saya sekitar 10–12 jam untuk scope yang sama.

---

## Catatan Soal Rekaman Zoom

Saya mohon maaf — saya lupa menyalakan Zoom dan merekam sesi pengerjaan. Sebagai gantinya, seluruh riwayat pengerjaan bisa dilihat melalui git commit history di repositori ini.

### Transparansi: Penggunaan AI Assistant

Saya memakai AI assistant (Antigravity / Google Gemini) selama pengerjaan. Ini yang dibantu AI:
- Scaffolding komponen UI (Tailwind classes, layout komponen dasar)
- Penulisan mock data di `db.json`
- Penulisan README ini

Ini yang saya kerjakan sendiri:
- Arsitektur keseluruhan dan keputusan teknis
- Logika bisnis: checkout flow, race condition guard, filter & pagination
- Integrasi antar komponen dan state management
- Review, koreksi, dan penyesuaian semua output AI

Saya memandang AI sebagai alat produktivitas, seperti GitHub Copilot — bukan pengganti pemahaman teknis.

---

*Terima kasih sudah meluangkan waktu untuk mereview project ini. Saya siap mendiskusikan setiap keputusan teknis lebih lanjut di sesi berikutnya.*
