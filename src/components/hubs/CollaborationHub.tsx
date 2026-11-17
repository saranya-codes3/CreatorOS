import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  ExternalLink,
  IndianRupee,
  LayoutGrid,
  List,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import type {
  Brand,
  Campaign,
  CampaignStatus,
  CurrencyCode,
  Deliverable,
  SocialPlatform,
} from '../../types/creatorOs';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import { MetricCard } from '../ui/MetricCard';
import { ConfirmDialog, Modal } from '../ui/Modal';
import { EmptyState } from '../ui/StateViews';
import { StatusBadge } from '../ui/StatusBadge';

interface CollaborationHubProps {
  campaigns: Campaign[];
  brands: Brand[];
  currency: CurrencyCode;
  onOpenCreateCampaign: () => void;
  onUpdateCampaign: (campaign: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
  onAddBrand: (brand: Omit<Brand, 'id'>) => void;
  onRecordCampaignPayment: (campaignId: string, amount: number) => void;
}

const CAMPAIGN_STATUSES: CampaignStatus[] = [
  'Enquiry Received',
  'Negotiation',
  'Confirmed',
  'In Progress',
  'Awaiting Approval',
  'Completed',
  'Payment Pending',
  'Closed',
  'Cancelled',
];

export const CollaborationHub: React.FC<CollaborationHubProps> = ({
  campaigns,
  brands,
  currency,
  onOpenCreateCampaign,
  onUpdateCampaign,
  onDeleteCampaign,
  onAddBrand,
  onRecordCampaignPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'brands' | 'deliverables' | 'payments'>(
    'campaigns'
  );
  const [viewLayout, setViewLayout] = useState<'cards' | 'table'>('cards');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Campaign Detail Workspace state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<
    'overview' | 'deliverables' | 'financials' | 'contracts' | 'activity'
  >('overview');
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  // Add Deliverable in detail view
  const [newDelTitle, setNewDelTitle] = useState('');
  const [newDelPlatform, setNewDelPlatform] = useState<SocialPlatform>('Instagram');
  const [newDelDeadline, setNewDelDeadline] = useState('2026-11-28');

  // Add Brand Modal
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [brandDraft, setBrandDraft] = useState({
    name: '',
    category: 'Beauty & Lifestyle',
    contactPerson: '',
    email: '',
    website: '',
  });

  // Quick Payment Modal
  const [paymentModalCamp, setPaymentModalCamp] = useState<Campaign | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');

  const selectedCampaign = useMemo(
    () => campaigns.find((c) => c.id === selectedCampaignId) || null,
    [campaigns, selectedCampaignId]
  );

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      const q = search.trim().toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.brandName.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [campaigns, statusFilter, search]);

  const totalCollabs = campaigns.length;
  const activeCount = campaigns.filter((c) =>
    ['Confirmed', 'In Progress', 'Awaiting Approval', 'Negotiation', 'Enquiry Received'].includes(
      c.status
    )
  ).length;
  const completedCount = campaigns.filter(
    (c) => c.status === 'Completed' || c.status === 'Closed'
  ).length;
  const totalPendingAmount = campaigns
    .filter((c) => c.status !== 'Cancelled')
    .reduce((s, c) => s + Math.max(0, c.amount - c.amountReceived), 0);
  const totalCollabRevenue = campaigns
    .filter((c) => c.status !== 'Cancelled')
    .reduce((s, c) => s + c.amount, 0);

  const allDeliverables = useMemo(() => {
    return campaigns
      .flatMap((c) =>
        c.deliverables.map((d) => ({
          ...d,
          campaignName: c.name,
          brandName: c.brandName,
        }))
      )
      .sort((a, b) => (a.deadline > b.deadline ? 1 : -1));
  }, [campaigns]);

  const handleToggleDeliverable = (campaignId: string, delId: string) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    const updatedDeliverables = camp.deliverables.map((d) =>
      d.id === delId ? { ...d, completed: !d.completed } : d
    );
    onUpdateCampaign({
      ...camp,
      deliverables: updatedDeliverables,
    });
  };

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !newDelTitle.trim()) return;
    const newDel: Deliverable = {
      id: `del-${Date.now()}`,
      campaignId: selectedCampaign.id,
      title: newDelTitle.trim(),
      platform: newDelPlatform,
      format: newDelPlatform === 'YouTube' ? 'Video' : 'Reel',
      deadline: newDelDeadline,
      completed: false,
    };
    onUpdateCampaign({
      ...selectedCampaign,
      deliverables: [...selectedCampaign.deliverables, newDel],
      activities: [
        {
          id: `act-${Date.now()}`,
          date: '2026-11-17',
          action: 'Deliverable Added',
          detail: `${newDel.title} (Due ${formatDateShort(newDel.deadline)})`,
        },
        ...selectedCampaign.activities,
      ],
    });
    setNewDelTitle('');
  };

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandDraft.name.trim()) return;
    onAddBrand({
      name: brandDraft.name.trim(),
      category: brandDraft.category,
      contactPerson: brandDraft.contactPerson.trim() || 'Partnerships Team',
      email: brandDraft.email.trim() || 'partnerships@brand.com',
      website: brandDraft.website.trim() || 'https://brand.com',
      previousCollaborations: 0,
    });
    setBrandModalOpen(false);
    setBrandDraft({
      name: '',
      category: 'Beauty & Lifestyle',
      contactPerson: '',
      email: '',
      website: '',
    });
  };

  // Detailed Campaign Workspace View
  if (selectedCampaign) {
    const completedDelCount = selectedCampaign.deliverables.filter((d) => d.completed).length;
    const totalDelCount = selectedCampaign.deliverables.length;
    const delProgressPct =
      totalDelCount > 0 ? Math.round((completedDelCount / totalDelCount) * 100) : 0;
    const outstanding = Math.max(0, selectedCampaign.amount - selectedCampaign.amountReceived);
    const isOverdue = outstanding > 0 && selectedCampaign.paymentDueDate < '2026-11-17';

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCampaignId(null)}
              className="rounded-lg border border-[#E5E7EB] bg-white p-2 text-[#697386] hover:text-[#171923]"
              aria-label="Back to campaigns"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold text-[#172554]">
                  {selectedCampaign.name}
                </h1>
                <StatusBadge status={selectedCampaign.status} />
              </div>
              <p className="text-xs text-[#697386]">
                {selectedCampaign.brandName} · {selectedCampaign.platform} · Contract{' '}
                {selectedCampaign.contractRef}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              aria-label="Update campaign status"
              value={selectedCampaign.status}
              onChange={(e) =>
                onUpdateCampaign({
                  ...selectedCampaign,
                  status: e.target.value as CampaignStatus,
                  activities: [
                    {
                      id: `act-${Date.now()}`,
                      date: '2026-11-17',
                      action: 'Status Updated',
                      detail: `Moved to ${e.target.value}`,
                    },
                    ...selectedCampaign.activities,
                  ],
                })
              }
              className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-xs font-medium"
            >
              {CAMPAIGN_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setDeleteTarget(selectedCampaign)}
              className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-2 text-[#DC2626] hover:bg-[#FEE2E2]"
              aria-label="Delete campaign"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 5 Campaign Detail Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-[#E5E7EB] pb-2">
          {(
            [
              { id: 'overview', label: 'Overview' },
              { id: 'deliverables', label: `Deliverables (${totalDelCount})` },
              { id: 'financials', label: 'Financial Details' },
              { id: 'contracts', label: 'Contracts' },
              { id: 'activity', label: 'Activity History' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setDetailTab(t.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 ${
                detailTab === t.id
                  ? 'bg-[#F0EEFF] text-[#635BFF] font-semibold'
                  : 'text-[#697386] hover:bg-[#F3F4F8]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {detailTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Campaign Summary
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[#697386]">Brand Partner</p>
                  <p className="mt-1 font-semibold text-[#171923]">
                    {selectedCampaign.brandName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#697386]">Start Date</p>
                  <p className="mt-1 font-mono text-xs font-medium">
                    {formatDateShort(selectedCampaign.startDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#697386]">Go-Live Deadline</p>
                  <p className="mt-1 font-mono text-xs font-medium">
                    {formatDateShort(selectedCampaign.deadline)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#697386]">Payment Terms</p>
                  <p className="mt-1 font-medium text-[#171923]">
                    {selectedCampaign.paymentTerms}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#697386]">Payment Due Date</p>
                  <p
                    className={`mt-1 font-mono text-xs font-medium ${
                      isOverdue ? 'text-[#DC2626]' : 'text-[#171923]'
                    }`}
                  >
                    {formatDateShort(selectedCampaign.paymentDueDate)}
                    {isOverdue ? ' (Overdue)' : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#697386]">Deliverables Progress</p>
                  <p className="mt-1 font-mono text-xs font-semibold text-[#635BFF]">
                    {completedDelCount}/{totalDelCount} ({delProgressPct}%)
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-[#697386]">Agreed Campaign Value</p>
                <p className="mt-1 font-mono text-2xl font-bold text-[#172554] tabular-nums">
                  {formatCurrency(selectedCampaign.amount, currency)}
                </p>
                <div className="mt-4 space-y-2 border-t border-[#F3F4F8] pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#697386]">Received</span>
                    <span className="font-mono font-semibold text-[#159B69]">
                      {formatCurrency(selectedCampaign.amountReceived, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#697386]">Outstanding</span>
                    <span
                      className={`font-mono font-semibold ${
                        outstanding > 0 ? 'text-[#D97706]' : 'text-[#159B69]'
                      }`}
                    >
                      {formatCurrency(outstanding, currency)}
                    </span>
                  </div>
                </div>
              </div>
              {outstanding > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalCamp(selectedCampaign);
                    setPaymentAmount(String(outstanding));
                  }}
                  className="mt-5 w-full rounded-lg bg-[#635BFF] py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
                >
                  Record Payment
                </button>
              )}
            </div>
          </div>
        )}

        {detailTab === 'deliverables' && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-semibold text-[#171923]">
                  Deliverable Tracker
                </h2>
                <p className="text-xs text-[#697386]">
                  {completedDelCount} of {totalDelCount} completed ({delProgressPct}%)
                </p>
              </div>
              <div className="w-36 h-2 rounded-full bg-[#F3F4F8] overflow-hidden">
                <div
                  className="h-full bg-[#159B69] transition-all"
                  style={{ width: `${delProgressPct}%` }}
                />
              </div>
            </div>

            <div className="divide-y divide-[#F3F4F8]">
              {selectedCampaign.deliverables.map((del) => (
                <label
                  key={del.id}
                  className="flex items-center justify-between gap-4 py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={del.completed}
                      onChange={() => handleToggleDeliverable(selectedCampaign.id, del.id)}
                      className="h-4 w-4 rounded border-[#D1D5DB] text-[#635BFF]"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          del.completed ? 'line-through text-[#9CA3AF]' : 'text-[#171923]'
                        }`}
                      >
                        {del.title}
                      </p>
                      <p className="text-xs text-[#697386]">
                        {del.platform} · {del.format}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#697386] shrink-0">
                    Due {formatDateShort(del.deadline)}
                  </span>
                </label>
              ))}
            </div>

            <form
              onSubmit={handleAddDeliverable}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 border-t border-[#E5E7EB] pt-4"
            >
              <input
                type="text"
                value={newDelTitle}
                onChange={(e) => setNewDelTitle(e.target.value)}
                placeholder="Add new deliverable (e.g. 2x Story Frames)"
                className="sm:col-span-6 rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs"
              />
              <select
                value={newDelPlatform}
                onChange={(e) => setNewDelPlatform(e.target.value as SocialPlatform)}
                className="sm:col-span-2 rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
              <input
                type="date"
                value={newDelDeadline}
                onChange={(e) => setNewDelDeadline(e.target.value)}
                className="sm:col-span-2 rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs"
              />
              <button
                type="submit"
                className="sm:col-span-2 rounded-lg bg-[#172554] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1e3170]"
              >
                Add Item
              </button>
            </form>
          </div>
        )}

        {detailTab === 'financials' && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Payment Tracking
              </h2>
              {outstanding > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalCamp(selectedCampaign);
                    setPaymentAmount(String(outstanding));
                  }}
                  className="rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white"
                >
                  Record Payment
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 font-mono tabular-nums">
              <div className="rounded-lg border border-[#E5E7EB] p-4">
                <p className="font-sans text-xs text-[#697386]">Agreed Amount</p>
                <p className="mt-1 text-lg font-bold text-[#171923]">
                  {formatCurrency(selectedCampaign.amount, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] p-4">
                <p className="font-sans text-xs text-[#697386]">Invoiced Amount</p>
                <p className="mt-1 text-lg font-bold text-[#171923]">
                  {formatCurrency(selectedCampaign.invoicedAmount, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] p-4">
                <p className="font-sans text-xs text-[#697386]">Amount Received</p>
                <p className="mt-1 text-lg font-bold text-[#159B69]">
                  {formatCurrency(selectedCampaign.amountReceived, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] p-4">
                <p className="font-sans text-xs text-[#697386]">Outstanding</p>
                <p
                  className={`mt-1 text-lg font-bold ${
                    outstanding > 0 ? 'text-[#D97706]' : 'text-[#159B69]'
                  }`}
                >
                  {formatCurrency(outstanding, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] p-4">
                <p className="font-sans text-xs text-[#697386]">Due Date</p>
                <p
                  className={`mt-1 text-sm font-bold ${
                    isOverdue ? 'text-[#DC2626]' : 'text-[#171923]'
                  }`}
                >
                  {formatDateShort(selectedCampaign.paymentDueDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {detailTab === 'contracts' && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Contract & Usage Terms
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg bg-[#FAFAFC] p-4 border border-[#E5E7EB]">
                <p className="text-xs text-[#697386]">Agreement Reference</p>
                <p className="mt-1 font-mono font-semibold text-[#171923]">
                  {selectedCampaign.contractRef}
                </p>
              </div>
              <div className="rounded-lg bg-[#FAFAFC] p-4 border border-[#E5E7EB]">
                <p className="text-xs text-[#697386]">Usage Rights</p>
                <p className="mt-1 font-medium text-[#171923]">{selectedCampaign.usageRights}</p>
              </div>
              <div className="rounded-lg bg-[#FAFAFC] p-4 border border-[#E5E7EB]">
                <p className="text-xs text-[#697386]">Category Exclusivity</p>
                <p className="mt-1 font-medium text-[#171923]">{selectedCampaign.exclusivity}</p>
              </div>
            </div>
          </div>
        )}

        {detailTab === 'activity' && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Activity History
            </h2>
            <div className="divide-y divide-[#F3F4F8]">
              {selectedCampaign.activities.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-[#171923]">{act.action}</p>
                    <p className="text-xs text-[#697386]">{act.detail}</p>
                  </div>
                  <span className="font-mono text-xs text-[#9CA3AF] shrink-0">
                    {formatDateShort(act.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ConfirmDialog
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            if (deleteTarget) {
              onDeleteCampaign(deleteTarget.id);
              setSelectedCampaignId(null);
            }
          }}
          title="Delete Campaign"
          description={`Remove "${deleteTarget?.name}" from your Collaboration Hub? Linked income entries remain in your ledger.`}
          confirmLabel="Delete Campaign"
          destructive
        />

        <Modal
          open={Boolean(paymentModalCamp)}
          onClose={() => setPaymentModalCamp(null)}
          title="Record Campaign Payment"
          size="sm"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!paymentModalCamp) return;
              const amt = Number(paymentAmount);
              if (amt > 0) {
                onRecordCampaignPayment(paymentModalCamp.id, amt);
                setPaymentModalCamp(null);
              }
            }}
            className="space-y-4"
          >
            <p className="text-xs text-[#697386]">
              Recording a payment updates both the campaign settlement balance and your Finance Hub
              income ledger.
            </p>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Amount Received (INR)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPaymentModalCamp(null)}
                className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[#159B69] px-4 py-2 text-xs font-semibold text-white"
              >
                Confirm Receipt
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172554]">
            Collaboration Hub
          </h1>
          <p className="mt-1 text-sm text-[#697386]">
            Manage brand relationships, deal stages, deliverables, and campaign payments.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBrandModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8] whitespace-nowrap shrink-0"
          >
            <Building2 className="h-3.5 w-3.5 text-[#697386]" />
            <span>Add Brand</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateCampaign}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248F5] whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 5 Collaboration Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Collaborations"
          value={String(totalCollabs)}
          icon={<Briefcase className="h-4 w-4" />}
        />
        <MetricCard
          label="Active Campaigns"
          value={String(activeCount)}
          tone="indigo"
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          label="Completed Campaigns"
          value={String(completedCount)}
          tone="positive"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Pending Payments"
          value={formatCurrency(totalPendingAmount, currency)}
          tone="warning"
          icon={<AlertCircle className="h-4 w-4" />}
        />
        <MetricCard
          label="Total Collab Revenue"
          value={formatCurrency(totalCollabRevenue, currency)}
          tone="positive"
          icon={<IndianRupee className="h-4 w-4" />}
        />
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {(
            [
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'brands', label: `Brand Directory (${brands.length})` },
              { id: 'deliverables', label: `Deliverables (${allDeliverables.length})` },
              { id: 'payments', label: 'Payment Tracking' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#F0EEFF] text-[#635BFF] font-semibold'
                  : 'text-[#697386] hover:bg-[#F3F4F8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'campaigns' && (
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter campaigns..."
                className="rounded-lg border border-[#E5E7EB] bg-white py-1.5 pl-8 pr-3 text-xs w-44"
              />
            </div>
            <select
              aria-label="Filter campaign status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium"
            >
              <option value="All">All Statuses</option>
              {CAMPAIGN_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1 rounded-lg bg-[#F3F4F8] p-1">
              <button
                type="button"
                onClick={() => setViewLayout('cards')}
                aria-label="Card view"
                className={`rounded-md p-1.5 ${
                  viewLayout === 'cards' ? 'bg-white text-[#171923] shadow-sm' : 'text-[#697386]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewLayout('table')}
                aria-label="Table view"
                className={`rounded-md p-1.5 ${
                  viewLayout === 'table' ? 'bg-white text-[#171923] shadow-sm' : 'text-[#697386]'
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <>
          {filteredCampaigns.length === 0 ? (
            <EmptyState
              title="No campaigns match your filters"
              description="Try clearing your search filter or create a new brand collaboration."
              actionLabel="Create Campaign"
              onAction={onOpenCreateCampaign}
            />
          ) : viewLayout === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCampaigns.map((camp) => {
                const done = camp.deliverables.filter((d) => d.completed).length;
                const total = camp.deliverables.length;
                const outstanding = Math.max(0, camp.amount - camp.amountReceived);
                const overdue = outstanding > 0 && camp.paymentDueDate < '2026-11-17';

                return (
                  <div
                    key={camp.id}
                    onClick={() => {
                      setSelectedCampaignId(camp.id);
                      setDetailTab('overview');
                    }}
                    className="cursor-pointer rounded-xl border border-[#E5E7EB] bg-white p-5 hover:border-[#635BFF] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-[#697386]">
                          {camp.brandName} · {camp.platform}
                        </span>
                        <StatusBadge status={camp.status} />
                      </div>
                      <h3 className="mt-2 font-display text-base font-bold text-[#171923]">
                        {camp.name}
                      </h3>
                      <div className="mt-3 flex items-baseline justify-between font-mono tabular-nums">
                        <span className="text-lg font-bold text-[#172554]">
                          {formatCurrency(camp.amount, currency)}
                        </span>
                        <span className="text-xs text-[#697386]">
                          Due {formatDateShort(camp.deadline)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-[#F3F4F8] pt-3 flex items-center justify-between text-xs">
                      <span className="text-[#697386]">
                        Deliverables: {done}/{total}
                      </span>
                      {outstanding > 0 ? (
                        <span
                          className={`font-medium ${
                            overdue ? 'text-[#DC2626]' : 'text-[#D97706]'
                          }`}
                        >
                          {overdue ? 'Overdue: ' : 'Pending: '}
                          {formatCurrency(outstanding, currency)}
                        </span>
                      ) : (
                        <span className="font-medium text-[#159B69]">Paid in full</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                      <th className="py-3 px-5">Campaign</th>
                      <th className="py-3 px-3">Brand</th>
                      <th className="py-3 px-3">Deadline</th>
                      <th className="py-3 px-3">Terms</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                    {filteredCampaigns.map((camp) => (
                      <tr
                        key={camp.id}
                        onClick={() => {
                          setSelectedCampaignId(camp.id);
                          setDetailTab('overview');
                        }}
                        className="cursor-pointer hover:bg-[#FAFAFC]"
                      >
                        <td className="py-3 px-5 font-semibold text-[#171923]">{camp.name}</td>
                        <td className="py-3 px-3 text-[#697386]">{camp.brandName}</td>
                        <td className="py-3 px-3 font-mono text-xs text-[#697386] tabular-nums">
                          {formatDateShort(camp.deadline)}
                        </td>
                        <td className="py-3 px-3 text-[#697386]">{camp.paymentTerms}</td>
                        <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums">
                          {formatCurrency(camp.amount, currency)}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <StatusBadge status={camp.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Brand Directory Tab */}
      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <div key={brand.id} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#172554] font-display text-sm font-bold text-white">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-[#171923]">
                      {brand.name}
                    </h3>
                    <p className="text-xs text-[#697386]">{brand.category}</p>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-[#635BFF]">
                  {brand.previousCollaborations} deals
                </span>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-[#697386] border-t border-[#F3F4F8] pt-3">
                <p>
                  <span className="text-[#9CA3AF]">Contact:</span> {brand.contactPerson}
                </p>
                <p>
                  <span className="text-[#9CA3AF]">Email:</span> {brand.email}
                </p>
                <p className="inline-flex items-center gap-1 text-[#635BFF]">
                  <ExternalLink className="h-3 w-3" />
                  <span>{brand.website}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deliverables Tab */}
      {activeTab === 'deliverables' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="divide-y divide-[#F3F4F8]">
            {allDeliverables.map((del) => (
              <div
                key={del.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-[#FAFAFC]"
              >
                <label className="flex items-center gap-3 cursor-pointer min-w-0">
                  <input
                    type="checkbox"
                    checked={del.completed}
                    onChange={() => handleToggleDeliverable(del.campaignId, del.id)}
                    className="h-4 w-4 rounded border-[#D1D5DB] text-[#635BFF]"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        del.completed ? 'line-through text-[#9CA3AF]' : 'text-[#171923]'
                      }`}
                    >
                      {del.title}
                    </p>
                    <p className="text-xs text-[#697386]">
                      {del.brandName} · {del.campaignName} · {del.platform}
                    </p>
                  </div>
                </label>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-[#697386] tabular-nums">
                    {formatDateShort(del.deadline)}
                  </span>
                  <StatusBadge status={del.completed ? 'Completed' : 'Pending'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Tracking Tab */}
      {activeTab === 'payments' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                  <th className="py-3 px-5">Campaign</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3 text-right">Agreed</th>
                  <th className="py-3 px-3 text-right">Invoiced</th>
                  <th className="py-3 px-3 text-right">Received</th>
                  <th className="py-3 px-3 text-right">Outstanding</th>
                  <th className="py-3 px-5 text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F8] text-[13px] font-mono tabular-nums">
                {campaigns.map((camp) => {
                  const outstanding = Math.max(0, camp.amount - camp.amountReceived);
                  const overdue = outstanding > 0 && camp.paymentDueDate < '2026-11-17';
                  return (
                    <tr
                      key={camp.id}
                      onClick={() => {
                        setSelectedCampaignId(camp.id);
                        setDetailTab('financials');
                      }}
                      className={`cursor-pointer hover:bg-[#FAFAFC] ${
                        overdue ? 'bg-[#FEF2F2]/40' : ''
                      }`}
                    >
                      <td className="py-3 px-5 font-sans font-semibold text-[#171923]">
                        {camp.name}
                      </td>
                      <td className="py-3 px-3 font-sans text-[#697386]">{camp.brandName}</td>
                      <td className="py-3 px-3 text-right">{formatCurrency(camp.amount, currency)}</td>
                      <td className="py-3 px-3 text-right">
                        {formatCurrency(camp.invoicedAmount, currency)}
                      </td>
                      <td className="py-3 px-3 text-right text-[#159B69]">
                        {formatCurrency(camp.amountReceived, currency)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-semibold ${
                          overdue
                            ? 'text-[#DC2626]'
                            : outstanding > 0
                              ? 'text-[#D97706]'
                              : 'text-[#159B69]'
                        }`}
                      >
                        {formatCurrency(outstanding, currency)}
                      </td>
                      <td
                        className={`py-3 px-5 text-right text-xs ${
                          overdue ? 'font-semibold text-[#DC2626]' : 'text-[#697386]'
                        }`}
                      >
                        {formatDateShort(camp.paymentDueDate)}
                        {overdue ? ' · Overdue' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Brand Modal */}
      <Modal
        open={brandModalOpen}
        onClose={() => setBrandModalOpen(false)}
        title="Add Brand Partner"
        size="sm"
      >
        <form onSubmit={handleCreateBrand} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Brand Name</label>
            <input
              type="text"
              value={brandDraft.name}
              onChange={(e) => setBrandDraft({ ...brandDraft, name: e.target.value })}
              placeholder="e.g. Dyson India"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Category</label>
            <input
              type="text"
              value={brandDraft.category}
              onChange={(e) => setBrandDraft({ ...brandDraft, category: e.target.value })}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Contact Person</label>
            <input
              type="text"
              value={brandDraft.contactPerson}
              onChange={(e) => setBrandDraft({ ...brandDraft, contactPerson: e.target.value })}
              placeholder="Marketing Manager Name"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Email</label>
            <input
              type="email"
              value={brandDraft.email}
              onChange={(e) => setBrandDraft({ ...brandDraft, email: e.target.value })}
              placeholder="name@brand.com"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setBrandModalOpen(false)}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white"
            >
              Save Brand
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
