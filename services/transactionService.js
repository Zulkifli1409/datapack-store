import api from './api'

export const transactionService = {
  getTransactions: async (userId) => {
    const response = await api.get('/transactions', {
      params: { userId, _sort: 'createdAt', _order: 'desc' },
    })
    const txns = Array.isArray(response.data) ? response.data : []
    return txns.map((txn) => ({
      ...txn,
      createdAt: txn.createdAt || txn.date || new Date().toISOString(),
      transactionCode: txn.transactionCode || txn.receiptNumber || `TRX-${txn.id}`,
    }))
  },
  createTransaction: async (data) => {
    const now = new Date().toISOString()
    const payload = {
      ...data,
      createdAt: now,
      date: now,
      status: 'success',
      transactionCode: `TRX-${Date.now()}`,
      receiptNumber: `TRX-${Date.now()}`,
    }
    const response = await api.post('/transactions', payload)
    const txn = response.data
    return {
      ...txn,
      createdAt: txn.createdAt || txn.date || now,
      transactionCode: txn.transactionCode || txn.receiptNumber,
    }
  },
}
