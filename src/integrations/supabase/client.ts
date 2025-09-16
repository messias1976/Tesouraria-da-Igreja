import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://sozymmjdzjqaubuoocpz.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvenltbWpkempxYXVidW9vY3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMzI2MDYsImV4cCI6MjA3MzYwODYwNn0.w8TURksZxJae1V0nW2tm_q_4MWKKEQ2qUD2leqFYBWA";

// Adicionando console logs para depuração
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (primeiros 10 caracteres):', supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'não definido');


if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key está faltando. Por favor, verifique suas variáveis de ambiente.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);