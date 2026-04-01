import api from './api'

export const authService = {
  login: async (credentials) => {
    const email = credentials.email?.trim().toLowerCase()
    const password = credentials.password

    // Simulate auth latency while still using db.json as source of truth
    await new Promise((resolve) => setTimeout(resolve, 500))

    const response = await api.get('/users', { params: { email } })
    const account = Array.isArray(response.data) ? response.data[0] : null

    if (!account || account.password !== password) {
      throw new Error('Email atau password salah')
    }

    const { password: _password, ...safeUser } = account
    return {
      user: safeUser,
      token: `mock-token-${safeUser.id}-${Date.now()}`,
    }
  },
  logout: async () => {
    return Promise.resolve(true)
  },
}
