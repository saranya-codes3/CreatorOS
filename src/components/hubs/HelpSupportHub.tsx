import React, { useState } from 'react';
import { BookOpen, CheckCircle2, LifeBuoy, Mail } from 'lucide-react';
import type { HubRoute } from '../../types/creatorOs';

interface HelpSupportHubProps {
  onNavigate: (route: HubRoute) => void;
}

export const HelpSupportHub: React.FC<HelpSupportHubProps> = ({ onNavigate }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#172554]">
          Help & Support
        </h1>
        <p className="mt-1 text-sm text-[#697386]">
          Quick guides for managing creator collaborations, invoices, and business analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: BookOpen,
            title: 'Tracking Brand Payouts',
            desc: 'Link income entries directly to campaigns in Finance Hub to keep pending receivables accurate.',
            cta: 'Go to Finance Hub',
            route: 'finance' as HubRoute,
          },
          {
            icon: LifeBuoy,
            title: 'Generating Your Media Kit',
            desc: 'Update your follower counts and portfolio case studies in Creator Hub, then export PDF.',
            cta: 'Open Creator Hub',
            route: 'creator' as HubRoute,
          },
          {
            icon: Mail,
            title: 'Querying AI Assistant',
            desc: 'Ask natural-language questions about campaign profit margins, budgets, or goal progress.',
            cta: 'Open AI Assistant',
            route: 'assistant' as HubRoute,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0EEFF] text-[#635BFF]">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="mt-3 font-display text-sm font-semibold text-[#171923]">
                  {card.title}
                </h2>
                <p className="mt-1.5 text-xs text-[#697386] leading-relaxed">{card.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(card.route)}
                className="mt-4 self-start text-xs font-semibold text-[#635BFF] hover:underline"
              >
                {card.cta} →
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="font-display text-base font-semibold text-[#171923]">
          Contact CREATOR OS Support
        </h2>
        <p className="mt-1 text-xs text-[#697386]">
          Send a question about billing, data exports, or workspace setup.
        </p>

        {submitted ? (
          <div className="mt-5 rounded-lg border border-[#159B69]/25 bg-[#D9FBEA]/50 p-4 flex items-center gap-3 text-sm text-[#0E744E]">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Support request logged</p>
              <p className="text-xs">Our creator success team will respond within 1 business day.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question about multi-currency invoice exports"
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Details</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you need help with..."
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
            >
              Send Support Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
