import type {
  BudgetCategory,
  Campaign,
  ExpenseCategory,
  ExpenseEntry,
  FinanceSummary,
  IncomeEntry,
  TimeframeOption,
} from '../types/creatorOs';

const CURRENT_MONTH = '2026-11';
const PREVIOUS_MONTH = '2026-10';

const MONTH_NAMES: Record<string, string> = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  return `${MONTH_NAMES[month] || month} ${year.slice(2)}`;
}

export function computeFinanceSummary(params: {
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  campaigns: Campaign[];
  budgets: BudgetCategory[];
  timeframe?: TimeframeOption;
  selectedMonth?: string;
}): FinanceSummary {
  const {
    incomes,
    expenses,
    campaigns,
    budgets,
    timeframe = '6m',
    selectedMonth = CURRENT_MONTH,
  } = params;

  const isAllYear = selectedMonth === '2026-ALL';
  const targetMonth = isAllYear ? CURRENT_MONTH : selectedMonth;

  // Determine records within active period for headline KPI cards
  const periodIncomes = isAllYear
    ? incomes
    : incomes.filter((i) => getMonthKey(i.date) === targetMonth);
  const periodExpenses = isAllYear
    ? expenses
    : expenses.filter((e) => getMonthKey(e.date) === targetMonth);

  const prevIncomes = isAllYear
    ? []
    : incomes.filter((i) => getMonthKey(i.date) === PREVIOUS_MONTH);
  const prevExpenses = isAllYear
    ? []
    : expenses.filter((e) => getMonthKey(e.date) === PREVIOUS_MONTH);

  const totalRevenue = periodIncomes.reduce((acc, i) => acc + i.amount, 0);
  const receivedPayments = periodIncomes
    .filter((i) => i.status === 'Received')
    .reduce((acc, i) => acc + i.amount, 0);
  const pendingPayments = periodIncomes
    .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((acc, i) => acc + i.amount, 0);
  const overduePayments = periodIncomes
    .filter((i) => i.status === 'Overdue')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalExpenses = periodExpenses.reduce((acc, e) => acc + e.amount, 0);
  const netOperatingProfit = totalRevenue - totalExpenses;
  const profitMarginPct = totalRevenue > 0 ? (netOperatingProfit / totalRevenue) * 100 : 0;
  const collectionRatePct = totalRevenue > 0 ? (receivedPayments / totalRevenue) * 100 : 0;

  const prevRevenue = prevIncomes.reduce((acc, i) => acc + i.amount, 0);
  const prevExpenseTotal = prevExpenses.reduce((acc, e) => acc + e.amount, 0);
  const prevProfit = prevRevenue - prevExpenseTotal;

  const revenueChangePct =
    !isAllYear && prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : null;
  const expenseChangePct =
    !isAllYear && prevExpenseTotal > 0 ? ((totalExpenses - prevExpenseTotal) / prevExpenseTotal) * 100 : null;
  const profitChangePct =
    !isAllYear && prevProfit !== 0 ? ((netOperatingProfit - prevProfit) / Math.abs(prevProfit)) * 100 : null;

  // Build monthly time series
  const allMonthKeys = Array.from(
    new Set([
      '2026-06',
      '2026-07',
      '2026-08',
      '2026-09',
      '2026-10',
      '2026-11',
      ...incomes.map((i) => getMonthKey(i.date)),
      ...expenses.map((e) => getMonthKey(e.date)),
    ])
  ).sort();

  const monthlyAll = allMonthKeys.map((mk) => {
    const mIncomes = incomes.filter((i) => getMonthKey(i.date) === mk);
    const mExpenses = expenses.filter((e) => getMonthKey(e.date) === mk);
    const rev = mIncomes.reduce((s, i) => s + i.amount, 0);
    const rec = mIncomes.filter((i) => i.status === 'Received').reduce((s, i) => s + i.amount, 0);
    const exp = mExpenses.reduce((s, e) => s + e.amount, 0);
    return {
      monthKey: mk,
      label: formatMonthLabel(mk),
      revenue: rev,
      received: rec,
      expenses: exp,
      profit: rev - exp,
    };
  });

  // Slice / bucket based on timeframe for Revenue Overview chart
  let monthlySeries = monthlyAll;
  if (timeframe === '7d') {
    // Show last 7 days granular buckets inside Nov 2026
    const dayBuckets = ['2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17'];
    monthlySeries = dayBuckets.map((day) => {
      const dInc = incomes.filter((i) => i.date === day).reduce((s, i) => s + i.amount, 0);
      const dRec = incomes.filter((i) => i.date === day && i.status === 'Received').reduce((s, i) => s + i.amount, 0);
      const dExp = expenses.filter((e) => e.date === day).reduce((s, e) => s + e.amount, 0);
      return {
        monthKey: day,
        label: day.slice(8) + ' Nov',
        revenue: dInc,
        received: dRec,
        expenses: dExp,
        profit: dInc - dExp,
      };
    });
  } else if (timeframe === '30d') {
    // Weekly breakdown for Nov 2026
    const weeks = [
      { label: 'Wk 1 (1-7 Nov)', start: '2026-11-01', end: '2026-11-07' },
      { label: 'Wk 2 (8-14 Nov)', start: '2026-11-08', end: '2026-11-14' },
      { label: 'Wk 3 (15-21 Nov)', start: '2026-11-15', end: '2026-11-21' },
      { label: 'Wk 4 (22-30 Nov)', start: '2026-11-22', end: '2026-11-30' },
    ];
    monthlySeries = weeks.map((w) => {
      const wInc = incomes.filter((i) => i.date >= w.start && i.date <= w.end).reduce((s, i) => s + i.amount, 0);
      const wRec = incomes.filter((i) => i.date >= w.start && i.date <= w.end && i.status === 'Received').reduce((s, i) => s + i.amount, 0);
      const wExp = expenses.filter((e) => e.date >= w.start && e.date <= w.end).reduce((s, e) => s + e.amount, 0);
      return {
        monthKey: w.start,
        label: w.label,
        revenue: wInc,
        received: wRec,
        expenses: wExp,
        profit: wInc - wExp,
      };
    });
  } else if (timeframe === '3m') {
    monthlySeries = monthlyAll.slice(-3);
  } else if (timeframe === '6m') {
    monthlySeries = monthlyAll.slice(-6);
  }

  // Income Source Breakdown
  const sourceTotals = new Map<string, number>();
  for (const inc of periodIncomes) {
    sourceTotals.set(inc.source, (sourceTotals.get(inc.source) || 0) + inc.amount);
  }
  const sourceBreakdown = Array.from(sourceTotals.entries())
    .map(([source, amount]) => ({
      source,
      amount,
      sharePct: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Platform Breakdown
  const platformTotals = new Map<string, number>();
  for (const inc of periodIncomes) {
    platformTotals.set(inc.platform, (platformTotals.get(inc.platform) || 0) + inc.amount);
  }
  const platformBreakdown = Array.from(platformTotals.entries())
    .map(([platform, amount]) => ({
      platform,
      amount,
      sharePct: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Expense Category Breakdown & Budget Utilization
  const allExpenseCats = Array.from(
    new Set([
      ...budgets.map((b) => b.category),
      ...periodExpenses.map((e) => e.category),
    ])
  ) as ExpenseCategory[];

  const expenseBreakdown = allExpenseCats
    .map((category) => {
      const amount = periodExpenses
        .filter((e) => e.category === category)
        .reduce((s, e) => s + e.amount, 0);
      const budgetLimit = budgets.find((b) => b.category === category)?.monthlyLimit || 0;
      const sharePct = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 1000) / 10 : 0;
      const utilizationPct = budgetLimit > 0 ? Math.round((amount / budgetLimit) * 100) : 0;
      return { category, amount, sharePct, budgetLimit, utilizationPct };
    })
    .filter((row) => row.amount > 0 || row.budgetLimit > 0)
    .sort((a, b) => b.amount - a.amount);

  // Campaign Profitability
  const campaignProfitability = campaigns
    .filter((c) => c.status !== 'Cancelled')
    .map((camp) => {
      const linkedExpenses = expenses
        .filter((e) => e.campaignId === camp.id)
        .reduce((s, e) => s + e.amount, 0);
      const profit = camp.amount - linkedExpenses;
      const marginPct = camp.amount > 0 ? Math.round((profit / camp.amount) * 1000) / 10 : 0;
      return {
        campaignId: camp.id,
        campaignName: camp.name,
        brandName: camp.brandName,
        revenue: camp.amount,
        expenses: linkedExpenses,
        profit,
        marginPct,
        status: camp.status,
      };
    })
    .sort((a, b) => b.profit - a.profit);

  // Cash Flow Statement (Actuals vs Estimates)
  const openingBalance = 142500;
  const actualReceived = receivedPayments;
  const actualPaid = totalExpenses;
  const expectedIncomingEstimate = pendingPayments;
  const upcomingExpensesEstimate = 4500; // Known scheduled recurring software/retainer estimates
  const projectedClosingEstimate =
    openingBalance + actualReceived - actualPaid + expectedIncomingEstimate - upcomingExpensesEstimate;

  // Dynamic Insights
  const topSource = sourceBreakdown[0];
  const pendingCount = periodIncomes.filter((i) => i.status === 'Pending' || i.status === 'Overdue').length;
  const topExpense = expenseBreakdown[0];
  const insights: FinanceSummary['insights'] = [];

  if (topSource) {
    insights.push({
      id: 'ins-source',
      title: `${topSource.source} drives ${topSource.sharePct}% of recorded income`,
      detail: `${topSource.source} generated ₹${topSource.amount.toLocaleString('en-IN')} out of ₹${totalRevenue.toLocaleString('en-IN')} recorded this period.`,
      tone: 'indigo',
    });
  }

  if (pendingPayments > 0) {
    insights.push({
      id: 'ins-pending',
      title: `${pendingCount} payment${pendingCount === 1 ? '' : 's'} worth ₹${pendingPayments.toLocaleString('en-IN')} still pending`,
      detail:
        overduePayments > 0
          ? `Includes ₹${overduePayments.toLocaleString('en-IN')} overdue. Follow up from Collaboration or Invoice Management.`
          : `Collecting these pending payouts will lift cash collection rate from ${Math.round(collectionRatePct)}% to 100%.`,
      tone: overduePayments > 0 ? 'danger' : 'warning',
    });
  } else {
    insights.push({
      id: 'ins-collected',
      title: '100% of recorded income collected',
      detail: 'All recorded invoices and payouts for this period have been settled.',
      tone: 'positive',
    });
  }

  if (topExpense) {
    insights.push({
      id: 'ins-expense',
      title: `${topExpense.category} is your largest expense (${topExpense.sharePct}%)`,
      detail:
        expenseChangePct !== null
          ? `Total expenses changed ${expenseChangePct >= 0 ? '+' : ''}${Math.round(expenseChangePct * 10) / 10}% compared to last month (₹${totalExpenses.toLocaleString('en-IN')} total).`
          : `You spent ₹${topExpense.amount.toLocaleString('en-IN')} on ${topExpense.category} this period.`,
      tone: topExpense.utilizationPct > 90 ? 'warning' : 'positive',
    });
  }

  return {
    periodLabel: isAllYear ? 'Full Year 2026' : formatMonthLabel(targetMonth),
    totalRevenue,
    receivedPayments,
    pendingPayments,
    overduePayments,
    totalExpenses,
    netOperatingProfit,
    profitMarginPct: Math.round(profitMarginPct * 10) / 10,
    collectionRatePct: Math.round(collectionRatePct * 10) / 10,
    revenueChangePct: revenueChangePct !== null ? Math.round(revenueChangePct * 10) / 10 : null,
    expenseChangePct: expenseChangePct !== null ? Math.round(expenseChangePct * 10) / 10 : null,
    profitChangePct: profitChangePct !== null ? Math.round(profitChangePct * 10) / 10 : null,
    monthlySeries,
    sourceBreakdown,
    platformBreakdown,
    expenseBreakdown,
    campaignProfitability,
    cashFlow: {
      openingBalance,
      actualReceived,
      actualPaid,
      expectedIncomingEstimate,
      upcomingExpensesEstimate,
      projectedClosingEstimate,
    },
    insights,
  };
}
