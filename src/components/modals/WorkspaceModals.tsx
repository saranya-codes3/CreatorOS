import React, { useEffect, useState } from 'react';
import type {
  Brand,
  Campaign,
  CampaignStatus,
  ExpenseCategory,
  ExpenseEntry,
  IncomeEntry,
  Invoice,
  PaymentStatus,
  RevenueSource,
  SocialPlatform,
} from '../../types/creatorOs';
import { Modal } from '../ui/Modal';

const INCOME_SOURCES: RevenueSource[] = [
  'Brand Collaborations',
  'YouTube',
  'Affiliate Marketing',
  'Freelancing',
  'Digital Products',
  'Sponsorships',
  'Other',
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Equipment',
  'Editing',
  'Software',
  'Travel',
  'Production',
  'Marketing',
  'Internet',
  'Outsourcing',
  'Other',
];

const PLATFORMS: SocialPlatform[] = ['Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Other'];

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

export const IncomeModal: React.FC<{
  open: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  initial?: IncomeEntry | null;
  onSave: (entry: Omit<IncomeEntry, 'id'>, existingId?: string) => void;
}> = ({ open, onClose, campaigns, initial, onSave }) => {
  const [description, setDescription] = useState('');
  const [source, setSource] = useState<RevenueSource>('Brand Collaborations');
  const [platform, setPlatform] = useState<SocialPlatform>('Instagram');
  const [brand, setBrand] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [date, setDate] = useState('2026-11-17');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('Received');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDescription(initial?.description || '');
      setSource(initial?.source || 'Brand Collaborations');
      setPlatform(initial?.platform || 'Instagram');
      setBrand(initial?.brand || '');
      setCampaignId(initial?.campaignId || '');
      setDate(initial?.date || '2026-11-17');
      setAmount(initial ? String(initial.amount) : '');
      setStatus(initial?.status || 'Received');
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!description.trim()) {
      setError('Please provide an income description.');
      return;
    }
    if (!num || num <= 0) {
      setError('Please enter a valid amount greater than ₹0.');
      return;
    }
    onSave(
      {
        description: description.trim(),
        source,
        platform,
        brand: brand.trim() || 'Direct',
        campaignId: campaignId || undefined,
        date,
        amount: num,
        status,
        isDemo: false,
      },
      initial?.id
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Income Entry' : 'Add Income Entry'}
      subtitle="Record brand payments, AdSense payouts, or affiliate revenue."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-[#171923] mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Dyson Airwrap Winter Campaign"
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm focus:border-[#635BFF] focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Revenue Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as RevenueSource)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              {INCOME_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Brand / Payer</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Nykaa, Google AdSense"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Linked Campaign (Optional)
            </label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              <option value="">None</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25000"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Payment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PaymentStatus)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              <option value="Received">Received</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#171923] hover:bg-[#F3F4F8]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5248F5]"
          >
            {initial ? 'Save Changes' : 'Add Income'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const ExpenseModal: React.FC<{
  open: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  initial?: ExpenseEntry | null;
  onSave: (entry: Omit<ExpenseEntry, 'id'>, existingId?: string) => void;
}> = ({ open, onClose, campaigns, initial, onSave }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Editing');
  const [vendor, setVendor] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [date, setDate] = useState('2026-11-17');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setDescription(initial?.description || '');
      setCategory(initial?.category || 'Editing');
      setVendor(initial?.vendor || '');
      setCampaignId(initial?.campaignId || '');
      setDate(initial?.date || '2026-11-17');
      setAmount(initial ? String(initial.amount) : '');
      setNotes(initial?.notes || '');
      setError('');
    }
  }, [open, initial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!description.trim()) {
      setError('Please enter an expense description.');
      return;
    }
    if (!num || num <= 0) {
      setError('Please enter an expense amount greater than ₹0.');
      return;
    }
    onSave(
      {
        description: description.trim(),
        category,
        vendor: vendor.trim() || 'Vendor',
        campaignId: campaignId || undefined,
        date,
        amount: num,
        notes: notes.trim() || undefined,
        isDemo: false,
      },
      initial?.id
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Expense' : 'Add Expense'}
      subtitle="Log shoot, editing, gear, or software costs to calculate real operating profit."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-[#171923] mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Reel Color Grading & Subtitles"
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Vendor / Payee</label>
            <input
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              placeholder="e.g. Studio BLR, Adobe"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="4000"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Link to Campaign
            </label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              <option value="">General Business</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#171923] mb-1">Notes (Optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Receipt ref or context"
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
          />
        </div>
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#171923] hover:bg-[#F3F4F8]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5248F5]"
          >
            {initial ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreateCampaignModal: React.FC<{
  open: boolean;
  onClose: () => void;
  brands: Brand[];
  onCreate: (campaign: Omit<Campaign, 'id'>) => void;
}> = ({ open, onClose, brands, onCreate }) => {
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState(brands[0]?.name || '');
  const [platform, setPlatform] = useState<SocialPlatform>('Instagram');
  const [amount, setAmount] = useState('');
  const [startDate, setStartDate] = useState('2026-11-17');
  const [deadline, setDeadline] = useState('2026-11-30');
  const [paymentTerms, setPaymentTerms] = useState('Net 15');
  const [paymentDueDate, setPaymentDueDate] = useState('2026-12-15');
  const [status, setStatus] = useState<CampaignStatus>('Confirmed');
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName('');
      setBrandName(brands[0]?.name || '');
      setAmount('');
      setDeliverableTitle('');
      setError('');
    }
  }, [open, brands]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!name.trim() || !brandName.trim()) {
      setError('Campaign name and brand are required.');
      return;
    }
    if (!num || num <= 0) {
      setError('Please enter a valid deal amount.');
      return;
    }
    const matchedBrand = brands.find(
      (b) => b.name.toLowerCase() === brandName.trim().toLowerCase()
    );
    const campId = `camp-${Date.now()}`;
    onCreate({
      name: name.trim(),
      brandId: matchedBrand?.id || `brand-${Date.now()}`,
      brandName: brandName.trim(),
      platform,
      amount: num,
      startDate,
      deadline,
      paymentTerms,
      paymentDueDate,
      status,
      invoicedAmount: 0,
      amountReceived: 0,
      contractRef: `COS-${Math.floor(1000 + Math.random() * 9000)}`,
      usageRights: '60 days organic reposting',
      exclusivity: 'None',
      deliverables: deliverableTitle.trim()
        ? [
            {
              id: `del-${Date.now()}`,
              campaignId: campId,
              title: deliverableTitle.trim(),
              platform,
              format: platform === 'YouTube' ? 'Integrated Video' : 'Instagram Reel',
              deadline,
              completed: false,
            },
          ]
        : [],
      activities: [
        {
          id: `act-${Date.now()}`,
          date: startDate,
          action: 'Campaign Created',
          detail: `Created with agreed fee ₹${num.toLocaleString('en-IN')}`,
        },
      ],
      isDemo: false,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Brand Campaign"
      subtitle="Add a new collaboration to your deal pipeline and deliverable tracker."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Campaign Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dyson Winter Styling Reel"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Brand</label>
            <input
              type="text"
              list="brand-suggestions"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Select or type brand"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
            <datalist id="brand-suggestions">
              {brands.map((b) => (
                <option key={b.id} value={b.name} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Deal Value (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="25000"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CampaignStatus)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              {CAMPAIGN_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Go-Live Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Payment Due</label>
            <input
              type="date"
              value={paymentDueDate}
              onChange={(e) => setPaymentDueDate(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Payment Terms</label>
            <input
              type="text"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Primary Deliverable (Optional)
            </label>
            <input
              type="text"
              value={deliverableTitle}
              onChange={(e) => setDeliverableTitle(e.target.value)}
              placeholder="e.g. 1x Instagram Reel + 2 Stories"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#171923] hover:bg-[#F3F4F8]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5248F5]"
          >
            Create Campaign
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const CreateInvoiceModal: React.FC<{
  open: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  nextInvoiceNumber: string;
  onCreate: (invoice: Omit<Invoice, 'id'>) => void;
}> = ({ open, onClose, campaigns, nextInvoiceNumber, onCreate }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(nextInvoiceNumber);
  const [brandName, setBrandName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [issueDate, setIssueDate] = useState('2026-11-17');
  const [dueDate, setDueDate] = useState('2026-12-02');
  const [totalAmount, setTotalAmount] = useState('');
  const [notes, setNotes] = useState('Payable via NEFT/IMPS within due date.');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setInvoiceNumber(nextInvoiceNumber);
      setBrandName('');
      setCampaignId('');
      setTotalAmount('');
      setError('');
    }
  }, [open, nextInvoiceNumber]);

  const handleCampaignSelect = (id: string) => {
    setCampaignId(id);
    const camp = campaigns.find((c) => c.id === id);
    if (camp) {
      setBrandName(camp.brandName);
      setTotalAmount(String(camp.amount));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(totalAmount);
    if (!brandName.trim()) {
      setError('Brand name is required.');
      return;
    }
    if (!num || num <= 0) {
      setError('Invoice total must be greater than ₹0.');
      return;
    }
    const camp = campaigns.find((c) => c.id === campaignId);
    onCreate({
      invoiceNumber: invoiceNumber.trim(),
      brandName: brandName.trim(),
      campaignId: campaignId || undefined,
      campaignName: camp?.name,
      issueDate,
      dueDate,
      totalAmount: num,
      paidAmount: 0,
      status: 'Pending',
      notes: notes.trim(),
      isDemo: false,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generate Brand Invoice"
      subtitle="Create a clean creator invoice linked to your Finance Hub."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Invoice Number</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Link Campaign (Optional)
            </label>
            <select
              value={campaignId}
              onChange={(e) => handleCampaignSelect(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              <option value="">Custom Invoice</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Minimalist"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Invoice Amount (INR)
            </label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="22000"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Issue Date</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#171923] mb-1">Payment Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
          />
        </div>
        <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium text-[#171923] hover:bg-[#F3F4F8]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5248F5]"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </Modal>
  );
};
