import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function LoginForm() {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign In'}
      </Button>
    </form>
  );
}
