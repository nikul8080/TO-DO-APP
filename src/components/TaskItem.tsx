import React, { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Clock 
} from 'lucide-react';
import { Task, Category } from '../types';

interface TaskItemProps {
  task: Task;
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onQuickUpdateTitle: (id: string, newTitle: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  categories,
  onToggleComplete,
  onDelete,
  onEdit,
  onQuickUpdateTitle,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showNotes, setShowNotes] = useState(false);

  const matchedCat = categories.find((c) => c.name.toLowerCase() === task.category.toLowerCase());
  const categoryColor = matchedCat ? matchedCat.color : '#64748b';

  // Format Due Date & calculate overdue status
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  let dueDateLabel = '';
  let isOverdue = false;
  let isDueToday = false;

  if (task.dueDate) {
    if (task.dueDate === todayStr) {
      dueDateLabel = 'Today';
      isDueToday = true;
    } else {
      const due = new Date(task.dueDate + 'T00:00:00');
      const today = new Date(todayStr + 'T00:00:00');
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        dueDateLabel = 'Tomorrow';
      } else if (diffDays === -1) {
        dueDateLabel = 'Yesterday';
        if (!task.completed) isOverdue = true;
      } else if (diffDays < -1) {
        dueDateLabel = `${Math.abs(diffDays)}d overdue`;
        if (!task.completed) isOverdue = true;
      } else {
        dueDateLabel = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    }
  }

  const handleSaveInlineTitle = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onQuickUpdateTitle(task.id, editedTitle.trim());
    } else {
      setEditedTitle(task.title);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveInlineTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-xl border transition-all duration-150 ${
        task.completed
          ? 'border-slate-200/60 bg-slate-50/40 opacity-75'
          : isOverdue
          ? 'border-rose-200 hover:border-rose-300 shadow-xs'
          : 'border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm'
      }`}
    >
      <div className="p-4 flex items-start gap-3.5">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors border ${
            task.completed
              ? 'bg-teal-600 border-teal-600 text-white'
              : 'border-slate-300 hover:border-teal-500 bg-white'
          }`}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Core Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveInlineTitle}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-medium text-slate-800 bg-teal-50/50 border border-teal-400 rounded px-2 py-0.5 focus:outline-none"
                autoFocus
              />
            ) : (
              <h3
                onDoubleClick={() => setIsEditingTitle(true)}
                className={`text-sm font-medium leading-snug cursor-pointer select-none transition-colors break-words ${
                  task.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-800 hover:text-teal-700'
                }`}
                title="Double-click to inline edit"
              >
                {task.title}
              </h3>
            )}
          </div>

          {/* Description snippet or full text */}
          {task.description && (
            <div className="mt-1">
              <p
                className={`text-xs text-slate-500 transition-all ${
                  showNotes ? 'whitespace-pre-wrap' : 'line-clamp-1'
                }`}
              >
                {task.description}
              </p>
              {task.description.length > 80 && (
                <button
                  type="button"
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-[11px] text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-0.5 mt-0.5"
                >
                  {showNotes ? (
                    <>
                      <span>Show less</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <span>Show more</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Unboxed Metadata Line (adhering to frontend-design anti-slop guidelines) */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {/* Category */}
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: categoryColor }}
              />
              {task.category}
            </span>

            <span className="text-slate-300" aria-hidden="true">·</span>

            {/* Priority Indicator */}
            <span
              className={`font-medium capitalize ${
                task.priority === 'high'
                  ? 'text-rose-600'
                  : task.priority === 'medium'
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            >
              {task.priority} Priority
            </span>

            {/* Due Date Indicator */}
            {task.dueDate && (
              <>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    task.completed
                      ? 'text-slate-400'
                      : isOverdue
                      ? 'text-rose-600 font-semibold'
                      : isDueToday
                      ? 'text-amber-600 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  {isOverdue ? (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{dueDateLabel}</span>
                </span>
              </>
            )}

            {/* Created time */}
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              Added {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Hover / Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit task details"
            aria-label="Edit task"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
