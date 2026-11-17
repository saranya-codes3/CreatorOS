import React, { useMemo, useState } from 'react';
import {
  BarChart2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Film,
  List,
  Plus,
  Send,
  Trash2,
} from 'lucide-react';
import type {
  Campaign,
  ContentItem,
  ContentStatus,
  SocialPlatform,
} from '../../types/creatorOs';
import { formatCompactNumber, formatDateShort } from '../../utils/formatters';
import { MetricCard } from '../ui/MetricCard';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/StateViews';
import { StatusBadge } from '../ui/StatusBadge';

interface ContentHubProps {
  contents: ContentItem[];
  campaigns: Campaign[];
  onAddContent: (item: Omit<ContentItem, 'id'>) => void;
  onUpdateContent: (item: ContentItem) => void;
  onDeleteContent: (id: string) => void;
}

const CONTENT_STATUSES: ContentStatus[] = [
  'Idea',
  'Script Pending',
  'In Production',
  'Editing',
  'Ready to Publish',
  'Published',
];

const PLATFORMS: SocialPlatform[] = ['Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Other'];

export const ContentHub: React.FC<ContentHubProps> = ({
  contents,
  campaigns,
  onAddContent,
  onUpdateContent,
  onDeleteContent,
}) => {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly' | 'list'>('monthly');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const [draft, setDraft] = useState({
    title: '',
    description: '',
    platform: 'Instagram' as SocialPlatform,
    format: 'Reel',
    category: 'Fashion',
    plannedDate: '2026-11-20',
    campaignId: '',
    status: 'Idea' as ContentStatus,
  });

  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      if (platformFilter !== 'All' && item.platform !== platformFilter) return false;
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      return true;
    });
  }, [contents, platformFilter, statusFilter]);

  const totalPlanned = contents.length;
  const inProduction = contents.filter((c) =>
    ['Script Pending', 'In Production', 'Editing'].includes(c.status)
  ).length;
  const readyCount = contents.filter((c) => c.status === 'Ready to Publish').length;
  const publishedCount = contents.filter((c) => c.status === 'Published').length;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) return;
    const camp = campaigns.find((c) => c.id === draft.campaignId);
    onAddContent({
      title: draft.title.trim(),
      description: draft.description.trim() || 'Planned creator deliverable.',
      platform: draft.platform,
      format: draft.format,
      category: draft.category,
      plannedDate: draft.plannedDate,
      campaignId: draft.campaignId || undefined,
      campaignName: camp?.name,
      status: draft.status,
      metrics: { views: 0, likes: 0, comments: 0, shares: 0, reach: 0, engagementRate: 0 },
      isDemo: false,
    });
    setCreateOpen(false);
    setDraft({
      title: '',
      description: '',
      platform: 'Instagram',
      format: 'Reel',
      category: 'Fashion',
      plannedDate: '2026-11-20',
      campaignId: '',
      status: 'Idea',
    });
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    const { views, likes, comments, shares } = selectedItem.metrics;
    const er =
      views > 0 ? Math.round(((likes + comments + shares) / views) * 1000) / 10 : selectedItem.metrics.engagementRate;
    onUpdateContent({
      ...selectedItem,
      metrics: { ...selectedItem.metrics, engagementRate: er },
    });
    setSelectedItem(null);
  };

  // Build November 2026 calendar grid (Nov 1, 2026 is Sunday)
  const novDays = Array.from({ length: 30 }, (_, idx) => {
    const day = idx + 1;
    const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
    const items = filteredContents.filter((c) => c.plannedDate === dateStr);
    return { day, dateStr, items };
  });

  // Weekly view (Nov 15 – Nov 21, 2026)
  const weekDays = novDays.slice(14, 21);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#172554]">
            Content Hub
          </h1>
          <p className="mt-1 text-sm text-[#697386]">
            Plan posts, connect deliverables to brand deals, and track post-publish performance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248F5] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Plan New Content</span>
        </button>
      </div>

      {/* 4 Content KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Content Planned"
          value={String(totalPlanned)}
          sublabel="All active pipeline items"
          icon={<CalendarIcon className="h-4 w-4" />}
        />
        <MetricCard
          label="In Production"
          value={String(inProduction)}
          sublabel="Scripting, filming & editing"
          tone="indigo"
          icon={<Film className="h-4 w-4" />}
        />
        <MetricCard
          label="Ready to Publish"
          value={String(readyCount)}
          sublabel="Approved & scheduled"
          tone="warning"
          icon={<Send className="h-4 w-4" />}
        />
        <MetricCard
          label="Published"
          value={String(publishedCount)}
          sublabel="Live with recorded metrics"
          tone="positive"
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
      </div>

      {/* View Switcher & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex items-center gap-1 rounded-lg bg-[#F3F4F8] p-1 self-start">
          {(
            [
              { id: 'monthly', label: 'Monthly View', icon: CalendarIcon },
              { id: 'weekly', label: 'Weekly View', icon: BarChart2 },
              { id: 'list', label: 'List View', icon: List },
            ] as const
          ).map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setViewMode(mode.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === mode.id
                    ? 'bg-white text-[#171923] shadow-sm'
                    : 'text-[#697386] hover:text-[#171923]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            aria-label="Filter by platform"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#171923]"
          >
            <option value="All">All Platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-medium text-[#171923]"
          >
            <option value="All">All Statuses</option>
            {CONTENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Monthly Calendar View */}
      {viewMode === 'monthly' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-3.5">
            <h2 className="font-display text-sm font-semibold text-[#171923]">November 2026</h2>
            <span className="text-xs text-[#697386]">Click any item to edit or log analytics</span>
          </div>
          <div className="grid grid-cols-7 border-b border-[#E5E7EB] bg-[#FAFAFC] text-center text-[11px] font-semibold text-[#697386]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-7 divide-y sm:divide-y-0 sm:gap-px bg-[#E5E7EB]">
            {novDays.map((cell) => (
              <div
                key={cell.dateStr}
                className="min-h-[112px] bg-white p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      cell.day === 17
                        ? 'inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#635BFF] text-white'
                        : 'text-[#697386]'
                    }`}
                  >
                    {cell.day}
                  </span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {cell.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#FAFAFC] px-2 py-1.5 text-left hover:border-[#635BFF] transition-colors"
                    >
                      <p className="text-[11px] font-semibold text-[#171923] truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-[#697386] truncate">
                        {item.platform} · {item.status}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly View */}
      {viewMode === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((cell) => (
            <div
              key={cell.dateStr}
              className="rounded-xl border border-[#E5E7EB] bg-white p-4 min-h-[220px] flex flex-col"
            >
              <div className="border-b border-[#F3F4F8] pb-2 mb-3 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-[#172554]">
                  {cell.day} Nov
                </span>
                {cell.day === 17 && (
                  <span className="text-[10px] font-semibold text-[#635BFF]">Today</span>
                )}
              </div>
              <div className="space-y-2.5 flex-1">
                {cell.items.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF]">No posts scheduled</p>
                ) : (
                  cell.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFC] p-3 text-left hover:border-[#635BFF]"
                    >
                      <p className="text-xs font-semibold text-[#171923]">{item.title}</p>
                      <p className="mt-1 text-[11px] text-[#697386]">
                        {item.platform} · {item.format}
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={item.status} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <>
          {filteredContents.length === 0 ? (
            <EmptyState
              title="No content matches these filters"
              description="Adjust your platform or status filters, or plan a new content piece."
              actionLabel="Plan New Content"
              onAction={() => setCreateOpen(true)}
            />
          ) : (
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                      <th className="py-3 px-5">Title</th>
                      <th className="py-3 px-3">Platform & Format</th>
                      <th className="py-3 px-3">Planned Date</th>
                      <th className="py-3 px-3">Campaign</th>
                      <th className="py-3 px-3 text-right">Views / ER</th>
                      <th className="py-3 px-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                    {filteredContents.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer hover:bg-[#FAFAFC] transition-colors"
                      >
                        <td className="py-3 px-5 font-medium text-[#171923]">{item.title}</td>
                        <td className="py-3 px-3 text-[#697386]">
                          {item.platform} · {item.format}
                        </td>
                        <td className="py-3 px-3 font-mono text-xs text-[#697386] tabular-nums">
                          {formatDateShort(item.plannedDate)}
                        </td>
                        <td className="py-3 px-3 text-[#697386]">
                          {item.campaignName || 'Organic'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-xs tabular-nums">
                          {item.metrics.views > 0
                            ? `${formatCompactNumber(item.metrics.views)} · ${item.metrics.engagementRate}%`
                            : '—'}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Plan New Content Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Plan Content Item"
        subtitle="Schedule a new post and optionally link it to an active campaign."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Content Title</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Festive Skincare Layering Guide"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Description</label>
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Hook, creative angle, and talking points"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Platform</label>
              <select
                value={draft.platform}
                onChange={(e) => setDraft({ ...draft, platform: e.target.value as SocialPlatform })}
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
              <label className="block text-xs font-medium text-[#171923] mb-1">Format</label>
              <input
                type="text"
                value={draft.format}
                onChange={(e) => setDraft({ ...draft, format: e.target.value })}
                placeholder="Reel, Carousel, Video"
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Category</label>
              <input
                type="text"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Planned Date</label>
              <input
                type="date"
                value={draft.plannedDate}
                onChange={(e) => setDraft({ ...draft, plannedDate: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Campaign</label>
              <select
                value={draft.campaignId}
                onChange={(e) => setDraft({ ...draft, campaignId: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
              >
                <option value="">Organic / None</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Status</label>
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as ContentStatus })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
              >
                {CONTENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white"
            >
              Save Content
            </button>
          </div>
        </form>
      </Modal>

      {/* Content Details & Performance Analytics Modal */}
      <Modal
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || 'Content Details'}
        subtitle={
          selectedItem
            ? `${selectedItem.platform} · ${selectedItem.format} · Planned ${formatDateShort(selectedItem.plannedDate)}`
            : undefined
        }
        size="lg"
      >
        {selectedItem && (
          <form onSubmit={handleSaveDetails} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#171923] mb-1">Status</label>
                <select
                  value={selectedItem.status}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      status: e.target.value as ContentStatus,
                    })
                  }
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
                >
                  {CONTENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#171923] mb-1">Planned Date</label>
                <input
                  type="date"
                  value={selectedItem.plannedDate}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, plannedDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Description</label>
              <textarea
                rows={2}
                value={selectedItem.description}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, description: e.target.value })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
              />
            </div>

            <div className="border-t border-[#E5E7EB] pt-4">
              <h3 className="font-display text-sm font-semibold text-[#171923] mb-3">
                Performance Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(
                  [
                    { key: 'views', label: 'Views' },
                    { key: 'likes', label: 'Likes' },
                    { key: 'comments', label: 'Comments' },
                    { key: 'shares', label: 'Shares' },
                    { key: 'reach', label: 'Reach' },
                  ] as const
                ).map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-[#697386] mb-1">
                      {field.label}
                    </label>
                    <input
                      type="number"
                      value={selectedItem.metrics[field.key]}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          metrics: {
                            ...selectedItem.metrics,
                            [field.key]: Number(e.target.value) || 0,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-[#697386] mb-1">
                    Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedItem.metrics.engagementRate}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        metrics: {
                          ...selectedItem.metrics,
                          engagementRate: Number(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-4">
              <button
                type="button"
                onClick={() => {
                  onDeleteContent(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DC2626] hover:underline"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Content</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white"
                >
                  Save Updates
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
