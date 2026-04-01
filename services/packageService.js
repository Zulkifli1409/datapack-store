import api from './api'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 8

function sortPackages(items = []) {
  return [...items].sort((a, b) => {
    if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0)
    return (b.reviewCount || 0) - (a.reviewCount || 0)
  })
}

export const packageService = {
  getPackages: async ({
    provider = 'all',
    maxPrice = Number.MAX_SAFE_INTEGER,
    minQuota = 0,
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
  } = {}) => {
    const response = await api.get('/packages')

    const allPackages = Array.isArray(response.data) ? response.data : []
    const filtered = allPackages.filter((item) => {
      const providerMatch = provider === 'all' || item.provider === provider
      const priceMatch = Number(item.price) <= Number(maxPrice)
      const quotaMatch = Number(item.quota) >= Number(minQuota)
      return providerMatch && priceMatch && quotaMatch
    })

    const sorted = sortPackages(filtered)
    const total = sorted.length
    const start = (page - 1) * limit
    const packages = sorted.slice(start, start + limit)

    return { packages, total }
  },
  getPackageById: async (id) => {
    const response = await api.get(`/packages/${id}`)
    return response.data
  },
  getPopularPackages: async (limit = 4) => {
    const response = await api.get('/packages')
    const allPackages = Array.isArray(response.data) ? response.data : []
    return sortPackages(allPackages).slice(0, limit)
  },
}
