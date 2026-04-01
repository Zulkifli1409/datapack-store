import { create } from 'zustand'

export const useCheckoutStore = create((set, get) => ({
  selectedPackage: null,
  isProcessing: false,
  phone: '',
  setPackage: (selectedPackage) => set({ selectedPackage }),
  setPhone: (phone) => set({ phone }),
  startCheckout: () => {
    if (get().isProcessing) return false
    set({ isProcessing: true })
    return true
  },
  finishCheckout: () => set({ isProcessing: false, selectedPackage: null, phone: '' }),
  failCheckout: () => set({ isProcessing: false }),
}))