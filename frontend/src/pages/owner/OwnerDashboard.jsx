import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Store } from 'lucide-react';
import * as ownerApi from '../../services/ownerApi';
import { StarRating } from '../../components/ui/StarRating';
import { Table } from '../../components/ui/Table';
import { Spinner } from '../../components/ui/Spinner';

const columns = [
  { key: 'user', label: 'Customer', render: (v) => v?.name },
  { key: 'user', label: 'Email', render: (v, row) => row.user?.email },
  { key: 'rating', label: 'Rating', render: (v) => <StarRating value={v} size="sm" /> },
  { key: 'createdAt', label: 'Date', render: (v) => new Date(v).toLocaleDateString() },
];

export function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerApi
      .getDashboard()
      .then((res) => setData(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">Store Dashboard</h1>
        {data?.store && (
          <div className="flex items-center gap-2 mt-1">
            <Store size={14} className="text-muted" />
            <p className="text-muted text-sm">{data.store.name}</p>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ translateY: -4 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted">Average Rating</p>
            <div className="w-9 h-9 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center">
              <Star size={16} className="text-yellow-400" />
            </div>
          </div>
          {data?.averageRating ? (
            <div className="flex items-center gap-3">
              <StarRating value={Math.round(data.averageRating)} size="lg" />
              <span className="text-3xl font-extrabold text-white">{data.averageRating.toFixed(1)}</span>
            </div>
          ) : (
            <p className="text-muted text-sm">No ratings yet</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ translateY: -4 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:border-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-muted">Total Reviews</p>
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
              <MessageSquare size={16} className="text-blue-400" />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-white">{data?.totalRatings ?? 0}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
      >
        <h2 className="text-base font-semibold text-white mb-4">Customer Reviews</h2>
        <Table columns={columns} data={data?.ratings ?? []} />
      </motion.div>
    </div>
  );
}
