import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-8xl font-extrabold bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">404</p>
        <h1 className="text-2xl font-semibold text-white mt-4">Page not found</h1>
        <p className="text-muted mt-2">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-all font-semibold"
        >
          ← Go home
        </Link>
      </motion.div>
    </div>
  );
}
