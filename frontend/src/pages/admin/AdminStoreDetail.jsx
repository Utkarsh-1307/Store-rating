import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import * as adminApi from '../../services/adminApi';
import { StarRating } from '../../components/ui/StarRating';
import { Spinner } from '../../components/ui/Spinner';

export function AdminStoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStoreById(id)
      .then((res) => setStore(res.data.data))
      .catch(() => toast.error('Failed to load store'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!store) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <button
        onClick={() => navigate('/admin/stores')}
        className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} /> Back to stores
      </button>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <h1 className="text-2xl font-bold text-white">{store.name}</h1>
        <p className="text-muted mt-1 text-sm">{store.address}</p>
        <p className="text-sm text-muted">{store.email}</p>
        <div className="flex items-center gap-2 mt-4">
          <StarRating value={Math.round(store.averageRating || 0)} />
          <span className="text-white font-medium">
            {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings'}
          </span>
          {store.totalRatings > 0 && (
            <span className="text-sm text-muted">({store.totalRatings} reviews)</span>
          )}
        </div>
        {store.owner && (
          <p className="text-sm text-muted mt-3">
            Owner: <span className="font-medium text-white">{store.owner.name}</span>{' '}
            <span className="text-muted">({store.owner.email})</span>
          </p>
        )}
      </div>

      {store.ratings?.length > 0 && (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
          <h2 className="text-base font-semibold text-white mb-4">Reviews</h2>
          <div className="flex flex-col divide-y divide-white/5">
            {store.ratings.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-white text-sm">{r.user.name}</p>
                  <p className="text-xs text-muted">{r.user.email}</p>
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
