import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  deltaLabel?: string;
  deltaTrend?: 'up' | 'down' | 'neutral';
  tone?: 'default' | 'positive' | 'warning' | 'negative' | 'indigo';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  sublabel,
  deltaLabel,
  deltaTrend = 'neutral',
  tone = 'default',
  icon,
}) => {
  const toneIndicator =
    tone === 'positive'
      ? 'bg-[#D9FBEA] text-[#159B69]'
      : tone === 'warning'
        ? 'bg-[#FFFBEB] text-[#D97706]'
        : tone === 'negative'
          ? 'bg-[#FEF2F2] text-[#DC2626]'
          : tone === 'indigo'
            ? 'bg-[#F0EEFF] text-[#635BFF]'
            : 'bg-[#F3F4F8] text-[#172554]';

  const deltaColor =
    deltaTrend === 'up'
      ? 'text-[#159B69]'
      : deltaTrend === 'down'
        ? 'text-[#DC2626]'
        : 'text-[#697386]';

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 transition-colors hover:border-[#D1D5DB]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-[#697386] truncate">{label}</span>
        {icon && (
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneIndicator}`}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="font-mono text-[24px] font-semibold tracking-tight text-[#171923] tabular-nums">
          {value}
        </span>
      </div>

      {(deltaLabel || sublabel) && (
        <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
          {deltaLabel ? (
            <span className={`inline-flex items-center gap-1 font-medium tabular-nums ${deltaColor}`}>
              {deltaTrend === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
              {deltaTrend === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
              {deltaTrend === 'neutral' && <Minus className="h-3.5 w-3.5" />}
              <span>{deltaLabel}</span>
            </span>
          ) : (
            <span />
          )}
          {sublabel && <span className="text-[#9CA3AF] truncate">{sublabel}</span>}
        </div>
      )}
    </div>
  );
};
