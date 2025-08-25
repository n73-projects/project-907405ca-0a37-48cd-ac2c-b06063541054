// Re-export types from supabase configuration
export type { Task, TaskInsert, TaskUpdate } from '../lib/supabase';
import type { Task } from '../lib/supabase';

// Additional UI state types
export interface TaskFormData {
  title: string;
  description: string;
}

export interface TaskModalProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: TaskFormData) => Promise<void>;
}