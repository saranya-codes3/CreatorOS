import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  Bot,
  MessageSquarePlus,
  Send,
  Sparkles,
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type {
  AIConversation,
  AIMessage,
  AIStructuredCard,
  WorkspaceState,
} from '../../types/creatorOs';
import { formatCurrency } from '../../utils/formatters';

interface AIAssistantHubProps {
  workspace: WorkspaceState;
  selectedMonth: string;
  conversations: AIConversation[];
  onUpdateConversations: (next: AIConversation[]) => void;
}

const SUGGESTED_PROMPTS = [
  'How much did I earn this month?',
  'Which collaboration was most profitable?',
  'What are my total pending payments?',
  'Where am I spending the most?',
  'Compare this month with last month.',
  'Am I on track to achieve my monthly goal?',
];

export const AIAssistantHub: React.FC<AIAssistantHubProps> = ({
  workspace,
  selectedMonth,
  conversations,
  onUpdateConversations,
}) => {
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || 'new');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || null;

  const handleNewConversation = () => {
    const newConv: AIConversation = {
      id: `conv-${Date.now()}`,
      title: 'New Financial Conversation',
      updatedAt: 'Just now',
      messages: [],
    };
    onUpdateConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    const nowLabel = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content: trimmed,
      timestamp: nowLabel,
    };

    let targetId = activeConversation?.id;
    let baseConversations = conversations;

    if (!targetId) {
      targetId = `conv-${Date.now()}`;
      const created: AIConversation = {
        id: targetId,
        title: trimmed.slice(0, 42),
        updatedAt: 'Just now',
        messages: [userMsg],
      };
      baseConversations = [created, ...conversations];
      setActiveConvId(targetId);
    } else {
      baseConversations = conversations.map((c) =>
        c.id === targetId
          ? {
              ...c,
              title: c.messages.length === 0 ? trimmed.slice(0, 42) : c.title,
              updatedAt: 'Just now',
              messages: [...c.messages, userMsg],
            }
          : c
      );
    }

    onUpdateConversations(baseConversations);
    setInput('');
    setLoading(true);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

    try {
      const targetConv = baseConversations.find((c) => c.id === targetId);
      const historyPayload = (targetConv?.messages || [])
        .filter((m) => !m.error)
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          history: historyPayload,
          selectedMonth,
          workspace: {
            profile: workspace.profile,
            incomes: workspace.incomes,
            expenses: workspace.expenses,
            campaigns: workspace.campaigns,
            budgets: workspace.budgets,
            goals: workspace.goals,
            aiTone: workspace.settings.aiTone,
          },
        }),
      });

      const data = (await res.json()) as {
        answer?: string;
        structuredCard?: AIStructuredCard;
        error?: string;
      };

      if (!res.ok || data.error) {
        const errMsg: AIMessage = {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: '',
          error: data.error || `Request failed with status ${res.status}`,
          timestamp: nowLabel,
        };
        onUpdateConversations(
          baseConversations.map((c) =>
            c.id === targetId ? { ...c, messages: [...c.messages, errMsg] } : c
          )
        );
      } else {
        const assistantMsg: AIMessage = {
          id: `msg-${Date.now()}-a`,
          role: 'assistant',
          content: data.answer || '',
          structuredCard: data.structuredCard,
          timestamp: nowLabel,
        };
        onUpdateConversations(
          baseConversations.map((c) =>
            c.id === targetId ? { ...c, messages: [...c.messages, assistantMsg] } : c
          )
        );
      }
    } catch (err) {
      const errMsg: AIMessage = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content: '',
        error:
          err instanceof Error
            ? err.message
            : 'Network error while reaching the AI Business Assistant.',
        timestamp: nowLabel,
      };
      onUpdateConversations(
        baseConversations.map((c) =>
          c.id === targetId ? { ...c, messages: [...c.messages, errMsg] } : c
        )
      );
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-140px)]">
      {/* Left Panel: Conversations & Suggested Prompts */}
      <div className="lg:col-span-4 xl:col-span-3 rounded-xl border border-[#E5E7EB] bg-white p-4 flex flex-col justify-between gap-5">
        <div className="space-y-5">
          <button
            type="button"
            onClick={handleNewConversation}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#172554] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1e3170] transition-colors"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>New Conversation</span>
          </button>

          <div>
            <p className="px-1 text-[11px] font-semibold text-[#9CA3AF] mb-2">
              Conversation History
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setActiveConvId(conv.id)}
                  className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors ${
                    conv.id === activeConvId
                      ? 'bg-[#F0EEFF] text-[#172554]'
                      : 'hover:bg-[#FAFAFC] text-[#697386]'
                  }`}
                >
                  <span className="text-xs font-semibold truncate w-full">{conv.title}</span>
                  <span className="text-[10px] text-[#9CA3AF]">{conv.updatedAt}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] pt-4">
            <p className="px-1 text-[11px] font-semibold text-[#9CA3AF] mb-2">
              Suggested Prompts
            </p>
            <div className="space-y-1.5">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion(prompt)}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFC] px-3 py-2 text-left text-xs font-medium text-[#171923] hover:border-[#635BFF] hover:bg-white transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-[#9CA3AF] border-t border-[#F3F4F8] pt-3">
          Grounded strictly in your backend ledger calculations. Estimates are explicitly labeled.
        </p>
      </div>

      {/* Main Conversational Panel */}
      <div className="lg:col-span-8 xl:col-span-9 rounded-xl border border-[#E5E7EB] bg-white flex flex-col overflow-hidden">
        {/* Assistant Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#635BFF] text-white">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-base font-bold text-[#172554]">
                CREATOR OS Business Assistant
              </h1>
              <p className="text-xs text-[#697386]">
                Connected to live workspace ledger · {workspace.settings.aiTone} mode
              </p>
            </div>
          </div>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAFC]/60">
          {/* Welcome Message Card */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#635BFF]">
              <Sparkles className="h-4 w-4" />
              <span>Welcome</span>
            </div>
            <p className="mt-2 text-sm text-[#171923] leading-relaxed">
              Hey! I&apos;m your CREATOR OS Business Assistant. I can help you understand your
              earnings, analyse expenses, track pending payments and make smarter business
              decisions.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.slice(0, 3).map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={loading}
                  onClick={() => sendQuestion(q)}
                  className="rounded-lg border border-[#E5E7EB] bg-[#FAFAFC] px-3 py-1.5 text-xs font-medium text-[#172554] hover:border-[#635BFF]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Messages */}
          {(activeConversation?.messages || []).map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-lg rounded-xl bg-[#172554] px-4 py-3 text-sm text-white">
                  <p>{msg.content}</p>
                  <p className="mt-1 text-[10px] text-white/60 text-right">{msg.timestamp}</p>
                </div>
              ) : msg.error ? (
                <div className="max-w-xl rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4 text-sm text-[#991B1B] flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-[#DC2626]" />
                  <div>
                    <p className="font-semibold">Assistant Error</p>
                    <p className="mt-1 text-xs">{msg.error}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl space-y-3">
                  {msg.structuredCard && (
                    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3F4F8] pb-3">
                        <h3 className="font-display text-sm font-bold text-[#172554]">
                          {msg.structuredCard.title}
                        </h3>
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold ${
                            msg.structuredCard.isEstimate
                              ? 'bg-[#FFFBEB] text-[#B45309]'
                              : 'bg-[#D9FBEA] text-[#0E744E]'
                          }`}
                        >
                          {msg.structuredCard.badgeLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono tabular-nums">
                        {msg.structuredCard.metrics.map((m) => {
                          const color =
                            m.tone === 'positive'
                              ? 'text-[#159B69]'
                              : m.tone === 'negative'
                                ? 'text-[#DC2626]'
                                : m.tone === 'warning'
                                  ? 'text-[#D97706]'
                                  : m.tone === 'indigo'
                                    ? 'text-[#635BFF]'
                                    : 'text-[#171923]';
                          return (
                            <div
                              key={m.label}
                              className="rounded-lg border border-[#F3F4F8] bg-[#FAFAFC] p-3"
                            >
                              <p className="font-sans text-[11px] text-[#697386]">{m.label}</p>
                              <p className={`mt-1 text-sm font-bold ${color}`}>{m.value}</p>
                            </div>
                          );
                        })}
                      </div>

                      {msg.structuredCard.chartData && msg.structuredCard.chartData.length > 0 && (
                        <div className="pt-2">
                          {msg.structuredCard.chartTitle && (
                            <p className="text-xs font-medium text-[#697386] mb-2">
                              {msg.structuredCard.chartTitle}
                            </p>
                          )}
                          <div className="h-[160px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={msg.structuredCard.chartData}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis
                                  tick={{ fontSize: 10 }}
                                  axisLine={false}
                                  tickLine={false}
                                  tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                                />
                                <Tooltip
                                  formatter={(val) =>
                                    formatCurrency(Number(val ?? 0), workspace.settings.currency)
                                  }
                                />
                                <Bar dataKey="value" fill="#635BFF" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      <p className="text-[11px] text-[#9CA3AF] border-t border-[#F3F4F8] pt-2.5">
                        {msg.structuredCard.dataNote}
                      </p>
                    </div>
                  )}

                  {msg.content && (
                    <div className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 text-sm text-[#171923] leading-relaxed whitespace-pre-line">
                      {msg.content}
                      <p className="mt-2 text-[10px] text-[#9CA3AF]">{msg.timestamp}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="max-w-md rounded-xl border border-[#E5E7EB] bg-white p-4 flex items-center gap-3 text-xs text-[#697386]">
              <div className="h-4 w-4 rounded-full border-2 border-[#635BFF] border-t-transparent animate-spin" />
              <span>Computing backend ledger metrics & generating analysis...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="border-t border-[#E5E7EB] bg-white p-4 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about monthly earnings, campaign profit, pending payments, or goals..."
            className="flex-1 rounded-lg border border-[#D1D5DB] bg-[#FAFAFC] px-4 py-2.5 text-sm focus:border-[#635BFF] focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5248F5] disabled:opacity-50 transition-colors shrink-0"
          >
            <span>Send</span>
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
