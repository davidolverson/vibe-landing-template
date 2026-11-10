'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadStatus = 'new' | 'contacted' | 'interested' | 'onboarding' | 'active';

interface Lead {
  id: number;
  name: string;
  email: string;
  business_types: string[];
  status: LeadStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface Stats {
  total: number;
  byStatus: { status: string; count: number }[];
}

type SortKey = 'name' | 'email' | 'status' | 'created_at';
type SortDir = 'asc' | 'desc';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: LeadStatus[] = ['new', 'contacted', 'interested', 'onboarding', 'active'];

const STATUS_STYLES: Record<LeadStatus, { dot: string; text: string }> = {
  new:        { dot: 'bg-white/50',    text: 'text-white/50'   },
  contacted:  { dot: 'bg-blue-400',    text: 'text-blue-400'   },
  interested: { dot: 'bg-yellow-400',  text: 'text-yellow-400' },
  onboarding: { dot: 'bg-green-400',   text: 'text-green-400'  },
  active:     { dot: 'bg-emerald-500', text: 'text-emerald-500'},
};

const PILL_COLORS = [
  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  'bg-orange-500/15 text-orange-300 border-orange-500/25',
  'bg-pink-500/15 text-pink-300 border-pink-500/25',
  'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  'bg-teal-500/15 text-teal-300 border-teal-500/25',
  'bg-rose-500/15 text-rose-300 border-rose-500/25',
  'bg-amber-500/15 text-amber-300 border-amber-500/25',
];

function pillColor(type: string): string {
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = (hash * 31 + type.charCodeAt(i)) & 0xffff;
  }
  return PILL_COLORS[hash % PILL_COLORS.length];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso + (iso.endsWith('Z') ? '' : 'Z')).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: new Date(iso).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[130, 180, 120, 90, 200, 80].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded-md bg-white/8 animate-pulse"
            style={{ width: w, maxWidth: '100%' }}
          />
        </td>
      ))}
    </tr>
  );
}

function StatCard({ label, count, gold = false }: { label: string; count: number; gold?: boolean }) {
  return (
    <div
      className="rounded-xl px-5 py-4 flex flex-col gap-1 min-w-0"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${gold ? 'rgba(212,160,23,0.3)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      <span
        className="text-3xl font-bold tabular-nums leading-none"
        style={{ color: gold ? '#D4A017' : '#fff' }}
      >
        {count}
      </span>
      <span className="text-xs uppercase tracking-widest text-white/40 mt-1">{label}</span>
    </div>
  );
}

function StatusSelect({
  leadId,
  current,
  onSaved,
}: {
  leadId: number;
  current: LeadStatus;
  onSaved: (id: number, status: LeadStatus) => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as LeadStatus;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: next }),
      });
      if (res.ok) onSaved(leadId, next);
    } finally {
      setSaving(false);
    }
  }

  const styles = STATUS_STYLES[current];

  return (
    <div className="relative inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
      <select
        value={current}
        onChange={handleChange}
        disabled={saving}
        aria-label="Change lead status"
        className={[
          'appearance-none bg-transparent text-sm font-medium pr-4 cursor-pointer',
          'border-0 outline-none focus-visible:underline',
          'disabled:opacity-50 disabled:cursor-wait',
          styles.text,
        ].join(' ')}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="bg-[#0A0A0F] text-white">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <svg
        className={`absolute right-0 w-3 h-3 pointer-events-none ${styles.text}`}
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 4l4 4 4-4" />
      </svg>
    </div>
  );
}

function NotesCell({
  leadId,
  initial,
  onSaved,
}: {
  leadId: number;
  initial: string;
  onSaved: (id: number, notes: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) setValue(initial);
  }, [initial, editing]);

  function startEdit() {
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  async function save() {
    setEditing(false);
    if (value === initial) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, notes: value }),
      });
      if (res.ok) {
        onSaved(leadId, value);
      } else {
        setValue(initial);
      }
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Escape') {
      setValue(initial);
      setEditing(false);
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      void save();
    }
  }

  if (editing) {
    return (
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => void save()}
        onKeyDown={handleKeyDown}
        rows={3}
        className="w-full min-w-[180px] bg-white/8 border border-[#D4A017]/40 rounded-lg px-3 py-2 text-sm text-white/90 resize-none outline-none focus:border-[#D4A017] placeholder-white/20 leading-snug"
        placeholder="Add a note..."
        aria-label="Edit notes"
      />
    );
  }

  return (
    <button
      onClick={startEdit}
      disabled={saving}
      className="text-left text-sm leading-snug max-w-[220px] w-full group text-white/60 hover:text-white/90 transition-colors duration-150 disabled:opacity-50"
      title="Click to edit notes"
      aria-label={value ? `Notes: ${value}. Click to edit.` : 'Click to add notes'}
    >
      {saving ? (
        <span className="italic text-white/30">Saving…</span>
      ) : value ? (
        <span className="line-clamp-2 group-hover:line-clamp-none transition-all">{value}</span>
      ) : (
        <span className="italic text-white/25 group-hover:text-white/50 transition-colors">
          Add note…
        </span>
      )}
    </button>
  );
}

/* ─── Mobile lead card ─── */
function MobileLeadCard({
  lead,
  onStatusSaved,
  onNotesSaved,
}: {
  lead: Lead;
  onStatusSaved: (id: number, status: LeadStatus) => void;
  onNotesSaved: (id: number, notes: string) => void;
}) {
  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Name + date */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-white/90 text-sm">{lead.name}</p>
          <a
            href={`mailto:${lead.email}`}
            className="text-xs text-white/40 hover:text-[#D4A017] transition-colors break-all"
          >
            {lead.email}
          </a>
        </div>
        <time
          dateTime={lead.created_at}
          title={new Date(lead.created_at).toLocaleString()}
          className="text-[10px] text-white/25 whitespace-nowrap mt-0.5"
        >
          {formatRelative(lead.created_at)}
        </time>
      </div>

      {/* Business types */}
      {lead.business_types.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {lead.business_types.map((t) => (
            <span
              key={t}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${pillColor(t)}`}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Status + Notes */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/5">
        <StatusSelect leadId={lead.id} current={lead.status} onSaved={onStatusSaved} />
        <div className="flex-1 min-w-0">
          <NotesCell leadId={lead.id} initial={lead.notes} onSaved={onNotesSaved} />
        </div>
      </div>
    </div>
  );
}

function SortIcon({ dir, active }: { dir: SortDir; active: boolean }) {
  return (
    <svg
      className={`inline w-3 h-3 ml-1 transition-opacity ${active ? 'opacity-100' : 'opacity-25'}`}
      viewBox="0 0 10 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 0L9 5H1L5 0Z" opacity={active && dir === 'asc' ? 1 : 0.35} />
      <path d="M5 12L1 7H9L5 12Z" opacity={active && dir === 'desc' ? 1 : 0.35} />
    </svg>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/leads');
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `Error ${res.status}`);
        return;
      }
      const data = (await res.json()) as { leads: Lead[]; stats: Stats };
      setLeads(data.leads);
      setStats(data.stats);
    } catch {
      setError('Network error — could not reach the API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeads();
  }, [fetchLeads]);

  const handleStatusSaved = useCallback(
    (id: number, status: LeadStatus) => {
      setLeads((prev) => {
        const old = prev.find((l) => l.id === id)?.status;
        if (!old) return prev;
        setStats((s) => {
          if (!s) return s;
          const updated = s.byStatus.map((b) => {
            if (b.status === old) return { ...b, count: Math.max(0, b.count - 1) };
            if (b.status === status) return { ...b, count: b.count + 1 };
            return b;
          });
          if (!updated.find((b) => b.status === status)) {
            updated.push({ status, count: 1 });
          }
          return { ...s, byStatus: updated };
        });
        return prev.map((l) => (l.id === id ? { ...l, status } : l));
      });
    },
    []
  );

  const handleNotesSaved = useCallback((id: number, notes: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  }, []);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = q
      ? leads.filter(
          (l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
        )
      : leads;

    list = [...list].sort((a, b) => {
      const av = String(a[sortKey]).toLowerCase();
      const bv = String(b[sortKey]).toLowerCase();
      const cmp = av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [leads, search, sortKey, sortDir]);

  function statCount(status: LeadStatus): number {
    return stats?.byStatus.find((s) => s.status === status)?.count ?? 0;
  }

  const columns: { key: SortKey | null; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: null, label: 'Business Types' },
    { key: 'status', label: 'Status' },
    { key: null, label: 'Notes' },
    { key: 'created_at', label: 'Date' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats row + refresh */}
      <section aria-label="Lead statistics">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-white/40 uppercase tracking-widest">
            Waitlist overview
          </h2>
          <button
            onClick={() => void fetchLeads(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white/90 transition-colors"
            aria-label="Refresh data"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M13.65 2.35A8 8 0 1 0 14.83 8" />
              <path d="M14 2v4h-4" />
            </svg>
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Total" count={stats?.total ?? 0} gold />
          <StatCard label="New" count={statCount('new')} />
          <StatCard label="Contacted" count={statCount('contacted')} />
          <StatCard label="Interested" count={statCount('interested')} />
          <StatCard label="Onboarding" count={statCount('onboarding')} />
          <StatCard label="Active" count={statCount('active')} />
        </div>
      </section>

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 4a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0V5zm-.75 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
          {error}
        </div>
      )}

      {/* Leads table */}
      <section
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        aria-label="Leads table"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white/60 shrink-0">
            Waitlist Leads
            {!loading && (
              <span className="ml-2 text-white/30 font-normal">
                ({filteredLeads.length}{search ? ` of ${leads.length}` : ''})
              </span>
            )}
          </h2>
          <div className="relative sm:ml-auto w-full sm:max-w-xs">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="6.5" cy="6.5" r="5" />
              <path d="M11 11l3 3" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or email…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-[#D4A017]/50 focus:bg-white/8 transition-colors"
              aria-label="Filter leads by name or email"
            />
          </div>
        </div>

        {/* ── Mobile card list (below sm) ── */}
        <div className="block sm:hidden px-4 py-4 space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-4 space-y-3 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="h-4 w-32 bg-white/8 rounded" />
                <div className="h-3 w-48 bg-white/5 rounded" />
                <div className="h-3 w-24 bg-white/5 rounded" />
              </div>
            ))
          ) : filteredLeads.length === 0 ? (
            <p className="text-center text-white/30 text-sm py-12">
              {search ? `No leads matching "${search}"` : 'No leads yet — signups will appear here.'}
            </p>
          ) : (
            filteredLeads.map((lead) => (
              <MobileLeadCard
                key={lead.id}
                lead={lead}
                onStatusSaved={handleStatusSaved}
                onNotesSaved={handleNotesSaved}
              />
            ))
          )}
        </div>

        {/* ── Desktop table (sm+) ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[740px] text-sm" aria-label="Waitlist leads">
            <thead>
              <tr
                className="text-xs uppercase tracking-wider border-b border-white/8"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {columns.map(({ key, label }) => (
                  <th
                    key={label}
                    scope="col"
                    className={[
                      'px-4 py-3 text-left font-medium select-none whitespace-nowrap',
                      key ? 'cursor-pointer hover:text-white/70 transition-colors' : '',
                    ].join(' ')}
                    onClick={key ? () => handleSort(key) : undefined}
                    aria-sort={
                      key && sortKey === key
                        ? sortDir === 'asc' ? 'ascending' : 'descending'
                        : undefined
                    }
                  >
                    {label}
                    {key && <SortIcon active={sortKey === key} dir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-white/30 text-sm">
                    {search ? `No leads matching "${search}"` : 'No leads yet — signups will appear here.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 transition-colors duration-100 hover:bg-white/[0.025] group"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-medium text-white/90">{lead.name}</span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-white/50 hover:text-[#D4A017] transition-colors"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1.5 min-w-[130px]">
                        {lead.business_types.length > 0 ? (
                          lead.business_types.map((t) => (
                            <span
                              key={t}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${pillColor(t)}`}
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="text-white/25 text-xs italic">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusSelect leadId={lead.id} current={lead.status} onSaved={handleStatusSaved} />
                    </td>
                    <td className="px-4 py-3.5 max-w-[260px]">
                      <NotesCell leadId={lead.id} initial={lead.notes} onSaved={handleNotesSaved} />
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <time
                        dateTime={lead.created_at}
                        title={new Date(lead.created_at).toLocaleString()}
                        className="text-xs text-white/30"
                      >
                        {formatRelative(lead.created_at)}
                      </time>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredLeads.length > 0 && (
          <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between text-xs text-white/25 gap-4">
            <span>
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}
              {search && ' matched'}
            </span>
            <span className="hidden sm:block">
              Click status to change &bull; Click a note to edit &bull; Cmd+Enter to save / Esc to cancel
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
