import React, { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Check,
  CreditCard,
  Download,
  Globe,
  Lock,
  RotateCcw,
  Trash2,
  User,
} from 'lucide-react';
import type {
  AppSettings,
  CurrencyCode,
  HubRoute,
  WorkspaceState,
} from '../../types/creatorOs';
import { downloadCsv } from '../../utils/formatters';
import { ConfirmDialog } from '../ui/Modal';

interface SettingsHubProps {
  workspace: WorkspaceState;
  onUpdateSettings: (next: AppSettings) => void;
  onUpdateAccount: (fullName: string, email: string) => void;
  onNavigate: (route: HubRoute) => void;
  onResetDemoData: () => void;
  onDeleteAccount: () => void;
  onNotify: (title: string, description?: string) => void;
}

export const SettingsHub: React.FC<SettingsHubProps> = ({
  workspace,
  onUpdateSettings,
  onUpdateAccount,
  onNavigate,
  onResetDemoData,
  onDeleteAccount,
  onNotify,
}) => {
  const [nameDraft, setNameDraft] = useState(workspace.profile.fullName);
  const [emailDraft, setEmailDraft] = useState(workspace.profile.email);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const s = workspace.settings;

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameDraft.trim() || !emailDraft.trim()) return;
    onUpdateAccount(nameDraft.trim(), emailDraft.trim());
    onNotify('Account updated', 'Your login name and contact email were saved.');
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'creator-os-workspace-export.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onNotify('Workspace exported', 'Downloaded full JSON backup.');
  };

  const handleExportLedgerCsv = () => {
    const headers = ['Type', 'Date', 'Description', 'Category', 'Amount (INR)'];
    const rows = [
      ...workspace.incomes.map((i) => ['Income', i.date, i.description, i.source, i.amount]),
      ...workspace.expenses.map((e) => ['Expense', e.date, e.description, e.category, -e.amount]),
    ];
    downloadCsv('creator-os-ledger-backup.csv', headers, rows);
    onNotify('CSV exported', 'Downloaded complete income and expense ledger.');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#172554]">Settings</h1>
        <p className="mt-1 text-sm text-[#697386]">
          Configure account preferences, currency display, notifications, AI tone, and data
          exports.
        </p>
      </div>

      {/* 1. Account Settings */}
      <form
        onSubmit={handleSaveAccount}
        className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-[#172554]">
          <User className="h-4 w-4 text-[#635BFF]" />
          <span>1. Account Settings</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Account Name</label>
            <input
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Email Address</label>
            <input
              type="email"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
          >
            Save Account
          </button>
        </div>
      </form>

      {/* 2 & 3. Creator Profile & Social Accounts Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-sm font-semibold text-[#172554]">
              2. Creator Profile
            </h2>
            <p className="mt-1 text-xs text-[#697386]">
              {workspace.profile.category} · {workspace.profile.location}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('creator')}
            className="mt-4 self-start text-xs font-semibold text-[#635BFF] hover:underline"
          >
            Edit Bio & Media Kit →
          </button>
        </div>
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-sm font-semibold text-[#172554]">
              3. Social Accounts
            </h2>
            <p className="mt-1 text-xs text-[#697386]">
              {workspace.profile.socials.length} connected platform(s) synced to Media Kit
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('creator')}
            className="mt-4 self-start text-xs font-semibold text-[#635BFF] hover:underline"
          >
            Manage Social Channels →
          </button>
        </div>
      </div>

      {/* 4. Notifications & 5. Currency Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
          <h2 className="font-display text-sm font-semibold text-[#172554]">4. Notifications</h2>
          {(
            [
              { key: 'emailNotifications', label: 'Weekly revenue summary emails' },
              { key: 'paymentAlerts', label: 'Overdue invoice & payment alerts' },
              { key: 'deliverableReminders', label: 'Upcoming deliverable reminders' },
            ] as const
          ).map((item) => (
            <label key={item.key} className="flex items-center justify-between text-xs cursor-pointer">
              <span className="text-[#171923]">{item.label}</span>
              <input
                type="checkbox"
                checked={s[item.key]}
                onChange={(e) => {
                  onUpdateSettings({ ...s, [item.key]: e.target.checked });
                  onNotify('Notification preference saved');
                }}
                className="h-4 w-4 rounded border-[#D1D5DB] text-[#635BFF]"
              />
            </label>
          ))}
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#172554]">
            <Globe className="h-4 w-4 text-[#635BFF]" />
            <span>5. Currency Preferences</span>
          </div>
          <p className="text-xs text-[#697386]">
            INR (₹) is the primary ledger currency. Switch display currency for international brand
            reviews.
          </p>
          <select
            aria-label="Preferred display currency"
            value={s.currency}
            onChange={(e) => {
              onUpdateSettings({ ...s, currency: e.target.value as CurrencyCode });
              onNotify('Display currency updated', `Figures now shown in ${e.target.value}.`);
            }}
            className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm"
          >
            <option value="INR">INR (₹) — Indian Rupee (Default)</option>
            <option value="USD">USD ($) — US Dollar</option>
            <option value="EUR">EUR (€) — Euro</option>
            <option value="GBP">GBP (£) — British Pound</option>
          </select>
        </div>
      </div>

      {/* 6. Privacy & Security + 7. AI Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#172554]">
            <Lock className="h-4 w-4 text-[#635BFF]" />
            <span>6. Privacy & Security</span>
          </div>
          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span className="text-[#171923]">Two-factor authentication (2FA)</span>
            <input
              type="checkbox"
              checked={s.twoFactorEnabled}
              onChange={(e) => onUpdateSettings({ ...s, twoFactorEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-[#D1D5DB] text-[#635BFF]"
            />
          </label>
          <label className="flex items-center justify-between text-xs cursor-pointer">
            <span className="text-[#171923]">Anonymized creator benchmark opt-in</span>
            <input
              type="checkbox"
              checked={s.dataSharingOptIn}
              onChange={(e) => onUpdateSettings({ ...s, dataSharingOptIn: e.target.checked })}
              className="h-4 w-4 rounded border-[#D1D5DB] text-[#635BFF]"
            />
          </label>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#172554]">
            <Bot className="h-4 w-4 text-[#635BFF]" />
            <span>7. AI Preferences</span>
          </div>
          <div>
            <label className="block text-xs text-[#697386] mb-1">Assistant Response Style</label>
            <select
              value={s.aiTone}
              onChange={(e) => {
                onUpdateSettings({
                  ...s,
                  aiTone: e.target.value as AppSettings['aiTone'],
                });
                onNotify('AI tone updated');
              }}
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm"
            >
              <option value="Concise Executive">Concise Executive</option>
              <option value="Detailed Analytical">Detailed Analytical</option>
              <option value="Strategic Coach">Strategic Coach</option>
            </select>
          </div>
        </div>
      </div>

      {/* 8. Subscription & Billing + 9. Data Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#172554]">
              <CreditCard className="h-4 w-4 text-[#635BFF]" />
              <span>8. Subscription & Billing</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded bg-[#D9FBEA] px-2 py-0.5 text-[11px] font-semibold text-[#0E744E]">
              <Check className="h-3 w-3" />
              {s.plan}
            </span>
          </div>
          <p className="text-xs text-[#697386]">
            Active Creator OS Pro workspace · Unlimited campaigns, invoices & AI financial queries.
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#172554]">
            <Download className="h-4 w-4 text-[#635BFF]" />
            <span>9. Data Export</span>
          </div>
          <p className="text-xs text-[#697386]">
            Download your entire creator database for accounting or backup.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportLedgerCsv}
              className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8]"
            >
              Export Ledger CSV
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8]"
            >
              Export Full JSON
            </button>
          </div>
        </div>
      </div>

      {/* 10. Workspace Reset & Delete Account */}
      <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2]/50 p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#991B1B]">
          <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
          <span>10. Workspace Reset & Delete Account</span>
        </div>
        <p className="text-xs text-[#697386]">
          Restore the default Aanya Sharma demo dataset or permanently clear your workspace data.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setResetDialogOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-4 py-2 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#DC2626] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B91C1C]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={onResetDemoData}
        title="Reset Demo Workspace"
        description="Restore all transactions, campaigns, invoices, and content items to the original Aanya Sharma sample dataset?"
        confirmLabel="Restore Demo Data"
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onDeleteAccount}
        title="Delete Account"
        description="This will clear your local CREATOR OS session and return you to the landing page."
        confirmLabel="Delete Account"
        destructive
      />
    </div>
  );
};
