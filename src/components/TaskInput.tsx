import React, { useState } from 'react';
import { Plus, Calendar, Flag, Tag, ArrowRight } from 'lucide-react';
import { Priority, Category } from '../types';

interface TaskInputProps {
  onAddTask: (task: {
    title: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => void;
  categories: Category[];
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, categories }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState(categories[0]?.name || 'Personal');
  const [dueDate, setDueDate] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      priority,
      category: category || (categories[0]?.name || 'Personal'),
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDueDate('');
    setShowOptions(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden transition-all focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/10">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            type="submit"
            disabled={!title.trim()}
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              title.trim()
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setShowOptions(true)}
            placeholder="Add a new task... (press Enter to save)"
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                showOptions
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle task options"
            >
              <Flag className={`w-3.5 h-3.5 ${
                priority === 'high' ? 'text-rose-500' : priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
              }`} />
            </button>

            {title.trim() && (
              <button
                type="submit"
                className="hidden sm:flex items-center gap-1 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <span>Add</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {showOptions && (
          <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            {/* Priority Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Priority:</span>
              <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-2 py-0.5 rounded text-[11px] capitalize font-medium transition-colors ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-50 text-rose-700 font-semibold'
                          : p === 'medium'
                          ? 'bg-amber-50 text-amber-700 font-semibold'
                          : 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Category:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-0.5 text-[11px] text-slate-700 focus:outline-none focus:border-teal-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Picker */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Due:</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2 py-0.5 text-[11px] text-slate-700 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
