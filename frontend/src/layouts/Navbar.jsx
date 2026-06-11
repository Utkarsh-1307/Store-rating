import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogOut, Store } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-bg/80 border-b border-border px-6 py-3 flex items-center justify-between"
    >
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Store size={16} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-wide text-white group-hover:text-blue-400 transition-colors">
          Store<span className="text-blue-400">-M</span>
        </span>
      </Link>

      <div className="flex items-center gap-3 text-sm">
        <Link
          to="/change-password"
          className="flex items-center gap-1.5 text-muted hover:text-white transition-colors px-3 py-1.5 rounded-xl hover:bg-white/5"
        >
          <Lock size={14} />
          <span className="hidden sm:inline">Password</span>
        </Link>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-border">
          <div className="w-5 h-5 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-foreground text-xs font-medium hidden sm:inline">
            {user?.name?.split(' ')[0]}
          </span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-muted hover:text-red-400 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </motion.nav>
  );
}
