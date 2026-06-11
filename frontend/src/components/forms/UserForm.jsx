import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as adminApi from '../../services/adminApi';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function UserForm({ onSuccess }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: 'USER' },
  });

  const onSubmit = async (data) => {
    try {
      await adminApi.createUser(data);
      toast.success('User created successfully');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Full Name"
        placeholder="At least 20 characters"
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 20, message: 'Name must be at least 20 characters' },
          maxLength: { value: 60, message: 'Name must be at most 60 characters' },
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
        placeholder="Address (max 400 characters)"
        error={errors.address?.message}
        {...register('address', {
          maxLength: { value: 400, message: 'Address must be at most 400 characters' },
        })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Min 8 chars, 1 uppercase, 1 special"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          maxLength: { value: 16, message: 'Password must be at most 16 characters' },
          pattern: { value: PASSWORD_REGEX, message: 'Min 8 chars, 1 uppercase, 1 special character' },
        })}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted">Role</label>
        <select
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 transition-all"
          {...register('role')}
        >
          <option value="USER" className="bg-surface">User</option>
          <option value="STORE_OWNER" className="bg-surface">Store Owner</option>
          <option value="ADMIN" className="bg-surface">Admin</option>
        </select>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create User'}
      </Button>
    </form>
  );
}
