import React from 'react';
import {
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LayoutDashboard,
  Settings,
  UserCheck,
  Wallet,
  X,
} from 'lucide-react';
import type { CreatorProfile, HubRoute } from '../../types/creatorOs';
import { BrandLogo } from '../ui/BrandLogo';
import { ResilientImage } from '../ui/ResilientImage';

interface SidebarProps {
  activeRoute: HubRoute;
  onNavigate: (route: HubRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  profile: CreatorProfile;
}

interface NavGroup {
  label: string;
  items: Array<{
    route: HubRoute;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ route: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Workspace',
    items: [
      { route: 'creator', label: 'Creator Hub', icon: UserCheck },
      { route: 'content', label: 'Content Hub', icon: Calendar },
      { route: 'collaboration', label: 'Collaboration Hub', icon: Briefcase },
    ],
  },
  {
    label: 'Business',
    items: [
      { route: 'finance', label: 'Finance Hub', icon: Wallet },
      { route: 'intelligence', label: 'Intelligence Hub', icon: BarChart3 },
    ],
  },
  {
    label: 'AI Tools',
    items: [{ route: 'assistant', label: 'AI Business Assistant', icon: Bot }],
  },
  {
    label: 'Preferences',
    items: [
      { route: 'settings', label: 'Settings', icon: Settings },
      { route: 'help', label: 'Help & Support', icon: HelpCircle },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  profile,
}) => {
  const handleSelect = (route: HubRoute) => {
    onNavigate(route);
    onCloseMobile();
  };

  const sidebarContent = (isMobileDrawer: boolean) => {
    const isCompact = !isMobileDrawer && collapsed;

    return (
      <div className="flex h-full flex-col justify-between bg-white border-r border-[#E5E7EB]">
        <div>
          {/* Top Logo Row */}
          <div className="flex h-16 items-center justify-between border-b border-[#E5E7EB] px-4">
            <button
              type="button"
              onClick={() => handleSelect('dashboard')}
              className="flex items-center text-left"
              aria-label="Go to Dashboard"
            >
              <BrandLogo compact={isCompact} />
            </button>

            {isMobileDrawer ? (
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className="rounded-lg p-1.5 text-[#697386] hover:bg-[#F3F4F8] hover:text-[#171923]"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                className="hidden lg:inline-flex rounded-lg p-1.5 text-[#697386] hover:bg-[#F3F4F8] hover:text-[#171923] transition-colors"
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5 px-3 py-5 overflow-y-auto" aria-label="Primary Sidebar">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                {!isCompact && (
                  <p className="px-3 mb-1.5 text-[11px] font-semibold text-[#9CA3AF]">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = activeRoute === item.route;
                    return (
                      <button
                        key={item.route}
                        type="button"
                        onClick={() => handleSelect(item.route)}
                        title={isCompact ? item.label : undefined}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-[#F0EEFF] text-[#635BFF] font-semibold'
                            : 'text-[#697386] hover:bg-[#F3F4F8] hover:text-[#171923]'
                        } ${isCompact ? 'justify-center px-2' : ''}`}
                      >
                        <Icon
                          className={`h-[18px] w-[18px] shrink-0 ${
                            active ? 'text-[#635BFF]' : 'text-[#697386]'
                          }`}
                        />
                        {!isCompact && <span className="truncate">{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Creator Profile Section */}
        <div className="border-t border-[#E5E7EB] p-3">
          <button
            type="button"
            onClick={() => handleSelect('creator')}
            className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-[#F3F4F8] transition-colors ${
              isCompact ? 'justify-center' : ''
            }`}
          >
            <ResilientImage
              src={profile.avatarUrl}
              alt={profile.fullName}
              fallbackText={profile.fullName}
              className="h-9 w-9 rounded-lg object-cover shrink-0 border border-[#E5E7EB]"
            />
            {!isCompact && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#171923]">
                  {profile.fullName}
                </p>
                <p className="truncate text-[11px] text-[#697386]">
                  {profile.isDemoData ? 'Demo Workspace' : profile.category}
                </p>
              </div>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`no-print hidden lg:block shrink-0 transition-[width] duration-200 ${
          collapsed ? 'w-[72px]' : 'w-[252px]'
        }`}
      >
        <div className="sticky top-0 h-screen">{sidebarContent(false)}</div>
      </aside>

      {/* Mobile & Tablet Slide-over Drawer */}
      {mobileOpen && (
        <div
          className="no-print fixed inset-0 z-50 flex lg:hidden bg-[#172554]/35 backdrop-blur-[1px]"
          onClick={onCloseMobile}
        >
          <div
            className="w-[268px] max-w-[85vw] h-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent(true)}
          </div>
        </div>
      )}

      {/* Mobile Compact Bottom Bar (height ~56px, well under 15% cap) */}
      <nav
        aria-label="Mobile Quick Navigation"
        className="no-print fixed bottom-0 left-0 right-0 z-40 flex lg:hidden items-center justify-around border-t border-[#E5E7EB] bg-white/95 backdrop-blur-sm h-14 px-2"
      >
        {(
          [
            { route: 'dashboard', label: 'Home', icon: LayoutDashboard },
            { route: 'collaboration', label: 'Deals', icon: Briefcase },
            { route: 'finance', label: 'Finance', icon: Wallet },
            { route: 'content', label: 'Content', icon: Calendar },
            { route: 'assistant', label: 'AI', icon: Bot },
          ] as Array<{
            route: HubRoute;
            label: string;
            icon: React.ComponentType<{ className?: string }>;
          }>
        ).map((item) => {
          const Icon = item.icon;
          const active = activeRoute === item.route;
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => onNavigate(item.route)}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-medium ${
                active ? 'text-[#635BFF]' : 'text-[#697386]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
