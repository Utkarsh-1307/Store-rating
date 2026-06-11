import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { PasswordForm } from '../../components/forms/PasswordForm';

export function ChangePasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto px-4 py-10"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
          <Lock size={18} className="text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Change Password</h1>
          <p className="text-muted text-xs mt-0.5">Update your account password</p>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
        <PasswordForm />
      </div>
    </motion.div>
  );
}
