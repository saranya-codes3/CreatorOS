import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { computeFinanceSummary } from './src/utils/financeEngine.ts';
import type {
  AIStructuredCard,
  BudgetCategory,
  Campaign,
  CreatorProfile,
  ExpenseEntry,
  FinancialGoal,
  FinanceSummary,
  IncomeEntry,
  TimeframeOption,
} from './src/types/creatorOs.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

function formatInr(amount: number): string {
  const abs = Math.round(Math.abs(amount)).toLocaleString('en-IN');
  return `${amount < 0 ? '-' : ''}₹${abs}`;
}

function buildStructuredCardForQuery(params: {
  question: string;
  summary: FinanceSummary;
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  campaigns: Campaign[];
  goals: FinancialGoal[];
  profile: CreatorProfile;
}): AIStructuredCard {
  const q = params.question.toLowerCase();
  const { summary, incomes, expenses, campaigns, goals, profile } = params;

  if (q.includes('profit') || q.includes('best') || q.includes('most profitable') || q.includes('campaign') || q.includes('collab')) {
    const top3 = summary.campaignProfitability.slice(0, 4);
    const best = top3[0];
    return {
      title: best ? `Top Collaboration: ${best.campaignName}` : 'Campaign Profitability Ranking',
      badgeLabel: 'Actual Campaign Ledger',
      isEstimate: false,
      metrics: top3.slice(0, 4).map((c, idx) => ({
        label: `${idx + 1}. ${c.brandName}`,
        value: `${formatInr(c.profit)} (${c.marginPct}%)`,
        tone: idx === 0 ? 'positive' : 'neutral',
      })),
      chartTitle: 'Profit by Campaign (INR)',
      chartData: top3.map((c) => ({
        name: c.brandName,
        value: c.profit,
        secondary: c.expenses,
      })),
      dataNote: 'Profit = Agreed Campaign Revenue minus Expenses explicitly linked to that campaign.',
    };
  }

  if (q.includes('pending') || q.includes('overdue') || q.includes('owed') || q.includes('collect')) {
    const pendingItems = incomes.filter((i) => i.status === 'Pending' || i.status === 'Overdue');
    return {
      title: 'Pending & Overdue Receivables',
      badgeLabel: 'Actual Receivables',
      isEstimate: false,
      metrics: [
        { label: 'Total Pending', value: formatInr(summary.pendingPayments), tone: 'warning' },
        { label: 'Overdue Portion', value: formatInr(summary.overduePayments), tone: summary.overduePayments > 0 ? 'negative' : 'neutral' },
        { label: 'Already Received', value: formatInr(summary.receivedPayments), tone: 'positive' },
        { label: 'Collection Rate', value: `${summary.collectionRatePct}%`, tone: 'indigo' },
      ],
      chartTitle: 'Pending Items Breakdown (INR)',
      chartData:
        pendingItems.length > 0
          ? pendingItems.map((i) => ({ name: i.brand || i.source, value: i.amount }))
          : [{ name: 'Collected', value: summary.receivedPayments }],
      dataNote: `${pendingItems.length} unsettled income record(s) found in your active ledger.`,
    };
  }

  if (q.includes('spend') || q.includes('expense') || q.includes('cost') || q.includes('budget')) {
    const topCats = summary.expenseBreakdown.filter((e) => e.amount > 0).slice(0, 4);
    return {
      title: `${summary.periodLabel} Expense Breakdown`,
      badgeLabel: 'Actual Expense Ledger',
      isEstimate: false,
      metrics: [
        { label: 'Total Expenses', value: formatInr(summary.totalExpenses), tone: 'negative' },
        ...topCats.slice(0, 3).map((cat) => ({
          label: cat.category,
          value: `${formatInr(cat.amount)} (${cat.sharePct}%)`,
          tone: (cat.utilizationPct > 90 ? 'warning' : 'neutral') as 'warning' | 'neutral',
        })),
      ],
      chartTitle: 'Spending by Category (INR)',
      chartData: topCats.map((cat) => ({
        name: cat.category,
        value: cat.amount,
        secondary: cat.budgetLimit,
      })),
      dataNote: `Calculated from ${expenses.filter((e) => e.date.startsWith('2026-11')).length} recorded expense entries for ${summary.periodLabel}.`,
    };
  }

  if (q.includes('compare') || q.includes('last month') || q.includes('previous') || q.includes('growth') || q.includes('trend')) {
    const recentMonths = summary.monthlySeries.slice(-4);
    return {
      title: 'Month-over-Month Performance Comparison',
      badgeLabel: 'Actual Historical Data',
      isEstimate: false,
      metrics: [
        { label: `${summary.periodLabel} Revenue`, value: formatInr(summary.totalRevenue), tone: 'indigo' },
        {
          label: 'Revenue vs Last Month',
          value: summary.revenueChangePct !== null ? `${summary.revenueChangePct >= 0 ? '+' : ''}${summary.revenueChangePct}%` : 'Insufficient history',
          tone: (summary.revenueChangePct ?? 0) >= 0 ? 'positive' : 'negative',
        },
        {
          label: 'Expenses vs Last Month',
          value: summary.expenseChangePct !== null ? `${summary.expenseChangePct >= 0 ? '+' : ''}${summary.expenseChangePct}%` : 'Insufficient history',
          tone: 'neutral',
        },
        {
          label: 'Profit vs Last Month',
          value: summary.profitChangePct !== null ? `${summary.profitChangePct >= 0 ? '+' : ''}${summary.profitChangePct}%` : 'Insufficient history',
          tone: (summary.profitChangePct ?? 0) >= 0 ? 'positive' : 'negative',
        },
      ],
      chartTitle: 'Revenue vs Profit Trend (INR)',
      chartData: recentMonths.map((m) => ({
        name: m.label,
        value: m.revenue,
        secondary: m.profit,
      })),
      dataNote: 'Comparison uses recorded ledger entries across consecutive calendar months.',
    };
  }

  if (q.includes('goal') || q.includes('target') || q.includes('track')) {
    const monthlyGoal = profile.monthlyIncomeGoal || 100000;
    const progressPct = monthlyGoal > 0 ? Math.round((summary.totalRevenue / monthlyGoal) * 1000) / 10 : 0;
    const remaining = Math.max(0, monthlyGoal - summary.totalRevenue);
    const activePipeline = campaigns
      .filter((c) => c.status === 'Negotiation' || c.status === 'Confirmed' || c.status === 'In Progress')
      .reduce((s, c) => s + Math.max(0, c.amount - c.amountReceived), 0);

    return {
      title: 'Monthly Income & Business Goal Tracking',
      badgeLabel: 'Actual Progress + Pipeline Estimate',
      isEstimate: true,
      metrics: [
        { label: 'Monthly Target', value: formatInr(monthlyGoal), tone: 'neutral' },
        { label: 'Recorded So Far', value: formatInr(summary.totalRevenue), tone: 'indigo' },
        { label: 'Goal Completion', value: `${progressPct}%`, tone: progressPct >= 80 ? 'positive' : 'warning' },
        { label: 'Remaining Needed', value: formatInr(remaining), tone: remaining === 0 ? 'positive' : 'warning' },
        { label: 'Unbilled Pipeline (Est.)', value: formatInr(activePipeline), tone: 'neutral' },
      ],
      chartTitle: 'Financial Goals Progress (INR)',
      chartData: goals.slice(0, 4).map((g) => ({
        name: g.title.split(' ').slice(0, 2).join(' '),
        value: g.currentAmount,
        secondary: g.targetAmount,
      })),
      dataNote: 'Recorded revenue is actual; unbilled active campaign pipeline is an estimate.',
    };
  }

  // Default: Financial Summary Card
  return {
    title: `${summary.periodLabel} Financial Summary`,
    badgeLabel: 'Actual Ledger Data',
    isEstimate: false,
    metrics: [
      { label: 'Recorded Revenue', value: formatInr(summary.totalRevenue), tone: 'indigo' },
      { label: 'Received Revenue', value: formatInr(summary.receivedPayments), tone: 'positive' },
      { label: 'Pending Payments', value: formatInr(summary.pendingPayments), tone: 'warning' },
      { label: 'Recorded Expenses', value: formatInr(summary.totalExpenses), tone: 'negative' },
      { label: 'Net Operating Profit', value: formatInr(summary.netOperatingProfit), tone: 'positive' },
    ],
    chartTitle: 'Income Breakdown by Source (INR)',
    chartData: summary.sourceBreakdown.slice(0, 5).map((s) => ({
      name: s.source.replace('Brand Collaborations', 'Brand Collabs'),
      value: s.amount,
    })),
    dataNote: `Computed on server from ${incomes.length} total income entries and ${expenses.length} expense records.`,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'creator-os-api' });
  });

  app.post('/api/finance/summary', (req, res) => {
    try {
      const {
        incomes = [],
        expenses = [],
        campaigns = [],
        budgets = [],
        timeframe = '6m',
        selectedMonth = '2026-11',
      } = req.body as {
        incomes: IncomeEntry[];
        expenses: ExpenseEntry[];
        campaigns: Campaign[];
        budgets: BudgetCategory[];
        timeframe?: TimeframeOption;
        selectedMonth?: string;
      };

      const summary = computeFinanceSummary({
        incomes,
        expenses,
        campaigns,
        budgets,
        timeframe,
        selectedMonth,
      });

      res.json({ summary });
    } catch (err) {
      res.status(400).json({
        error: err instanceof Error ? err.message : 'Unable to compute financial summary.',
      });
    }
  });

  app.post('/api/ai/assistant', async (req, res) => {
    const {
      question,
      history = [],
      workspace,
      selectedMonth = '2026-11',
    } = req.body as {
      question: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
      workspace: {
        profile: CreatorProfile;
        incomes: IncomeEntry[];
        expenses: ExpenseEntry[];
        campaigns: Campaign[];
        budgets: BudgetCategory[];
        goals: FinancialGoal[];
        aiTone?: string;
      };
      selectedMonth?: string;
    };

    if (!question || typeof question !== 'string') {
      res.status(400).json({ error: 'A question string is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY is not configured in Settings > Secrets. Add your Gemini API key to enable live AI analysis.',
      });
      return;
    }

    try {
      const summary = computeFinanceSummary({
        incomes: workspace?.incomes || [],
        expenses: workspace?.expenses || [],
        campaigns: workspace?.campaigns || [],
        budgets: workspace?.budgets || [],
        timeframe: '6m',
        selectedMonth,
      });

      const structuredCard = buildStructuredCardForQuery({
        question,
        summary,
        incomes: workspace?.incomes || [],
        expenses: workspace?.expenses || [],
        campaigns: workspace?.campaigns || [],
        goals: workspace?.goals || [],
        profile: workspace?.profile,
      });

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const groundedContext = {
        creator: {
          name: workspace?.profile?.fullName,
          category: workspace?.profile?.category,
          location: workspace?.profile?.location,
          monthlyIncomeGoal: workspace?.profile?.monthlyIncomeGoal,
          savingsTarget: workspace?.profile?.savingsTarget,
        },
        activePeriodSummary: summary,
        pendingIncomeItems: (workspace?.incomes || [])
          .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
          .map((i) => ({ description: i.description, brand: i.brand, amount: i.amount, status: i.status, date: i.date })),
        goals: workspace?.goals || [],
        activeCampaignPipeline: (workspace?.campaigns || []).map((c) => ({
          name: c.name,
          brand: c.brandName,
          amount: c.amount,
          received: c.amountReceived,
          status: c.status,
          deadline: c.deadline,
        })),
      };

      const systemInstruction = [
        'You are the CREATOR OS Business Assistant for an independent content creator.',
        `Preferred tone: ${workspace?.aiTone || 'Concise Executive'}.`,
        'CRITICAL RULES:',
        '1. Use ONLY the verified numbers in the JSON context below. NEVER invent, guess, or extrapolate missing numbers.',
        '2. Clearly distinguish ACTUAL recorded figures from ESTIMATED or projected figures (like cash flow projections or unbilled pipeline).',
        '3. If the user asks about data that is not present in the context, state explicitly that insufficient data is available.',
        '4. Format currency in Indian Rupees (₹) using standard Indian grouping (e.g., ₹85,000).',
        '5. Keep your response concise (2–4 focused sentences or short bullet points) because a structured financial card is already rendered alongside your message.',
        '',
        'VERIFIED DATABASE CONTEXT (JSON):',
        JSON.stringify(groundedContext),
      ].join('\n');

      const recentHistory = history
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'Creator' : 'Assistant'}: ${m.content}`)
        .join('\n');

      const prompt = recentHistory
        ? `Previous conversation:\n${recentHistory}\n\nCreator question: ${question}`
        : question;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      const answer = response.text?.trim();
      if (!answer) {
        res.status(502).json({ error: 'The AI model returned an empty response. Please try again.' });
        return;
      }

      res.json({
        answer,
        structuredCard,
        summary,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate AI response.';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CREATOR OS server running on http://localhost:${PORT}`);
  });
}

startServer();
