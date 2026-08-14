import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FileText,
  Filter,
  Download,
  Share2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { ActionChecklistItem, UserProfile } from '../types';

interface ActionsFlowProps {
  userProfile: UserProfile;
  checklists: ActionChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onAddChecklist: (item: ActionChecklistItem) => void;
  onDeleteChecklist: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const ActionsFlow: React.FC<ActionsFlowProps> = ({
  userProfile,
  checklists,
  onToggleChecklist,
  onAddChecklist,
  onDeleteChecklist,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newCategory, setNewCategory] = useState('Personal Task');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredItems = checklists.filter((item) => {
    if (filter === 'pending') return !item.isCompleted;
    if (filter === 'completed') return item.isCompleted;
    return true;
  });

  const completedCount = checklists.filter((c) => c.isCompleted).length;
  const progressPercent = checklists.length > 0 ? Math.round((completedCount / checklists.length) * 100) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAddChecklist({
        id: `act-custom-${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        dueDate: newDueDate || 'No deadline',
        isCompleted: false,
        sourceDocName: 'Manual Entry',
        priority: newPriority,
      });
      setNewTitle('');
      setNewDueDate('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5EFE6] text-[#93441B] border border-[#E8DCCB]">
            <ListTodo className="w-3.5 h-3.5 text-[#C25E2B]" />
            <span>Action & Execution Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-[#2D2D2D] tracking-tight mt-1">
            My Action Checklists
          </h1>
          <p className="text-sm text-[#6B6355]">
            Concrete next steps extracted from documents, appointments, and forms.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#C25E2B] hover:bg-[#A84B1D] text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : 'Add Custom Task'}</span>
        </button>
      </div>

      {/* Progress & Stats Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#EFE8DC] shadow-artistic grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        <div>
          <div className="text-xs font-bold text-[#7A7265] uppercase tracking-wider">Overall Progress</div>
          <div className="text-2xl font-black font-serif text-[#2D2D2D] mt-0.5">{progressPercent}% Completed</div>
          <div className="text-xs text-[#6B6355] mt-1">{completedCount} of {checklists.length} tasks done</div>
        </div>

        <div className="sm:col-span-2">
          <div className="w-full h-3 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#EFE8DC]">
            <div
              className="h-full bg-gradient-to-r from-[#C25E2B] to-[#E67E22] rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Task Form Drawer */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#E8DCCB] shadow-sm space-y-4"
          >
            <h3 className="text-sm font-bold font-serif text-[#93441B] uppercase tracking-wider">
              Create New Action Item
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Task title (e.g. 'Get doctor signature on medical slip')..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8DC] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/50 text-[#2D2D2D]"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="Due date (e.g. 'Sept 17, 2026')..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EFE8DC] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#C25E2B]/50 text-[#2D2D2D]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-[#6B6355]">Priority:</span>
                {(['high', 'medium', 'low'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewPriority(p)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs capitalize transition-all cursor-pointer ${
                      newPriority === p
                        ? p === 'high'
                          ? 'bg-rose-600 text-white'
                          : p === 'medium'
                          ? 'bg-[#C25E2B] text-white'
                          : 'bg-[#2D2D2D] text-white'
                        : 'bg-white text-[#5A5248] border border-[#EFE8DC]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#C25E2B] hover:bg-[#A84B1D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Save Action Item
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-3">
        <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EFE8DC]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            All Tasks ({checklists.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'pending' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            Pending ({checklists.filter((c) => !c.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filter === 'completed' ? 'bg-white text-[#2D2D2D] shadow-xs' : 'text-[#7A7265] hover:text-[#2D2D2D]'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <button
          onClick={() => onNavigate('understand')}
          className="text-xs font-bold text-[#C25E2B] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Scan Another Document →</span>
        </button>
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-[#EFE8DC] text-[#7A7265] text-sm">
            No action items found under this filter.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start justify-between gap-4 bg-white shadow-artistic ${
                item.isCompleted
                  ? 'border-[#EFE8DC] bg-[#FAF7F2]/60 opacity-70'
                  : item.priority === 'high'
                  ? 'border-rose-200 hover:border-rose-300'
                  : 'border-[#EFE8DC] hover:border-[#D6C2A5]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => onToggleChecklist(item.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5 cursor-pointer ${
                    item.isCompleted
                      ? 'bg-[#3A6B4F] border-[#3A6B4F] text-white'
                      : 'border-[#A89F91] hover:border-[#3D352B] bg-white'
                  }`}
                  aria-label={`Mark task as ${item.isCompleted ? 'pending' : 'completed'}`}
                >
                  {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                </button>

                <div className="space-y-1">
                  <div
                    className={`text-sm font-bold ${
                      item.isCompleted ? 'line-through text-[#A89F91]' : 'text-[#2D2D2D]'
                    }`}
                  >
                    {item.title}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A7265]">
                    <span className="font-semibold text-[#2D5A40] bg-[#F0F7F3] px-2 py-0.5 rounded-md border border-[#D0E6D9]">
                      {item.category}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#A89F91]" />
                      Due {item.dueDate}
                    </span>
                    {item.sourceDocName && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-[#A89F91]">
                          <FileText className="w-3.5 h-3.5" />
                          {item.sourceDocName}
                        </span>
                      </>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-xs text-[#6B6355] mt-1 italic">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    item.priority === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : item.priority === 'medium'
                      ? 'bg-[#F5EFE6] text-[#93441B]'
                      : 'bg-[#FAF7F2] text-[#6B6355]'
                  }`}
                >
                  {item.priority}
                </span>

                <button
                  onClick={() => onDeleteChecklist(item.id)}
                  className="p-1.5 rounded-lg text-[#A89F91] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
