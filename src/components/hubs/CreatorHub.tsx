import React, { useState } from 'react';
import {
  Check,
  Download,
  ExternalLink,
  Globe,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type {
  Campaign,
  CreatorProfile,
  PortfolioItem,
  SocialAccount,
  SocialPlatform,
} from '../../types/creatorOs';
import { formatCompactNumber, formatCurrency, formatDateShort } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { ResilientImage } from '../ui/ResilientImage';
import { StatusBadge } from '../ui/StatusBadge';

interface CreatorHubProps {
  profile: CreatorProfile;
  campaigns: Campaign[];
  onUpdateProfile: (next: CreatorProfile) => void;
  onNotify: (title: string, description?: string) => void;
}

type CreatorSection =
  | 'personal'
  | 'socials'
  | 'portfolio'
  | 'collaborations'
  | 'mediakit'
  | 'goals';

export const CreatorHub: React.FC<CreatorHubProps> = ({
  profile,
  campaigns,
  onUpdateProfile,
  onNotify,
}) => {
  const [section, setSection] = useState<CreatorSection>('personal');
  const [formState, setFormState] = useState({
    fullName: profile.fullName,
    category: profile.category,
    location: profile.location,
    bio: profile.bio,
    email: profile.email,
    phone: profile.phone,
    website: profile.website,
  });

  // Add Social Modal
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [newSocial, setNewSocial] = useState<{
    platform: SocialPlatform;
    handle: string;
    url: string;
    followers: string;
    engagementRate: string;
  }>({
    platform: 'Instagram',
    handle: '',
    url: '',
    followers: '',
    engagementRate: '4.5',
  });

  // Add Portfolio Modal
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    title: '',
    brand: '',
    category: 'Fashion & Lifestyle',
    platform: 'Instagram' as SocialPlatform,
    views: '85000',
    engagementRate: '5.2',
    summary: '',
  });

  // Goals editor
  const [goalDraft, setGoalDraft] = useState({
    monthlyIncomeGoal: String(profile.monthlyIncomeGoal),
    savingsTarget: String(profile.savingsTarget),
    growthGoal: profile.growthGoal,
  });

  const totalAudience = profile.socials.reduce((sum, s) => sum + s.followers, 0);
  const avgEngagement =
    profile.socials.length > 0
      ? Math.round(
          (profile.socials.reduce((sum, s) => sum + s.engagementRate, 0) /
            profile.socials.length) *
            10
        ) / 10
      : 0;

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      ...formState,
    });
    onNotify('Creator profile updated', 'Your personal details and Media Kit have been synced.');
  };

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.handle.trim()) return;
    const added: SocialAccount = {
      id: `soc-${Date.now()}`,
      platform: newSocial.platform,
      handle: newSocial.handle.trim(),
      url: newSocial.url.trim() || `https://${newSocial.platform.toLowerCase()}.com`,
      followers: Number(newSocial.followers) || 10000,
      engagementRate: Number(newSocial.engagementRate) || 4.0,
      connected: true,
    };
    onUpdateProfile({ ...profile, socials: [...profile.socials, added] });
    setSocialModalOpen(false);
    setNewSocial({ platform: 'Instagram', handle: '', url: '', followers: '', engagementRate: '4.5' });
    onNotify('Social channel added', `${added.platform} (${added.handle}) connected.`);
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolio.title.trim() || !newPortfolio.brand.trim()) return;
    const item: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newPortfolio.title.trim(),
      brand: newPortfolio.brand.trim(),
      category: newPortfolio.category,
      platform: newPortfolio.platform,
      imageUrl: profile.portfolio[0]?.imageUrl || '',
      views: Number(newPortfolio.views) || 50000,
      engagementRate: Number(newPortfolio.engagementRate) || 4.5,
      date: '2026-11-17',
      summary: newPortfolio.summary.trim() || 'Featured brand collaboration showcase.',
    };
    onUpdateProfile({ ...profile, portfolio: [item, ...profile.portfolio] });
    setPortfolioModalOpen(false);
    setNewPortfolio({
      title: '',
      brand: '',
      category: 'Fashion & Lifestyle',
      platform: 'Instagram',
      views: '85000',
      engagementRate: '5.2',
      summary: '',
    });
    onNotify('Portfolio item added', `${item.title} added to your showcase.`);
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      monthlyIncomeGoal: Number(goalDraft.monthlyIncomeGoal) || profile.monthlyIncomeGoal,
      savingsTarget: Number(goalDraft.savingsTarget) || profile.savingsTarget,
      growthGoal: goalDraft.growthGoal.trim() || profile.growthGoal,
    });
    onNotify('Business goals updated', 'Targets updated across Finance Hub & AI Assistant.');
  };

  const handleDownloadMediaKitPdf = () => {
    setSection('mediakit');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Profile Hero Header */}
      <div className="no-print rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <ResilientImage
              src={profile.avatarUrl}
              alt={profile.fullName}
              fallbackText={profile.fullName}
              className="h-20 w-20 rounded-xl object-cover border border-[#E5E7EB] shrink-0"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold text-[#172554]">
                  {profile.fullName}
                </h1>
                <span className="text-xs font-medium text-[#635BFF]">· {profile.category}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#697386]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{profile.location}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  <span>{profile.website}</span>
                </span>
              </div>
              <p className="mt-2.5 max-w-2xl text-sm text-[#697386] leading-relaxed">
                {profile.bio}
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-start md:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-[#F3F4F8]">
            <div className="text-left md:text-right font-mono tabular-nums">
              <p className="font-sans text-xs text-[#697386]">Combined Audience Reach</p>
              <p className="text-2xl font-bold text-[#172554]">
                {formatCompactNumber(totalAudience)}
              </p>
              <p className="font-sans text-xs text-[#159B69]">{avgEngagement}% avg engagement</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadMediaKitPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1e3170] transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Media Kit PDF</span>
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="mt-6 flex items-center gap-1 overflow-x-auto border-t border-[#E5E7EB] pt-4">
          {(
            [
              { id: 'personal', label: 'Personal Information' },
              { id: 'socials', label: 'Social Profiles' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'collaborations', label: 'Previous Collaborations' },
              { id: 'mediakit', label: 'Media Kit' },
              { id: 'goals', label: 'Business Goals' },
            ] as Array<{ id: CreatorSection; label: string }>
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                section === tab.id
                  ? 'bg-[#F0EEFF] text-[#635BFF] font-semibold'
                  : 'text-[#697386] hover:bg-[#F3F4F8] hover:text-[#171923]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Personal Information */}
      {section === 'personal' && (
        <form
          onSubmit={handleSavePersonal}
          className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#F3F4F8] pb-3">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Personal Information
              </h2>
              <p className="text-xs text-[#697386]">
                Keep your creator details current for invoices and brand media kits.
              </p>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
            >
              Save Profile
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Full Name</label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Creator Category
              </label>
              <input
                type="text"
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Location</label>
              <input
                type="text"
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Contact Email</label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Phone</label>
              <input
                type="text"
                value={formState.phone}
                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Website</label>
              <input
                type="text"
                value={formState.website}
                onChange={(e) => setFormState({ ...formState, website: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Creator Bio</label>
            <textarea
              rows={3}
              value={formState.bio}
              onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
              className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
            />
          </div>
        </form>
      )}

      {/* 2. Social Profiles */}
      {section === 'socials' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Social Profiles
              </h2>
              <p className="text-xs text-[#697386]">
                Audience metrics displayed in your Media Kit and Brand Directory.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSocialModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Channel</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.socials.map((soc) => (
              <div
                key={soc.id}
                className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold text-[#172554]">
                      {soc.platform}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateProfile({
                          ...profile,
                          socials: profile.socials.filter((item) => item.id !== soc.id),
                        });
                        onNotify('Channel removed', `${soc.platform} removed from profile.`);
                      }}
                      aria-label={`Remove ${soc.platform}`}
                      className="text-[#9CA3AF] hover:text-[#DC2626]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[#171923]">{soc.handle}</p>
                  <p className="text-xs text-[#697386] truncate">{soc.url}</p>
                </div>
                <div className="mt-4 border-t border-[#E5E7EB] pt-3 flex items-center justify-between font-mono text-xs tabular-nums">
                  <div>
                    <p className="font-sans text-[11px] text-[#697386]">Followers</p>
                    <p className="font-semibold text-[#171923]">
                      {soc.followers.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[11px] text-[#697386]">Engagement</p>
                    <p className="font-semibold text-[#159B69]">{soc.engagementRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Portfolio */}
      {section === 'portfolio' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Featured Campaign Portfolio
              </h2>
              <p className="text-xs text-[#697386]">
                Curated proof of creative quality and campaign performance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPortfolioModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Case Study</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {profile.portfolio.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden flex flex-col"
              >
                <ResilientImage
                  src={item.imageUrl}
                  alt={item.title}
                  fallbackText={item.brand}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-[#697386]">
                      {item.brand} · {item.platform} · {formatDateShort(item.date)}
                    </p>
                    <h3 className="mt-1 font-display text-base font-semibold text-[#171923]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#697386] leading-relaxed">{item.summary}</p>
                  </div>
                  <div className="mt-4 border-t border-[#F3F4F8] pt-3 flex items-center justify-between font-mono text-xs tabular-nums">
                    <span className="text-[#171923] font-semibold">
                      {formatCompactNumber(item.views)} views
                    </span>
                    <span className="text-[#159B69] font-semibold">
                      {item.engagementRate}% ER
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Previous Collaborations */}
      {section === 'collaborations' && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
          <div className="border-b border-[#E5E7EB] px-6 py-4">
            <h2 className="font-display text-base font-semibold text-[#171923]">
              Collaboration History
            </h2>
            <p className="text-xs text-[#697386]">
              Synced directly from your Collaboration Hub deals.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#FAFAFC] text-xs font-medium text-[#697386]">
                  <th className="py-3 px-6">Campaign</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4 text-right">Fee</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F8] text-[13px]">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAFAFC]">
                    <td className="py-3 px-6 font-medium text-[#171923]">{c.name}</td>
                    <td className="py-3 px-4 text-[#697386]">{c.brandName}</td>
                    <td className="py-3 px-4 text-[#697386]">{c.platform}</td>
                    <td className="py-3 px-4 font-mono text-xs text-[#697386] tabular-nums">
                      {formatDateShort(c.deadline)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#171923] tabular-nums">
                      {formatCurrency(c.amount)}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Media Kit Builder */}
      {section === 'mediakit' && (
        <div className="space-y-4">
          <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-white px-6 py-4">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Live Media Kit Preview
              </h2>
              <p className="text-xs text-[#697386]">
                Automatically reflects your latest follower numbers, portfolio, and brand partners.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadMediaKitPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Printable Media Kit Sheet */}
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 md:p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E5E7EB] pb-8">
              <div className="flex items-center gap-5">
                <ResilientImage
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  fallbackText={profile.fullName}
                  className="h-24 w-24 rounded-2xl object-cover border border-[#E5E7EB]"
                />
                <div>
                  <p className="text-xs font-semibold text-[#635BFF]">Official Creator Media Kit</p>
                  <h2 className="mt-1 font-display text-3xl font-bold text-[#172554]">
                    {profile.fullName}
                  </h2>
                  <p className="text-sm text-[#697386]">
                    {profile.category} · {profile.location}
                  </p>
                </div>
              </div>
              <div className="text-sm text-[#697386] space-y-1 md:text-right">
                <p className="font-semibold text-[#171923]">Partnerships & Booking</p>
                <p>{profile.email}</p>
                <p>{profile.phone}</p>
                <p className="text-[#635BFF]">{profile.website}</p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm font-semibold text-[#172554]">
                Creator Introduction
              </h3>
              <p className="mt-2 text-sm text-[#697386] leading-relaxed max-w-3xl">
                {profile.bio}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.socials.map((soc) => (
                <div key={soc.id} className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFC] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#172554]">{soc.platform}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#9CA3AF]" />
                  </div>
                  <p className="mt-1 text-xs text-[#697386]">{soc.handle}</p>
                  <div className="mt-3 flex items-baseline justify-between font-mono tabular-nums">
                    <span className="text-xl font-bold text-[#171923]">
                      {formatCompactNumber(soc.followers)}
                    </span>
                    <span className="text-xs font-semibold text-[#159B69]">
                      {soc.engagementRate}% avg ER
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E5E7EB] pt-6">
              <div>
                <h3 className="font-display text-sm font-semibold text-[#172554]">
                  Content Pillars & Formats
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-[#697386]">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#159B69]" />
                    <span>Clean Skincare & Daily Beauty Routines (Reels & Shorts)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#159B69]" />
                    <span>Capsule Workwear & Modern Indian Styling Lookbooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#159B69]" />
                    <span>Desk Tech & Everyday Lifestyle Integrations (YouTube)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-display text-sm font-semibold text-[#172554]">
                  Selected Brand Collaborations
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2.5 text-sm font-medium text-[#171923]">
                  {Array.from(new Set(campaigns.map((c) => c.brandName))).map((b) => (
                    <div
                      key={b}
                      className="rounded-lg border border-[#E5E7EB] bg-[#FAFAFC] px-3 py-2"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Business Goals */}
      {section === 'goals' && (
        <form
          onSubmit={handleSaveGoals}
          className="rounded-xl border border-[#E5E7EB] bg-white p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#F3F4F8] pb-3">
            <div>
              <h2 className="font-display text-base font-semibold text-[#171923]">
                Creator Business Goals
              </h2>
              <p className="text-xs text-[#697386]">
                Configure targets monitored by your Dashboard and AI Business Assistant.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#635BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5248F5]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Save Targets</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Monthly Income Goal (INR)
              </label>
              <input
                type="number"
                value={goalDraft.monthlyIncomeGoal}
                onChange={(e) =>
                  setGoalDraft({ ...goalDraft, monthlyIncomeGoal: e.target.value })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Annual Savings Target (INR)
              </label>
              <input
                type="number"
                value={goalDraft.savingsTarget}
                onChange={(e) => setGoalDraft({ ...goalDraft, savingsTarget: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">
              Strategic Business Growth Goal
            </label>
            <textarea
              rows={3}
              value={goalDraft.growthGoal}
              onChange={(e) => setGoalDraft({ ...goalDraft, growthGoal: e.target.value })}
              className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2 text-sm"
            />
          </div>
        </form>
      )}

      {/* Add Social Modal */}
      <Modal
        open={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
        title="Add Social Channel"
      >
        <form onSubmit={handleAddSocial} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Platform</label>
              <select
                value={newSocial.platform}
                onChange={(e) =>
                  setNewSocial({ ...newSocial, platform: e.target.value as SocialPlatform })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
              >
                {(['Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Other'] as SocialPlatform[]).map(
                  (p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Handle</label>
              <input
                type="text"
                value={newSocial.handle}
                onChange={(e) => setNewSocial({ ...newSocial, handle: e.target.value })}
                placeholder="@aanya.curates"
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Profile URL</label>
            <input
              type="text"
              value={newSocial.url}
              onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Followers</label>
              <input
                type="number"
                value={newSocial.followers}
                onChange={(e) => setNewSocial({ ...newSocial, followers: e.target.value })}
                placeholder="50000"
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">
                Engagement Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={newSocial.engagementRate}
                onChange={(e) => setNewSocial({ ...newSocial, engagementRate: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setSocialModalOpen(false)}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white"
            >
              Save Channel
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Portfolio Modal */}
      <Modal
        open={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        title="Add Portfolio Case Study"
      >
        <form onSubmit={handleAddPortfolio} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Title</label>
              <input
                type="text"
                value={newPortfolio.title}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                placeholder="Summer Glow Edit"
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Brand</label>
              <input
                type="text"
                value={newPortfolio.brand}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, brand: e.target.value })}
                placeholder="Nykaa"
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Platform</label>
              <select
                value={newPortfolio.platform}
                onChange={(e) =>
                  setNewPortfolio({ ...newPortfolio, platform: e.target.value as SocialPlatform })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm bg-white"
              >
                <option value="Instagram">Instagram</option>
                <option value="YouTube">YouTube</option>
                <option value="LinkedIn">LinkedIn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">Total Views</label>
              <input
                type="number"
                value={newPortfolio.views}
                onChange={(e) => setNewPortfolio({ ...newPortfolio, views: e.target.value })}
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171923] mb-1">ER (%)</label>
              <input
                type="number"
                step="0.1"
                value={newPortfolio.engagementRate}
                onChange={(e) =>
                  setNewPortfolio({ ...newPortfolio, engagementRate: e.target.value })
                }
                className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171923] mb-1">Summary</label>
            <textarea
              rows={2}
              value={newPortfolio.summary}
              onChange={(e) => setNewPortfolio({ ...newPortfolio, summary: e.target.value })}
              placeholder="Deliverables and campaign outcome"
              className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setPortfolioModalOpen(false)}
              className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white"
            >
              Add Portfolio Item
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
