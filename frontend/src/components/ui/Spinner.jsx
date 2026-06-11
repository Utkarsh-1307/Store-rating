export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin ${className}`} />
  );
}
