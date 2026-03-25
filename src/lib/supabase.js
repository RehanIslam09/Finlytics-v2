import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@clerk/clerk-react';
import { useRef } from 'react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function useSupabaseClient() {
  const { getToken } = useAuth();
  const clientRef = useRef(null);
  const tokenRef = useRef(null);

  const getSupabase = async () => {
    const token = await getToken({ template: 'supabase' });

    // Reuse client if token hasn't changed
    if (token === tokenRef.current && clientRef.current) {
      return clientRef.current;
    }

    tokenRef.current = token;
    clientRef.current = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    return clientRef.current;
  };

  return getSupabase;
}
