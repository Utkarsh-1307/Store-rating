import { useState } from 'react';

export function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;
  const display = hovered || value || 0;

  const sizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl';

  return (
    <div className={`flex gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`transition-all duration-150 ${display >= star ? 'text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' : 'text-white/20'} ${
            interactive ? 'cursor-pointer select-none hover:scale-110' : ''
          }`}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
