
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wosxjkqxkbwxvavozzdo.supabase.co';
const supabaseAnonKey = 'sb_publishable_1H28N-dH2g62eTlllsXYFQ_hUBOoJ2f';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
