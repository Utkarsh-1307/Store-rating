import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-muted">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-[#475569] backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${
          error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 hover:border-white/20'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
});
