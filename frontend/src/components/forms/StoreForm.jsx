import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as adminApi from '../../services/adminApi';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function StoreForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    adminApi.getUsers().then((res) => {
      setOwners(res.data.data.filter((u) => u.role === 'STORE_OWNER'));
    }).catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      await adminApi.createStore({ ...data, ownerId: parseInt(data.ownerId) });
      toast.success('Store created successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Store Name"
        placeholder="At least 20 characters"
        error={errors.name?.message}
        {...register('name', {
          required: 'Store name is required',
          minLength: { value: 20, message: 'Store name must be at least 20 characters' },
          maxLength: { value: 60, message: 'Store name must be at most 60 characters' },
        })}
      />
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <Input
        label="Address"
        error={errors.address?.message}
        {...register('address', { required: 'Address is required' })}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted">Owner</label>
        <select
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
          {...register('ownerId', { required: 'Owner is required' })}
        >
          <option value="" className="bg-surface">Select an owner…</option>
          {owners.map((o) => (
            <option key={o.id} value={o.id} className="bg-surface">{o.name} ({o.email})</option>
          ))}
        </select>
        {errors.ownerId && <p className="text-xs text-red-400">{errors.ownerId.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create Store'}
      </Button>
    </form>
  );
}
