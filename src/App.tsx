import React, { useState, useEffect } from 'react';
import { AuthMode, NavTab, UserProfile, AcademicCoursePlaceholder } from './types';
import { dbService } from './services/db';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileSetupModal } from './components/profile/ProfileSetupModal';
import { Sidebar } from './components/navigation/Sidebar';
import { TopHeader } from './components/navigation/TopHeader';
import { BottomNav } from './components/navigation/BottomNav';
import { HomeView } from './components/dashboard/HomeView';
import { CalendarView } from './components/calendar/CalendarView';
import { AddRecordModal } from './components/add/AddRecordModal';
import { InsightsView } from './components/insights/InsightsView';
import { ProfileView } from './components/profile/ProfileView';
import { MemoriesView } from './components/memories/MemoriesView';
import { CareerDashboard } from './components/career/CareerDashboard';
import { CommunityDashboard } from './components/community/CommunityDashboard';
import { AdvancedAiDashboard } from './components/ai/AdvancedAiDashboard';
import { NotificationsModal } from './components/notifications/NotificationsModal';
import { SearchModal } from './components/navigation/SearchModal';
import { SettingsModal } from './components/profile/SettingsModal';

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('landing');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<AcademicCoursePlaceholder[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial session & profile on mount
    const session = dbService.getCurrentSession();
    const existingProfile = dbService.getUserProfile();
    const userId = existingProfile?.uid || 'default-user';
    const loadedCourses = dbService.getAcademicCourses(userId);

    setCourses(loadedCourses);

    if (session && session.isAuthenticated) {
      if (existingProfile) {
        setProfile(existingProfile);
        setAuthMode('app');
      } else {
        setAuthMode('profile_setup');
      }
    }

    // Check system color scheme preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleAuthSuccess = (isNewUser: boolean) => {
    const existingProfile = dbService.getUserProfile();
    if (isNewUser || !existingProfile) {
      setAuthMode('profile_setup');
    } else {
      setProfile(existingProfile);
      setAuthMode('app');
    }
  };

  const handleProfileComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setAuthMode('app');
  };

  const handleLogout = () => {
    dbService.clearSession();
    setProfile(null);
    setAuthMode('landing');
  };

  // Render Landing Page
  if (authMode === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAuthMode('signup')}
        onLoginClick={() => setAuthMode('login')}
      />
    );
  }

  // Render Authentication (Sign Up / Login)
  if (authMode === 'login' || authMode === 'signup') {
    return (
      <AuthModal
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
        onBackToLanding={() => setAuthMode('landing')}
      />
    );
  }

  // Render Profile Setup
  if (authMode === 'profile_setup') {
    return <ProfileSetupModal onComplete={handleProfileComplete} />;
  }

  // Render Main Application Shell
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        profile={profile}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          profile={profile}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          onProfileClick={() => setCurrentTab('profile')}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'home' && (
            <HomeView
              profile={profile}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              profile={profile}
              courses={courses}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {currentTab === 'insights' && <InsightsView profile={profile} />}

          {currentTab === 'memories' && <MemoriesView profile={profile} onNavigateTab={(t) => setCurrentTab(t as NavTab)} />}

          {currentTab === 'career' && <CareerDashboard profile={profile} />}

          {currentTab === 'community' && <CommunityDashboard profile={profile} />}

          {currentTab === 'ai' && <AdvancedAiDashboard profile={profile} />}

          {currentTab === 'profile' && (
            <ProfileView
              profile={profile}
              onLogout={handleLogout}
              onEditProfile={() => setAuthMode('profile_setup')}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Modals */}
      <AddRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <NotificationsModal
        profile={profile}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <SearchModal
        profile={profile}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <SettingsModal
        profile={profile}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
