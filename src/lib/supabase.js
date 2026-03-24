// ============================================================
// FILE: src/lib/supabase.js
// Authenticated Supabase client — injects Clerk JWT so RLS works
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Unauthenticated client (used only before user signs in) ──
// Do NOT use this for any user data queries
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Authenticated client hook ─────────────────────────────
// Returns a Supabase client that carries the Clerk JWT in every
// request header — this is what makes RLS policies work.
// Usage inside a component or hook:
//   const getSupabase = useSupabaseClient();
//   const client = await getSupabase();
//   const { data } = await client.from('transactions').select('*');

export function useSupabaseClient() {
  const { getToken } = useAuth();

  const getSupabase = async () => {
    // 'supabase' must match the JWT template name in Clerk dashboard exactly
    const token = await getToken({ template: 'supabase' });

    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      // Disable Supabase's own auth handling — Clerk manages auth
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  };

  return getSupabase;
}
