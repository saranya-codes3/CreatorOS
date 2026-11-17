import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';
import { AVATAR_AANYA_URL } from '../../data/demoData';
import type { CreatorProfile, RevenueSource, SocialAccount, SocialPlatform } from '../../types/creatorOs';
import { BrandLogo } from '../ui/BrandLogo';
import { ResilientImage } from '../ui/ResilientImage';

interface OnboardingFlowProps {
  initialProfile: CreatorProfile;
  onComplete: (updatedProfile: CreatorProfile) => void;
  onCancel: () => void;
}

const ALL_INCOME_SOURCES: RevenueSource[] = [
  'Brand Collaborations',
  'YouTube',
  'Affiliate Marketing',
  'Freelancing',
  'Digital Products',
  'Sponsorships',
  'Other',
];

const CATEGORIES = [
  'Lifestyle and Fashion Creator',
  'Tech & Productivity Creator',
  'Beauty & Skincare Creator',
  'Finance & Business Educator',
  'Food & Travel Creator',
  'Fitness & Wellness Coach',
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(initialProfile.fullName || 'Aanya Sharma');
  const [category, setCategory] = useState(initialProfile.category);
  const [location, setLocation] = useState(initialProfile.location || 'Bengaluru, India');
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl || AVATAR_AANYA_URL);
  const [socials, setSocials] = useState<SocialAccount[]>(initialProfile.socials);
  const [incomeSources, setIncomeSources] = useState<RevenueSource[]>(initialProfile.incomeSources);
  const [monthlyGoal, setMonthlyGoal] = useState(String(initialProfile.monthlyIncomeGoal || 100000));
  const [savingsTarget, setSavingsTarget] = useState(String(initialProfile.savingsTarget || 450000));
  const [growthGoal, setGrowthGoal] = useState(initialProfile.growthGoal);

  const [newPlatform, setNewPlatform] = useState<SocialPlatform>('Instagram');
  const [newUrl, setNewUrl] = useState('');
  const [newFollowers, setNewFollowers] = useState('');

  const totalSteps = 6;

  const toggleIncomeSource = (src: RevenueSource) => {
    setIncomeSources((prev) =>
      prev.includes(src) ? prev.filter((item) => item !== src) : [...prev, src]
    );
  };

  const addSocialRow = () => {
    if (!newUrl.trim()) return;
    const handle = newUrl.trim().split('/').filter(Boolean).pop() || `@${newPlatform.toLowerCase()}`;
    setSocials((prev) => [
      ...prev,
      {
        id: `soc-${Date.now()}`,
        platform: newPlatform,
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        url: newUrl.trim(),
        followers: Number(newFollowers) || 10000,
        engagementRate: 4.2,
        connected: true,
      },
    ]);
    setNewUrl('');
    setNewFollowers('');
  };

  const handleFinish = () => {
    onComplete({
      ...initialProfile,
      fullName: fullName.trim() || initialProfile.fullName,
      category,
      location: location.trim() || initialProfile.location,
      avatarUrl,
      socials,
      incomeSources: incomeSources.length > 0 ? incomeSources : ['Brand Collaborations'],
      monthlyIncomeGoal: Number(monthlyGoal) || 100000,
      savingsTarget: Number(savingsTarget) || 450000,
      growthGoal: growthGoal.trim() || initialProfile.growthGoal,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col">
      {/* Top Progress Header */}
      <header className="border-b border-[#E5E7EB] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#697386] tabular-nums">
              Step {step} of {totalSteps}
            </span>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-[#697386] hover:text-[#171923]"
            >
              Skip to Workspace
            </button>
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-3xl h-1.5 rounded-full bg-[#F3F4F8] overflow-hidden">
          <div
            className="h-full bg-[#635BFF] transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Step Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl rounded-xl border border-[#E5E7EB] bg-white p-8">
          {step === 1 && (
            <div className="text-center py-4">
              <p className="text-xs font-semibold text-[#635BFF]">Workspace Setup</p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#172554]">
                Let&apos;s build your creator business workspace.
              </h1>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#697386] leading-relaxed">
                We&apos;ll configure your creator profile, connected social channels, revenue
                streams, and monthly financial targets in a few quick steps.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                {[
                  { num: '01', title: 'Profile & Channels', desc: 'Media kit & social reach' },
                  { num: '02', title: 'Income Streams', desc: 'Collabs, YouTube & more' },
                  { num: '03', title: 'Business Targets', desc: 'Revenue & savings goals' },
                ].map((card) => (
                  <div key={card.num} className="rounded-lg border border-[#E5E7EB] bg-[#FAFAFC] p-4">
                    <span className="font-mono text-xs font-semibold text-[#635BFF]">
                      {card.num}
                    </span>
                    <p className="mt-1 font-display text-sm font-semibold text-[#171923]">
                      {card.title}
                    </p>
                    <p className="mt-0.5 text-xs text-[#697386]">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#171923]">
                  Creator Information
                </h2>
                <p className="mt-1 text-sm text-[#697386]">
                  This populates your Creator Hub and Media Kit header.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ResilientImage
                  src={avatarUrl}
                  alt={fullName}
                  fallbackText={fullName}
                  className="h-16 w-16 rounded-xl object-cover border border-[#E5E7EB]"
                />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#171923] mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs focus:border-[#635BFF] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#171923] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm focus:border-[#635BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#171923] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm focus:border-[#635BFF] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#171923] mb-1.5">
                  Creator Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm bg-white focus:border-[#635BFF] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#171923]">
                  Social Platforms
                </h2>
                <p className="mt-1 text-sm text-[#697386]">
                  Add your active channels and current audience size.
                </p>
              </div>

              <div className="divide-y divide-[#E5E7EB] rounded-lg border border-[#E5E7EB]">
                {socials.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#171923]">
                        {s.platform} · <span className="font-normal text-[#697386]">{s.handle}</span>
                      </p>
                      <p className="text-xs text-[#9CA3AF] truncate">{s.url}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xs font-semibold text-[#171923] tabular-nums">
                        {s.followers.toLocaleString('en-IN')} followers
                      </span>
                      <button
                        type="button"
                        onClick={() => setSocials((prev) => prev.filter((item) => item.id !== s.id))}
                        aria-label={`Remove ${s.platform}`}
                        className="text-[#9CA3AF] hover:text-[#DC2626]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2">
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as SocialPlatform)}
                  className="sm:col-span-3 rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs bg-white"
                >
                  {(['Instagram', 'YouTube', 'LinkedIn', 'Facebook', 'Other'] as SocialPlatform[]).map(
                    (p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    )
                  )}
                </select>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Profile URL (e.g. https://instagram.com/...)"
                  className="sm:col-span-5 rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs"
                />
                <input
                  type="number"
                  value={newFollowers}
                  onChange={(e) => setNewFollowers(e.target.value)}
                  placeholder="Followers"
                  className="sm:col-span-2 rounded-lg border border-[#D1D5DB] px-3 py-2 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={addSocialRow}
                  className="sm:col-span-2 inline-flex items-center justify-center gap-1 rounded-lg bg-[#172554] px-3 py-2 text-xs font-medium text-white hover:bg-[#1e3170]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#171923]">Income Sources</h2>
                <p className="mt-1 text-sm text-[#697386]">
                  Select all ways your creator business generates revenue.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_INCOME_SOURCES.map((src) => {
                  const selected = incomeSources.includes(src);
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => toggleIncomeSource(src)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                        selected
                          ? 'border-[#635BFF] bg-[#F0EEFF]/70 text-[#172554]'
                          : 'border-[#E5E7EB] bg-white text-[#697386] hover:border-[#D1D5DB]'
                      }`}
                    >
                      <span>{src}</span>
                      {selected && <Check className="h-4 w-4 text-[#635BFF]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#171923]">Business Goals</h2>
                <p className="mt-1 text-sm text-[#697386]">
                  Set clear benchmarks for your Finance Hub and AI Goal Tracker.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#171923] mb-1.5">
                    Monthly Income Goal (INR)
                  </label>
                  <input
                    type="number"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value)}
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm font-mono focus:border-[#635BFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#171923] mb-1.5">
                    Savings Target (INR)
                  </label>
                  <input
                    type="number"
                    value={savingsTarget}
                    onChange={(e) => setSavingsTarget(e.target.value)}
                    className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm font-mono focus:border-[#635BFF] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#171923] mb-1.5">
                  Business Growth Goal
                </label>
                <textarea
                  rows={3}
                  value={growthGoal}
                  onChange={(e) => setGrowthGoal(e.target.value)}
                  className="w-full rounded-lg border border-[#D1D5DB] px-3.5 py-2.5 text-sm focus:border-[#635BFF] focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#D9FBEA] text-[#159B69]">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="font-display text-3xl font-bold text-[#172554]">
                Your creator workspace is ready.
              </h2>
              <p className="mx-auto max-w-md text-sm text-[#697386]">
                Welcome, {fullName}. Your dashboard is configured with {socials.length} social
                channel(s), {incomeSources.length} revenue stream(s), and a monthly target of ₹
                {Number(monthlyGoal || 100000).toLocaleString('en-IN')}.
              </p>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 flex items-center justify-between border-t border-[#E5E7EB] pt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#171923] hover:bg-[#F3F4F8] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(totalSteps, s + 1))}
                className="inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5248F5] transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-lg bg-[#172554] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1e3170] transition-colors"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
