import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Search, Store } from 'lucide-react';
import * as storeApi from '../../services/storeApi';
import { useDebounce } from '../../hooks/useDebounce';
import { StarRating } from '../../components/ui/StarRating';
import { Spinner } from '../../components/ui/Spinner';

export function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    storeApi
      .getStores(debouncedSearch || undefined)
      .then((res) => setStores(res.data.data))
      .catch(() => toast.error('Failed to load stores'))
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-2xl font-bold text-white tracking-tight">Browse Stores</h1>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search by name or address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 w-64 transition-all"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : stores.length === 0 ? (
        <div className="text-center py-20">
          <Store size={40} className="text-muted mx-auto mb-3" />
          <p className="text-muted">No stores found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stores.map((store, i) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              whileHover={{ translateY: -5 }}
              onClick={() => navigate(`/stores/${store.id}`)}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 cursor-pointer hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-semibold text-white truncate">{store.name}</h2>
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
                  <Store size={14} className="text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-muted truncate mb-3">{store.address}</p>
              <div className="flex items-center gap-2">
                <StarRating value={Math.round(store.averageRating || 0)} size="sm" />
                <span className="text-sm text-muted">
                  {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings'}
                  {store.totalRatings > 0 && <span className="ml-1">({store.totalRatings})</span>}
                </span>
              </div>
              {store.userRating && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-xs text-blue-400 font-medium">
                    Your rating: {store.userRating.rating} ★
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
