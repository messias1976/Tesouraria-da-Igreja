import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Adicionando console logs para depuração
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY (primeiros 10 caracteres):', supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'não definido');


if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key está faltando. Por favor, verifique suas variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);