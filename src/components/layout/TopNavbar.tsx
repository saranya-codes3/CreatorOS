import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Sparkles,
  User,
} from 'lucide-react';
import type { HubRoute, NotificationItem, WorkspaceState } from '../../types/creatorOs';
import { formatCurrency } from '../../utils/formatters';
import { ResilientImage } from '../ui/ResilientImage';

interface TopNavbarProps {
  activeRoute: HubRoute;
  selectedMonth: string;
  onChangeMonth: (month: string) => void;
  workspace: WorkspaceState;
  onOpenMobileMenu: () => void;
  onNavigate: (route: HubRoute) => void;
  onMarkAllRead: () => void;
  onMarkOneRead: (id: string) => void;
  onReplayOnboarding: () => void;
  onViewLanding: () => void;
  onSignOut: () => void;
}

const ROUTE_TITLES: Record<HubRoute, string> = {
  dashboard: 'Dashboard',
  creator: 'Creator Hub',
  content: 'Content Hub',
  collaboration: 'Collaboration Hub',
  finance: 'Finance Hub',
  intelligence: 'Intelligence Hub',
  assistant: 'AI Business Assistant',
  settings: 'Settings',
  help: 'Help & Support',
};

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeRoute,
  selectedMonth,
  onChangeMonth,
  workspace,
  onOpenMobileMenu,
  onNavigate,
  onMarkAllRead,
  onMarkOneRead,
  onReplayOnboarding,
  onViewLanding,
  onSignOut,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const unreadCount = workspace.notifications.filter((n) => !n.read).length;

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{ id: string; label: string; sub: string; route: HubRoute }> = [];

    workspace.campaigns.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.brandName.toLowerCase().includes(q)) {
        results.push({
          id: `camp-${c.id}`,
          label: c.name,
          sub: `Campaign · ${c.brandName} · ${formatCurrency(c.amount, workspace.settings.currency)}`,
          route: 'collaboration',
        });
      }
    });

    workspace.incomes.forEach((i) => {
      if (i.description.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q)) {
        results.push({
          id: `inc-${i.id}`,
          label: i.description,
          sub: `Income · ${i.source} · ${formatCurrency(i.amount, workspace.settings.currency)}`,
          route: 'finance',
        });
      }
    });

    workspace.contents.forEach((cnt) => {
      if (cnt.title.toLowerCase().includes(q) || cnt.platform.toLowerCase().includes(q)) {
        results.push({
          id: `cnt-${cnt.id}`,
          label: cnt.title,
          sub: `Content · ${cnt.platform} · ${cnt.status}`,
          route: 'content',
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, workspace]);

  const handleNotificationClick = (n: NotificationItem) => {
    onMarkOneRead(n.id);
    setNotifOpen(false);
    if (n.targetRoute) onNavigate(n.targetRoute);
  };

  return (
    <header className="no-print sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-sm px-4 sm:px-6">
      {/* Left: Mobile Menu + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-[#697386] hover:bg-[#F3F4F8] hover:text-[#171923] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline text-[#9CA3AF]">CREATOR OS</span>
          <span className="hidden sm:inline text-[#D1D5DB]">/</span>
          <span className="font-display font-semibold text-[#171923] truncate">
            {ROUTE_TITLES[activeRoute]}
          </span>
        </div>
      </div>

      {/* Right: Search + Period Filter + Notifications + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Global Search */}
        <div ref={searchRef} className="relative hidden md:block w-60 lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            placeholder="Search deals, income, content..."
            className="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFC] py-1.5 pl-9 pr-3 text-xs text-[#171923] placeholder:text-[#9CA3AF] focus:border-[#635BFF] focus:bg-white focus:outline-none"
          />
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 rounded-xl border border-[#E5E7EB] bg-white shadow-lg overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="divide-y divide-[#F3F4F8]">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.route);
                        setSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="flex w-full flex-col items-start px-3.5 py-2.5 text-left hover:bg-[#FAFAFC] transition-colors"
                    >
                      <span className="text-xs font-semibold text-[#171923] truncate w-full">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-[#697386] truncate w-full">
                        {item.sub}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-[#697386]">
                  No matches found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Date Filter */}
        <div className="relative flex items-center">
          <Calendar className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#697386]" />
          <select
            aria-label="Filter reporting month"
            value={selectedMonth}
            onChange={(e) => onChangeMonth(e.target.value)}
            className="rounded-lg border border-[#E5E7EB] bg-white py-1.5 pl-8 pr-7 text-xs font-medium text-[#171923] focus:border-[#635BFF] focus:outline-none"
          >
            <option value="2026-11">Nov 2026</option>
            <option value="2026-10">Oct 2026</option>
            <option value="2026-09">Sep 2026</option>
            <option value="2026-ALL">Full Year 2026</option>
          </select>
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative rounded-lg border border-[#E5E7EB] bg-white p-2 text-[#697386] hover:bg-[#F3F4F8] hover:text-[#171923] transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#DC2626] px-1 font-mono text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden z-50">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3">
                <span className="font-display text-xs font-semibold text-[#171923]">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllRead}
                    className="text-[11px] font-medium text-[#635BFF] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 divide-y divide-[#F3F4F8] overflow-y-auto">
                {workspace.notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-[#697386]">
                    You&apos;re all caught up.
                  </div>
                ) : (
                  workspace.notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => handleNotificationClick(n)}
                      className={`flex w-full flex-col items-start px-4 py-3 text-left hover:bg-[#FAFAFC] transition-colors ${
                        !n.read ? 'bg-[#F0EEFF]/35' : ''
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-[#171923]">{n.title}</span>
                        <span className="text-[10px] text-[#9CA3AF] shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#697386]">{n.description}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white p-1 pr-2.5 hover:bg-[#F3F4F8] transition-colors"
          >
            <ResilientImage
              src={workspace.profile.avatarUrl}
              alt={workspace.profile.fullName}
              fallbackText={workspace.profile.fullName}
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="hidden sm:inline text-xs font-medium text-[#171923] whitespace-nowrap">
              {workspace.profile.fullName.split(' ')[0]}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-[#697386]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden z-50 py-1">
              <div className="border-b border-[#E5E7EB] px-4 py-2.5">
                <p className="text-xs font-semibold text-[#171923] truncate">
                  {workspace.profile.fullName}
                </p>
                <p className="text-[11px] text-[#697386] truncate">{workspace.profile.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('creator');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-[#171923] hover:bg-[#FAFAFC]"
              >
                <User className="h-3.5 w-3.5 text-[#697386]" />
                <span>Creator Hub & Media Kit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('settings');
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-[#171923] hover:bg-[#FAFAFC]"
              >
                <Settings className="h-3.5 w-3.5 text-[#697386]" />
                <span>Workspace Settings</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onReplayOnboarding();
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-[#171923] hover:bg-[#FAFAFC]"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#697386]" />
                <span>Run Onboarding Wizard</span>
              </button>
              <div className="my-1 border-t border-[#E5E7EB]" />
              <button
                type="button"
                onClick={() => {
                  onViewLanding();
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-[#697386] hover:bg-[#FAFAFC] hover:text-[#171923]"
              >
                <span>View Public Landing Page</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  setProfileOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-xs text-[#DC2626] hover:bg-[#FEF2F2]"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
