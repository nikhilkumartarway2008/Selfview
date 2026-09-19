import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { dbService } from '../../services/db';
import { Search, X, BookOpen, FileText, Target, Calendar, Award, CheckCircle } from 'lucide-react';

interface SearchModalProps {
  profile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ profile, isOpen, onClose }) => {
  const userId = profile?.uid || 'default-user';
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Gather actual records
  const tasks = dbService.getTasks(userId).filter(t => t.title.toLowerCase().includes(q));
  const courses = dbService.getAcademicCourses(userId).filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  const goals = dbService.getPersonalGoals(userId).filter(g => g.title.toLowerCase().includes(q));
  const memories = dbService.getMemories(userId).filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
  const journal = dbService.getJournal(userId);
  const journalMatches = journal && (journal.title.toLowerCase().includes(q) || journal.content.toLowerCase().includes(q));

  const hasResults = q.length > 0 && (tasks.length > 0 || courses.length > 0 || goals.length > 0 || memories.length > 0 || journalMatches);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search input header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes, notes, memories, goals, tasks..."
            autoFocus
            className="flex-1 bg-transparent border-none text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {q.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm font-semibold">Type to search across your DayVault database</p>
              <p className="text-xs">Find tasks, subjects, goals, memories, and journal notes instantly.</p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="text-sm font-semibold">No results found for "{query}"</p>
              <p className="text-xs">Try searching with a different keyword.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Academic Subjects ({courses.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {courses.map(c => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-indigo-600">{c.code}</span>
                          <h5 className="font-bold text-sm">{c.name}</h5>
                        </div>
                        <span className="text-xs text-slate-400">{c.instructor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Tasks ({tasks.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {tasks.map(t => (
                      <div key={t.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border flex items-center justify-between">
                        <span className="font-semibold text-sm">{t.title}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${t.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {t.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {goals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-500" />
                    <span>Goals ({goals.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {goals.map(g => (
                      <div key={g.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border flex items-center justify-between">
                        <span className="font-semibold text-sm">{g.title}</span>
                        <span className="text-xs font-bold text-amber-500">{g.currentProgress}/{g.target} {g.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {memories.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-pink-500" />
                    <span>Memories & Vault ({memories.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {memories.map(m => (
                      <div key={m.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border flex items-center gap-3">
                        {m.imageUrls?.[0] && (
                          <img src={m.imageUrls[0]} alt={m.title} className="w-10 h-10 rounded-xl object-cover" />
                        )}
                        <div>
                          <h5 className="font-bold text-sm">{m.title}</h5>
                          <p className="text-xs text-slate-400">{m.date} • {m.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
