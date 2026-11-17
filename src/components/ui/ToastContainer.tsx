import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const Icon =
          t.tone === 'success' ? CheckCircle2 : t.tone === 'error' ? AlertCircle : Info;
        const accent =
          t.tone === 'success'
            ? 'text-[#159B69]'
            : t.tone === 'error'
              ? 'text-[#DC2626]'
              : 'text-[#635BFF]';

        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-lg"
          >
            <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${accent}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#171923]">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-[#697386]">{t.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-[#9CA3AF] hover:bg-[#F3F4F8] hover:text-[#171923]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
