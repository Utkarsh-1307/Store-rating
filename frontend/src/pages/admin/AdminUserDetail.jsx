import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import * as adminApi from '../../services/adminApi';
import { StarRating } from '../../components/ui/StarRating';
import { Spinner } from '../../components/ui/Spinner';

const roleBadge = {
  ADMIN: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  STORE_OWNER: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  USER: 'bg-white/5 text-muted border-white/10',
};

export function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getUserById(id)
      .then((res) => setUser(res.data.data))
      .catch(() => toast.error('Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} /> Back to users
      </button>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-muted mt-1 text-sm">{user.email}</p>
            {user.address && <p className="text-muted text-sm mt-0.5">{user.address}</p>}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleBadge[user.role] ?? roleBadge.USER}`}>
            {user.role}
          </span>
        </div>
        <p className="text-xs text-muted mt-4">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {user.role === 'STORE_OWNER' && user.ownedStore && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag size={16} className="text-purple-400" />
            <h2 className="text-base font-semibold text-white">Owned Store</h2>
          </div>
          <p className="font-medium text-white">{user.ownedStore.name}</p>
          <p className="text-sm text-muted mt-0.5">{user.ownedStore.address}</p>
          <div className="flex items-center gap-2 mt-3">
            <StarRating value={Math.round(user.ownedStore.averageRating || 0)} size="sm" />
            <span className="text-white font-medium text-sm">
              {user.ownedStore.averageRating ? user.ownedStore.averageRating.toFixed(1) : 'No ratings'}
            </span>
            {user.ownedStore.totalRatings > 0 && (
              <span className="text-sm text-muted">({user.ownedStore.totalRatings} reviews)</span>
            )}
          </div>
        </div>
      )}

      {user.ratings?.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
          <h2 className="text-base font-semibold text-white mb-4">Rating History</h2>
          <div className="flex flex-col divide-y divide-white/5">
            {user.ratings.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white text-sm">{r.store.name}</p>
                  <p className="text-xs text-muted">{r.store.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={r.rating} size="sm" />
                  <span className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
