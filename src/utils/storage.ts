import { Task, Category } from '../types';

const STORAGE_KEY_TASKS = 'taskflow_tasks_v1';
const STORAGE_KEY_CATEGORIES = 'taskflow_categories_v1';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: 'Work', color: '#3b82f6' },       // blue
  { id: 'personal', name: 'Personal', color: '#10b981' }, // emerald
  { id: 'shopping', name: 'Shopping', color: '#f59e0b' }, // amber
  { id: 'health', name: 'Health', color: '#ec4899' },     // pink
];

// Helper to get today's date formatted as YYYY-MM-DD
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to get tomorrow's date
export const getTomorrowDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'demo-1',
    title: 'Review project requirements & design',
    description: 'Ensure all specifications from the user brief are met with clean UI and responsive layout.',
    completed: true,
    priority: 'high',
    category: 'Work',
    dueDate: getTodayDateString(),
    createdAt: Date.now() - 3600000 * 4,
    completedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'demo-2',
    title: 'Pick up groceries from farmer\'s market',
    description: 'Fresh vegetables, sourdough bread, oat milk, and organic eggs.',
    completed: false,
    priority: 'medium',
    category: 'Shopping',
    dueDate: getTodayDateString(),
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'demo-3',
    title: 'Schedule annual dental checkup',
    description: 'Call Dr. Miller\'s dental clinic to confirm routine cleaning.',
    completed: false,
    priority: 'low',
    category: 'Health',
    dueDate: getTomorrowDateString(),
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'demo-4',
    title: 'Prepare presentation slides for team weekly sync',
    description: 'Summarize Q3 sprint velocity and roadmap milestones.',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: getTomorrowDateString(),
    createdAt: Date.now() - 1800000,
  },
];

export const loadTasksFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TASKS);
    if (!raw) return INITIAL_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_TASKS;
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return INITIAL_TASKS;
  }
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
};

export const loadCategoriesFromStorage = (): Category[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch (err) {
    console.error('Failed to load categories from localStorage', err);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategoriesToStorage = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories to localStorage', err);
  }
};
