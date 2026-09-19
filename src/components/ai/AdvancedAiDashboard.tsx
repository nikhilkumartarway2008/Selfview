import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { 
  aiAdvancedService, 
  AIPlanItem, 
  AIFlashcardItem, 
  AIQuizItem, 
  AIMemoryItem, 
  AISettingsState 
} from '../../services/aiAdvancedService';
import { dbService } from '../../services/db';
import { communityService } from '../../services/communityService';
import { careerService } from '../../services/careerService';
import { 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  BookOpen, 
  CheckSquare, 
  Target, 
  Briefcase, 
  Award, 
  FileText, 
  Brain, 
  Settings, 
  Search, 
  Send, 
  Mic, 
  RefreshCw, 
  Download, 
  Bookmark, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle,
  Play,
  Check,
  X
} from 'lucide-react';

interface AdvancedAiDashboardProps {
  profile: UserProfile | null;
}

export const AdvancedAiDashboard: React.FC<AdvancedAiDashboardProps> = ({ profile }) => {
  const userId = profile?.uid || 'default_user';
  const [activeSubTab, setActiveSubTab] = useState<
    'chat' | 'brief' | 'study' | 'revision' | 'tasks' | 'goals' | 'reviews' | 'career' | 'interview' | 'documents' | 'flashcards' | 'quizzes' | 'memory' | 'settings'
  >('chat');

  const [settings, setSettings] = useState<AISettingsState>(() => aiAdvancedService.getSettings(userId));
  const [plans, setPlans] = useState<AIPlanItem[]>(() => aiAdvancedService.getPlans(userId));
  const [flashcards, setFlashcards] = useState<AIFlashcardItem[]>(() => aiAdvancedService.getFlashcards(userId));
  const [quizzes, setQuizzes] = useState<AIQuizItem[]>(() => aiAdvancedService.getQuizzes(userId));
  const [memories, setMemories] = useState<AIMemoryItem[]>(() => aiAdvancedService.getMemories(userId));

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; sources?: string[] }>>([
    {
      sender: 'ai',
      text: `Hello ${profile?.fullName || 'Student'}! I am your DayVault AI Intelligence Assistant with secure access to your authorized academic, schedule, wellness, and career data. How can I help you today?`,
      sources: ['DayVault Secure Vault']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Today Brief
  const todayData = aiAdvancedService.getTodayData(userId);

  // New Memory Form
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<'Study Style' | 'Career Goal' | 'Revision Preference' | 'Note'>('Study Style');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = `Based on your authorized DayVault data for ${userId}, I've analyzed your request.`;
      let sources = ['Authorized Database Scope'];

      const lower = userText.toLowerCase();
      if (lower.includes('schedule') || lower.includes('today') || lower.includes('classes')) {
        responseText = `Today you have ${todayData.classes.length} classes scheduled, ${todayData.tasks.length} pending tasks, and your target career role is ${todayData.careerGoal}.`;
        sources = ['Academic Schedule', 'Task Tracker'];
      } else if (lower.includes('study') || lower.includes('plan')) {
        responseText = `You have active study plans for Advanced Algorithms and Machine Learning. Would you like me to generate a new spaced-revision session?`;
        sources = ['AI Study Engine'];
      } else if (lower.includes('career') || lower.includes('interview') || lower.includes('job')) {
        responseText = `Your career target is set to ${todayData.careerGoal}. You have 3 projects in your portfolio and 2 upcoming interview rounds.`;
        sources = ['Career Portfolio'];
      } else {
        responseText = `I have processed your query: "${userText}". All authorized records indicate steady progress across your semester goals and habits.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText, sources }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryContent.trim()) return;
    const item: AIMemoryItem = {
      id: `mem-${Date.now()}`,
      userId,
      category: newMemoryCategory,
      content: newMemoryContent,
      createdAt: new Date().toISOString().split('T')[0]
    };
    aiAdvancedService.saveMemory(item);
    setMemories(aiAdvancedService.getMemories(userId));
    setNewMemoryContent('');
    showToast('Successfully saved to AI Memory!');
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
                Gemini 3.5 Powered
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md text-xs font-medium">
                Authorized Access Only
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">DayVault AI Intelligence Hub</h1>
            <p className="text-purple-100 text-sm sm:text-base mt-1 max-w-2xl">
              Advanced personalized study planning, smart revision engines, interview coaching, and natural language analytics powered by your private academic vault.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <Brain className="w-8 h-8 text-amber-300 animate-pulse" />
            <div>
              <p className="text-xs text-purple-100 font-medium">AI Intelligence Status</p>
              <p className="text-sm font-bold">{settings.aiEnabled ? 'Active & Secure' : 'Disabled'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'chat', label: 'Ask AI', icon: MessageSquare },
          { id: 'brief', label: "Today's Brief", icon: Calendar },
          { id: 'study', label: 'Study Planner', icon: BookOpen },
          { id: 'revision', label: 'Smart Revision', icon: RefreshCw },
          { id: 'tasks', label: 'Task Assistant', icon: CheckSquare },
          { id: 'goals', label: 'Goal Assistant', icon: Target },
          { id: 'reviews', label: 'Weekly/Monthly Review', icon: FileText },
          { id: 'career', label: 'Career AI', icon: Briefcase },
          { id: 'interview', label: 'Interview Coach', icon: Award },
          { id: 'documents', label: 'Document Assistant', icon: FileText },
          { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
          { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
          { id: 'memory', label: 'AI Memory', icon: Brain },
          { id: 'settings', label: 'AI Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. ASK AI CHAT TAB */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in">
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px]">
            {/* Chat header */}
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">DayVault Intelligence Assistant</h3>
                  <p className="text-xs text-slate-500">Ask questions about your courses, study plans, or career roadmap</p>
                </div>
              </div>
              <button 
                onClick={() => setChatMessages([{ sender: 'ai', text: 'Chat cleared. How can I assist you?', sources: ['System'] }])}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear Chat
              </button>
            </div>

            {/* Messages container */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    {msg.sources && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2 text-[10px] text-purple-600 dark:text-purple-300 font-semibold">
                        <span>Sources: {msg.sources.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 text-sm text-slate-400 flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Analyzing your authorized vault records...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt suggestions */}
            <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-800">
              {[
                "What classes do I have today?",
                "Generate a study plan for Algorithms",
                "Review my career portfolio",
                "What assignments are due soon?"
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInputMessage(prompt); }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-300 text-xs whitespace-nowrap border border-slate-200 dark:border-slate-700 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about your study sessions, goals, or career roadmap..."
                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => showToast('Voice dictation simulation active.')}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                title="Voice Input"
              >
                <Mic className="w-5 h-5" />
              </button>
              <button
                type="submit"
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition shadow-md shadow-purple-600/20 flex items-center gap-2"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* AI Quick Context & Memories Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized Data Scope</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                AI queries are strictly restricted to your authenticated user ID. No private data is ever shared across users.
              </p>
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Academic Records</span>
                  <span className="text-emerald-600 font-semibold">Authorized ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Career & Placement</span>
                  <span className="text-emerald-600 font-semibold">Authorized ✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>University Community</span>
                  <span className="text-emerald-600 font-semibold">Authorized ✓</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Active AI Memories</span>
              </h3>
              {memories.length === 0 ? (
                <p className="text-xs text-slate-400">No custom AI memories saved yet.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {memories.map((m) => (
                    <div key={m.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                      <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                        {m.category}
                      </span>
                      <p className="text-slate-700 dark:text-slate-200">{m.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. TODAY'S BRIEF TAB */}
      {activeSubTab === 'brief' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                Daily AI Briefing
              </span>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">Today ({todayData.date})</h2>
            </div>
            <button 
              onClick={() => showToast('Daily Brief refreshed successfully.')}
              className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Brief</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
            <p className="font-semibold text-purple-900 dark:text-purple-300 mb-1">💡 Executive Summary:</p>
            Today you have <strong>{todayData.classes.length} classes</strong> scheduled, <strong>{todayData.tasks.length} pending tasks</strong> requiring your attention, and your primary career target is set to <strong>{todayData.careerGoal}</strong>. Attendance standing is {todayData.attendanceSummary}.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <span>Pending Tasks for Today</span>
              </h3>
              {todayData.tasks.length === 0 ? (
                <p className="text-xs text-slate-400">No urgent pending tasks for today. Great job!</p>
              ) : (
                <div className="space-y-2">
                  {todayData.tasks.map((t: any) => (
                    <div key={t.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{t.title}</span>
                      <span className="text-[10px] text-amber-600 font-bold uppercase">{t.priority}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>University Events & Reminders</span>
              </h3>
              {todayData.events.length === 0 ? (
                <p className="text-xs text-slate-400">No campus events scheduled for today.</p>
              ) : (
                <div className="space-y-2">
                  {todayData.events.map((ev: any) => (
                    <div key={ev.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{ev.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">📍 {ev.venue}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. STUDY PLANNER TAB */}
      {activeSubTab === 'study' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Study & Exam Planner</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Generate structured study schedules tailored to your exam dates, difficulty, and available hours.</p>
            </div>
            <button
              onClick={() => showToast('AI Study plan generated successfully!')}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-purple-600/20 flex items-center gap-2 self-start"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate New Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                    {plan.difficulty} Priority
                  </span>
                  <span className="text-xs text-slate-400">Exam: {plan.examDate}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{plan.subject}</h3>
                <p className="text-xs text-slate-500">Target Duration: {plan.durationHours} hours total</p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Scheduled Milestones:</p>
                  {plan.schedule.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
                        <span>📅 {item.date}: {item.topic}</span>
                        <span className="text-purple-600">{item.duration}</span>
                      </div>
                      <p className="text-slate-500">Practice: {item.practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SMART REVISION TAB */}
      {activeSubTab === 'revision' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Smart Spaced Revision Engine</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              AI tracks your syllabus progress and schedules optimal revision intervals (Day 0 → Day 2 → Day 7 → Day 14 → Day 30) for long-term retention.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { topic: 'Graph Theory & Dijkstra', lastReviewed: '3 days ago', nextRevision: 'Today', status: 'Due Now', priority: 'High' },
              { topic: 'Operating Systems Semaphores', lastReviewed: '1 week ago', nextRevision: 'Tomorrow', status: 'Upcoming', priority: 'Medium' },
              { topic: 'DBMS Indexing & B-Trees', lastReviewed: '2 weeks ago', nextRevision: 'In 3 days', status: 'Scheduled', priority: 'Low' },
            ].map((rev, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${rev.status === 'Due Now' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'}`}>
                      {rev.status}
                    </span>
                    <span className="text-xs text-slate-400">Priority: {rev.priority}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{rev.topic}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Last reviewed {rev.lastReviewed} • Next revision: <strong className="text-purple-600">{rev.nextRevision}</strong></p>
                </div>
                <button
                  onClick={() => showToast(`Started revision session for ${rev.topic}`)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 whitespace-nowrap"
                >
                  Start Revision
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CAREER AI ASSISTANT TAB */}
      {activeSubTab === 'career' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Career & Placement Assistant</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Generate resume bullet points, project README summaries, and tailored placement preparation plans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Resume Bullet Generator</span>
              </h3>
              <p className="text-xs text-slate-500">Select a project or internship to draft high-impact quantifiable resume bullets.</p>
              <button
                onClick={() => showToast('Generated 3 professional resume bullet points.')}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-md shadow-amber-600/20"
              >
                Draft Resume Bullets
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Placement Readiness Assessment</span>
              </h3>
              <p className="text-xs text-slate-500">Analyze your DSA problem bank, portfolio projects, and interview history.</p>
              <button
                onClick={() => showToast('Placement readiness analysis complete. You are well-positioned for Software Engineer roles.')}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-md shadow-purple-600/20"
              >
                Analyze Readiness
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. AI INTERVIEW COACH TAB */}
      {activeSubTab === 'interview' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
              AI Mock Interviewer
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">Technical & Behavioral Interview Coach</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Practice simulated interview questions with real-time feedback on clarity, structure, and technical accuracy.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
              System Design Round
            </span>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Question: How would you design a scalable real-time chat notification system handling 10 million concurrent users?</h4>
            <textarea
              rows={4}
              placeholder="Type your architectural answer here (e.g., WebSockets, Redis pub/sub, horizontal load balancing)..."
              className="w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs"
            />
            <button
              onClick={() => showToast('AI Feedback: Excellent mention of WebSockets and pub/sub. Consider discussing partitioning strategies for database persistence.')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20"
            >
              Submit Answer for AI Review
            </button>
          </div>
        </div>
      )}

      {/* 7. FLASHCARDS TAB */}
      {activeSubTab === 'flashcards' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Flashcard Study Deck</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Review core concepts generated from your academic syllabus and notes.</p>
            </div>
            <button
              onClick={() => showToast('Generated new flashcards from recent notes.')}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20"
            >
              Generate Flashcards
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {flashcards.map((fc) => (
              <div key={fc.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                      {fc.topic}
                    </span>
                    <span className="text-[11px] text-slate-400">{fc.difficulty}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{fc.question}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">Answer: {fc.answer}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className={`text-xs font-semibold ${fc.mastered ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {fc.mastered ? 'Mastered ✓' : 'Learning'}
                  </span>
                  <button
                    onClick={() => {
                      const updated = flashcards.map(f => f.id === fc.id ? { ...f, mastered: !f.mastered } : f);
                      setFlashcards(updated);
                      showToast('Flashcard status updated');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. AI MEMORY TAB */}
      {activeSubTab === 'memory' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Permanent Memory Manager</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Store long-term preferences, learning styles, and career interests so DayVault AI understands your context across sessions.
            </p>
          </div>

          <form onSubmit={handleSaveMemory} className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Memory Category</label>
              <select
                value={newMemoryCategory}
                onChange={(e) => setNewMemoryCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              >
                <option value="Study Style">Study Style</option>
                <option value="Career Goal">Career Goal</option>
                <option value="Revision Preference">Revision Preference</option>
                <option value="Note">General Note</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Memory Content</label>
              <textarea
                rows={2}
                required
                value={newMemoryContent}
                onChange={(e) => setNewMemoryContent(e.target.value)}
                placeholder="e.g. I prefer morning study sessions and visual diagrams for algorithm problems..."
                className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20"
            >
              Save to AI Memory
            </button>
          </form>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Saved AI Memories</h3>
            {memories.length === 0 ? (
              <p className="text-xs text-slate-400">No memories saved yet.</p>
            ) : (
              <div className="space-y-2">
                {memories.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                        {m.category}
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-200 mt-1">{m.content}</p>
                    </div>
                    <button
                      onClick={() => {
                        aiAdvancedService.deleteMemory(m.id);
                        setMemories(aiAdvancedService.getMemories(userId));
                        showToast('Memory deleted');
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. AI SETTINGS TAB */}
      {activeSubTab === 'settings' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Privacy & Data Access Settings</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Control precisely what authorized data scope DayVault AI can access and process.</p>
          </div>

          <div className="space-y-4">
            {[
              { key: 'aiEnabled', label: 'Enable DayVault AI Intelligence', desc: 'Master switch for AI features' },
              { key: 'aiMemoryEnabled', label: 'AI Permanent Memory', desc: 'Allow AI to retain long-term study preferences' },
              { key: 'academicDataAccess', label: 'Academic & Course Data Access', desc: 'Allow AI to read attendance, assignments, and exams' },
              { key: 'careerDataAccess', label: 'Career & Placement Access', desc: 'Allow AI to read projects, skills, and resume data' },
              { key: 'communityDataAccess', label: 'University Community Access', desc: 'Allow AI to query campus events and study groups' },
            ].map((item) => {
              const val = (settings as any)[item.key];
              return (
                <div key={item.key} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{item.label}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      const updated = { ...settings, [item.key]: !val };
                      setSettings(updated);
                      aiAdvancedService.saveSettings(updated);
                      showToast('AI settings updated successfully');
                    }}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      val ? 'bg-purple-600' : 'bg-slate-400'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      val ? 'translate-x-7' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
