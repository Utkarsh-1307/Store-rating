import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as authApi from '../../services/authApi';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authApi.register(data);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <Input
        label="Address"
        placeholder="Your address (optional, max 400 characters)"
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
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create Account'}
      </Button>
    </form>
  );
}
