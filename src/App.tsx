import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DEMO_WORKSPACE_STATE } from './data/demoData';
import { computeFinanceSummary } from './utils/financeEngine';
import type {
  AIConversation,
  AppSettings,
  AuthStage,
  Brand,
  Campaign,
  ContentItem,
  CreatorProfile,
  ExpenseCategory,
  ExpenseEntry,
  FinanceSummary,
  FinancialGoal,
  HubRoute,
  IncomeEntry,
  Invoice,
  TimeframeOption,
  WorkspaceState,
} from './types/creatorOs';
import { LandingPage } from './components/public/LandingPage';
import { AuthScreens } from './components/public/AuthScreens';
import { OnboardingFlow } from './components/public/OnboardingFlow';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { MainDashboard } from './components/hubs/MainDashboard';
import { CreatorHub } from './components/hubs/CreatorHub';
import { ContentHub } from './components/hubs/ContentHub';
import { CollaborationHub } from './components/hubs/CollaborationHub';
import { FinanceHub } from './components/hubs/FinanceHub';
import { IntelligenceHub } from './components/hubs/IntelligenceHub';
import { AIAssistantHub } from './components/hubs/AIAssistantHub';
import { SettingsHub } from './components/hubs/SettingsHub';
import { HelpSupportHub } from './components/hubs/HelpSupportHub';
import {
  CreateCampaignModal,
  CreateInvoiceModal,
  ExpenseModal,
  IncomeModal,
} from './components/modals/WorkspaceModals';
import { ToastContainer, type ToastMessage } from './components/ui/ToastContainer';

const STORAGE_WORKSPACE_KEY = 'creator_os_workspace_v1';
const STORAGE_STAGE_KEY = 'creator_os_stage_v1';

function loadInitialWorkspace(): WorkspaceState {
  try {
    const raw = localStorage.getItem(STORAGE_WORKSPACE_KEY);
    if (raw) {
      return JSON.parse(raw) as WorkspaceState;
    }
  } catch {
    // ignore corrupted local storage
  }
  return DEMO_WORKSPACE_STATE;
}

function loadInitialStage(): AuthStage {
  try {
    const raw = localStorage.getItem(STORAGE_STAGE_KEY) as AuthStage | null;
    if (raw && ['landing', 'login', 'register', 'onboarding', 'app'].includes(raw)) {
      return raw;
    }
  } catch {
    // ignore
  }
  return 'landing';
}

export default function App() {
  const [authStage, setAuthStage] = useState<AuthStage>(loadInitialStage);
  const [activeRoute, setActiveRoute] = useState<HubRoute>('dashboard');
  const [workspace, setWorkspace] = useState<WorkspaceState>(loadInitialWorkspace);
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-11');
  const [timeframe, setTimeframe] = useState<TimeframeOption>('6m');

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Global Quick Action Modals
  const [incomeModalState, setIncomeModalState] = useState<{
    open: boolean;
    edit?: IncomeEntry | null;
  }>({ open: false, edit: null });
  const [expenseModalState, setExpenseModalState] = useState<{
    open: boolean;
    edit?: ExpenseEntry | null;
  }>({ open: false, edit: null });
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  // Authoritative Finance Summary synced with backend /api/finance/summary
  const localSummary = useMemo(
    () =>
      computeFinanceSummary({
        incomes: workspace.incomes,
        expenses: workspace.expenses,
        campaigns: workspace.campaigns,
        budgets: workspace.budgets,
        timeframe,
        selectedMonth,
      }),
    [workspace.incomes, workspace.expenses, workspace.campaigns, workspace.budgets, timeframe, selectedMonth]
  );

  const [serverSummary, setServerSummary] = useState<FinanceSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/finance/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        incomes: workspace.incomes,
        expenses: workspace.expenses,
        campaigns: workspace.campaigns,
        budgets: workspace.budgets,
        timeframe,
        selectedMonth,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { summary?: FinanceSummary } | null) => {
        if (!cancelled && data?.summary) {
          setServerSummary(data.summary);
        }
      })
      .catch(() => {
        // Fallback to local computation if offline
      });
    return () => {
      cancelled = true;
    };
  }, [workspace.incomes, workspace.expenses, workspace.campaigns, workspace.budgets, timeframe, selectedMonth]);

  const summary = serverSummary || localSummary;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WORKSPACE_KEY, JSON.stringify(workspace));
    } catch {
      // ignore quota errors
    }
  }, [workspace]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STAGE_KEY, authStage);
    } catch {
      // ignore
    }
  }, [authStage]);

  const pushToast = useCallback(
    (title: string, description?: string, tone: ToastMessage['tone'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  // Handlers for Income
  const handleSaveIncome = (entry: Omit<IncomeEntry, 'id'>, existingId?: string) => {
    if (existingId) {
      setWorkspace((prev) => ({
        ...prev,
        incomes: prev.incomes.map((i) => (i.id === existingId ? { ...entry, id: existingId } : i)),
      }));
      pushToast('Income updated', entry.description);
    } else {
      const newInc: IncomeEntry = { ...entry, id: `inc-${Date.now()}` };
      setWorkspace((prev) => ({
        ...prev,
        incomes: [newInc, ...prev.incomes],
      }));
      pushToast('Income recorded', `Added ₹${entry.amount.toLocaleString('en-IN')}`);
    }
  };

  const handleDeleteIncome = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      incomes: prev.incomes.filter((i) => i.id !== id),
    }));
    pushToast('Income entry deleted', undefined, 'info');
  };

  const handleMarkIncomeReceived = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      incomes: prev.incomes.map((i) => (i.id === id ? { ...i, status: 'Received' } : i)),
    }));
    pushToast('Payment marked as received', 'Settled cash metrics updated.');
  };

  // Handlers for Expenses
  const handleSaveExpense = (entry: Omit<ExpenseEntry, 'id'>, existingId?: string) => {
    if (existingId) {
      setWorkspace((prev) => ({
        ...prev,
        expenses: prev.expenses.map((e) => (e.id === existingId ? { ...entry, id: existingId } : e)),
      }));
      pushToast('Expense updated', entry.description);
    } else {
      const newExp: ExpenseEntry = { ...entry, id: `exp-${Date.now()}` };
      setWorkspace((prev) => ({
        ...prev,
        expenses: [newExp, ...prev.expenses],
      }));
      pushToast('Expense recorded', `Logged ₹${entry.amount.toLocaleString('en-IN')}`);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    pushToast('Expense deleted', undefined, 'info');
  };

  // Handlers for Campaigns & Brands
  const handleCreateCampaign = (camp: Omit<Campaign, 'id'>) => {
    const newCamp: Campaign = { ...camp, id: `camp-${Date.now()}` };
    setWorkspace((prev) => ({
      ...prev,
      campaigns: [newCamp, ...prev.campaigns],
    }));
    pushToast('Campaign created', `${camp.name} added to Collaboration Hub.`);
  };

  const handleUpdateCampaign = (updated: Campaign) => {
    setWorkspace((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const handleDeleteCampaign = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      campaigns: prev.campaigns.filter((c) => c.id !== id),
    }));
    pushToast('Campaign deleted', undefined, 'info');
  };

  const handleAddBrand = (brand: Omit<Brand, 'id'>) => {
    setWorkspace((prev) => ({
      ...prev,
      brands: [{ ...brand, id: `brand-${Date.now()}` }, ...prev.brands],
    }));
    pushToast('Brand added', `${brand.name} added to your directory.`);
  };

  const handleRecordCampaignPayment = (campaignId: string, amount: number) => {
    const camp = workspace.campaigns.find((c) => c.id === campaignId);
    if (!camp) return;
    const nextReceived = camp.amountReceived + amount;
    const isPaid = nextReceived >= camp.amount;

    setWorkspace((prev) => ({
      ...prev,
      campaigns: prev.campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              amountReceived: nextReceived,
              status: isPaid ? 'Completed' : c.status,
              activities: [
                {
                  id: `act-${Date.now()}`,
                  date: '2026-11-17',
                  action: 'Payment Recorded',
                  detail: `Received ₹${amount.toLocaleString('en-IN')}`,
                },
                ...c.activities,
              ],
            }
          : c
      ),
      incomes: prev.incomes.some((i) => i.campaignId === campaignId)
        ? prev.incomes.map((i) =>
            i.campaignId === campaignId ? { ...i, status: isPaid ? 'Received' : i.status } : i
          )
        : [
            {
              id: `inc-${Date.now()}`,
              description: `${camp.name} — Payment`,
              source: 'Brand Collaborations',
              platform: camp.platform,
              brand: camp.brandName,
              campaignId: camp.id,
              date: '2026-11-17',
              amount,
              status: 'Received',
              isDemo: false,
            },
            ...prev.incomes,
          ],
    }));
    pushToast('Payment recorded', `₹${amount.toLocaleString('en-IN')} settled for ${camp.name}.`);
  };

  // Handlers for Invoices
  const handleCreateInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInv: Invoice = { ...invoice, id: `inv-${Date.now()}` };
    setWorkspace((prev) => ({
      ...prev,
      invoices: [newInv, ...prev.invoices],
      campaigns: invoice.campaignId
        ? prev.campaigns.map((c) =>
            c.id === invoice.campaignId
              ? { ...c, invoicedAmount: Math.max(c.invoicedAmount, invoice.totalAmount) }
              : c
          )
        : prev.campaigns,
    }));
    pushToast('Invoice generated', `${invoice.invoiceNumber} created.`);
  };

  const handleRecordInvoicePayment = (invoiceId: string, amount: number) => {
    const inv = workspace.invoices.find((i) => i.id === invoiceId);
    if (!inv) return;
    const nextPaid = Math.min(inv.totalAmount, inv.paidAmount + amount);
    const nextStatus = nextPaid >= inv.totalAmount ? 'Paid' : 'Partially Paid';

    setWorkspace((prev) => ({
      ...prev,
      invoices: prev.invoices.map((i) =>
        i.id === invoiceId ? { ...i, paidAmount: nextPaid, status: nextStatus } : i
      ),
      incomes: inv.campaignId
        ? prev.incomes.map((inc) =>
            inc.campaignId === inv.campaignId && nextPaid >= inv.totalAmount
              ? { ...inc, status: 'Received' }
              : inc
          )
        : prev.incomes,
      campaigns: inv.campaignId
        ? prev.campaigns.map((c) =>
            c.id === inv.campaignId
              ? {
                  ...c,
                  amountReceived: Math.min(c.amount, c.amountReceived + amount),
                  status: nextPaid >= inv.totalAmount ? 'Completed' : c.status,
                }
              : c
          )
        : prev.campaigns,
    }));
    pushToast('Invoice payment recorded', `${inv.invoiceNumber} updated to ${nextStatus}.`);
  };

  // Handlers for Content Hub
  const handleAddContent = (item: Omit<ContentItem, 'id'>) => {
    setWorkspace((prev) => ({
      ...prev,
      contents: [{ ...item, id: `cnt-${Date.now()}` }, ...prev.contents],
    }));
    pushToast('Content scheduled', item.title);
  };

  const handleUpdateContent = (item: ContentItem) => {
    setWorkspace((prev) => ({
      ...prev,
      contents: prev.contents.map((c) => (c.id === item.id ? item : c)),
    }));
    pushToast('Content updated', item.title);
  };

  const handleDeleteContent = (id: string) => {
    setWorkspace((prev) => ({
      ...prev,
      contents: prev.contents.filter((c) => c.id !== id),
    }));
    pushToast('Content item deleted', undefined, 'info');
  };

  // Handlers for Budgets & Goals
  const handleUpdateBudget = (category: ExpenseCategory, limit: number) => {
    setWorkspace((prev) => ({
      ...prev,
      budgets: prev.budgets.some((b) => b.category === category)
        ? prev.budgets.map((b) => (b.category === category ? { ...b, monthlyLimit: limit } : b))
        : [...prev.budgets, { category, monthlyLimit: limit }],
    }));
    pushToast('Budget updated', `${category} cap set to ₹${limit.toLocaleString('en-IN')}.`);
  };

  const handleAddGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    setWorkspace((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: `goal-${Date.now()}` }],
    }));
    pushToast('Goal created', goal.title);
  };

  const handleContributeGoal = (goalId: string, amount: number) => {
    setWorkspace((prev) => ({
      ...prev,
      goals: prev.goals.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
          : g
      ),
    }));
    pushToast('Goal progress updated', `Added ₹${amount.toLocaleString('en-IN')}.`);
  };

  const handleDeleteGoal = (goalId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== goalId),
    }));
    pushToast('Goal removed', undefined, 'info');
  };

  // Public & Onboarding Flows
  if (authStage === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setAuthStage('register')}
          onLogin={() => setAuthStage('login')}
          onExploreDashboard={() => {
            setAuthStage('app');
            setActiveRoute('dashboard');
          }}
        />
        <ToastContainer
          toasts={toasts}
          onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))}
        />
      </>
    );
  }

  if (authStage === 'login' || authStage === 'register') {
    return (
      <AuthScreens
        mode={authStage}
        onSwitchMode={(m) => setAuthStage(m)}
        onBackToLanding={() => setAuthStage('landing')}
        onLoginSuccess={(email) => {
          setWorkspace((prev) => ({
            ...prev,
            profile: { ...prev.profile, email },
          }));
          setAuthStage('app');
          setActiveRoute('dashboard');
          pushToast('Signed in to CREATOR OS');
        }}
        onRegisterSuccess={(fullName, email) => {
          setWorkspace((prev) => ({
            ...prev,
            profile: {
              ...prev.profile,
              fullName,
              email,
              isDemoData: false,
            },
          }));
          setAuthStage('onboarding');
        }}
        onUseDemo={() => {
          setWorkspace(DEMO_WORKSPACE_STATE);
          setAuthStage('app');
          setActiveRoute('dashboard');
          pushToast('Demo workspace loaded', 'Viewing Aanya Sharma creator business.');
        }}
      />
    );
  }

  if (authStage === 'onboarding') {
    return (
      <OnboardingFlow
        initialProfile={workspace.profile}
        onComplete={(updatedProfile: CreatorProfile) => {
          setWorkspace((prev) => ({
            ...prev,
            profile: updatedProfile,
          }));
          setAuthStage('app');
          setActiveRoute('dashboard');
          pushToast('Workspace ready', `Welcome, ${updatedProfile.fullName}.`);
        }}
        onCancel={() => {
          setAuthStage('app');
          setActiveRoute('dashboard');
        }}
      />
    );
  }

  const nextInvoiceNum = `INV-2026-0${41 + workspace.invoices.length}`;

  return (
    <div className="min-h-screen flex bg-[#FAFAFC] text-[#171923]">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        profile={workspace.profile}
      />

      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopNavbar
          activeRoute={activeRoute}
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
          workspace={workspace}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNavigate={setActiveRoute}
          onMarkAllRead={() =>
            setWorkspace((prev) => ({
              ...prev,
              notifications: prev.notifications.map((n) => ({ ...n, read: true })),
            }))
          }
          onMarkOneRead={(id) =>
            setWorkspace((prev) => ({
              ...prev,
              notifications: prev.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
              ),
            }))
          }
          onReplayOnboarding={() => setAuthStage('onboarding')}
          onViewLanding={() => setAuthStage('landing')}
          onSignOut={() => setAuthStage('login')}
        />

        <main className="flex-1 mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-8 py-6">
          {activeRoute === 'dashboard' && (
            <MainDashboard
              workspace={workspace}
              summary={summary}
              timeframe={timeframe}
              onChangeTimeframe={setTimeframe}
              onNavigate={setActiveRoute}
              onOpenAddIncome={() => setIncomeModalState({ open: true, edit: null })}
              onOpenAddExpense={() => setExpenseModalState({ open: true, edit: null })}
              onOpenCreateCampaign={() => setCampaignModalOpen(true)}
              onOpenCreateInvoice={() => setInvoiceModalOpen(true)}
            />
          )}

          {activeRoute === 'creator' && (
            <CreatorHub
              profile={workspace.profile}
              campaigns={workspace.campaigns}
              onUpdateProfile={(next) => setWorkspace((prev) => ({ ...prev, profile: next }))}
              onNotify={(title, desc) => pushToast(title, desc)}
            />
          )}

          {activeRoute === 'content' && (
            <ContentHub
              contents={workspace.contents}
              campaigns={workspace.campaigns}
              onAddContent={handleAddContent}
              onUpdateContent={handleUpdateContent}
              onDeleteContent={handleDeleteContent}
            />
          )}

          {activeRoute === 'collaboration' && (
            <CollaborationHub
              campaigns={workspace.campaigns}
              brands={workspace.brands}
              currency={workspace.settings.currency}
              onOpenCreateCampaign={() => setCampaignModalOpen(true)}
              onUpdateCampaign={handleUpdateCampaign}
              onDeleteCampaign={handleDeleteCampaign}
              onAddBrand={handleAddBrand}
              onRecordCampaignPayment={handleRecordCampaignPayment}
            />
          )}

          {activeRoute === 'finance' && (
            <FinanceHub
              summary={summary}
              incomes={workspace.incomes}
              expenses={workspace.expenses}
              invoices={workspace.invoices}
              budgets={workspace.budgets}
              goals={workspace.goals}
              currency={workspace.settings.currency}
              creatorName={workspace.profile.fullName}
              creatorEmail={workspace.profile.email}
              onOpenAddIncome={(edit) =>
                setIncomeModalState({ open: true, edit: edit || null })
              }
              onDeleteIncome={handleDeleteIncome}
              onMarkIncomeReceived={handleMarkIncomeReceived}
              onOpenAddExpense={(edit) =>
                setExpenseModalState({ open: true, edit: edit || null })
              }
              onDeleteExpense={handleDeleteExpense}
              onOpenCreateInvoice={() => setInvoiceModalOpen(true)}
              onRecordInvoicePayment={handleRecordInvoicePayment}
              onUpdateBudget={handleUpdateBudget}
              onAddGoal={handleAddGoal}
              onContributeGoal={handleContributeGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeRoute === 'intelligence' && (
            <IntelligenceHub
              summary={summary}
              incomes={workspace.incomes}
              expenses={workspace.expenses}
              currency={workspace.settings.currency}
              selectedMonth={selectedMonth}
              onChangeMonth={setSelectedMonth}
            />
          )}

          {activeRoute === 'assistant' && (
            <AIAssistantHub
              workspace={workspace}
              selectedMonth={selectedMonth}
              conversations={workspace.conversations}
              onUpdateConversations={(next: AIConversation[]) =>
                setWorkspace((prev) => ({ ...prev, conversations: next }))
              }
            />
          )}

          {activeRoute === 'settings' && (
            <SettingsHub
              workspace={workspace}
              onUpdateSettings={(next: AppSettings) =>
                setWorkspace((prev) => ({ ...prev, settings: next }))
              }
              onUpdateAccount={(fullName, email) =>
                setWorkspace((prev) => ({
                  ...prev,
                  profile: { ...prev.profile, fullName, email },
                }))
              }
              onNavigate={setActiveRoute}
              onResetDemoData={() => {
                setWorkspace(DEMO_WORKSPACE_STATE);
                pushToast('Demo workspace restored');
              }}
              onDeleteAccount={() => {
                localStorage.removeItem(STORAGE_WORKSPACE_KEY);
                localStorage.removeItem(STORAGE_STAGE_KEY);
                setWorkspace(DEMO_WORKSPACE_STATE);
                setAuthStage('landing');
                pushToast('Account cleared', undefined, 'info');
              }}
              onNotify={(title, desc) => pushToast(title, desc)}
            />
          )}

          {activeRoute === 'help' && <HelpSupportHub onNavigate={setActiveRoute} />}
        </main>
      </div>

      {/* Shared Modals */}
      <IncomeModal
        open={incomeModalState.open}
        onClose={() => setIncomeModalState({ open: false, edit: null })}
        campaigns={workspace.campaigns}
        initial={incomeModalState.edit}
        onSave={handleSaveIncome}
      />

      <ExpenseModal
        open={expenseModalState.open}
        onClose={() => setExpenseModalState({ open: false, edit: null })}
        campaigns={workspace.campaigns}
        initial={expenseModalState.edit}
        onSave={handleSaveExpense}
      />

      <CreateCampaignModal
        open={campaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        brands={workspace.brands}
        onCreate={handleCreateCampaign}
      />

      <CreateInvoiceModal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        campaigns={workspace.campaigns}
        nextInvoiceNumber={nextInvoiceNum}
        onCreate={handleCreateInvoice}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))}
      />
    </div>
  );
}
