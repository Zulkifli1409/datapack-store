import { useState, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Package } from 'lucide-react'
import { packageService } from '@/services/packageService'
import PackageCard from '@/components/package/PackageCard'
import FilterPanel from '@/components/package/FilterPanel'
// Import Skeleton instead of PackageCardSkeleton
import Skeleton from '@/components/ui/Skeleton'
import Pagination from '@/components/ui/Pagination'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import Input from '@/components/ui/Input'

const PackageCardSkeleton = () => (
  <div className="glass-card p-5 space-y-4">
    <Skeleton className="h-10 w-24 rounded-xl" />
    <Skeleton className="h-12 w-32" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-10 w-full rounded-xl" />
  </div>
)

const LIMIT = 8
const DEFAULT_FILTERS = { provider: 'all', maxPrice: 150000, minQuota: 0 }

export default function PackagesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const queryKey = useMemo(() => ['packages', page, filters], [page, filters])

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => packageService.getPackages({ ...filters, page, limit: LIMIT }),
    keepPreviousData: true,
  })

  const handleFilterChange = useCallback((updates) => {
    setFilters(f => ({ ...f, ...updates }))
    setPage(1)
  }, [])

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSearch('')
    setPage(1)
  }, [])

  // Client-side search on loaded packages
  const filteredPackages = useMemo(() => {
    if (!data?.packages) return []
    if (!search.trim()) return data.packages
    const q = search.toLowerCase()
    return data.packages.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.provider.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  }, [data?.packages, search])

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0

  return (
    <div className="space-y-6 page-enter">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-text-primary">Paket Data</h1>
        <p className="text-sm text-text-muted mt-1">
          Pilih paket terbaik dari semua provider
          {data && <span className="text-text-secondary ml-1 font-medium">({data.total} paket)</span>}
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Cari nama paket, provider, atau kategori..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        leftIcon={<Search size={16} />}
      />

      <div className="flex gap-6 items-start">
        {/* Filter Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
        </aside>

        {/* Packages Grid */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Mobile filter strip */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {['all','XL','Telkomsel','Indosat','Tri','Smartfren'].map(p => (
              <button
                key={p}
                onClick={() => handleFilterChange({ provider: p })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                  filters.provider === p
                    ? 'bg-bg-elevated border-border-default text-text-primary'
                    : 'border-border-default text-text-secondary hover:border-border-strong'
                }`}
              >
                {p === 'all' ? 'Semua' : p}
              </button>
            ))}
          </div>

          {isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
              {Array(6).fill(0).map((_, i) => <PackageCardSkeleton key={i} />)}
            </div>
          ) : filteredPackages.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Paket tidak ditemukan"
              description="Coba ubah filter atau kata kunci pencarian"
              action={handleReset}
              actionLabel="Reset Filter"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
                {filteredPackages.map(pkg => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
              {!search && (
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
