export type AuthStage = 'landing' | 'login' | 'register' | 'onboarding' | 'app';

export type HubRoute =
  | 'dashboard'
  | 'creator'
  | 'content'
  | 'collaboration'
  | 'finance'
  | 'intelligence'
  | 'assistant'
  | 'settings'
  | 'help';

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export type RevenueSource =
  | 'Brand Collaborations'
  | 'YouTube'
  | 'Affiliate Marketing'
  | 'Freelancing'
  | 'Digital Products'
  | 'Sponsorships'
  | 'Other';

export type ExpenseCategory =
  | 'Equipment'
  | 'Editing'
  | 'Software'
  | 'Travel'
  | 'Production'
  | 'Marketing'
  | 'Internet'
  | 'Outsourcing'
  | 'Other';

export type PaymentStatus = 'Received' | 'Pending' | 'Overdue';

export type CampaignStatus =
  | 'Enquiry Received'
  | 'Negotiation'
  | 'Confirmed'
  | 'In Progress'
  | 'Awaiting Approval'
  | 'Completed'
  | 'Payment Pending'
  | 'Closed'
  | 'Cancelled';

export type ContentStatus =
  | 'Idea'
  | 'Script Pending'
  | 'In Production'
  | 'Editing'
  | 'Ready to Publish'
  | 'Published';

export type SocialPlatform = 'Instagram' | 'YouTube' | 'LinkedIn' | 'Facebook' | 'Other';

export type InvoiceStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  handle: string;
  url: string;
  followers: number;
  engagementRate: number;
  connected: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  platform: SocialPlatform;
  imageUrl: string;
  views: number;
  engagementRate: number;
  date: string;
  summary: string;
}

export interface CreatorProfile {
  fullName: string;
  email: string;
  category: string;
  location: string;
  bio: string;
  avatarUrl: string;
  website: string;
  phone: string;
  incomeSources: RevenueSource[];
  socials: SocialAccount[];
  portfolio: PortfolioItem[];
  monthlyIncomeGoal: number;
  savingsTarget: number;
  growthGoal: string;
  isDemoData: boolean;
}

export interface IncomeEntry {
  id: string;
  description: string;
  source: RevenueSource;
  platform: SocialPlatform;
  brand: string;
  campaignId?: string;
  date: string; // YYYY-MM-DD
  amount: number;
  status: PaymentStatus;
  isDemo?: boolean;
}

export interface ExpenseEntry {
  id: string;
  description: string;
  category: ExpenseCategory;
  campaignId?: string;
  vendor: string;
  date: string; // YYYY-MM-DD
  amount: number;
  notes?: string;
  isDemo?: boolean;
}

export interface Brand {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  website: string;
  previousCollaborations: number;
  notes?: string;
}

export interface Deliverable {
  id: string;
  campaignId: string;
  title: string;
  platform: SocialPlatform;
  format: string;
  deadline: string;
  completed: boolean;
}

export interface CampaignActivity {
  id: string;
  date: string;
  action: string;
  detail: string;
}

export interface Campaign {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  platform: SocialPlatform;
  amount: number;
  startDate: string;
  deadline: string;
  paymentTerms: string;
  paymentDueDate: string;
  status: CampaignStatus;
  invoicedAmount: number;
  amountReceived: number;
  contractRef: string;
  usageRights: string;
  exclusivity: string;
  deliverables: Deliverable[];
  activities: CampaignActivity[];
  isDemo?: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  brandName: string;
  campaignId?: string;
  campaignName?: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  notes?: string;
  isDemo?: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  platform: SocialPlatform;
  format: string;
  category: string;
  plannedDate: string;
  campaignId?: string;
  campaignName?: string;
  status: ContentStatus;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    reach: number;
    engagementRate: number;
  };
  isDemo?: boolean;
}

export interface BudgetCategory {
  category: ExpenseCategory;
  monthlyLimit: number;
}

export interface FinancialGoal {
  id: string;
  title: string;
  type: 'Monthly Income Target' | 'Savings Goal' | 'Equipment Purchase' | 'Business Investment';
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info' | 'danger';
  timestamp: string;
  read: boolean;
  targetRoute?: HubRoute;
}

export interface AppSettings {
  currency: CurrencyCode;
  emailNotifications: boolean;
  paymentAlerts: boolean;
  deliverableReminders: boolean;
  aiAutoInsights: boolean;
  aiTone: 'Concise Executive' | 'Detailed Analytical' | 'Strategic Coach';
  twoFactorEnabled: boolean;
  dataSharingOptIn: boolean;
  plan: 'Pro Creator' | 'Starter';
}

export interface AIStructuredCard {
  title: string;
  badgeLabel: string;
  isEstimate?: boolean;
  metrics: Array<{
    label: string;
    value: string;
    tone?: 'neutral' | 'positive' | 'negative' | 'warning' | 'indigo';
  }>;
  chartTitle?: string;
  chartData?: Array<{
    name: string;
    value: number;
    secondary?: number;
  }>;
  dataNote: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredCard?: AIStructuredCard;
  error?: string;
}

export interface AIConversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: AIMessage[];
}

export interface WorkspaceState {
  profile: CreatorProfile;
  incomes: IncomeEntry[];
  expenses: ExpenseEntry[];
  brands: Brand[];
  campaigns: Campaign[];
  invoices: Invoice[];
  contents: ContentItem[];
  budgets: BudgetCategory[];
  goals: FinancialGoal[];
  notifications: NotificationItem[];
  settings: AppSettings;
  conversations: AIConversation[];
}

export type TimeframeOption = '7d' | '30d' | '3m' | '6m' | '1y';

export interface FinanceSummary {
  periodLabel: string;
  totalRevenue: number;
  receivedPayments: number;
  pendingPayments: number;
  overduePayments: number;
  totalExpenses: number;
  netOperatingProfit: number;
  profitMarginPct: number;
  collectionRatePct: number;
  revenueChangePct: number | null;
  expenseChangePct: number | null;
  profitChangePct: number | null;
  monthlySeries: Array<{
    monthKey: string;
    label: string;
    revenue: number;
    received: number;
    expenses: number;
    profit: number;
  }>;
  sourceBreakdown: Array<{
    source: string;
    amount: number;
    sharePct: number;
  }>;
  platformBreakdown: Array<{
    platform: string;
    amount: number;
    sharePct: number;
  }>;
  expenseBreakdown: Array<{
    category: ExpenseCategory;
    amount: number;
    sharePct: number;
    budgetLimit: number;
    utilizationPct: number;
  }>;
  campaignProfitability: Array<{
    campaignId: string;
    campaignName: string;
    brandName: string;
    revenue: number;
    expenses: number;
    profit: number;
    marginPct: number;
    status: CampaignStatus;
  }>;
  cashFlow: {
    openingBalance: number;
    actualReceived: number;
    actualPaid: number;
    expectedIncomingEstimate: number;
    upcomingExpensesEstimate: number;
    projectedClosingEstimate: number;
  };
  insights: Array<{
    id: string;
    title: string;
    detail: string;
    tone: 'indigo' | 'warning' | 'positive' | 'danger';
  }>;
}
