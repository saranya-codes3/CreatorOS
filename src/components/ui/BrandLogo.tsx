import React from 'react';

interface BrandLogoProps {
  compact?: boolean;
  inverted?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, inverted = false }) => {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="28"
          height="28"
          rx="7"
          fill={inverted ? '#635BFF' : '#172554'}
        />
        <path
          d="M8.5 14C8.5 10.9624 10.9624 8.5 14 8.5C15.933 8.5 17.6334 9.49736 18.6132 11.0041"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M19.5 14C19.5 17.0376 17.0376 19.5 14 19.5C12.067 19.5 10.3666 18.5026 9.38678 16.9959"
          stroke="#A5B4FC"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="2.2" fill="#159B69" />
      </svg>
      {!compact && (
        <span
          className={`font-display text-[17px] font-bold tracking-tight ${
            inverted ? 'text-white' : 'text-[#172554]'
          }`}
        >
          CREATOR OS
        </span>
      )}
    </span>
  );
};
