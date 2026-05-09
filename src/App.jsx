import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing.jsx'
import AuthPage from './pages/AuthPage.jsx'
import Account from './pages/Account.jsx'

import RBLayout from './pages/rb/RBLayout.jsx'
import RBHome from './pages/rb/RBHome.jsx'
import RBMenu from './pages/rb/RBMenu.jsx'
import RBCheckout from './pages/rb/RBCheckout.jsx'
import RBBooking from './pages/rb/RBBooking.jsx'

import HWLayout from './pages/hw/HWLayout.jsx'
import HWHome from './pages/hw/HWHome.jsx'
import HWSubShop from './pages/hw/HWSubShop.jsx'
import HWCheckout from './pages/hw/HWCheckout.jsx'
import HWBooking from './pages/hw/HWBooking.jsx'

import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminBookings from './pages/admin/AdminBookings.jsx'
import AdminMenu from './pages/admin/AdminMenu.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'

import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Roasted Bean */}
        <Route path="/rb" element={<RBLayout />}>
          <Route index element={<RBHome />} />
          <Route path="menu" element={<RBMenu />} />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <RBCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="book"
            element={
              <ProtectedRoute>
                <RBBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <Account shopCode="RB" />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Hillside Walk */}
        <Route path="/hw" element={<HWLayout />}>
          <Route index element={<HWHome />} />
          <Route path="shop/:subShopCode" element={<HWSubShop />} />
          <Route
            path="checkout/:subShopCode"
            element={
              <ProtectedRoute>
                <HWCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="book"
            element={
              <ProtectedRoute>
                <HWBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <Account shopCode="HW" />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['rb_admin', 'hw_admin', 'superuser']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['superuser']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
