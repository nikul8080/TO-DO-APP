import React from 'react';
import { CheckCheck, Trash2, ArrowUpDown } from 'lucide-react';
import { SortOption } from '../types';

interface StatsBarProps {
  totalTasks: number;
  completedTasks: number;
  onClearCompleted: () => void;
  onMarkAllCompleted: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalTasks,
  completedTasks,
  onClearCompleted,
  onMarkAllCompleted,
  sortBy,
  onSortChange,
}) => {
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingCount = totalTasks - completedTasks;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Progress summary */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              {completedTasks} of {totalTasks} tasks completed
            </span>
            <span className="text-slate-500 font-mono tabular-nums font-semibold">
              {percentage}%
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-between sm:justify-end">
          {/* Sort dropdown */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-600">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-slate-700 focus:outline-none text-xs font-medium cursor-pointer"
            >
              <option value="created_desc">Newest First</option>
              <option value="created_asc">Oldest First</option>
              <option value="due_date">Due Date</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={onMarkAllCompleted}
              className="px-2.5 py-1 text-xs text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg font-medium transition-colors flex items-center gap-1"
              title="Mark all pending tasks as done"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mark all done</span>
            </button>
          )}

          {completedTasks > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-medium transition-colors flex items-center gap-1"
              title="Remove all completed tasks"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
