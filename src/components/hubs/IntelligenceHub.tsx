import React, { useState } from 'react';
import { Award, Download, FileSpreadsheet, Info, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CurrencyCode, ExpenseEntry, FinanceSummary, IncomeEntry } from '../../types/creatorOs';
import { downloadCsv, formatCurrency, formatPct } from '../../utils/formatters';
import { MetricCard } from '../ui/MetricCard';
import { StatusBadge } from '../ui/StatusBadge';

interface IntelligenceHubProps {
  summary: FinanceSummary;
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  currency: CurrencyCode;
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
}

type IntelTab = 'overview' | 'profitability' | 'revenue' | 'expenses' | 'cashflow' | 'reports';

export const IntelligenceHub: React.FC<IntelligenceHubProps> = ({
  summary,
  incomes,
  expenses,
  currency,
  selectedMonth,
  onChangeMonth,
}) => {
  const [tab, setTab] = useState<IntelTab>('overview');
  const [reportScope, setReportScope] = useState<'all' | 'income' | 'expenses'>('all');

  const topCampaign = summary.campaignProfitability[0];

  const handleExportCsv = () => {
    const headers = ['Type', 'Date', 'Description', 'Category/Source', 'Brand/Vendor', 'Amount (INR)', 'Status'];
    const rows: Array<Array<string | number>> = [];

    if (reportScope === 'all' || reportScope === 'income') {
      incomes.forEach((i) => {
        rows.push(['Income', i.date, i.description, i.source, i.brand, i.amount, i.status]);
      });
    }
    if (reportScope === 'all' || reportScope === 'expenses') {
      expenses.forEach((e) => {
        rows.push(['Expense', e.date, e.description, e.category, e.vendor, -e.amount, 'Paid']);
      });
    }

    downloadCsv(`creator-os-report-${selectedMonth}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172554]">
            Intelligence Hub
          </h1>
          <p className="mt-1 text-sm text-[#697386]">
            Campaign profitability, source analytics, actual vs estimated cash flow, and exportable
            reports.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#171923] hover:bg-[#F3F4F8]"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-[#159B69]" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#1e3170]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="no-print flex items-center gap-1 overflow-x-auto border-b border-[#E5E7EB] pb-2">
        {(
          [
            { id: 'overview', label: 'Executive Overview' },
            { id: 'profitability', label: 'Campaign Profitability' },
            { id: 'revenue', label: 'Revenue Analysis' },
            { id: 'expenses', label: 'Expense Analysis' },
            { id: 'cashflow', label: 'Cash Flow' },
            { id: 'reports', label: 'Business Reports' },
          ] as Array<{ id: IntelTab; label: string }>
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 ${
              tab === t.id
                ? 'bg-[#F0EEFF] text-[#635BFF] font-semibold'
                : 'text-[#697386] hover:bg-[#F3F4F8]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Overview */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Operating Profit Margin"
              value={`${summary.profitMarginPct}%`}
              deltaLabel={formatPct(summary.profitChangePct)}
              deltaTrend={(summary.profitChangePct ?? 0) >= 0 ? 'up' : 'down'}
              tone="positive"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <MetricCard
              label="Cash Collection Rate"
              value={`${summary.collectionRatePct}%`}
              sublabel="Settled vs Recorded"
              tone="indigo"
            />
            <MetricCard
              label="Top Campaign Profit"
              value={topCampaign ? formatCurrency(topCampaign.profit, currency) : '—'}
              sublabel={topCampaign ? `${topCampaign.brandName} (${topCampaign.marginPct}%)` : undefined}
              tone="positive"
              icon={<Award className="h-4 w-4" />}
            />
            <MetricCard
              label="Top Revenue Stream"
              value={summary.sourceBreakdown[0]?.source || '—'}
              sublabel={
                summary.sourceBreakdown[0]
                  ? `${summary.sourceBreakdown[0].sharePct}% of total`
                  : undefined
              }
            />
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              6-Month Revenue, Expense & Operating Profit Trajectory
            </h2>
            <div className="mt-4 h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F8" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#697386', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: '#697386', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  />
                  <Tooltip formatter={(val) => formatCurrency(Number(val ?? 0), currency)} />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#635BFF" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="profit" name="Operating Profit" stroke="#159B69" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Profitability */}
      {tab === 'profitability' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Campaign Profitability Ranking
              </h2>
              <p className="text-xs text-[#697386]">
                Agreed campaign revenue minus directly linked shoot, editing, and equipment costs.
              </p>
            </div>
            {topCampaign && (
              <span className="text-xs font-semibold text-[#159B69]">
                Highest Profit: {topCampaign.campaignName} ({topCampaign.marginPct}%)
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                  <th className="py-3 px-6">Campaign</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3 text-right">Revenue</th>
                  <th className="py-3 px-3 text-right">Linked Expenses</th>
                  <th className="py-3 px-3 text-right">Net Profit</th>
                  <th className="py-3 px-3 text-right">Profit Margin</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                {summary.campaignProfitability.map((row, idx) => (
                  <tr
                    key={row.campaignId}
                    className={idx === 0 ? 'bg-[#D9FBEA]/25' : 'hover:bg-[#FAFAFC]'}
                  >
                    <td className="py-3.5 px-6 font-semibold text-[#171923]">
                      {row.campaignName}
                      {idx === 0 && (
                        <span className="ml-2 text-[11px] font-semibold text-[#159B69]">
                          · Most Profitable
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-[#697386]">{row.brandName}</td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums">
                      {formatCurrency(row.revenue, currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[#DC2626] tabular-nums">
                      {formatCurrency(row.expenses, currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#159B69] tabular-nums">
                      {formatCurrency(row.profit, currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-[#172554] tabular-nums">
                      {row.marginPct}%
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue Analysis */}
      {tab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Revenue by Source ({summary.periodLabel})
            </h2>
            <div className="mt-4 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.sourceBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F8" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="source" width={135} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(val) => formatCurrency(Number(val ?? 0), currency)} />
                  <Bar dataKey="amount" fill="#635BFF" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Revenue by Platform ({summary.periodLabel})
            </h2>
            <div className="mt-4 space-y-4">
              {summary.platformBreakdown.map((plat) => (
                <div key={plat.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#171923]">{plat.platform}</span>
                    <span className="font-mono font-semibold tabular-nums">
                      {formatCurrency(plat.amount, currency)} ({plat.sharePct}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-[#F3F4F8] overflow-hidden">
                    <div
                      className="h-full bg-[#172554]"
                      style={{ width: `${plat.sharePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expense Analysis */}
      {tab === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Spending by Category ({summary.periodLabel})
            </h2>
            <div className="mt-4 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.expenseBreakdown.filter((e) => e.amount > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F8" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => formatCurrency(Number(val ?? 0), currency)} />
                  <Bar dataKey="amount" name="Spent" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-3">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Highest Expense Categories & Budget Utilisation
            </h2>
            <div className="divide-y divide-[#F3F4F8]">
              {summary.expenseBreakdown
                .filter((e) => e.amount > 0)
                .map((row) => (
                  <div key={row.category} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-semibold text-[#171923]">{row.category}</p>
                      <p className="text-xs text-[#697386]">
                        {row.sharePct}% of spending · {row.utilizationPct}% of budget
                      </p>
                    </div>
                    <span className="font-mono font-semibold text-[#DC2626] tabular-nums">
                      {formatCurrency(row.amount, currency)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Statement (Actuals vs Clearly Labeled Estimates) */}
      {tab === 'cashflow' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Cash Flow Statement ({summary.periodLabel})
              </h2>
              <p className="text-xs text-[#697386]">
                Clearly separates settled bank movements from estimated upcoming inflows and outflows.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1D4ED8]">
              <Info className="h-3.5 w-3.5" />
              <span>Projected closing balance is an estimate</span>
            </span>
          </div>

          <div className="divide-y divide-[#F3F4F8] text-sm">
            {[
              {
                label: 'Opening Cash Balance',
                value: summary.cashFlow.openingBalance,
                tag: 'Actual',
                tone: 'text-[#171923]',
              },
              {
                label: 'Actual Money Received (Settled Income)',
                value: summary.cashFlow.actualReceived,
                tag: 'Actual',
                tone: 'text-[#159B69]',
                prefix: '+',
              },
              {
                label: 'Actual Money Paid (Recorded Expenses)',
                value: -summary.cashFlow.actualPaid,
                tag: 'Actual',
                tone: 'text-[#DC2626]',
              },
              {
                label: 'Expected Incoming Payments (Pending Receivables)',
                value: summary.cashFlow.expectedIncomingEstimate,
                tag: 'Estimate',
                tone: 'text-[#D97706]',
                prefix: '+',
              },
              {
                label: 'Known Upcoming Recurring Expenses',
                value: -summary.cashFlow.upcomingExpensesEstimate,
                tag: 'Estimate',
                tone: 'text-[#DC2626]',
              },
              {
                label: 'Projected Closing Cash Balance',
                value: summary.cashFlow.projectedClosingEstimate,
                tag: 'Estimate',
                tone: 'text-[#172554] text-base font-bold',
              },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3.5 gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-medium text-[#171923]">{row.label}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                      row.tag === 'Actual'
                        ? 'bg-[#D9FBEA] text-[#0E744E]'
                        : 'bg-[#FFFBEB] text-[#B45309]'
                    }`}
                  >
                    {row.tag}
                  </span>
                </div>
                <span className={`font-mono font-semibold tabular-nums ${row.tone}`}>
                  {row.prefix && row.value > 0 ? row.prefix : ''}
                  {formatCurrency(row.value, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Reports */}
      {tab === 'reports' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
          <h2 className="font-display text-base font-semibold text-[#171923]">
            Export Financial & Business Reports
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Reporting Period
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => onChangeMonth(e.target.value)}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm"
              >
                <option value="2026-11">November 2026</option>
                <option value="2026-10">October 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-ALL">Full Year 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Data Scope</label>
              <select
                value={reportScope}
                onChange={(e) => setReportScope(e.target.value as 'all' | 'income' | 'expenses')}
                className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm"
              >
                <option value="all">Full Ledger (Income + Expenses)</option>
                <option value="income">Income Only</option>
                <option value="expenses">Expenses Only</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex-1 rounded-lg bg-[#635BFF] py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 rounded-lg bg-[#172554] py-2 text-xs font-semibold text-white hover:bg-[#1e3170]"
              >
                Print PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
