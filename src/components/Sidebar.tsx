import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  CalendarDays, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles,
  Tag
} from 'lucide-react';
import { ViewFilter, Category, Priority, Task } from '../types';

interface SidebarProps {
  currentView: ViewFilter;
  onViewChange: (view: ViewFilter) => void;
  selectedPriority: Priority | 'all';
  onPriorityChange: (priority: Priority | 'all') => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: Category[];
  onAddCategory: (name: string, color: string) => void;
  tasks: Task[];
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetTasks: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  selectedPriority,
  onPriorityChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onAddCategory,
  tasks,
  onExportJSON,
  onImportJSON,
  onResetTasks,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatColor, setNewCatColor] = useState('#6366f1');

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const counts = {
    all: tasks.length,
    today: tasks.filter(t => t.dueDate === todayStr).length,
    upcoming: tasks.filter(t => t.dueDate && t.dueDate > todayStr && !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    onAddCategory(newCatName.trim(), newCatColor);
    setNewCatName('');
    setIsAddingCat(false);
  };

  const availableColors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#64748b'];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-lg shadow-sm">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              TaskFlow
            </h1>
            <p className="text-xs text-slate-400">To-Do & Productivity</p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Main Views */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Views
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => {
                onViewChange('all');
                onCategoryChange(null);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'all' && selectedCategory === null
                  ? 'bg-teal-500/15 text-teal-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>All Tasks</span>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">{counts.all}</span>
            </button>

            <button
              onClick={() => {
                onViewChange('today');
                onCategoryChange(null);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'today' && selectedCategory === null
                  ? 'bg-teal-500/15 text-teal-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Today</span>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">{counts.today}</span>
            </button>

            <button
              onClick={() => {
                onViewChange('upcoming');
                onCategoryChange(null);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'upcoming' && selectedCategory === null
                  ? 'bg-teal-500/15 text-teal-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-blue-400" />
                <span>Upcoming</span>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">{counts.upcoming}</span>
            </button>

            <button
              onClick={() => {
                onViewChange('completed');
                onCategoryChange(null);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'completed' && selectedCategory === null
                  ? 'bg-teal-500/15 text-teal-300 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Completed</span>
              </div>
              <span className="text-xs text-slate-400 font-mono tabular-nums">{counts.completed}</span>
            </button>
          </nav>
        </div>

        {/* Priority Filter */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Priority
          </div>
          <div className="grid grid-cols-4 gap-1 px-1 bg-slate-800/50 p-1 rounded-lg">
            {(['all', 'high', 'medium', 'low'] as const).map((pri) => (
              <button
                key={pri}
                onClick={() => onPriorityChange(pri)}
                className={`py-1 text-xs font-medium rounded capitalize transition-all ${
                  selectedPriority === pri
                    ? pri === 'high'
                      ? 'bg-rose-500/20 text-rose-300 font-semibold shadow-xs'
                      : pri === 'medium'
                      ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-xs'
                      : pri === 'low'
                      ? 'bg-blue-500/20 text-blue-300 font-semibold shadow-xs'
                      : 'bg-slate-700 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {pri}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Categories
            </span>
            <button
              onClick={() => setIsAddingCat(!isAddingCat)}
              className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded"
              title="Add category"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isAddingCat && (
            <form onSubmit={handleCreateCategory} className="mb-2 p-2.5 bg-slate-800/80 rounded-lg space-y-2 border border-slate-700">
              <input
                type="text"
                placeholder="Category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-slate-700 text-white px-2 py-1.5 rounded focus:outline-none focus:border-teal-400"
                autoFocus
              />
              <div className="flex items-center gap-1.5 pt-1">
                {availableColors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setNewCatColor(color)}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      newCatColor === color ? 'scale-125 ring-2 ring-white ring-offset-1 ring-offset-slate-800' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingCat(false)}
                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 text-[11px] bg-teal-600 hover:bg-teal-500 text-white rounded font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          <nav className="space-y-1">
            {categories.map((cat) => {
              const catTasksCount = tasks.filter((t) => t.category === cat.name).length;
              const isSelected = selectedCategory === cat.name;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(isSelected ? null : cat.name);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">{catTasksCount}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Storage & Utilities Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Browser Storage</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Saved
          </span>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={onExportJSON}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors text-[11px]"
            title="Download backup JSON"
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>

          <label
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer transition-colors text-[11px]"
            title="Upload tasks JSON"
          >
            <Upload className="w-3 h-3" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportJSON}
              className="hidden"
            />
          </label>

          <button
            onClick={onResetTasks}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 rounded transition-colors"
            title="Reset to default tasks"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-slate-800">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Container */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
