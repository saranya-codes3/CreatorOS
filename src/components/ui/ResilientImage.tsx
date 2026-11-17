import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ResilientImageProps {
  src?: string;
  alt: string;
  fallbackText?: string;
  className?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackText,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const initials = (fallbackText || alt || 'CR')
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F0EEFF] to-[#E6E9F5] text-[#172554] ${className}`}
        aria-label={alt}
      >
        {fallbackText ? (
          <span className="font-display font-semibold text-sm">{initials}</span>
        ) : (
          <ImageIcon className="h-6 w-6 text-[#635BFF]" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
