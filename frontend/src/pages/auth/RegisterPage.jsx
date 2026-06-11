import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import { RegisterForm } from '../../components/forms/RegisterForm';

export function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-500/15 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/40 mb-5"
          >
            <Store size={28} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Store<span className="text-blue-400">-M</span>
          </h1>
          <p className="text-muted text-sm mt-2">Create your account today</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <RegisterForm />
          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
