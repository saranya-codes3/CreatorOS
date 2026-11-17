import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Edit3,
  Eye,
  Plus,
  Search,
  Target,
  Trash2,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  BudgetCategory,
  CurrencyCode,
  ExpenseCategory,
  ExpenseEntry,
  FinanceSummary,
  FinancialGoal,
  IncomeEntry,
  Invoice,
} from '../../types/creatorOs';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import { MetricCard } from '../ui/MetricCard';
import { ConfirmDialog, Modal } from '../ui/Modal';
import { EmptyState } from '../ui/StateViews';
import { StatusBadge } from '../ui/StatusBadge';

interface FinanceHubProps {
  summary: FinanceSummary;
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  invoices: Invoice[];
  budgets: BudgetCategory[];
  goals: FinancialGoal[];
  currency: CurrencyCode;
  creatorName: string;
  creatorEmail: string;
  onOpenAddIncome: (edit?: IncomeEntry) => void;
  onDeleteIncome: (id: string) => void;
  onMarkIncomeReceived: (id: string) => void;
  onOpenAddExpense: (edit?: ExpenseEntry) => void;
  onDeleteExpense: (id: string) => void;
  onOpenCreateInvoice: () => void;
  onRecordInvoicePayment: (invoiceId: string, amount: number) => void;
  onUpdateBudget: (category: ExpenseCategory, limit: number) => void;
  onAddGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  onContributeGoal: (goalId: string, amount: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

type FinanceTab = 'overview' | 'income' | 'expenses' | 'invoices' | 'budgets' | 'goals';

export const FinanceHub: React.FC<FinanceHubProps> = ({
  summary,
  incomes,
  expenses,
  invoices,
  budgets,
  goals,
  currency,
  creatorName,
  creatorEmail,
  onOpenAddIncome,
  onDeleteIncome,
  onMarkIncomeReceived,
  onOpenAddExpense,
  onDeleteExpense,
  onOpenCreateInvoice,
  onRecordInvoicePayment,
  onUpdateBudget,
  onAddGoal,
  onContributeGoal,
  onDeleteGoal,
}) => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const [incomeSearch, setIncomeSearch] = useState('');
  const [incomeSourceFilter, setIncomeSourceFilter] = useState('All');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');

  // View Invoice & Record Payment Modals
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [payAmountInput, setPayAmountInput] = useState('');

  // Confirm Deletes
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'income' | 'expense' | 'goal';
    id: string;
    label: string;
  } | null>(null);

  // Add Goal Modal
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalDraft, setGoalDraft] = useState({
    title: '',
    type: 'Savings Goal' as FinancialGoal['type'],
    targetAmount: '100000',
    currentAmount: '0',
    targetDate: '2027-03-31',
  });

  // Budget editing
  const [editingBudget, setEditingBudget] = useState<ExpenseCategory | null>(null);
  const [budgetLimitDraft, setBudgetLimitDraft] = useState('');

  const filteredIncomes = useMemo(() => {
    return incomes
      .filter((i) => {
        if (incomeSourceFilter !== 'All' && i.source !== incomeSourceFilter) return false;
        const q = incomeSearch.trim().toLowerCase();
        if (q && !i.description.toLowerCase().includes(q) && !i.brand.toLowerCase().includes(q)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [incomes, incomeSourceFilter, incomeSearch]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => expenseCategoryFilter === 'All' || e.category === expenseCategoryFilter)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [expenses, expenseCategoryFilter]);

  const totalBudget = budgets.reduce((s, b) => s + b.monthlyLimit, 0);
  const remainingBudget = totalBudget - summary.totalExpenses;

  const handleGoalCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalDraft.title.trim()) return;
    onAddGoal({
      title: goalDraft.title.trim(),
      type: goalDraft.type,
      targetAmount: Number(goalDraft.targetAmount) || 50000,
      currentAmount: Number(goalDraft.currentAmount) || 0,
      targetDate: goalDraft.targetDate,
    });
    setGoalModalOpen(false);
    setGoalDraft({
      title: '',
      type: 'Savings Goal',
      targetAmount: '100000',
      currentAmount: '0',
      targetDate: '2027-03-31',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172554]">
            Finance Hub
          </h1>
          <p className="mt-1 text-sm text-[#697386]">
            Income ledger, expenses, invoices, monthly budgets, and financial targets ({summary.periodLabel}).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenAddIncome()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Income</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAddExpense()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1e3170]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="no-print flex items-center gap-1 overflow-x-auto border-b border-[#E5E7EB] pb-2">
        {(
          [
            { id: 'overview', label: 'Finance Overview' },
            { id: 'income', label: `Income (${incomes.length})` },
            { id: 'expenses', label: `Expenses (${expenses.length})` },
            { id: 'invoices', label: `Invoices (${invoices.length})` },
            { id: 'budgets', label: 'Budgets' },
            { id: 'goals', label: 'Financial Goals' },
          ] as Array<{ id: FinanceTab; label: string }>
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

      {/* A. Finance Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              label="Total Income"
              value={formatCurrency(summary.totalRevenue, currency)}
              tone="indigo"
              sublabel={summary.periodLabel}
            />
            <MetricCard
              label="Received Income"
              value={formatCurrency(summary.receivedPayments, currency)}
              tone="positive"
              sublabel={`${summary.collectionRatePct}% settled`}
            />
            <MetricCard
              label="Pending Income"
              value={formatCurrency(summary.pendingPayments, currency)}
              tone="warning"
              sublabel="Open receivables"
            />
            <MetricCard
              label="Total Expenses"
              value={formatCurrency(summary.totalExpenses, currency)}
              tone="negative"
              sublabel="Recorded costs"
            />
            <MetricCard
              label="Net Operating Profit"
              value={formatCurrency(summary.netOperatingProfit, currency)}
              tone="positive"
              sublabel={`${summary.profitMarginPct}% margin`}
            />
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-base font-semibold text-[#171923]">
                  Monthly Financial Comparison
                </h2>
                <p className="text-xs text-[#697386]">
                  Revenue vs Expenses vs Net Operating Profit across the last 6 months
                </p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F8" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#697386', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#697386', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  />
                  <Tooltip formatter={(val) => formatCurrency(Number(val ?? 0), currency)} />
                  <Bar dataKey="revenue" name="Revenue" fill="#635BFF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="#159B69" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* B. Income Management */}
      {activeTab === 'income' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={incomeSearch}
                  onChange={(e) => setIncomeSearch(e.target.value)}
                  placeholder="Search income or brand..."
                  className="rounded-lg border border-[#E5E7EB] py-1.5 pl-8 pr-3 text-xs w-56"
                />
              </div>
              <select
                value={incomeSourceFilter}
                onChange={(e) => setIncomeSourceFilter(e.target.value)}
                className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium"
              >
                <option value="All">All Revenue Sources</option>
                {[
                  'Brand Collaborations',
                  'YouTube',
                  'Affiliate Marketing',
                  'Freelancing',
                  'Digital Products',
                  'Sponsorships',
                  'Other',
                ].map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => onOpenAddIncome()}
              className="rounded-lg bg-[#635BFF] px-3.5 py-1.5 text-xs font-semibold text-white"
            >
              + Add Income
            </button>
          </div>

          {filteredIncomes.length === 0 ? (
            <EmptyState
              title="No income entries found"
              description="Log your first brand deal, AdSense payout, or affiliate commission."
              actionLabel="Add Income"
              onAction={() => onOpenAddIncome()}
            />
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                      <th className="py-3 px-5">Income Description</th>
                      <th className="py-3 px-3">Revenue Source</th>
                      <th className="py-3 px-3">Associated Brand</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3 text-right">Status</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                    {filteredIncomes.map((inc) => (
                      <tr key={inc.id} className="hover:bg-[#FAFAFC]">
                        <td className="py-3 px-5 font-medium text-[#171923]">{inc.description}</td>
                        <td className="py-3 px-3 text-[#697386]">{inc.source}</td>
                        <td className="py-3 px-3 text-[#697386]">{inc.brand}</td>
                        <td className="py-3 px-3 font-mono text-xs text-[#697386] tabular-nums">
                          {formatDateShort(inc.date)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-[#159B69] tabular-nums">
                          {formatCurrency(inc.amount, currency)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <StatusBadge status={inc.status} />
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            {inc.status !== 'Received' && (
                              <button
                                type="button"
                                onClick={() => onMarkIncomeReceived(inc.id)}
                                className="text-[11px] font-semibold text-[#159B69] hover:underline whitespace-nowrap"
                              >
                                Mark Received
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => onOpenAddIncome(inc)}
                              aria-label="Edit income"
                              className="text-[#697386] hover:text-[#171923]"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'income',
                                  id: inc.id,
                                  label: inc.description,
                                })
                              }
                              aria-label="Delete income"
                              className="text-[#9CA3AF] hover:text-[#DC2626]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* C. Expense Management */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                'All',
                'Equipment',
                'Editing',
                'Software',
                'Travel',
                'Production',
                'Marketing',
                'Internet',
                'Outsourcing',
                'Other',
              ].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setExpenseCategoryFilter(cat)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    expenseCategoryFilter === cat
                      ? 'bg-[#172554] text-white'
                      : 'bg-[#F3F4F8] text-[#697386] hover:text-[#171923]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onOpenAddExpense()}
              className="rounded-lg bg-[#635BFF] px-3.5 py-1.5 text-xs font-semibold text-white shrink-0"
            >
              + Add Expense
            </button>
          </div>

          {filteredExpenses.length === 0 ? (
            <EmptyState
              title="No expenses in this category"
              description="Track editing, equipment, travel, and production costs for accurate profit margins."
              actionLabel="Add Expense"
              onAction={() => onOpenAddExpense()}
            />
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                      <th className="py-3 px-5">Expense Description</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Vendor</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-[#FAFAFC]">
                        <td className="py-3 px-5 font-medium text-[#171923]">{exp.description}</td>
                        <td className="py-3 px-3 text-[#697386]">{exp.category}</td>
                        <td className="py-3 px-3 text-[#697386]">{exp.vendor}</td>
                        <td className="py-3 px-3 font-mono text-xs text-[#697386] tabular-nums">
                          {formatDateShort(exp.date)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-[#DC2626] tabular-nums">
                          -{formatCurrency(exp.amount, currency)}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onOpenAddExpense(exp)}
                              aria-label="Edit expense"
                              className="text-[#697386] hover:text-[#171923]"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setDeleteTarget({
                                  type: 'expense',
                                  id: exp.id,
                                  label: exp.description,
                                })
                              }
                              aria-label="Delete expense"
                              className="text-[#9CA3AF] hover:text-[#DC2626]"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* D. Invoice Management */}
      {activeTab === 'invoices' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">Brand Invoices</h2>
              <p className="text-xs text-[#697386]">
                View, download PDF invoices, and record partial or full settlements.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenCreateInvoice}
              className="rounded-lg bg-[#635BFF] px-3.5 py-2 text-xs font-semibold text-white"
            >
              + Create Invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                  <th className="py-3 px-5">Invoice #</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3">Issue / Due</th>
                  <th className="py-3 px-3 text-right">Total</th>
                  <th className="py-3 px-3 text-right">Paid</th>
                  <th className="py-3 px-3 text-right">Outstanding</th>
                  <th className="py-3 px-3 text-right">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                {invoices.map((inv) => {
                  const outstanding = Math.max(0, inv.totalAmount - inv.paidAmount);
                  return (
                    <tr key={inv.id} className="hover:bg-[#FAFAFC]">
                      <td className="py-3 px-5 font-mono font-semibold text-[#172554]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3 font-medium text-[#171923]">{inv.brandName}</td>
                      <td className="py-3 px-3 font-mono text-xs text-[#697386] tabular-nums">
                        {formatDateShort(inv.issueDate)} → {formatDateShort(inv.dueDate)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        {formatCurrency(inv.totalAmount, currency)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[#159B69] tabular-nums">
                        {formatCurrency(inv.paidAmount, currency)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-semibold tabular-nums ${
                          outstanding > 0 ? 'text-[#D97706]' : 'text-[#159B69]'
                        }`}
                      >
                        {formatCurrency(outstanding, currency)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="inline-flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setViewingInvoice(inv)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#635BFF] hover:underline"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View</span>
                          </button>
                          {outstanding > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPayingInvoice(inv);
                                setPayAmountInput(String(outstanding));
                              }}
                              className="text-xs font-semibold text-[#159B69] hover:underline whitespace-nowrap"
                            >
                              Record Payment
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* E. Budget Management */}
      {activeTab === 'budgets' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
              label="Monthly Budget Cap"
              value={formatCurrency(totalBudget, currency)}
              tone="indigo"
            />
            <MetricCard
              label="Total Spending"
              value={formatCurrency(summary.totalExpenses, currency)}
              tone="negative"
              sublabel={`${totalBudget > 0 ? Math.round((summary.totalExpenses / totalBudget) * 100) : 0}% utilised`}
            />
            <MetricCard
              label="Remaining Budget"
              value={formatCurrency(remainingBudget, currency)}
              tone={remainingBudget >= 0 ? 'positive' : 'negative'}
            />
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Category-wise Budget Utilisation
            </h2>
            <div className="space-y-4">
              {summary.expenseBreakdown
                .filter((row) => row.budgetLimit > 0 || row.amount > 0)
                .map((row) => {
                  const pct = Math.min(100, row.utilizationPct);
                  const isHigh = row.utilizationPct >= 85;
                  const isOver = row.utilizationPct > 100;

                  return (
                    <div key={row.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[#171923]">{row.category}</span>
                          {isOver ? (
                            <span className="inline-flex items-center gap-1 text-[#DC2626] font-medium">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Over budget
                            </span>
                          ) : isHigh ? (
                            <span className="inline-flex items-center gap-1 text-[#D97706] font-medium">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              Near limit
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-3 font-mono tabular-nums">
                          <span>
                            {formatCurrency(row.amount, currency)} /{' '}
                            {formatCurrency(row.budgetLimit, currency)}
                          </span>
                          {editingBudget === row.category ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                onUpdateBudget(row.category, Number(budgetLimitDraft) || 0);
                                setEditingBudget(null);
                              }}
                              className="inline-flex items-center gap-1"
                            >
                              <input
                                type="number"
                                value={budgetLimitDraft}
                                onChange={(e) => setBudgetLimitDraft(e.target.value)}
                                className="w-20 rounded border border-[#D1D5DB] px-2 py-0.5 text-xs"
                              />
                              <button
                                type="submit"
                                className="text-[11px] font-semibold text-[#635BFF]"
                              >
                                Save
                              </button>
                            </form>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBudget(row.category);
                                setBudgetLimitDraft(String(row.budgetLimit));
                              }}
                              className="font-sans text-[11px] font-medium text-[#635BFF] hover:underline"
                            >
                              Edit Limit
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#F3F4F8] overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isOver
                              ? 'bg-[#DC2626]'
                              : isHigh
                                ? 'bg-[#D97706]'
                                : 'bg-[#635BFF]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* F. Financial Goals */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Active Creator Financial Goals
            </h2>
            <button
              type="button"
              onClick={() => setGoalModalOpen(true)}
              className="rounded-lg bg-[#635BFF] px-3.5 py-2 text-xs font-semibold text-white"
            >
              + New Goal
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((g) => {
              const pct =
                g.targetAmount > 0
                  ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
                  : 0;
              return (
                <div key={g.id} className="rounded-xl border border-[#E5E7EB] bg-white p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-medium text-[#635BFF]">{g.type}</span>
                      <h3 className="mt-0.5 font-display text-base font-bold text-[#171923]">
                        {g.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ type: 'goal', id: g.id, label: g.title })
                      }
                      aria-label="Delete goal"
                      className="text-[#9CA3AF] hover:text-[#DC2626]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between font-mono text-sm tabular-nums">
                    <span className="font-bold text-[#172554]">
                      {formatCurrency(g.currentAmount, currency)}{' '}
                      <span className="font-normal text-xs text-[#697386]">
                        of {formatCurrency(g.targetAmount, currency)}
                      </span>
                    </span>
                    <span className="font-semibold text-[#159B69]">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-[#F3F4F8] overflow-hidden">
                    <div className="h-full bg-[#159B69]" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs text-[#697386]">
                    <span>Target: {formatDateShort(g.targetDate)}</span>
                    <button
                      type="button"
                      onClick={() => onContributeGoal(g.id, 5000)}
                      className="inline-flex items-center gap-1 font-semibold text-[#635BFF] hover:underline"
                    >
                      <Target className="h-3.5 w-3.5" />
                      <span>+ Add ₹5,000</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View & Download PDF Invoice Modal */}
      <Modal
        open={Boolean(viewingInvoice)}
        onClose={() => setViewingInvoice(null)}
        title={viewingInvoice ? `Invoice ${viewingInvoice.invoiceNumber}` : 'Invoice'}
        size="lg"
      >
        {viewingInvoice && (
          <div className="space-y-6">
            <div className="rounded-xl border border-[#E5E7EB] p-6 space-y-5 bg-white">
              <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-4">
                <div>
                  <p className="font-display text-lg font-bold text-[#172554]">{creatorName}</p>
                  <p className="text-xs text-[#697386]">{creatorEmail}</p>
                </div>
                <div className="text-right font-mono">
                  <p className="text-sm font-bold text-[#171923]">{viewingInvoice.invoiceNumber}</p>
                  <StatusBadge status={viewingInvoice.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[#697386]">Billed To</p>
                  <p className="mt-1 text-sm font-semibold text-[#171923]">
                    {viewingInvoice.brandName}
                  </p>
                  {viewingInvoice.campaignName && (
                    <p className="text-[#697386]">{viewingInvoice.campaignName}</p>
                  )}
                </div>
                <div className="text-right font-mono tabular-nums">
                  <p className="text-[#697386]">
                    Issued: {formatDateShort(viewingInvoice.issueDate)}
                  </p>
                  <p className="text-[#697386]">Due: {formatDateShort(viewingInvoice.dueDate)}</p>
                </div>
              </div>
              <div className="border-t border-[#E5E7EB] pt-4 flex items-center justify-between font-mono tabular-nums">
                <span className="font-sans text-sm font-medium text-[#171923]">
                  Total Invoice Amount
                </span>
                <span className="text-xl font-bold text-[#172554]">
                  {formatCurrency(viewingInvoice.totalAmount, currency)}
                </span>
              </div>
              {viewingInvoice.notes && (
                <p className="text-xs text-[#697386] border-t border-[#F3F4F8] pt-3">
                  Note: {viewingInvoice.notes}
                </p>
              )}
            </div>
            <div className="no-print flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#172554] px-4 py-2 text-xs font-semibold text-white"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Record Invoice Payment Modal */}
      <Modal
        open={Boolean(payingInvoice)}
        onClose={() => setPayingInvoice(null)}
        title={`Record Payment · ${payingInvoice?.invoiceNumber}`}
        size="sm"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!payingInvoice) return;
            const amt = Number(payAmountInput);
            if (amt > 0) {
              onRecordInvoicePayment(payingInvoice.id, amt);
              setPayingInvoice(null);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Payment Amount (INR)
            </label>
            <input
              type="number"
              value={payAmountInput}
              onChange={(e) => setPayAmountInput(e.target.value)}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPayingInvoice(null)}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#159B69] px-4 py-2 text-xs font-semibold text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Record Settlement</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Financial Goal Modal */}
      <Modal
        open={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        title="Create Financial Goal"
        size="sm"
      >
        <form onSubmit={handleGoalCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Goal Title</label>
            <input
              type="text"
              value={goalDraft.title}
              onChange={(e) => setGoalDraft({ ...goalDraft, title: e.target.value })}
              placeholder="e.g. MacBook Pro M4 Studio Upgrade"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Category</label>
            <select
              value={goalDraft.type}
              onChange={(e) =>
                setGoalDraft({ ...goalDraft, type: e.target.value as FinancialGoal['type'] })
              }
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
            >
              <option value="Monthly Income Target">Monthly Income Target</option>
              <option value="Savings Goal">Savings Goal</option>
              <option value="Equipment Purchase">Equipment Purchase</option>
              <option value="Business Investment">Business Investment</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Target Amount (INR)
              </label>
              <input
                type="number"
                value={goalDraft.targetAmount}
                onChange={(e) => setGoalDraft({ ...goalDraft, targetAmount: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Saved So Far (INR)
              </label>
              <input
                type="number"
                value={goalDraft.currentAmount}
                onChange={(e) => setGoalDraft({ ...goalDraft, currentAmount: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Target Date</label>
            <input
              type="date"
              value={goalDraft.targetDate}
              onChange={(e) => setGoalDraft({ ...goalDraft, targetDate: e.target.value })}
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setGoalModalOpen(false)}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white"
            >
              Save Goal
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === 'income') onDeleteIncome(deleteTarget.id);
          if (deleteTarget.type === 'expense') onDeleteExpense(deleteTarget.id);
          if (deleteTarget.type === 'goal') onDeleteGoal(deleteTarget.id);
        }}
        title="Confirm Deletion"
        description={`Delete "${deleteTarget?.label}"? This will immediately recalculate your financial metrics.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
};
