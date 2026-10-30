export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string; // YYYY-MM-DD
  createdAt: number; // timestamp
  completedAt?: number;
}

export type ViewFilter = 'all' | 'today' | 'upcoming' | 'completed';

export type SortOption = 'created_desc' | 'created_asc' | 'due_date' | 'priority' | 'alphabetical';

export interface Category {
  id: string;
  name: string;
  color: string;
}
