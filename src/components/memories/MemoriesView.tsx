import React, { useState, useRef } from 'react';
import { UserProfile, MemoryVaultItem, DailyRecordPlaceholder } from '../../types';
import { dbService } from '../../services/db';
import {
  FolderArchive,
  Camera,
  Image as ImageIcon,
  Mic,
  FileText,
  Paperclip,
  Search,
  Plus,
  Calendar,
  Tag,
  ExternalLink,
  Trash2,
  Play,
  Square,
  Sparkles,
  CheckCircle,
  Clock,
  MapPin,
  X,
  Upload,
  BookOpen
} from 'lucide-react';

interface MemoriesViewProps {
  profile: UserProfile | null;
  onNavigateTab?: (tab: string) => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ profile, onNavigateTab }) => {
  const userId = profile?.uid || 'default-user';
  const todayStr = new Date().toISOString().split('T')[0];

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'photos' | 'documents' | 'voice' | 'events'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [memories, setMemories] = useState<MemoryVaultItem[]>(dbService.getMemories(userId));
  
  // Modal State for Add Memory
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMode, setAddMode] = useState<'options' | 'photo' | 'gallery' | 'voice' | 'note' | 'file'>('options');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayStr);
  const [category, setCategory] = useState('College');
  const [tagsInput, setTagsInput] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  ]);
  const [fileName, setFileName] = useState('');
  const [voiceDuration, setVoiceDuration] = useState('01:12');
  const [voiceTranscription, setVoiceTranscription] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMemoryDetail, setSelectedMemoryDetail] = useState<MemoryVaultItem | null>(null);

  const categoriesList = ['All', 'College', 'Academic', 'Project', 'Achievement', 'Presentation', 'Event', 'Friends', 'Personal', 'General'];

  const handleSaveMemory = (type: 'photo' | 'document' | 'voice' | 'event' | 'note') => {
    if (!title.trim()) {
      alert('Please enter a memory title');
      return;
    }
    const tagsArray = tagsInput.split(',').map(t => t.trim().startsWith('#') ? t.trim() : '#' + t.trim()).filter(t => t.length > 1);

    const newItem: MemoryVaultItem = {
      id: 'mem-' + Math.random().toString(36).substring(2, 9),
      userId,
      title,
      description: description || 'College memory & record',
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
      type,
      imageUrls: type === 'photo' ? imageUrls : undefined,
      fileName: type === 'document' ? (fileName || 'Document_Record.pdf') : undefined,
      fileUrl: type === 'document' ? '#' : undefined,
      voiceNoteUrl: type === 'voice' ? '#' : undefined,
      voiceDuration: type === 'voice' ? voiceDuration : undefined,
      voiceTranscription: type === 'voice' ? (voiceTranscription || 'Recorded voice session transcribed successfully.') : undefined,
      location: location || undefined,
      tags: tagsArray.length > 0 ? tagsArray : ['#college', '#selfview'],
      linkedDate: date,
      createdAt: new Date().toISOString(),
    };

    dbService.saveMemory(newItem);
    setMemories(dbService.getMemories(userId));
    resetForm();
    setIsAddModalOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(todayStr);
    setCategory('College');
    setTagsInput('');
    setLocation('');
    setFileName('');
    setVoiceTranscription('');
    setAddMode('options');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this memory?')) {
      dbService.deleteMemory(id);
      setMemories(dbService.getMemories(userId));
      if (selectedMemoryDetail?.id === id) setSelectedMemoryDetail(null);
    }
  };

  const filteredMemories = memories.filter(m => {
    const matchesSubTab =
      activeSubTab === 'all' ? true :
      activeSubTab === 'photos' ? m.type === 'photo' :
      activeSubTab === 'documents' ? m.type === 'document' :
      activeSubTab === 'voice' ? m.type === 'voice' :
      activeSubTab === 'events' ? m.category === 'Event' || m.category === 'Presentation' : true;

    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.tags && m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesSubTab && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-24 md:pb-12 animate-fadeIn">
      {/* Header & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Selfview Personal Archive</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">🗂️ Memory & Document Vault</h2>
          <p className="text-sm text-slate-500 mt-0.5">Preserve photos, voice memos, certificates, academic records, and college events linked to your dates.</p>
        </div>

        <button
          onClick={() => { setAddMode('options'); setIsAddModalOpen(true); }}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Add Memory / Document</span>
        </button>
      </div>

      {/* Sub-Navigation & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'all' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Memories
          </button>
          <button
            onClick={() => setActiveSubTab('photos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'photos' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Photos & Camera
          </button>
          <button
            onClick={() => setActiveSubTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'documents' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Documents & Certificates
          </button>
          <button
            onClick={() => setActiveSubTab('voice')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'voice' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Voice Notes
          </button>
          <button
            onClick={() => setActiveSubTab('events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeSubTab === 'events' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Events & Presentations
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {categoriesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Memories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            onClick={() => setSelectedMemoryDetail(mem)}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden hover:border-amber-400 dark:hover:border-amber-500 transition cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {mem.type === 'photo' && mem.imageUrls && mem.imageUrls.length > 0 && (
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={mem.imageUrls[0]}
                    alt={mem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                    📸 {mem.imageUrls.length} Photo{mem.imageUrls.length > 1 ? 's' : ''}
                  </div>
                </div>
              )}

              {mem.type === 'document' && (
                <div className="h-40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 flex flex-col items-center justify-center p-6 border-b border-amber-100 dark:border-amber-900/40">
                  <FileText className="w-12 h-12 text-amber-600 mb-2" />
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 truncate max-w-full">
                    {mem.fileName || 'Academic_Certificate.pdf'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">PDF Document & Record</span>
                </div>
              )}

              {mem.type === 'voice' && (
                <div className="h-40 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 flex flex-col items-center justify-center p-6 border-b border-emerald-100 dark:border-emerald-900/40">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md mb-2">
                    <Mic className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Voice Note • {mem.voiceDuration || '01:12'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">Audio Recording & Transcription</span>
                </div>
              )}

              {mem.type !== 'photo' && mem.type !== 'document' && mem.type !== 'voice' && (
                <div className="h-32 bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col justify-between border-b border-slate-100 dark:border-slate-800">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Memory Note</span>
                </div>
              )}

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    {mem.category}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {mem.date}
                  </span>
                </div>

                <h3 className="font-extrabold text-base tracking-tight group-hover:text-amber-600 transition">
                  {mem.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {mem.description}
                </p>

                {mem.tags && mem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mem.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Linked to {mem.linkedDate || mem.date} Daily Record
              </span>
              <button
                onClick={(e) => handleDelete(mem.id, e)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                title="Delete Memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <FolderArchive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No memories found</h3>
          <p className="text-xs text-slate-400 mt-1">Try changing your search query or add a new memory to your vault.</p>
        </div>
      )}

      {/* ADD MEMORY MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  🗂️
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">Add Memory to Vault</h3>
                  <p className="text-xs text-slate-400">Capture photos, documents, voice notes, or write a memory.</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {addMode === 'options' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setAddMode('photo')}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition flex flex-col items-center text-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition">
                      📷
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm">Take Photo / Camera</h4>
                      <p className="text-xs text-slate-400 mt-1">Capture photos using device camera and store in vault</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setAddMode('gallery')}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 transition flex flex-col items-center text-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition">
                      🖼️
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm">Choose from Gallery</h4>
                      <p className="text-xs text-slate-400 mt-1">Select one or multiple photos from your device</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setAddMode('voice')}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition flex flex-col items-center text-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition">
                      🎙️
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm">Record Voice Note</h4>
                      <p className="text-xs text-slate-400 mt-1">Record audio with automated transcription</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setAddMode('note')}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition flex flex-col items-center text-center gap-3 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition">
                      📝
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm">Write Memory Note</h4>
                      <p className="text-xs text-slate-400 mt-1">Write journal memory with title & details</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setAddMode('file')}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition flex flex-col items-center text-center gap-3 group sm:col-span-2"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition">
                      📎
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm">Add Academic Document / Certificate</h4>
                      <p className="text-xs text-slate-400 mt-1">Upload project docs, certificates, and academic PDFs</p>
                    </div>
                  </button>
                </div>
              )}

              {addMode !== 'options' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      Mode: {addMode.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setAddMode('options')}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      ← Back to Options
                    </button>
                  </div>

                  {/* Camera / Photo preview */}
                  {(addMode === 'photo' || addMode === 'gallery') && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold block text-slate-700 dark:text-slate-300">Photo Preview</label>
                      <div className="grid grid-cols-3 gap-3">
                        {imageUrls.map((url, idx) => (
                          <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border">
                            <img src={url} alt="preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-lg text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newUrl = prompt('Enter photo URL or simulate camera capture:', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80');
                            if (newUrl) setImageUrls([...imageUrls, newUrl]);
                          }}
                          className="h-24 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-xs font-bold text-slate-400 hover:border-amber-500 transition"
                        >
                          <Camera className="w-5 h-5 mb-1" />
                          <span>Add Photo</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Voice recording state */}
                  {addMode === 'voice' && (
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-2xl shadow-lg animate-pulse">
                        🎙️
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                          {isRecording ? 'Recording voice note...' : 'Voice Recorder Ready'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">Duration: {voiceDuration}</p>
                      </div>
                      <div className="flex justify-center gap-3">
                        {!isRecording ? (
                          <button
                            onClick={() => setIsRecording(true)}
                            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md"
                          >
                            Start Recording
                          </button>
                        ) : (
                          <button
                            onClick={() => { setIsRecording(false); setVoiceTranscription('Live audio recorded and transcribed by Selfview AI engine.'); }}
                            className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md"
                          >
                            Stop Recording
                          </button>
                        )}
                      </div>
                      <textarea
                        placeholder="Automated AI Transcription will appear here..."
                        value={voiceTranscription}
                        onChange={(e) => setVoiceTranscription(e.target.value)}
                        className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border text-xs"
                        rows={2}
                      />
                    </div>
                  )}

                  {/* Document upload state */}
                  {addMode === 'file' && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold block text-slate-700 dark:text-slate-300">File Name / Document</label>
                      <input
                        type="text"
                        placeholder="e.g. AI_Hackathon_Certificate.pdf"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                      />
                    </div>
                  )}

                  {/* Common Form Fields */}
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">Memory Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Annual Tech Symposium First Prize"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                        >
                          {categoriesList.filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">Date</label>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">Description / Reflection</label>
                      <textarea
                        placeholder="Write details, thoughts or context..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">Tags (comma separated)</label>
                        <input
                          type="text"
                          placeholder="#project, #college, #award"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1 text-slate-700 dark:text-slate-300">Location (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. University Hall"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveMemory(addMode === 'gallery' ? 'photo' : addMode === 'file' ? 'document' : addMode === 'voice' ? 'voice' : 'photo')}
                      className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md"
                    >
                      Save Memory to Vault
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MEMORY DETAIL MODAL */}
      {selectedMemoryDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                  {selectedMemoryDetail.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedMemoryDetail.date} at {selectedMemoryDetail.time}
                </span>
              </div>
              <button onClick={() => setSelectedMemoryDetail(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <h2 className="text-2xl font-extrabold tracking-tight">{selectedMemoryDetail.title}</h2>

              {selectedMemoryDetail.imageUrls && selectedMemoryDetail.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedMemoryDetail.imageUrls.map((url, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden h-48 border bg-slate-100 dark:bg-slate-800">
                      <img src={url} alt="memory" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {selectedMemoryDetail.type === 'document' && (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-amber-600" />
                    <div>
                      <h4 className="font-bold text-sm">{selectedMemoryDetail.fileName}</h4>
                      <p className="text-xs text-slate-400">PDF Document & Record Verified</p>
                    </div>
                  </div>
                  <a href={selectedMemoryDetail.fileUrl} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-md">
                    Download File
                  </a>
                </div>
              )}

              {selectedMemoryDetail.type === 'voice' && (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Voice Recording Playback</h4>
                        <p className="text-xs text-slate-400">Duration: {selectedMemoryDetail.voiceDuration}</p>
                      </div>
                    </div>
                  </div>
                  {selectedMemoryDetail.voiceTranscription && (
                    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>AI Transcription:</strong> "{selectedMemoryDetail.voiceTranscription}"
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedMemoryDetail.description}
                </p>
              </div>

              {selectedMemoryDetail.location && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>{selectedMemoryDetail.location}</span>
                </div>
              )}

              {selectedMemoryDetail.tags && selectedMemoryDetail.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMemoryDetail.tags.map(t => (
                    <span key={t} className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Linked Daily Record Section */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-600/10 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block mb-0.5">
                    Linked Daily Record
                  </span>
                  <h4 className="font-extrabold text-sm">{selectedMemoryDetail.linkedDate || selectedMemoryDetail.date} Daily Record</h4>
                </div>
                <button
                  onClick={() => {
                    setSelectedMemoryDetail(null);
                    if (onNavigateTab) onNavigateTab('calendar');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold hover:border-amber-500 transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>View Daily Record</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
