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
import { UserForm } from '../../components/forms/UserForm';
import { Spinner } from '../../components/ui/Spinner';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'address', label: 'Address', render: (v) => v || '—' },
  {
    key: 'role',
    label: 'Role',
    render: (v) => {
      const styles = {
        ADMIN: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        STORE_OWNER: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
        USER: 'bg-white/5 text-muted border-white/10',
      };
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[v] ?? styles.USER}`}>{v}</span>
      );
    },
  },
  { key: 'createdAt', label: 'Joined', render: (v) => new Date(v).toLocaleDateString() },
];

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    adminApi
      .getUsers(debouncedSearch || undefined, roleFilter || undefined)
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [debouncedSearch, roleFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-6 py-10"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Users</h1>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search name, email or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 w-56 transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <option value="" className="bg-surface">All Roles</option>
            <option value="USER" className="bg-surface">User</option>
            <option value="STORE_OWNER" className="bg-surface">Store Owner</option>
            <option value="ADMIN" className="bg-surface">Admin</option>
          </select>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={14} /> Add User
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <Table columns={columns} data={users} onRowClick={(row) => navigate(`/admin/users/${row.id}`)} />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New User">
        <UserForm onSuccess={() => { setModalOpen(false); load(); }} />
      </Modal>
    </motion.div>
  );
}
