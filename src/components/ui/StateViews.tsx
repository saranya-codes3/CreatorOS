import React from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] bg-white px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3F4F8] text-[#697386]">
        {icon || <Inbox className="h-5 w-5" />}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold text-[#171923]">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-[#697386]">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5248F5] transition-colors whitespace-nowrap shrink-0"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const LoadingState: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 space-y-3" aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2 animate-pulse">
          <div className="h-4 w-1/3 rounded bg-[#F3F4F8]" />
          <div className="h-4 w-1/5 rounded bg-[#F3F4F8]" />
          <div className="h-4 w-16 rounded bg-[#F3F4F8]" />
        </div>
      ))}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = 'Unable to load view', message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[#FECACA] bg-[#FEF2F2]/60 px-6 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#DC2626]">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="mt-3 font-display text-base font-semibold text-[#171923]">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-[#697386]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#171923] hover:bg-[#F3F4F8] transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
