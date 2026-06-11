import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as authApi from '../../services/authApi';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

export function PasswordForm() {
  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Current Password"
        type="password"
        error={errors.currentPassword?.message}
        {...register('currentPassword', { required: 'Current password is required' })}
      />
      <Input
        label="New Password"
        type="password"
        placeholder="Min 8 chars, 1 uppercase, 1 special"
        error={errors.newPassword?.message}
        {...register('newPassword', {
          required: 'New password is required',
          maxLength: { value: 16, message: 'Password must be at most 16 characters' },
          pattern: { value: PASSWORD_REGEX, message: 'Min 8 chars, 1 uppercase, 1 special character' },
        })}
      />
      <Input
        label="Confirm New Password"
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (val) => val === watch('newPassword') || 'Passwords do not match',
        })}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating…' : 'Update Password'}
      </Button>
    </form>
  );
}
