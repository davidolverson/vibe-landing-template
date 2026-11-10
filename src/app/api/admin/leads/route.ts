import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateToken } from '@/lib/auth';
import {
  getAllLeads,
  getLeadStats,
  getLeadById,
  updateLead,
  type Lead,
  type LeadStatus,
} from '@/lib/db';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const COOKIE_NAME = 'vibe_admin_session';

const VALID_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'interested',
  'onboarding',
  'active',
];

// ---------------------------------------------------------------------------
// Auth guard
// ---------------------------------------------------------------------------

/**
 * Reads the vibe_admin_session cookie from the request and validates it
 * against today's expected SHA-256 token via validateToken() in lib/auth.
 * Returns true if the session is valid, false otherwise.
 */
function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return validateToken(token);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parses the business_types JSON string stored in SQLite into a proper array
 * before sending to the client. Returns an empty array on malformed JSON to
 * avoid crashing the response.
 */
function parseLead(lead: Lead): Omit<Lead, 'business_types'> & { business_types: string[] } {
  let business_types: string[] = [];
  try {
    const parsed = JSON.parse(lead.business_types);
    if (Array.isArray(parsed)) {
      business_types = parsed;
    }
  } catch {
    // Malformed JSON stored in DB — return empty array rather than crashing
    console.error(`[Admin Leads] Failed to parse business_types for lead id=${lead.id}`);
  }
  return { ...lead, business_types };
}

// ---------------------------------------------------------------------------
// Validation schemas
// ---------------------------------------------------------------------------

const PatchSchema = z.object({
  id: z.number({ error: 'id is required' }).int().positive(),
  status: z
    .enum(['new', 'contacted', 'interested', 'onboarding', 'active'] as const)
    .optional(),
  notes: z
    .string()
    .max(4000, 'Notes must be 4000 characters or fewer')
    .optional(),
});

// ---------------------------------------------------------------------------
// GET /api/admin/leads
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawLeads = getAllLeads.all() as Lead[];
    const leads = rawLeads.map(parseLead);

    const stats = getLeadStats();

    return NextResponse.json({ leads, stats });
  } catch (error) {
    console.error(
      '[Admin Leads] GET error:',
      error instanceof Error ? error.message : 'Unknown',
    );
    return NextResponse.json({ error: 'Failed to retrieve leads' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/leads
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate with Zod
  const result = PatchSchema.safeParse(body);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? 'Invalid request body' },
      { status: 400 },
    );
  }

  const { id, status, notes } = result.data;

  // At least one field to update must be present
  if (status === undefined && notes === undefined) {
    return NextResponse.json(
      { error: 'Provide at least one of: status, notes' },
      { status: 400 },
    );
  }

  // Fetch current lead — this also doubles as the 404 check
  let existing: Lead | undefined;
  try {
    existing = getLeadById.get(id) as Lead | undefined;
  } catch (error) {
    console.error(
      '[Admin Leads] PATCH getLeadById error:',
      error instanceof Error ? error.message : 'Unknown',
    );
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Merge: only overwrite the fields that were provided in the request body
  const nextStatus: LeadStatus = status ?? existing.status;
  const nextNotes: string = notes ?? existing.notes;

  try {
    // updateLead signature: (status, notes, id)
    updateLead.run(nextStatus, nextNotes, id);
  } catch (error) {
    console.error(
      '[Admin Leads] PATCH updateLead error:',
      error instanceof Error ? error.message : 'Unknown',
    );
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }

  // Re-fetch the updated record to return ground-truth data (including updated_at)
  let updated: Lead | undefined;
  try {
    updated = getLeadById.get(id) as Lead | undefined;
  } catch (error) {
    console.error(
      '[Admin Leads] PATCH re-fetch error:',
      error instanceof Error ? error.message : 'Unknown',
    );
    return NextResponse.json({ error: 'Lead updated but failed to retrieve result' }, { status: 500 });
  }

  if (!updated) {
    // Extremely unlikely but guard anyway
    return NextResponse.json({ error: 'Lead not found after update' }, { status: 500 });
  }

  return NextResponse.json({ lead: parseLead(updated) });
}
