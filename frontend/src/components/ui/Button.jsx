import { motion } from 'framer-motion';

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40',
    secondary: 'bg-white/5 text-[#94A3B8] border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 hover:border-red-400/30',
    ghost: 'text-[#94A3B8] hover:bg-white/5 hover:text-white',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
