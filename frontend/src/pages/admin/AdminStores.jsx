import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Search, Plus } from 'lucide-react';
import * as adminApi from '../../services/adminApi';
import { useDebounce } from '../../hooks/useDebounce';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { StoreForm } from '../../components/forms/StoreForm';
import { Spinner } from '../../components/ui/Spinner';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address' },
  { key: 'owner', label: 'Owner', render: (v) => v?.name ?? '—' },
  { key: 'averageRating', label: 'Avg Rating', render: (v) => v ? `⭐ ${v.toFixed(1)}` : '—' },
];

export function AdminStores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    adminApi
      .getStores(debouncedSearch || undefined)
      .then((res) => setStores(res.data.data))
      .catch(() => toast.error('Failed to load stores'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [debouncedSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-6 py-10"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Stores</h1>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by name or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 w-56 transition-all"
            />
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Add Store
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <Table columns={columns} data={stores} onRowClick={(row) => navigate(`/admin/stores/${row.id}`)} />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Store">
        <StoreForm onSuccess={() => { setModalOpen(false); load(); }} />
      </Modal>
    </motion.div>
  );
}
