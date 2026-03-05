import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export let supabase: ReturnType<typeof createClient> | null = null;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials missing. Check .env.local file. Database operations will be skipped.');
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}
