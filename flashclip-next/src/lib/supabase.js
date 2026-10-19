// Cliente Supabase compartilhado. A chave é a publicável (pública por definição); as regras de
// acesso ficam no próprio Supabase (RLS).
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mkylyczeakkgksrzffca.supabase.co';
const SUPABASE_KEY = 'sb_publishable_LD9drZgiFn7iQ5FK-PhHOA_Uuv7YeqP';

export const clienteSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);
