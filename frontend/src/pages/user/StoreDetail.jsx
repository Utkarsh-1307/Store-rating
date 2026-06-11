import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ArrowLeft, Store } from 'lucide-react';
import * as storeApi from '../../services/storeApi';
import * as ratingApi from '../../services/ratingApi';
import { StarRating } from '../../components/ui/StarRating';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [pendingValue, setPendingValue] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    storeApi
      .getStoreById(id)
      .then((res) => {
        setStore(res.data.data);
        setPendingValue(res.data.data.userRating?.rating || 0);
      })
      .catch(() => toast.error('Failed to load store'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleSubmit = async () => {
    if (!pendingValue) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await ratingApi.submitRating({ storeId: parseInt(id), value: pendingValue });
      toast.success('Rating submitted!');
      load();
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!pendingValue) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      await ratingApi.updateRating(store.userRating.id, { value: pendingValue });
      toast.success('Rating updated!');
      load();
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update rating');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your rating?')) return;
    setSubmitting(true);
    try {
      await ratingApi.deleteRating(store.userRating.id);
      toast.success('Rating removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete rating');
    } finally {
      setSubmitting(false);
    }
  };

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
        onClick={() => navigate('/stores')}
        className="flex items-center gap-2 text-muted hover:text-white text-sm mb-8 transition-colors"
      >
        <ArrowLeft size={15} /> Back to stores
      </button>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 mb-5 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold text-white">{store.name}</h1>
          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
            <Store size={18} className="text-purple-400" />
          </div>
        </div>
        <p className="text-muted mt-1 text-sm">{store.address}</p>
        <p className="text-sm text-muted">{store.email}</p>
        <div className="flex items-center gap-2 mt-4">
          <StarRating value={Math.round(store.averageRating || 0)} size="lg" />
          <span className="text-white font-semibold">
            {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings'}
          </span>
          {store.totalRatings > 0 && (
            <span className="text-sm text-muted">({store.totalRatings} reviews)</span>
          )}
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
        <h2 className="text-base font-semibold text-white mb-4">Your Rating</h2>

        {!store.userRating || editing ? (
          <div className="flex flex-col gap-4">
            <StarRating value={pendingValue} onChange={setPendingValue} size="lg" />
            <div className="flex gap-2">
              <Button onClick={store.userRating ? handleUpdate : handleSubmit} disabled={submitting}>
                {submitting ? 'Saving…' : store.userRating ? 'Update Rating' : 'Submit Rating'}
              </Button>
              {editing && (
                <Button variant="secondary" onClick={() => { setEditing(false); setPendingValue(store.userRating.rating); }}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <StarRating value={store.userRating.rating} size="lg" />
            <p className="text-sm text-muted">
              Submitted {new Date(store.userRating.createdAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => { setEditing(true); setPendingValue(store.userRating.rating); }}>
                Edit Rating
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={submitting}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
