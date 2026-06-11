import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingBag, Store } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20 shadow-sm shadow-blue-500/10'
      : 'text-muted hover:bg-white/5 hover:text-white border border-transparent'
  }`;

export function Sidebar() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-56 min-h-[calc(100vh-57px)] bg-white/2 backdrop-blur-xl border-r border-border px-3 py-6 flex flex-col gap-1 shrink-0"
    >
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-muted uppercase tracking-widest">
          {user?.role === 'ADMIN' ? 'Admin Panel' : user?.role === 'STORE_OWNER' ? 'Store Panel' : 'My Account'}
        </p>
      </div>

      {user?.role === 'ADMIN' && (
        <>
          <NavLink to="/admin/dashboard" className={linkClass}>
            <LayoutDashboard size={15} className="shrink-0" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            <Users size={15} className="shrink-0" /> Users
          </NavLink>
          <NavLink to="/admin/stores" className={linkClass}>
            <ShoppingBag size={15} className="shrink-0" /> Stores
          </NavLink>
        </>
      )}
      {user?.role === 'STORE_OWNER' && (
        <NavLink to="/owner/dashboard" className={linkClass}>
          <LayoutDashboard size={15} className="shrink-0" /> Dashboard
        </NavLink>
      )}
      {user?.role === 'USER' && (
        <NavLink to="/stores" className={linkClass}>
          <Store size={15} className="shrink-0" /> Browse Stores
        </NavLink>
      )}
    </motion.aside>
  );
}
