import React from 'react';
import { UserProfile } from '../../types';
import { User, Building2, BookOpen, GraduationCap, Calendar, Mail, Phone, LogOut, Shield, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile | null;
  onLogout: () => void;
  onEditProfile: () => void;
  onOpenSettings: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onLogout, onEditProfile, onOpenSettings }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 md:pb-8">
      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <img
            src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={profile?.fullName || 'Student'}
            className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-indigo-600"
          />
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-2xl font-extrabold">{profile?.fullName || 'Student Scholar'}</h2>
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {profile?.university || 'University Student'} • {profile?.course || 'Degree'}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                onClick={onEditProfile}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
              >
                Edit Profile
              </button>
              <button
                onClick={onOpenSettings}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Settings & Privacy</span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-xs rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/70 transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">University</span>
            <p className="font-bold text-sm mt-0.5">{profile?.university || 'Not specified'}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Course & Branch</span>
            <p className="font-bold text-sm mt-0.5">{profile ? `${profile.course} (${profile.branch})` : 'Not specified'}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Semester</span>
            <p className="font-bold text-sm mt-0.5">{profile?.semester || 'Not specified'}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Graduation Year</span>
            <p className="font-bold text-sm mt-0.5">{profile?.graduationYear || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {/* Security & Database Status */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-base">Account & Database Architecture</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
          Your account is secured with local persistent storage and structured for zero-friction migration to Firestore or relational databases in subsequent phases.
        </p>
        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-slate-500">Contact Identifier</span>
          <span className="font-mono font-semibold">{profile?.email || profile?.phone || 'student@dayvault.app'}</span>
        </div>
      </div>
    </div>
  );
};
