import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { 
  communityService, 
  UniversityProfile, 
  UniversityEventItem, 
  UniversityNoticeItem, 
  ClubItem, 
  StudyGroupItem, 
  AcademicResourceItem, 
  CampusLocationItem, 
  CommunityProfileItem 
} from '../../services/communityService';
import { 
  GraduationCap, 
  Calendar, 
  Bell, 
  Users, 
  BookOpen, 
  MapPin, 
  Search, 
  Plus, 
  Shield, 
  CheckCircle2, 
  Bookmark, 
  Download, 
  Share2, 
  FileText, 
  ExternalLink, 
  AlertTriangle, 
  UserCheck, 
  Sliders, 
  Info, 
  Building2, 
  Layers, 
  Check, 
  X, 
  Sparkles,
  Briefcase
} from 'lucide-react';

interface CommunityDashboardProps {
  profile: UserProfile | null;
}

export const CommunityDashboard: React.FC<CommunityDashboardProps> = ({ profile }) => {
  const userId = profile?.uid || 'default_user';
  const [univProfile, setUnivProfile] = useState<UniversityProfile>(() => communityService.getProfile(userId));
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'events' | 'notices' | 'clubs' | 'groups' | 'resources' | 'locations' | 'profile'>('overview');
  
  const [events, setEvents] = useState<UniversityEventItem[]>(() => communityService.getEvents(userId));
  const [notices, setNotices] = useState<UniversityNoticeItem[]>(() => communityService.getNotices(userId));
  const [clubs, setClubs] = useState<ClubItem[]>(() => communityService.getClubs(userId));
  const [studyGroups, setStudyGroups] = useState<StudyGroupItem[]>(() => communityService.getStudyGroups(userId));
  const [resources, setResources] = useState<AcademicResourceItem[]>(() => communityService.getResources(userId));
  const [locations] = useState<CampusLocationItem[]>(() => communityService.getCampusLocations());
  const [communityProfile, setCommunityProfile] = useState<CommunityProfileItem>(() => communityService.getCommunityProfile(userId));

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetId, setReportTargetId] = useState('');
  const [reportReason, setReportReason] = useState('Spam');
  const [reportDetails, setReportDetails] = useState('');

  // New study group form
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    topic: '',
    semester: univProfile.semester,
    description: '',
    maxMembers: 6,
    meetingSchedule: '',
    mode: 'Online' as 'Online' | 'Offline' | 'Hybrid',
    locationOrLink: '',
    creatorName: communityProfile.displayName
  });

  // New resource form
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    subject: '',
    topic: '',
    semester: univProfile.semester,
    resourceType: 'PDF' as 'PDF' | 'Notes' | 'Images' | 'Links' | 'Question Paper' | 'Study Guide' | 'Reference',
    fileName: '',
    tags: ''
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleUnivMode = () => {
    const updated = { ...univProfile, universityMode: !univProfile.universityMode };
    setUnivProfile(updated);
    communityService.saveProfile(updated);
    showToast(updated.universityMode ? 'University Mode enabled successfully' : 'University Mode disabled');
  };

  const handleRSVPEvent = (eventId: string) => {
    const updated = events.map(ev => {
      if (ev.id === eventId) {
        const nextState = !ev.rsvpd;
        const modified = { ...ev, rsvpd: nextState };
        communityService.saveEvent(modified);
        return modified;
      }
      return ev;
    });
    setEvents(updated);
    showToast('Event RSVP updated successfully');
  };

  const handleSaveEvent = (eventId: string) => {
    const updated = events.map(ev => {
      if (ev.id === eventId) {
        const nextState = !ev.saved;
        const modified = { ...ev, saved: nextState };
        communityService.saveEvent(modified);
        return modified;
      }
      return ev;
    });
    setEvents(updated);
    showToast('Event bookmark updated');
  };

  const handleJoinGroup = (groupId: string) => {
    const updated = studyGroups.map(g => {
      if (g.id === groupId) {
        const nextJoined = !g.joined;
        const modified = { ...g, joined: nextJoined, currentMembers: nextJoined ? g.currentMembers + 1 : Math.max(1, g.currentMembers - 1) };
        communityService.saveStudyGroup(modified);
        return modified;
      }
      return g;
    });
    setStudyGroups(updated);
    showToast('Study group membership updated');
  };

  const handleBookmarkResource = (resId: string) => {
    const updated = resources.map(r => {
      if (r.id === resId) {
        const nextState = !r.bookmarked;
        const modified = { ...r, bookmarked: nextState };
        communityService.saveResource(modified);
        return modified;
      }
      return r;
    });
    setResources(updated);
    showToast('Resource bookmark updated');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name || !newGroup.subject) return;
    const item: StudyGroupItem = {
      id: `grp-${Date.now()}`,
      userId,
      ...newGroup,
      currentMembers: 1,
      joined: true
    };
    communityService.saveStudyGroup(item);
    setStudyGroups([item, ...studyGroups]);
    setShowGroupModal(false);
    setNewGroup({
      name: '',
      subject: '',
      topic: '',
      semester: univProfile.semester,
      description: '',
      maxMembers: 6,
      meetingSchedule: '',
      mode: 'Online',
      locationOrLink: '',
      creatorName: communityProfile.displayName
    });
    showToast('Study group created successfully!');
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.subject) return;
    const item: AcademicResourceItem = {
      id: `res-${Date.now()}`,
      userId,
      ...newResource,
      uploadedBy: communityProfile.displayName,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: newResource.tags.split(',').map(t => t.trim()).filter(Boolean),
      bookmarked: false
    };
    communityService.saveResource(item);
    setResources([item, ...resources]);
    setShowResourceModal(false);
    setNewResource({
      title: '',
      description: '',
      subject: '',
      topic: '',
      semester: univProfile.semester,
      resourceType: 'PDF',
      fileName: '',
      tags: ''
    });
    showToast('Academic resource shared with the community!');
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    showToast('Report submitted securely to moderators.');
    setReportDetails('');
  };

  // Filter items by search query
  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClubs = clubs.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = studyGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header & University Mode Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
                {univProfile.universityName}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/30 backdrop-blur-md text-xs font-medium">
                {univProfile.semester}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">University & Student Community</h1>
            <p className="text-amber-100 text-sm sm:text-base mt-1 max-w-2xl">
              Connect with campus events, study groups, clubs, and peer resource libraries while keeping personal daily records 100% private.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <div>
              <p className="text-xs text-amber-100 font-medium">University Mode</p>
              <p className="text-sm font-bold">{univProfile.universityMode ? 'Active (ON)' : 'Disabled (OFF)'}</p>
            </div>
            <button
              onClick={handleToggleUnivMode}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                univProfile.universityMode ? 'bg-emerald-400' : 'bg-slate-400'
              }`}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                univProfile.universityMode ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {!univProfile.universityMode ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">University Mode is Currently OFF</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 text-sm">
            Enable University Mode above to access campus events, notices, study groups, clubs, and shared academic resource libraries.
          </p>
          <button
            onClick={handleToggleUnivMode}
            className="mt-6 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition shadow-lg shadow-amber-600/20"
          >
            Turn University Mode ON
          </button>
        </div>
      ) : (
        <>
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'overview', label: 'Dashboard', icon: GraduationCap },
              { id: 'events', label: 'Events & RSVPs', icon: Calendar },
              { id: 'notices', label: 'Notices', icon: Bell },
              { id: 'clubs', label: 'Clubs', icon: Users },
              { id: 'groups', label: 'Study Groups', icon: Layers },
              { id: 'resources', label: 'Resource Library', icon: BookOpen },
              { id: 'locations', label: 'Campus Map & Spots', icon: MapPin },
              { id: 'profile', label: 'Community Profile', icon: UserCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition ${
                    isActive
                      .toString() === 'true' && activeSubTab === tab.id
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar for active tab */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, notices, clubs, groups, or resources..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm text-sm"
            />
          </div>

          {/* 1. OVERVIEW DASHBOARD */}
          {activeSubTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Quick stats & Campus Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Upcoming Events</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{events.filter(e => e.rsvpd).length} RSVPs</h3>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">{events.length} total campus events</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Active Notices</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{notices.filter(n => n.important).length} Important</h3>
                    <p className="text-xs text-blue-600 mt-1 font-medium">{notices.length} active announcements</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600">
                    <Bell className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Study Groups</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{studyGroups.filter(g => g.joined).length} Joined</h3>
                    <p className="text-xs text-purple-600 mt-1 font-medium">{studyGroups.length} active peer squads</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Resource Library</p>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">{resources.length} Files</h3>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">{resources.filter(r => r.bookmarked).length} bookmarked</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600">
                    <BookOpen className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Grid sections for overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Events Preview */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span>Upcoming Campus Events</span>
                    </h2>
                    <button 
                      onClick={() => setActiveSubTab('events')}
                      className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-4">
                    {events.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 gap-4">
                        <div className="flex items-start gap-4">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt={event.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 font-bold shrink-0">
                              {event.date.split('-')[2]}
                            </div>
                          )}
                          <div>
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-1">
                              {event.category}
                            </span>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{event.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                              <span>📅 {event.date}</span>
                              <span>•</span>
                              <span>📍 {event.venue}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleSaveEvent(event.id)}
                            className={`p-2.5 rounded-xl border transition ${event.saved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'}`}
                            title="Save Event"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => handleRSVPEvent(event.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${event.rsvpd ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-600 hover:text-white'}`}
                          >
                            {event.rsvpd ? 'RSVP’d ✓' : 'RSVP Now'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Important Notices */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <span>Notices & Circulars</span>
                    </h2>
                    <button 
                      onClick={() => setActiveSubTab('notices')}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {notices.slice(0, 3).map((notice) => (
                      <div key={notice.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${notice.important ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'}`}>
                            {notice.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{notice.date}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs line-clamp-1">{notice.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{notice.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Study Groups & Clubs Quick Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Study Groups */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-purple-600" />
                      <span>My Study Groups</span>
                    </h2>
                    <button 
                      onClick={() => setShowGroupModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Group</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {studyGroups.map((group) => (
                      <div key={group.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                              {group.subject}
                            </span>
                            <span className="text-xs text-slate-400">👥 {group.currentMembers}/{group.maxMembers} members</span>
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1">{group.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{group.meetingSchedule} • {group.mode}</p>
                        </div>
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${group.joined ? 'bg-purple-600 text-white' : 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white'}`}
                        >
                          {group.joined ? 'Joined ✓' : 'Join Group'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clubs & Communities */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-600" />
                      <span>University Clubs</span>
                    </h2>
                    <button 
                      onClick={() => setActiveSubTab('clubs')}
                      className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {clubs.slice(0, 3).map((club) => (
                      <div key={club.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            {club.category}
                          </span>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-1">{club.name}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{club.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold ${club.following ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'text-slate-400 bg-slate-200 dark:bg-slate-800'}`}>
                          {club.following ? 'Following' : 'Explore'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. EVENTS TAB */}
          {activeSubTab === 'events' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Campus Events & Activities</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Browse hackathons, career fairs, technical workshops, and campus cultural festivals.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      {event.imageUrl && (
                        <div className="h-48 overflow-hidden relative">
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold">
                            {event.category}
                          </div>
                        </div>
                      )}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                          <span>📅 {event.date} • {event.startTime}</span>
                          <span>📍 {event.venue}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{event.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {event.tags.map((tag, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEvent(event.id)}
                          className={`p-2.5 rounded-xl border transition ${event.saved ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'}`}
                          title="Save Event"
                        >
                          <Bookmark className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={() => {
                            setReportTargetId(event.id);
                            setShowReportModal(true);
                          }}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition"
                          title="Report Content"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        {event.registrationLink && (
                          <a 
                            href={event.registrationLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                            title="External Link"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleRSVPEvent(event.id)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${event.rsvpd ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-amber-600 text-white hover:bg-amber-700 shadow-amber-600/20'}`}
                        >
                          {event.rsvpd ? 'RSVP Confirmed ✓' : 'RSVP Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. NOTICES TAB */}
          {activeSubTab === 'notices' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">University Notices & Circulars</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Official announcements from examination branch, placement cell, and academic departments.</p>
                </div>
              </div>

              <div className="space-y-4">
                {filteredNotices.map((notice) => (
                  <div key={notice.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${notice.important ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'}`}>
                          {notice.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">📅 Posted on {notice.date}</span>
                        {notice.important && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">Important</span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{notice.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{notice.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {notice.attachmentName && (
                        <button 
                          onClick={() => showToast(`Downloading ${notice.attachmentName}...`)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition"
                        >
                          <Download className="w-4 h-4 text-amber-600" />
                          <span>PDF Circular</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setReportTargetId(notice.id);
                          setShowReportModal(true);
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 transition"
                        title="Report Notice"
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CLUBS TAB */}
          {activeSubTab === 'clubs' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Student Clubs & Societies</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Discover tech chapters, AI research groups, cultural societies, and entrepreneurship cells.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredClubs.map((club) => (
                  <div key={club.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          {club.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Faculty: {club.facultyCoordinator}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{club.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{club.description}</p>
                      
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        <p>🕒 <span className="font-semibold">Meetings:</span> {club.meetingInfo}</p>
                        <p>👤 <span className="font-semibold">Student Lead:</span> {club.studentCoordinator}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          const updated = clubs.map(c => c.id === club.id ? { ...c, following: !c.following } : c);
                          setClubs(updated);
                          showToast(club.following ? `Unfollowed ${club.name}` : `Successfully joined/followed ${club.name}!`);
                        }}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${club.following ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white'}`}
                      >
                        {club.following ? 'Following ✓' : 'Follow Club'}
                      </button>

                      <button
                        onClick={() => showToast(`Viewing announcements for ${club.name}`)}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <span>Announcements</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. STUDY GROUPS TAB */}
          {activeSubTab === 'groups' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Study Groups & Peer Squads</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Collaborate on coursework, prepare for examinations, and tackle coding challenges together.</p>
                </div>
                <button
                  onClick={() => setShowGroupModal(true)}
                  className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition shadow-lg shadow-purple-600/20 flex items-center gap-2 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Study Group</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                          {group.subject}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">👥 {group.currentMembers}/{group.maxMembers} Members</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{group.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{group.description}</p>
                      
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                        <p>🎯 <span className="font-semibold">Topic:</span> {group.topic}</p>
                        <p>⏰ <span className="font-semibold">Schedule:</span> {group.meetingSchedule}</p>
                        <p>📍 <span className="font-semibold">Mode:</span> {group.mode} ({group.locationOrLink})</p>
                        <p>👤 <span className="font-semibold">Creator:</span> {group.creatorName}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition ${group.joined ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white'}`}
                      >
                        {group.joined ? 'Joined Squad ✓' : 'Join Group'}
                      </button>

                      {group.joined && (
                        <button
                          onClick={() => showToast(`Opening discussion room for ${group.name}`)}
                          className="px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 text-xs font-bold hover:bg-purple-100 transition"
                        >
                          Open Chat & Tasks
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. RESOURCE LIBRARY TAB */}
          {activeSubTab === 'resources' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Shared Academic Resource Library</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Voluntarily shared student notes, past exam papers, cheat sheets, and reference guides.</p>
                </div>
                <button
                  onClick={() => setShowResourceModal(true)}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center gap-2 self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Share Resource</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <div key={res.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                          {res.resourceType}
                        </span>
                        <span className="text-xs text-slate-400">{res.semester}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-2">{res.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">{res.description}</p>
                      
                      <div className="flex flex-wrap gap-1 pt-1">
                        {res.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span>Uploaded by: <strong className="text-slate-700 dark:text-slate-300">{res.uploadedBy}</strong></span>
                        <span>{res.uploadDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleBookmarkResource(res.id)}
                        className={`p-2.5 rounded-xl border transition ${res.bookmarked ? 'bg-amber-50 border-amber-300 text-amber-600' : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'}`}
                        title="Bookmark Resource"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => showToast(`Downloading ${res.fileName || res.title}...`)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. CAMPUS LOCATIONS TAB */}
          {activeSubTab === 'locations' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Campus Locations & Building Directory</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Quickly locate libraries, computer science labs, auditoriums, and cafeterias across campus.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLocations.map((loc) => (
                  <div key={loc.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        {loc.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">📍 {loc.building}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{loc.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{loc.description}</p>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300">
                      🕒 <span className="font-semibold">Timings:</span> {loc.timings}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. COMMUNITY PROFILE TAB */}
          {activeSubTab === 'profile' && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Community & Public Profile Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Control what information is visible to other university students. Personal daily records, journals, and private memories remain strictly isolated and private.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Display Name</label>
                  <input
                    type="text"
                    value={communityProfile.displayName}
                    onChange={(e) => setCommunityProfile({ ...communityProfile, displayName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Course / Degree</label>
                    <input
                      type="text"
                      value={communityProfile.course}
                      onChange={(e) => setCommunityProfile({ ...communityProfile, course: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Semester</label>
                    <input
                      type="text"
                      value={communityProfile.semester}
                      onChange={(e) => setCommunityProfile({ ...communityProfile, semester: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Skills & Expertise (comma separated)</label>
                  <input
                    type="text"
                    value={communityProfile.skills.join(', ')}
                    onChange={(e) => setCommunityProfile({ ...communityProfile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Short Bio</label>
                  <textarea
                    rows={3}
                    value={communityProfile.bio}
                    onChange={(e) => setCommunityProfile({ ...communityProfile, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Profile Visibility</label>
                  <select
                    value={communityProfile.visibility}
                    onChange={(e) => setCommunityProfile({ ...communityProfile, visibility: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 text-sm"
                  >
                    <option value="Public">Public (Anyone)</option>
                    <option value="University Only">University Users Only</option>
                    <option value="Private">Private (Hidden)</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      communityService.saveCommunityProfile(communityProfile);
                      showToast('Community profile saved successfully!');
                    }}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition shadow-lg shadow-amber-600/20"
                  >
                    Save Community Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE STUDY GROUP MODAL */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create Study Group</h3>
              <button onClick={() => setShowGroupModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  placeholder="e.g. Advanced AI Study Squad"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newGroup.subject}
                    onChange={(e) => setNewGroup({ ...newGroup, subject: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Max Members</label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={newGroup.maxMembers}
                    onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) || 6 })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Topic / Focus</label>
                <input
                  type="text"
                  value={newGroup.topic}
                  onChange={(e) => setNewGroup({ ...newGroup, topic: e.target.value })}
                  placeholder="e.g. Transformers & LLM Finetuning"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    value={newGroup.meetingSchedule}
                    onChange={(e) => setNewGroup({ ...newGroup, meetingSchedule: e.target.value })}
                    placeholder="e.g. Tue & Fri 7 PM"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mode</label>
                  <select
                    value={newGroup.mode}
                    onChange={(e) => setNewGroup({ ...newGroup, mode: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  placeholder="Describe group goals and preparation plan..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20"
                >
                  Create Study Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPLOAD RESOURCE MODAL */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Share Academic Resource</h3>
              <button onClick={() => setShowResourceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Resource Title</label>
                <input
                  type="text"
                  required
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="e.g. Operating Systems Chapter 4 Summary Notes"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newResource.subject}
                    onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                    placeholder="e.g. Operating Systems"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Resource Type</label>
                  <select
                    value={newResource.resourceType}
                    onChange={(e) => setNewResource({ ...newResource, resourceType: e.target.value as any })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Notes">Notes</option>
                    <option value="Images">Images / Diagrams</option>
                    <option value="Links">External Link</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Study Guide">Study Guide</option>
                    <option value="Reference">Reference Material</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="Briefly describe what this resource covers..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newResource.tags}
                  onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                  placeholder="OS, Semaphores, Notes"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Share Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>Report Content</span>
              </h3>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Reason for Reporting</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                >
                  <option value="Spam">Spam or Misleading</option>
                  <option value="Incorrect information">Incorrect Information</option>
                  <option value="Inappropriate content">Inappropriate Content</option>
                  <option value="Copyright concern">Copyright Concern</option>
                  <option value="Harassment">Harassment or Bullying</option>
                  <option value="Fraud/scam">Fraud or Scam</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Additional Details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide context for our moderators..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
