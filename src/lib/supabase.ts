import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kefxhwonbtqgeoakiltq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlZnhod29uYnRxZ2VvYWtpbHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NTE4NDIsImV4cCI6MjEwNjMyNzg0Mn0.7rtByBiQPx1PPp5Xl5zwJ7g67PTxnOCnn0K6H5j1kKE';

// Browser-safe client (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
