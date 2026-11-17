import React from 'react';
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  Plus,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  FinanceSummary,
  HubRoute,
  TimeframeOption,
  WorkspaceState,
} from '../../types/creatorOs';
import { formatCurrency, formatDateShort, formatPct } from '../../utils/formatters';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface MainDashboardProps {
  workspace: WorkspaceState;
  summary: FinanceSummary;
  timeframe: TimeframeOption;
  onChangeTimeframe: (tf: TimeframeOption) => void;
  onNavigate: (route: HubRoute) => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
  onOpenCreateCampaign: () => void;
  onOpenCreateInvoice: () => void;
}

const DONUT_COLORS = ['#635BFF', '#159B69', '#2563EB', '#D97706', '#172554', '#9CA3AF'];

const TIMEFRAME_LABELS: Array<{ value: TimeframeOption; label: string }> = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
];

export const MainDashboard: React.FC<MainDashboardProps> = ({
  workspace,
  summary,
  timeframe,
  onChangeTimeframe,
  onNavigate,
  onOpenAddIncome,
  onOpenAddExpense,
  onOpenCreateCampaign,
  onOpenCreateInvoice,
}) => {
  const currency = workspace.settings.currency;
  const firstName = workspace.profile.fullName.split(' ')[0] || 'Creator';

  // Combined recent transactions sorted descending by date
  const recentTransactions = [
    ...workspace.incomes.map((i) => ({
      id: `inc-${i.id}`,
      description: i.description,
      category: i.source,
      date: i.date,
      amount: i.amount,
      type: 'income' as const,
      status: i.status,
    })),
    ...workspace.expenses.map((e) => ({
      id: `exp-${e.id}`,
      description: e.description,
      category: e.category,
      date: e.date,
      amount: -e.amount,
      type: 'expense' as const,
      status: 'Paid',
    })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 7);

  const activeCampaignsCount = workspace.campaigns.filter((c) =>
    ['Confirmed', 'In Progress', 'Awaiting Approval', 'Negotiation'].includes(c.status)
  ).length;
  const completedCampaignsCount = workspace.campaigns.filter((c) => c.status === 'Completed').length;
  const upcomingDeliverables = workspace.campaigns
    .flatMap((c) =>
      c.deliverables
        .filter((d) => !d.completed)
        .map((d) => ({ ...d, campaignName: c.name, brandName: c.brandName }))
    )
    .sort((a, b) => (a.deadline > b.deadline ? 1 : -1));
  const overdueInvoices = workspace.invoices.filter((inv) => inv.status === 'Overdue');

  return (
    <div className="space-y-6">
      {/* Header + Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554]">
              Good morning, {firstName}
            </h1>
            {workspace.profile.isDemoData && (
              <span className="text-xs font-medium text-[#697386]">
                · Sample Creator Workspace ({summary.periodLabel})
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-[#697386]">
            Here&apos;s how your creator business is performing. Recorded revenue vs actual cash
            settled.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddIncome}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#5248F5] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Income</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddExpense}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Expense</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateCampaign}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8] transition-colors whitespace-nowrap shrink-0"
          >
            <Briefcase className="h-3.5 w-3.5 text-[#697386]" />
            <span>Create Campaign</span>
          </button>
          <button
            type="button"
            onClick={onOpenCreateInvoice}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8] transition-colors whitespace-nowrap shrink-0"
          >
            <FileText className="h-3.5 w-3.5 text-[#697386]" />
            <span>Generate Invoice</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('assistant')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1e3170] transition-colors whitespace-nowrap shrink-0"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* 5 Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Total Revenue (Recorded)"
          value={formatCurrency(summary.totalRevenue, currency)}
          deltaLabel={
            summary.revenueChangePct !== null
              ? `${formatPct(summary.revenueChangePct)} vs last month`
              : summary.periodLabel
          }
          deltaTrend={
            summary.revenueChangePct === null
              ? 'neutral'
              : summary.revenueChangePct >= 0
                ? 'up'
                : 'down'
          }
          sublabel="Earned deals & payouts"
          tone="indigo"
          icon={<IndianRupee className="h-4 w-4" />}
        />
        <MetricCard
          label="Received Payments"
          value={formatCurrency(summary.receivedPayments, currency)}
          deltaLabel={`${summary.collectionRatePct}% collected`}
          deltaTrend="up"
          sublabel="Settled cash in bank"
          tone="positive"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <MetricCard
          label="Pending Payments"
          value={formatCurrency(summary.pendingPayments, currency)}
          deltaLabel={
            summary.overduePayments > 0
              ? `${formatCurrency(summary.overduePayments, currency)} overdue`
              : 'Awaiting settlement'
          }
          deltaTrend={summary.overduePayments > 0 ? 'down' : 'neutral'}
          sublabel="Receivables open"
          tone="warning"
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          label="Total Expenses"
          value={formatCurrency(summary.totalExpenses, currency)}
          deltaLabel={
            summary.expenseChangePct !== null
              ? `${formatPct(summary.expenseChangePct)} vs last month`
              : 'Operating costs'
          }
          deltaTrend={
            summary.expenseChangePct !== null && summary.expenseChangePct > 0 ? 'down' : 'neutral'
          }
          sublabel="Editing, gear & studio"
          tone="negative"
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <MetricCard
          label="Net Operating Profit"
          value={formatCurrency(summary.netOperatingProfit, currency)}
          deltaLabel={`${summary.profitMarginPct}% margin`}
          deltaTrend={summary.netOperatingProfit >= 0 ? 'up' : 'down'}
          sublabel="Revenue minus expenses"
          tone="positive"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Main Analytics Row: Revenue Overview Chart + Income Breakdown Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Revenue Analytics Chart */}
        <div className="lg:col-span-8 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#F3F4F8]">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Revenue Overview
              </h2>
              <p className="text-xs text-[#697386]">
                Monthly recorded revenue, expenses, and net operating profit
              </p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[#F3F4F8] p-1 self-start">
              {TIMEFRAME_LABELS.map((tf) => (
                <button
                  key={tf.value}
                  type="button"
                  onClick={() => onChangeTimeframe(tf.value)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    timeframe === tf.value
                      ? 'bg-white text-[#171923] shadow-sm'
                      : 'text-[#697386] hover:text-[#171923]'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-[#697386]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#635BFF]" />
              <span>Revenue</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#159B69]" />
              <span>Net Profit</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#DC2626]" />
              <span>Expenses</span>
            </span>
          </div>

          <div className="mt-4 h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.monthlySeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#159B69" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#159B69" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F8" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#697386', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#697386', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value ?? 0), currency),
                    name === 'revenue'
                      ? 'Revenue'
                      : name === 'profit'
                        ? 'Net Profit'
                        : 'Expenses',
                  ]}
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#635BFF"
                  strokeWidth={2.2}
                  fill="url(#revGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#159B69"
                  strokeWidth={2}
                  fill="url(#profGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#DC2626"
                  strokeWidth={1.8}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Breakdown Donut */}
        <div className="lg:col-span-4 rounded-xl border border-[#E5E7EB] bg-white p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Income Breakdown
            </h2>
            <p className="text-xs text-[#697386]">
              Distribution across revenue streams ({summary.periodLabel})
            </p>
          </div>

          {summary.sourceBreakdown.length > 0 ? (
            <>
              <div className="h-[190px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.sourceBreakdown}
                      dataKey="amount"
                      nameKey="source"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                    >
                      {summary.sourceBreakdown.map((entry, idx) => (
                        <Cell
                          key={entry.source}
                          fill={DONUT_COLORS[idx % DONUT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => formatCurrency(Number(val ?? 0), currency)}
                      contentStyle={{
                        borderRadius: '10px',
                        border: '1px solid #E5E7EB',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 space-y-2 border-t border-[#F3F4F8] pt-3">
                {summary.sourceBreakdown.map((item, idx) => (
                  <div
                    key={item.source}
                    className="flex items-center justify-between text-xs gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-sm shrink-0"
                        style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                      />
                      <span className="text-[#171923] truncate">{item.source}</span>
                    </div>
                    <div className="flex items-center gap-2.5 font-mono tabular-nums shrink-0">
                      <span className="text-[#697386]">{item.sharePct}%</span>
                      <span className="font-semibold text-[#171923]">
                        {formatCurrency(item.amount, currency)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-[#697386]">
              No income recorded for {summary.periodLabel}.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions + Collaboration Overview + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Transactions */}
        <div className="lg:col-span-7 rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Recent Transactions
              </h2>
              <p className="text-xs text-[#697386]">Latest recorded income and business expenses</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('finance')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#635BFF] hover:underline whitespace-nowrap shrink-0"
            >
              <span>Open Finance Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                  <th className="py-2.5 px-5">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAFAFC] transition-colors">
                    <td className="py-3 px-5 font-medium text-[#171923] max-w-[220px] truncate">
                      {tx.description}
                    </td>
                    <td className="py-3 px-3 text-[#697386] whitespace-nowrap">{tx.category}</td>
                    <td className="py-3 px-3 font-mono text-xs text-[#697386] whitespace-nowrap tabular-nums">
                      {formatDateShort(tx.date)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-mono font-semibold whitespace-nowrap tabular-nums ${
                        tx.amount >= 0 ? 'text-[#159B69]' : 'text-[#DC2626]'
                      }`}
                    >
                      {tx.amount >= 0 ? '+' : ''}
                      {formatCurrency(tx.amount, currency)}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Collaboration Overview + AI Business Insights */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Insights Card */}
          <div className="rounded-xl border border-[#635BFF]/25 bg-gradient-to-br from-[#F0EEFF]/75 via-white to-white p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#635BFF] text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h2 className="font-display text-base font-semibold text-[#172554]">
                  Your Business Insights
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('intelligence')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#635BFF] hover:underline whitespace-nowrap shrink-0"
              >
                <span>Explore Insights</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="mt-4 space-y-2.5">
              {summary.insights.map((ins) => (
                <li
                  key={ins.id}
                  className="rounded-lg border border-[#E5E7EB]/80 bg-white px-3.5 py-2.5 text-xs"
                >
                  <p className="font-semibold text-[#171923]">{ins.title}</p>
                  <p className="mt-0.5 text-[#697386] leading-relaxed">{ins.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Collaboration Overview */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Collaboration Overview
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('collaboration')}
                className="text-xs font-semibold text-[#635BFF] hover:underline whitespace-nowrap shrink-0"
              >
                Manage Deals
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 font-mono tabular-nums">
              <div className="rounded-lg bg-[#FAFAFC] border border-[#F3F4F8] p-3">
                <p className="font-sans text-[11px] text-[#697386]">Active Campaigns</p>
                <p className="mt-1 text-xl font-semibold text-[#172554]">{activeCampaignsCount}</p>
              </div>
              <div className="rounded-lg bg-[#FAFAFC] border border-[#F3F4F8] p-3">
                <p className="font-sans text-[11px] text-[#697386]">Completed Campaigns</p>
                <p className="mt-1 text-xl font-semibold text-[#159B69]">
                  {completedCampaignsCount}
                </p>
              </div>
              <div className="rounded-lg bg-[#FAFAFC] border border-[#F3F4F8] p-3">
                <p className="font-sans text-[11px] text-[#697386]">Upcoming Deliverables</p>
                <p className="mt-1 text-xl font-semibold text-[#635BFF]">
                  {upcomingDeliverables.length}
                </p>
              </div>
              <div className="rounded-lg bg-[#FAFAFC] border border-[#F3F4F8] p-3">
                <p className="font-sans text-[11px] text-[#697386]">Overdue Invoices</p>
                <p
                  className={`mt-1 text-xl font-semibold ${
                    overdueInvoices.length > 0 ? 'text-[#DC2626]' : 'text-[#159B69]'
                  }`}
                >
                  {overdueInvoices.length}
                </p>
              </div>
            </div>

            {upcomingDeliverables.length > 0 && (
              <div className="mt-4 border-t border-[#F3F4F8] pt-3">
                <p className="text-[11px] font-semibold text-[#697386] mb-2">
                  Next Deliverable Due
                </p>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="font-medium text-[#171923] truncate">
                      {upcomingDeliverables[0].title}
                    </p>
                    <p className="text-[#697386] truncate">
                      {upcomingDeliverables[0].brandName} · {upcomingDeliverables[0].platform}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-medium text-[#D97706] shrink-0">
                    {formatDateShort(upcomingDeliverables[0].deadline)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
