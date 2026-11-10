export const BUSINESS_TYPES = [
  'Real Estate',
  'Mortgage',
  'Insurance',
  'Title Company',
  'Construction',
  'Property Management',
  'Investing',
  'Other',
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const BRAND = {
  name: 'VIBE',
  fullName: 'VERTICAL INTEGRATION BUSINESS ENTERPRISE',
  tagline: '10 businesses. One CRM. Zero chaos.',
  subtitle: 'Title company. Construction. Real estate. Mortgage. Insurance. All your leads, pipelines, and financials in one login.',
  domain: 'example.com',
  email: 'hello@example.com',
  twitter: '' as string, // e.g. '@yourhandle'
  launchWindow: 'Spring 2026',
} as const;

export const COLORS = {
  gold: '#D4A017',
  goldLight: '#E8C547',
  goldDark: '#B8860B',
  dark: '#0A0A0F',
  darkMid: '#1A1A2E',
  light: '#FAFAFA',
} as const;

export const FOUNDING = {
  totalSpots: 50,
  perks: [
    { title: '60 days free trial', detail: '4x the normal 14-day trial. Build the habit before you pay.' },
    { title: 'Pro features for 6 months', detail: 'Any plan gets full Pro-tier features for 6 months.' },
    { title: '40% off Year 1', detail: 'Starter: $600/mo. Pro: $900/mo. Enterprise: $1,500/mo.' },
    { title: '20% off permanently after', detail: 'Locked in forever. The price only goes up from here.' },
    { title: 'Direct line to the founder', detail: 'Personal onboarding, priority support, feature request influence.' },
  ],
} as const;

export const PAIN_QUOTES = [
  { text: "I'm paying $400/mo for Follow Up Boss and still using spreadsheets for my mortgage leads", author: 'Sample quote' },
  { text: "Why can't any CRM handle both my real estate AND insurance business?", author: 'Sample quote' },
  { text: 'I have 4 different logins for 4 different tools and leads fall through the cracks daily', author: 'Sample quote' },
  { text: "My bookkeeper and my CRM don't talk to each other. I'm the middleware.", author: 'Sample quote' },
  { text: 'Spent $2000 on CINC last month. Half my leads never got contacted.', author: 'Sample quote' },
  { text: 'Every time I switch tools I lose 2 weeks of momentum and half my data', author: 'Sample quote' },
] as const;

export const COMPETITORS = [
  { name: 'Follow Up Boss', price: '~$345/mo', unified: false, multiSite: false, qbo: false, dashboards: false, comms: 'Partial', idx: 'Add-on', multiTenant: false },
  { name: 'LionDesk', price: '~$75/mo', unified: false, multiSite: false, qbo: false, dashboards: false, comms: 'Yes', idx: 'Add-on', multiTenant: false },
  { name: 'CINC', price: '~$500/mo', unified: false, multiSite: false, qbo: false, dashboards: false, comms: false, idx: 'Locked-in', multiTenant: false },
  { name: 'Sierra', price: '~$300/mo', unified: false, multiSite: false, qbo: false, dashboards: false, comms: false, idx: 'Yes', multiTenant: false },
] as const;

export const FEATURES = [
  {
    title: 'Unified Leads',
    headline: 'One contact. Every business line.',
    description: 'RE, mortgage, insurance, investing — one timeline, zero duplicates.',
    problem: 'Leads scattered across 4 different platforms',
  },
  {
    title: 'Multi-Site Capture',
    headline: 'Every site feeds one engine.',
    description: 'Authority sites, campaign pages, landing pages — all leads flow to one CRM.',
    problem: 'Multiple websites with no unified lead capture',
  },
  {
    title: 'Owner Dashboards',
    headline: 'CEO view. CFO view. One login.',
    description: 'Pipeline health + QuickBooks-synced financials across all entities.',
    problem: 'No way to see pipeline + finances in one place',
  },
  {
    title: 'Communication Hub',
    headline: 'Call. Text. Email. One place.',
    description: 'Twilio-powered comms with full logging and automated sequences.',
    problem: 'Communication scattered across email, phone, and text apps',
  },
] as const;

export const WORKFLOW_STEPS = [
  { step: 1, title: 'Lead hits your site', description: 'Forms, campaigns, social — every source captured.' },
  { step: 2, title: 'Auto-captured + deduped', description: 'No duplicates, UTM tracked, one unified contact.' },
  { step: 3, title: 'Assigned in < 30 seconds', description: 'Round robin or rules-based. Speed-to-lead is everything.' },
  { step: 4, title: 'Agent contacts via VIBE', description: 'Call, text, email — all logged to the timeline automatically.' },
  { step: 5, title: 'Deal moves through pipeline', description: 'Kanban stages from lead to close. Everyone sees the same board.' },
  { step: 6, title: 'Revenue syncs to QuickBooks', description: 'Close the deal, financials sync automatically. CFO sees it instantly.' },
] as const;

export const DAY_COMPARISON = [
  { time: '6:00 AM', without: 'Check 3 inboxes for new leads', with: 'All leads already assigned overnight' },
  { time: '7:30 AM', without: 'Copy leads from email to spreadsheet', with: "Open VIBE. Everything's there." },
  { time: '9:00 AM', without: 'Log into FUB, then LionDesk, then QuickBooks', with: 'One login. One dashboard.' },
  { time: '11:00 AM', without: 'Realize a lead from Tuesday was never contacted', with: 'Auto-sequence already sent 3 touchpoints' },
  { time: '3:00 PM', without: 'Bookkeeper asks for revenue numbers, scramble', with: 'CFO dashboard. One click.' },
  { time: '5:00 PM', without: 'Exhausted from tool-juggling, still behind', with: 'Closed 2 deals. Left early.' },
] as const;

export const TECH_STACK = [
  { name: 'Next.js', description: 'React framework, server-first' },
  { name: 'Prisma', description: 'Type-safe database layer' },
  { name: 'Neon', description: 'Serverless Postgres, branches like git' },
  { name: 'Clerk', description: 'Multi-tenant auth in minutes' },
  { name: 'Stripe', description: 'Subscriptions + billing, done right' },
  { name: 'Twilio', description: 'SMS, calls, full logging' },
  { name: 'Postmark', description: '99%+ email deliverability' },
] as const;

export const CHAT_MESSAGES = [
  { sender: 'Agent A', role: 'Sample', message: "I'm the middleware between my CRM and my bookkeeper.", reactions: { angry: 47, hundred: 23 } },
  { sender: 'VIBE', role: null, message: 'VIBE syncs QuickBooks hourly. Automatically.' },
  { sender: 'Agent B', role: 'Sample', message: "Why can't one tool handle RE + mortgage + insurance?", reactions: { weary: 31, fire: 18 } },
  { sender: 'VIBE', role: null, message: 'VIBE was built for exactly this. One lead, every business line.' },
  { sender: 'Agent C', role: 'Sample', message: "I'm paying $400/mo and still using spreadsheets.", reactions: { skull: 52, angry: 29 } },
  { sender: 'VIBE', role: null, message: 'Founding members start at $600/mo for everything. No spreadsheets.' },
] as const;
