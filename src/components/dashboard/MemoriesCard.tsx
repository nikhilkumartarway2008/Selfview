import React from 'react';
import { MemoryItem } from '../../types';
import { Camera, Plus } from 'lucide-react';

interface MemoriesCardProps {
  memories: MemoryItem[];
  onOpenAddMemory: () => void;
}

export const MemoriesCard: React.FC<MemoriesCardProps> = ({ memories, onOpenAddMemory }) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Memories & Moments</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight">Recent Memories</h3>
        </div>
        <button
          onClick={onOpenAddMemory}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Memory</span>
        </button>
      </div>

      {memories.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-500">"Your memories will appear here."</p>
          <button
            onClick={onOpenAddMemory}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition"
          >
            + Add Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memories.map((m) => (
            <div key={m.id} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-sm group">
              <div className="h-40 overflow-hidden relative">
                <img
                  src={m.imageUrl}
                  alt={m.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                  {m.date}
                </span>
              </div>
              <div className="p-3.5">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{m.caption}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
