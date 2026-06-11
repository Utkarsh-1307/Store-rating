import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from './layouts/Navbar';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { Sidebar } from './layouts/Sidebar';
import { useAuth } from './hooks/useAuth';

import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ChangePasswordPage } from './pages/shared/ChangePasswordPage';
import { NotFoundPage } from './pages/shared/NotFoundPage';

import { StoreList } from './pages/user/StoreList';
import { StoreDetail } from './pages/user/StoreDetail';

import { OwnerDashboard } from './pages/owner/OwnerDashboard';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminUserDetail } from './pages/admin/AdminUserDetail';
import { AdminStores } from './pages/admin/AdminStores';
import { AdminStoreDetail } from './pages/admin/AdminStoreDetail';

function RootRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden relative" style={{ background: '#0d0014' }}>
      {/* Background: warm rose-pink gradient inspired by reference */}
      {/* Deep rose blob — top left */}
      <div className="fixed -top-32 -left-32 w-150 h-150 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.45) 0%, rgba(244,114,182,0.25) 45%, transparent 70%)', filter: 'blur(60px)' }} />
      {/* Salmon-pink blob — center right */}
      <div className="fixed top-1/4 right-0 w-125 h-125 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.40) 0%, rgba(253,164,175,0.20) 50%, transparent 72%)', filter: 'blur(70px)' }} />
      {/* Soft violet accent — bottom center */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-120 h-95 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(192,38,211,0.30) 0%, rgba(168,85,247,0.15) 55%, transparent 75%)', filter: 'blur(80px)' }} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastStyle={{
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          color: '#F8FAFC',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'STORE_OWNER']} />}>
                <Route path="/change-password" element={<ChangePasswordPage />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                <Route path="/stores" element={<StoreList />} />
                <Route path="/stores/:id" element={<StoreDetail />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['STORE_OWNER']} />}>
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/users/:id" element={<AdminUserDetail />} />
                <Route path="/admin/stores" element={<AdminStores />} />
                <Route path="/admin/stores/:id" element={<AdminStoreDetail />} />
              </Route>

              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
