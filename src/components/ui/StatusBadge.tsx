import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  PauseCircle,
  PlayCircle,
  Send,
  XCircle,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

const STATUS_MAP: Record<
  string,
  { bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  Received: {
    bg: 'bg-[#D9FBEA]/70',
    text: 'text-[#0E744E]',
    border: 'border-[#159B69]/25',
    icon: CheckCircle2,
  },
  Paid: {
    bg: 'bg-[#D9FBEA]/70',
    text: 'text-[#0E744E]',
    border: 'border-[#159B69]/25',
    icon: CheckCircle2,
  },
  Completed: {
    bg: 'bg-[#D9FBEA]/70',
    text: 'text-[#0E744E]',
    border: 'border-[#159B69]/25',
    icon: CheckCircle2,
  },
  Published: {
    bg: 'bg-[#D9FBEA]/70',
    text: 'text-[#0E744E]',
    border: 'border-[#159B69]/25',
    icon: CheckCircle2,
  },
  Confirmed: {
    bg: 'bg-[#F0EEFF]',
    text: 'text-[#4B44D6]',
    border: 'border-[#635BFF]/25',
    icon: CheckCircle2,
  },
  'In Progress': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#2563EB]/25',
    icon: PlayCircle,
  },
  'In Production': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#2563EB]/25',
    icon: PlayCircle,
  },
  'Ready to Publish': {
    bg: 'bg-[#F0EEFF]',
    text: 'text-[#4B44D6]',
    border: 'border-[#635BFF]/25',
    icon: Send,
  },
  Editing: {
    bg: 'bg-[#F3F4F8]',
    text: 'text-[#374151]',
    border: 'border-[#D1D5DB]',
    icon: FileText,
  },
  Pending: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#D97706]/25',
    icon: Clock,
  },
  'Payment Pending': {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#D97706]/25',
    icon: Clock,
  },
  'Partially Paid': {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#D97706]/25',
    icon: Clock,
  },
  'Awaiting Approval': {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#D97706]/25',
    icon: PauseCircle,
  },
  Negotiation: {
    bg: 'bg-[#F0EEFF]',
    text: 'text-[#4B44D6]',
    border: 'border-[#635BFF]/25',
    icon: Clock,
  },
  'Enquiry Received': {
    bg: 'bg-[#EFF6FF]',
    text: 'text-[#1D4ED8]',
    border: 'border-[#2563EB]/25',
    icon: FileText,
  },
  'Script Pending': {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#D97706]/25',
    icon: FileText,
  },
  Idea: {
    bg: 'bg-[#F3F4F8]',
    text: 'text-[#4B5563]',
    border: 'border-[#D1D5DB]',
    icon: FileText,
  },
  Draft: {
    bg: 'bg-[#F3F4F8]',
    text: 'text-[#4B5563]',
    border: 'border-[#D1D5DB]',
    icon: FileText,
  },
  Closed: {
    bg: 'bg-[#F3F4F8]',
    text: 'text-[#4B5563]',
    border: 'border-[#D1D5DB]',
    icon: CheckCircle2,
  },
  Overdue: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#DC2626]/25',
    icon: AlertCircle,
  },
  Cancelled: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#DC2626]/25',
    icon: XCircle,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = STATUS_MAP[status] || {
    bg: 'bg-[#F3F4F8]',
    text: 'text-[#4B5563]',
    border: 'border-[#D1D5DB]',
    icon: FileText,
  };
  const Icon = cfg.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[12px] font-medium whitespace-nowrap shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
};
