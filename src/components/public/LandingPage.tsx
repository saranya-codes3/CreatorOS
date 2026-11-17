import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  IndianRupee,
  Layers,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onExploreDashboard: () => void;
}

const FAQS = [
  {
    q: 'How is CREATOR OS different from regular accounting software?',
    a: 'Traditional accounting tools are built for inventory businesses and GST filings. CREATOR OS connects your creator profile, content calendar, brand deliverables, invoices, and campaign-level profitability in one place built around brand deals, AdSense, and affiliate payouts.',
  },
  {
    q: 'Does CREATOR OS separate recorded revenue from actual cash received?',
    a: 'Yes. Every dashboard and report distinguishes Recorded Revenue (invoiced or earned deals) from Received Payments (money settled in your bank) and Pending/Overdue receivables so you always know your true cash position.',
  },
  {
    q: 'Can I manage my Media Kit and Content Calendar inside the same workspace?',
    a: 'Yes. Your Creator Hub compiles your live audience metrics and portfolio into a print-ready PDF Media Kit, while the Content Hub links planned Reels and YouTube videos directly to brand campaigns and deliverables.',
  },
  {
    q: 'How does the AI Business Assistant avoid making up numbers?',
    a: 'All financial calculations run through server-side ledger logic before the assistant writes its summary. Every structured card reports verified figures from your database and explicitly flags any cash flow projections as estimates.',
  },
  {
    q: 'Is INR the default currency, and can I work with international brands?',
    a: 'INR (₹) is configured as the primary currency with Indian numbering format (₹85,000), and you can switch display preferences to USD, EUR, or GBP in Settings at any time.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onExploreDashboard,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#171923]">
      {/* Top Navigation Bar — strict 3-zone contract */}
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-8 px-6 py-3.5">
          <a href="#top" className="whitespace-nowrap shrink-0">
            <BrandLogo />
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#697386]">
            <a
              href="#modules"
              className="hover:text-[#171923] transition-colors whitespace-nowrap shrink-0"
            >
              Modules
            </a>
            <a
              href="#finance-showcase"
              className="hover:text-[#171923] transition-colors whitespace-nowrap shrink-0"
            >
              Finance
            </a>
            <a
              href="#ai-assistant"
              className="hover:text-[#171923] transition-colors whitespace-nowrap shrink-0"
            >
              Assistant
            </a>
            <a
              href="#faq"
              className="hover:text-[#171923] transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onLogin}
              className="hidden sm:inline-flex rounded-lg px-3.5 py-2 text-sm font-medium text-[#171923] hover:bg-[#F3F4F8] transition-colors whitespace-nowrap shrink-0"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5248F5] transition-colors whitespace-nowrap shrink-0"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* 1. Hero Section */}
      <section id="top" className="mx-auto max-w-[1240px] px-6 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-medium text-[#635BFF]">
            Business & Financial Operating System for Independent Creators
          </p>
          <h1
            className="mt-4 font-display text-[36px] sm:text-[48px] md:text-[56px] font-bold tracking-tight text-[#172554] leading-[1.08]"
            style={{ textWrap: 'balance' }}
          >
            Your Creator Business Deserves an Operating System.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-[#697386] leading-relaxed">
            Manage collaborations, track every rupee, understand your profits and grow your creator
            business — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5248F5] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExploreDashboard}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D1D5DB] bg-white px-5 py-3 text-sm font-semibold text-[#171923] hover:bg-[#F3F4F8] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Explore Dashboard</span>
            </button>
          </div>
        </div>

        {/* Hero Visual: Authentic Live Preview of CREATOR OS Dashboard */}
        <div className="mt-12 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_24px_60px_-20px_rgba(23,37,84,0.14)] overflow-hidden">
          {/* Mock Browser Window Chrome */}
          <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#F3F4F8] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D1D5DB]" />
            </div>
            <span className="font-mono text-[11px] text-[#697386]">
              app.creatoros.in · Aanya Sharma Workspace
            </span>
            <button
              type="button"
              onClick={onExploreDashboard}
              className="text-xs font-medium text-[#635BFF] hover:underline whitespace-nowrap shrink-0"
            >
              Open Live Workspace
            </button>
          </div>

          {/* Dashboard Preview Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#FAFAFC]">
            {/* Preview Sidebar */}
            <div className="hidden lg:flex lg:col-span-3 flex-col justify-between border-r border-[#E5E7EB] bg-white p-5">
              <div className="space-y-6">
                <BrandLogo />
                <div className="space-y-1 text-[13px]">
                  <div className="px-2.5 py-1 text-[11px] font-medium text-[#9CA3AF]">Overview</div>
                  <div className="flex items-center gap-2.5 rounded-lg bg-[#F0EEFF] px-3 py-2 font-semibold text-[#635BFF]">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                  <div className="pt-3 px-2.5 py-1 text-[11px] font-medium text-[#9CA3AF]">Workspace</div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[#697386]">
                    <UserCheck className="h-4 w-4" />
                    <span>Creator Hub</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[#697386]">
                    <Calendar className="h-4 w-4" />
                    <span>Content Hub</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[#697386]">
                    <Briefcase className="h-4 w-4" />
                    <span>Collaboration Hub</span>
                  </div>
                  <div className="pt-3 px-2.5 py-1 text-[11px] font-medium text-[#9CA3AF]">Business</div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[#697386]">
                    <Wallet className="h-4 w-4" />
                    <span>Finance Hub</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[#697386]">
                    <Bot className="h-4 w-4" />
                    <span>AI Business Assistant</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 border-t border-[#E5E7EB] pt-4 text-xs">
                <p className="font-semibold text-[#171923]">Aanya Sharma</p>
                <p className="text-[#697386]">Lifestyle & Fashion · Bengaluru</p>
              </div>
            </div>

            {/* Preview Main Body */}
            <div className="lg:col-span-9 p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-[#171923]">
                    Good morning, Aanya
                  </h2>
                  <p className="text-xs text-[#697386]">
                    November 2026 Performance · Recorded Revenue vs Settled Cash
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs font-medium text-[#171923]">
                    Nov 2026
                  </span>
                  <button
                    type="button"
                    onClick={onExploreDashboard}
                    className="rounded-md bg-[#172554] px-3 py-1 text-xs font-medium text-white hover:bg-[#1e3170] transition-colors"
                  >
                    + Add Income
                  </button>
                </div>
              </div>

              {/* 5 Financial Cards Preview */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Total Revenue', val: '₹85,000', note: '+14.8% vs Oct', color: 'text-[#171923]' },
                  { label: 'Received Cash', val: '₹65,000', note: '76.5% collected', color: 'text-[#159B69]' },
                  { label: 'Pending Payouts', val: '₹20,000', note: '2 invoices open', color: 'text-[#D97706]' },
                  { label: 'Total Expenses', val: '₹18,500', note: '5 entries', color: 'text-[#DC2626]' },
                  { label: 'Operating Profit', val: '₹66,500', note: '78.2% margin', color: 'text-[#159B69]' },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-[#E5E7EB] bg-white p-3.5"
                  >
                    <p className="text-[11px] font-medium text-[#697386]">{m.label}</p>
                    <p className={`mt-1.5 font-mono text-lg font-semibold tabular-nums ${m.color}`}>
                      {m.val}
                    </p>
                    <p className="mt-1 text-[11px] text-[#9CA3AF]">{m.note}</p>
                  </div>
                ))}
              </div>

              {/* Split Preview Bottom: Campaigns + AI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 rounded-xl border border-[#E5E7EB] bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#171923]">
                      Active Brand Collaborations
                    </span>
                    <span className="text-[11px] text-[#697386]">November 2026</span>
                  </div>
                  <div className="divide-y divide-[#F3F4F8] text-xs">
                    {[
                      { name: 'Nykaa Beauty Campaign', amt: '₹20,000', state: 'Completed', stateColor: 'text-[#159B69]' },
                      { name: 'Mamaearth Promotion', amt: '₹15,000', state: 'Completed', stateColor: 'text-[#159B69]' },
                      { name: 'Myntra Fashion Reel', amt: '₹12,000', state: 'Payment Pending', stateColor: 'text-[#D97706]' },
                      { name: 'Boat Lifestyle Campaign', amt: '₹18,000', state: 'In Progress', stateColor: 'text-[#2563EB]' },
                    ].map((row) => (
                      <div key={row.name} className="flex items-center justify-between py-2.5">
                        <span className="font-medium text-[#171923]">{row.name}</span>
                        <div className="flex items-center gap-4">
                          <span className={`font-medium ${row.stateColor}`}>{row.state}</span>
                          <span className="font-mono font-semibold text-[#171923] tabular-nums">
                            {row.amt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-5 rounded-xl border border-[#635BFF]/20 bg-[#F0EEFF]/55 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#172554]">
                      <Sparkles className="h-4 w-4 text-[#635BFF]" />
                      <span>Your Business Insights</span>
                    </div>
                    <ul className="mt-3 space-y-2 text-xs text-[#171923] leading-relaxed">
                      <li>• Brand collaborations account for 76.5% (₹65,000) of recorded income.</li>
                      <li>• 2 payments worth ₹20,000 remain pending collection.</li>
                      <li>• Operating profit margin holds at 78.2% after ₹18,500 expenses.</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={onExploreDashboard}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:underline"
                  >
                    <span>Explore Interactive Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Statement */}
      <section className="border-y border-[#E5E7EB] bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#172554]">
              Creators run multi-lakh businesses on scattered spreadsheets and chat threads.
            </h2>
            <p className="mt-3 text-base text-[#697386]">
              When brand deals, AdSense payouts, editing invoices, and shoot expenses live in five
              different apps, you lose track of what is earned versus what actually hit your bank.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Lost Pending Payments',
                detail:
                  'Net-15 and Net-30 brand invoices slip through the cracks without automated overdue visibility.',
              },
              {
                title: 'Blind Campaign Margins',
                detail:
                  'A ₹20,000 collaboration looks profitable until you subtract ₹4,000 editing and ₹3,500 studio rentals.',
              },
              {
                title: 'Disconnected Deliverables',
                detail:
                  'Content calendars sit apart from contracts, making deadline tracking and brand approvals chaotic.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-6">
                <h3 className="font-display text-base font-semibold text-[#171923]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[#697386] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How CREATOR OS Works */}
      <section className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#172554]">
            How CREATOR OS works
          </h2>
          <p className="mt-2.5 text-base text-[#697386]">
            Three structured steps to turn your creator work into an organized financial operation.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#E5E7EB] pt-8">
          {[
            {
              step: '01. Set Up Your Workspace',
              desc: 'Connect your creator profile, social audience reach, revenue streams, and monthly income goals in under two minutes.',
            },
            {
              step: '02. Link Deals, Content & Money',
              desc: 'Track brand campaigns from enquiry to invoice settlement while linking shoot expenses and content deliverables directly.',
            },
            {
              step: '03. Make Decisions With Clarity',
              desc: 'Review real operating margins, cash flow forecasts, and query the AI Business Assistant grounded in your actual ledger.',
            },
          ].map((item) => (
            <div key={item.step}>
              <h3 className="font-display text-lg font-semibold text-[#171923]">{item.step}</h3>
              <p className="mt-2 text-sm text-[#697386] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Six Product Modules (Asymmetric Bento Grid) */}
      <section id="modules" className="border-y border-[#E5E7EB] bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#172554]">
                Six integrated modules. Zero tool switching.
              </h2>
              <p className="mt-2.5 text-base text-[#697386]">
                Every hub shares one consistent dataset — updating a campaign payment automatically
                updates your Finance and Intelligence dashboards.
              </p>
            </div>
            <button
              type="button"
              onClick={onExploreDashboard}
              className="text-sm font-semibold text-[#635BFF] hover:underline whitespace-nowrap shrink-0"
            >
              Try all modules in demo
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-6">
              <div className="flex items-center gap-2.5 text-[#635BFF]">
                <Wallet className="h-5 w-5" />
                <span className="text-sm font-semibold">Finance Hub</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-bold text-[#171923]">
                Creator-first financial operations without accounting jargon.
              </h3>
              <p className="mt-2 text-sm text-[#697386] max-w-xl">
                Track Brand Collaborations, YouTube AdSense, and Affiliate income alongside Editing,
                Equipment, and Production expenses. Generate clean PDF invoices and monitor monthly
                budgets and savings targets.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-6">
              <div className="flex items-center gap-2.5 text-[#172554]">
                <Briefcase className="h-5 w-5" />
                <span className="text-sm font-semibold">Collaboration Hub</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-[#171923]">
                Brand CRM & Deal Pipeline
              </h3>
              <p className="mt-2 text-sm text-[#697386]">
                Manage brand contacts, deliverable checklists, usage rights, and overdue payment
                alerts in one structured campaign workspace.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-6">
              <div className="flex items-center gap-2.5 text-[#159B69]">
                <UserCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">Creator Hub</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-[#171923]">
                Profile & Instant Media Kit
              </h3>
              <p className="mt-2 text-sm text-[#697386]">
                Showcase your social metrics, previous brand work, and export a formatted PDF Media
                Kit whenever a brand asks for your rates.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-6">
              <div className="flex items-center gap-2.5 text-[#2563EB]">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-semibold">Content Hub</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-[#171923]">
                Visual Editorial Calendar
              </h3>
              <p className="mt-2 text-sm text-[#697386]">
                Plan Reels, Shorts, and Carousels across Monthly, Weekly, and List views while
                logging post-publish reach and engagement.
              </p>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-6">
              <div className="flex items-center gap-2.5 text-[#635BFF]">
                <Layers className="h-5 w-5" />
                <span className="text-sm font-semibold">Intelligence Hub</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold text-[#171923]">
                Campaign Margin & Cash Flow
              </h3>
              <p className="mt-2 text-sm text-[#697386]">
                Identify your highest-margin brands, review estimated closing cash balances, and
                export CSV or PDF board-ready reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. Financial Intelligence + AI Assistant Showcase */}
      <section id="finance-showcase" className="mx-auto max-w-[1240px] px-6 py-16 md:py-20 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold text-[#159B69]">Financial Intelligence</span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#172554]">
              Know which collaborations actually make you money.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#697386] leading-relaxed">
              CREATOR OS ties production, editing, and travel expenses directly to each brand
              campaign so you see true profit margins instead of vanity top-line fees.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-[#171923]">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#159B69] shrink-0" />
                <span>Clear split between recorded revenue and settled cash</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#159B69] shrink-0" />
                <span>Campaign-level profit & margin ranking</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-[#159B69] shrink-0" />
                <span>Cash flow statement separating actuals from estimates</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 rounded-xl border border-[#E5E7EB] bg-white p-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <span className="text-sm font-semibold text-[#171923]">
                Campaign Profitability Matrix
              </span>
              <span className="font-mono text-xs text-[#697386]">Nov 2026 · INR</span>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-xs font-medium text-[#697386]">
                    <th className="py-2 pr-4">Campaign</th>
                    <th className="py-2 px-3 text-right">Revenue</th>
                    <th className="py-2 px-3 text-right">Expenses</th>
                    <th className="py-2 px-3 text-right">Net Profit</th>
                    <th className="py-2 pl-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F8] tabular-nums font-mono text-[13px]">
                  <tr>
                    <td className="py-3 pr-4 font-sans font-medium text-[#171923]">
                      Nykaa Beauty Campaign
                    </td>
                    <td className="py-3 px-3 text-right">₹20,000</td>
                    <td className="py-3 px-3 text-right text-[#DC2626]">₹4,000</td>
                    <td className="py-3 px-3 text-right font-semibold text-[#159B69]">₹16,000</td>
                    <td className="py-3 pl-3 text-right text-[#159B69]">80.0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-sans font-medium text-[#171923]">
                      Boat Lifestyle Campaign
                    </td>
                    <td className="py-3 px-3 text-right">₹18,000</td>
                    <td className="py-3 px-3 text-right text-[#DC2626]">₹6,000</td>
                    <td className="py-3 px-3 text-right font-semibold text-[#159B69]">₹12,000</td>
                    <td className="py-3 pl-3 text-right text-[#159B69]">66.7%</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-sans font-medium text-[#171923]">
                      Mamaearth Promotion
                    </td>
                    <td className="py-3 px-3 text-right">₹15,000</td>
                    <td className="py-3 px-3 text-right text-[#DC2626]">₹3,500</td>
                    <td className="py-3 px-3 text-right font-semibold text-[#159B69]">₹11,500</td>
                    <td className="py-3 pl-3 text-right text-[#159B69]">76.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 6. AI Assistant Showcase */}
        <div
          id="ai-assistant"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-2xl border border-[#E5E7EB] bg-white p-6 md:p-10"
        >
          <div className="lg:col-span-7 order-2 lg:order-1 rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-5">
            <div className="flex justify-end">
              <div className="rounded-xl bg-[#172554] px-4 py-2.5 text-sm text-white">
                How much did I earn this month?
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-white p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-sm font-semibold text-[#171923]">
                  November 2026 Financial Summary
                </span>
                <span className="text-[11px] font-medium text-[#159B69]">Actual Ledger Data</span>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono tabular-nums">
                <div className="rounded-lg bg-[#FAFAFC] p-3">
                  <p className="font-sans text-[11px] text-[#697386]">Recorded Revenue</p>
                  <p className="mt-1 text-base font-semibold text-[#635BFF]">₹85,000</p>
                </div>
                <div className="rounded-lg bg-[#FAFAFC] p-3">
                  <p className="font-sans text-[11px] text-[#697386]">Received Cash</p>
                  <p className="mt-1 text-base font-semibold text-[#159B69]">₹65,000</p>
                </div>
                <div className="rounded-lg bg-[#FAFAFC] p-3">
                  <p className="font-sans text-[11px] text-[#697386]">Pending Payments</p>
                  <p className="mt-1 text-base font-semibold text-[#D97706]">₹20,000</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#697386] leading-relaxed">
                Recorded expenses totaled ₹18,500, leaving an operating profit of ₹66,500 (78.2%
                margin). Two pending payouts worth ₹20,000 remain open.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <span className="text-xs font-semibold text-[#635BFF]">AI Business Assistant</span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#172554]">
              Ask real financial questions. Get verified answers.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#697386] leading-relaxed">
              Every response combines server-computed ledger figures with structured summary cards
              — never guessed numbers or generic advice.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#171923]">
              <span className="rounded-md border border-[#E5E7EB] bg-[#FAFAFC] px-2.5 py-1.5">
                Which collaboration was most profitable?
              </span>
              <span className="rounded-md border border-[#E5E7EB] bg-[#FAFAFC] px-2.5 py-1.5">
                What are my total pending payments?
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Benefits for Creators */}
      <section className="border-y border-[#E5E7EB] bg-white py-16">
        <div className="mx-auto max-w-[1240px] px-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#172554]">
            Built for solo creators, influencers, and creator-led studios
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: IndianRupee,
                title: '100% INR Clarity',
                desc: 'Native Indian rupee formatting, Net-15/Net-30 tracking, and multi-currency preview.',
              },
              {
                icon: ShieldCheck,
                title: 'Zero Missed Payouts',
                desc: 'Instant overdue invoice highlights across Collaboration Hub and Finance Hub.',
              },
              {
                icon: BarChart3,
                title: 'True Margin Visibility',
                desc: 'Deduct editing, lighting, and travel expenses per deal to price future rates accurately.',
              },
              {
                icon: Sparkles,
                title: 'Export-Ready Outputs',
                desc: 'One-click PDF Media Kits, brand invoices, and CSV financial statements.',
              },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="space-y-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0EEFF] text-[#635BFF]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#171923]">{b.title}</h3>
                  <p className="text-sm text-[#697386]">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="mx-auto max-w-[840px] px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#172554] text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 divide-y divide-[#E5E7EB] rounded-xl border border-[#E5E7EB] bg-white">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={item.q} className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="font-display text-sm sm:text-base font-semibold text-[#171923]">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#697386] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#697386] leading-relaxed">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="mx-auto max-w-[1240px] px-6 pb-16">
        <div className="rounded-2xl bg-[#172554] px-8 py-12 md:px-12 md:py-14 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Know your income. Manage your deals. Understand your profit.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#CBD5E1]">
              Start with your own workspace or explore Aanya Sharma&apos;s pre-loaded creator
              business right now.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onGetStarted}
              className="rounded-lg bg-[#635BFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5248F5] transition-colors whitespace-nowrap shrink-0"
            >
              Get Started Free
            </button>
            <button
              type="button"
              onClick={onExploreDashboard}
              className="rounded-lg border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors whitespace-nowrap shrink-0"
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* 10. Quiet Footer */}
      <footer className="border-t border-[#E5E7EB] bg-white py-8">
        <div className="mx-auto flex max-w-[1240px] flex-col sm:flex-row items-center justify-between gap-4 px-6 text-xs text-[#697386]">
          <div className="flex items-center gap-3">
            <BrandLogo />
            <span aria-hidden="true">·</span>
            <span>Your Creator Business. One Operating System.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#modules" className="hover:text-[#171923]">
              Modules
            </a>
            <a href="#finance-showcase" className="hover:text-[#171923]">
              Finance
            </a>
            <a href="#faq" className="hover:text-[#171923]">
              FAQ
            </a>
            <span>© 2026 CREATOR OS</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
