import React from 'react';
import { JournalEntry } from '../../types';
import { FileText, ArrowRight, Plus } from 'lucide-react';

interface JournalPreviewCardProps {
  journal: JournalEntry | null;
  onOpenJournalModal: () => void;
}

export const JournalPreviewCard: React.FC<JournalPreviewCardProps> = ({ journal, onOpenJournalModal }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Daily Journal</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <h3 className="text-xl font-extrabold tracking-tight mb-3">Today's Journal</h3>

        {!journal ? (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-500">"How was your day?"</p>
            <button
              onClick={onOpenJournalModal}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition flex items-center gap-1.5 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Write Journal</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-bold text-base">{journal.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{journal.content}</p>
          </div>
        )}
      </div>

      {journal && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onOpenJournalModal}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
