import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
// For demo purposes, using placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: number;
          title: string;
          description: string | null;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          completed?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          completed?: boolean;
        };
      };
    };
  };
};

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];