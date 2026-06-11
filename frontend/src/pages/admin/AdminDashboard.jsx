import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Star } from 'lucide-react';
import * as adminApi from '../../services/adminApi';
import { Spinner } from '../../components/ui/Spinner';

const iconMap = {
  'Total Users': { icon: Users, color: 'from-blue-500 to-blue-600', glow: 'shadow-blue-500/30' },
  'Total Stores': { icon: ShoppingBag, color: 'from-purple-500 to-purple-600', glow: 'shadow-purple-500/30' },
  'Total Ratings': { icon: Star, color: 'from-cyan-500 to-cyan-600', glow: 'shadow-cyan-500/30' },
};

function StatCard({ label, value, delay = 0 }) {
  const { icon: Icon, color, glow } = iconMap[label];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ translateY: -4 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:border-white/20 hover:shadow-xl transition-all duration-300 cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted">{label}</p>
        <div className={`w-10 h-10 rounded-2xl bg-linear-to-br ${color} flex items-center justify-center shadow-lg ${glow}`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-4xl font-extrabold text-white">{value ?? '—'}</p>
    </motion.div>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-muted text-sm mt-1">Overview of your Store-M platform</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Total Users" value={stats?.totalUsers} delay={0.1} />
        <StatCard label="Total Stores" value={stats?.totalStores} delay={0.2} />
        <StatCard label="Total Ratings" value={stats?.totalRatings} delay={0.3} />
      </div>
    </div>
  );
}
