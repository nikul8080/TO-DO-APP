import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Menu, 
  Plus, 
  CheckCircle2, 
  Filter, 
  X, 
  RotateCcw,
  Sparkles,
  ListTodo
} from 'lucide-react';
import { 
  Task, 
  Category, 
  ViewFilter, 
  Priority, 
  SortOption 
} from './types';
import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  loadCategoriesFromStorage, 
  saveCategoriesToStorage,
  INITIAL_TASKS
} from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { TaskInput } from './components/TaskInput';
import { TaskItem } from './components/TaskItem';
import { TaskModal } from './components/TaskModal';
import { StatsBar } from './components/StatsBar';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [categories, setCategories] = useState<Category[]>(() => loadCategoriesFromStorage());
  const [currentView, setCurrentView] = useState<ViewFilter>('all');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('created_desc');
  
  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Undo delete toast state
  const [deletedTask, setDeletedTask] = useState<{ task: Task; index: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist tasks on change
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Persist categories on change
  useEffect(() => {
    saveCategoriesToStorage(categories);
  }, [categories]);

  // Handle toast timeout
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Add Task
  const handleAddTask = (newTaskData: {
    title: string;
    description?: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: newTaskData.title,
      description: newTaskData.description,
      priority: newTaskData.priority,
      category: newTaskData.category,
      dueDate: newTaskData.dueDate,
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setToastMessage('Task added');
  };

  // Edit Task
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveModal = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => {
    if (editingTask) {
      // Updating existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...taskData }
            : t
        )
      );
      setToastMessage('Task updated');
    } else {
      // Creating new task via modal
      handleAddTask(taskData);
    }
    setEditingTask(null);
  };

  // Quick inline update title
  const handleQuickUpdateTitle = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  // Toggle complete
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? Date.now() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Delete Task with Undo option
  const handleDeleteTask = (id: string) => {
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return;
    const taskToDelete = tasks[taskIndex];

    setDeletedTask({ task: taskToDelete, index: taskIndex });
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setToastMessage(`Task "${taskToDelete.title.substring(0, 24)}${taskToDelete.title.length > 24 ? '...' : ''}" deleted`);
  };

  // Undo Delete
  const handleUndoDelete = () => {
    if (!deletedTask) return;
    setTasks((prev) => {
      const copy = [...prev];
      copy.splice(deletedTask.index, 0, deletedTask.task);
      return copy;
    });
    setDeletedTask(null);
    setToastMessage('Task restored');
  };

  // Batch: Clear completed
  const handleClearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    setToastMessage(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`);
  };

  // Batch: Mark all completed
  const handleMarkAllCompleted = () => {
    const pendingCount = tasks.filter((t) => !t.completed).length;
    if (pendingCount === 0) return;
    const now = Date.now();
    setTasks((prev) =>
      prev.map((t) => (t.completed ? t : { ...t, completed: true, completedAt: now }))
    );
    setToastMessage(`Marked all ${pendingCount} tasks as done`);
  };

  // Add Category
  const handleAddCategory = (name: string, color: string) => {
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setToastMessage('Category already exists');
      return;
    }
    const newCat: Category = {
      id: 'cat_' + Date.now(),
      name,
      color,
    };
    setCategories((prev) => [...prev, newCat]);
    setToastMessage(`Category "${name}" created`);
  };

  // Reset to default sample tasks
  const handleResetTasks = () => {
    if (window.confirm('Reset tasks to the default sample list? Your current tasks will be replaced.')) {
      setTasks(INITIAL_TASKS);
      setToastMessage('Reset to initial tasks');
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      tasks,
      categories,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('Tasks exported to JSON');
  };

  // Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.tasks)) {
          setTasks(parsed.tasks);
          if (Array.isArray(parsed.categories)) {
            setCategories(parsed.categories);
          }
          setToastMessage('Tasks successfully imported');
        } else if (Array.isArray(parsed)) {
          setTasks(parsed);
          setToastMessage('Tasks successfully imported');
        } else {
          alert('Invalid tasks backup file format.');
        }
      } catch (err) {
        alert('Failed to parse backup file. Please provide valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter & Sort tasks
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q) ?? false;
          const matchCategory = task.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCategory) return false;
        }

        // View filter
        if (currentView === 'today') {
          if (task.dueDate !== todayStr) return false;
        } else if (currentView === 'upcoming') {
          if (!task.dueDate || task.dueDate <= todayStr || task.completed) return false;
        } else if (currentView === 'completed') {
          if (!task.completed) return false;
        }

        // Priority filter
        if (selectedPriority !== 'all') {
          if (task.priority !== selectedPriority) return false;
        }

        // Category filter
        if (selectedCategory !== null) {
          if (task.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'created_asc':
            return a.createdAt - b.createdAt;
          case 'due_date': {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
          }
          case 'priority': {
            const priWeight = { high: 3, medium: 2, low: 1 };
            return priWeight[b.priority] - priWeight[a.priority];
          }
          case 'alphabetical':
            return a.title.localeCompare(b.title);
          case 'created_desc':
          default:
            return b.createdAt - a.createdAt;
        }
      });
  }, [tasks, currentView, selectedPriority, selectedCategory, searchQuery, sortBy, todayStr]);

  // View Title computation
  const viewTitle = useMemo(() => {
    if (selectedCategory) return selectedCategory;
    switch (currentView) {
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming Tasks';
      case 'completed':
        return 'Completed Tasks';
      case 'all':
      default:
        return 'All Tasks';
    }
  }, [currentView, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onViewChange={(v) => {
          setCurrentView(v);
          setSelectedCategory(null);
        }}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        onAddCategory={handleAddCategory}
        tasks={tasks}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onResetTasks={handleResetTasks}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-baseline gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  {viewTitle}
                </h1>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>
            </div>

            {/* Search Bar & New Task button */}
            <div className="flex items-center gap-2">
              <div className="relative w-36 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs pl-9 pr-7 py-2 rounded-xl border border-transparent focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 focus:outline-none transition-all placeholder-slate-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Task</span>
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-6 space-y-5">
          {/* Active Filter Chips / Badges banner (if priority or category filter active) */}
          {(selectedPriority !== 'all' || selectedCategory !== null || searchQuery) && (
            <div className="flex items-center justify-between text-xs bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500 font-medium">Filtering by:</span>
                {selectedPriority !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-medium capitalize">
                    Priority: {selectedPriority}
                    <button onClick={() => setSelectedPriority('all')} className="hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== null && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedPriority('all');
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="text-[11px] text-teal-700 hover:text-teal-800 font-medium hover:underline shrink-0 ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Quick Task Input Bar */}
          <TaskInput
            onAddTask={(data) => handleAddTask(data)}
            categories={categories}
          />

          {/* Overall Stats & Batch Bar */}
          <StatsBar
            totalTasks={tasks.length}
            completedTasks={tasks.filter((t) => t.completed).length}
            onClearCompleted={handleClearCompleted}
            onMarkAllCompleted={handleMarkAllCompleted}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Task List */}
          <div className="space-y-2.5">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  categories={categories}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onEdit={handleOpenEdit}
                  onQuickUpdateTitle={handleQuickUpdateTitle}
                />
              ))
            ) : (
              <div className="py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <ListTodo className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {searchQuery || selectedCategory || selectedPriority !== 'all'
                    ? 'No matching tasks'
                    : 'No tasks in this view'}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  {searchQuery || selectedCategory || selectedPriority !== 'all'
                    ? 'Try adjusting your search query or removing active filters.'
                    : 'Stay organized and focused. Add your next task using the input box above.'}
                </p>
                {(searchQuery || selectedCategory || selectedPriority !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedPriority('all');
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    className="mt-3 text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Undo / Status Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span>{toastMessage}</span>
            {deletedTask && (
              <button
                onClick={handleUndoDelete}
                className="text-teal-400 hover:text-teal-300 font-semibold underline underline-offset-2 ml-1"
              >
                Undo
              </button>
            )}
            <button
              onClick={() => {
                setToastMessage(null);
                setDeletedTask(null);
              }}
              className="text-slate-400 hover:text-white ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>

      {/* Full Task Modal (Add/Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveModal}
        initialTask={editingTask}
        categories={categories}
      />
    </div>
  );
}
