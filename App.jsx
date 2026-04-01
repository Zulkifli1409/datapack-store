import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute, GuestRoute } from '@/components/layout/RouteGuard'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import PackagesPage from '@/pages/PackagesPage'
import PackageDetailPage from '@/pages/PackageDetailPage'
import CheckoutPage from '@/pages/CheckoutPage'
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage'
import TransactionsPage from '@/pages/TransactionsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      {/* Public redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Guest only routes */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/packages/:id" element={<PackageDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
