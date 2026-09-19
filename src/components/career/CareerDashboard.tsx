import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { careerService, CareerProfile, SkillItem, ProjectItem, CertificationItem, InternshipItem, JobApplicationItem, InterviewItem, InterviewQuestionItem, CodingProblemItem, ResumeItem, CareerGoalItem } from '../../services/careerService';
import { Briefcase, Target, Award, Code, CheckCircle, Clock, Calendar, FileText, Plus, ExternalLink, Edit3, Trash2, Sparkles, UserCheck, BookOpen, Layers, Check, X, ChevronRight, TrendingUp } from 'lucide-react';

interface CareerDashboardProps {
  profile: UserProfile | null;
}

export const CareerDashboard: React.FC<CareerDashboardProps> = ({ profile }) => {
  const userId = profile?.uid || 'default-user';
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'skills' | 'projects' | 'certs' | 'internships' | 'applications' | 'interviews' | 'coding' | 'resume' | 'goals'>('overview');

  const [careerProfile, setCareerProfile] = useState<CareerProfile>(careerService.getProfile(userId));
  const [skills, setSkills] = useState<SkillItem[]>(careerService.getSkills(userId));
  const [projects, setProjects] = useState<ProjectItem[]>(careerService.getProjects(userId));
  const [certs, setCerts] = useState<CertificationItem[]>(careerService.getCertifications(userId));
  const [internships, setInternships] = useState<InternshipItem[]>(careerService.getInternships(userId));
  const [applications, setApplications] = useState<JobApplicationItem[]>(careerService.getJobApplications(userId));
  const [interviews, setInterviews] = useState<InterviewItem[]>(careerService.getInterviews(userId));
  const [codingProblems, setCodingProblems] = useState<CodingProblemItem[]>(careerService.getCodingProblems(userId));
  const [resumes, setResumes] = useState<ResumeItem[]>(careerService.getResumes(userId));
  const [careerGoals, setCareerGoals] = useState<CareerGoalItem[]>(careerService.getCareerGoals(userId));

  // Modals & States
  const [selectedResume, setSelectedResume] = useState<ResumeItem | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [isAddAppOpen, setIsAddAppOpen] = useState(false);
  const [isAddIntvOpen, setIsAddIntvOpen] = useState(false);
  const [isAddCodingOpen, setIsAddCodingOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Form states for modals
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Programming', proficiency: 'Intermediate' as const, progress: 70, notes: '', status: 'Practicing' as const });
  const [newProject, setNewProject] = useState({ name: '', description: '', category: 'Full Stack', technologies: 'React, TypeScript', githubUrl: '', liveUrl: '', status: 'Completed' as const });
  const [newCert, setNewCert] = useState({ name: '', organization: '', date: new Date().toISOString().split('T')[0], credentialId: '', skills: 'AWS, Cloud' });
  const [newApp, setNewApp] = useState({ company: '', role: '', jobUrl: '', applicationDate: new Date().toISOString().split('T')[0], status: 'Applied' as const, location: 'Remote', notes: '' });
  const [newIntv, setNewIntv] = useState({ company: '', role: '', date: new Date().toISOString().split('T')[0], time: '10:00 AM', type: 'Technical' as const, round: 'Round 1', status: 'Scheduled' as const, notes: '' });
  const [newCoding, setNewCoding] = useState({ name: '', platform: 'LeetCode' as const, url: '', topic: 'Arrays' as const, difficulty: 'Medium' as const, status: 'Solved' as const });

  // AI Assistant Query
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const solvedCount = codingProblems.filter(c => c.status === 'Solved').length + 113; // mock base + custom
  const interviewPrepPercentage = Math.min(100, Math.round((solvedCount / 150) * 100));

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    const item: SkillItem = {
      id: 'skill-' + Date.now(),
      userId,
      name: newSkill.name.trim(),
      category: newSkill.category,
      proficiency: newSkill.proficiency,
      progress: Number(newSkill.progress),
      startedDate: new Date().toISOString().split('T')[0],
      lastPracticed: new Date().toISOString().split('T')[0],
      notes: newSkill.notes,
      status: newSkill.status,
    };
    careerService.saveSkill(item);
    setSkills(careerService.getSkills(userId));
    setIsAddSkillOpen(false);
    setNewSkill({ name: '', category: 'Programming', proficiency: 'Intermediate', progress: 70, notes: '', status: 'Practicing' });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    const item: ProjectItem = {
      id: 'proj-' + Date.now(),
      userId,
      name: newProject.name.trim(),
      description: newProject.description,
      category: newProject.category,
      technologies: newProject.technologies.split(',').map(t => t.trim()),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      status: newProject.status,
      githubUrl: newProject.githubUrl,
      liveUrl: newProject.liveUrl,
    };
    careerService.saveProject(item);
    setProjects(careerService.getProjects(userId));
    setIsAddProjectOpen(false);
    setNewProject({ name: '', description: '', category: 'Full Stack', technologies: 'React, TypeScript', githubUrl: '', liveUrl: '', status: 'Completed' });
  };

  const handleAddApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApp.company.trim()) return;
    const item: JobApplicationItem = {
      id: 'app-' + Date.now(),
      userId,
      company: newApp.company.trim(),
      role: newApp.role,
      jobUrl: newApp.jobUrl,
      applicationDate: newApp.applicationDate,
      status: newApp.status,
      location: newApp.location,
      notes: newApp.notes,
    };
    careerService.saveJobApplication(item);
    setApplications(careerService.getJobApplications(userId));
    setIsAddAppOpen(false);
    setNewApp({ company: '', role: '', jobUrl: '', applicationDate: new Date().toISOString().split('T')[0], status: 'Applied', location: 'Remote', notes: '' });
  };

  const handleAskAi = () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      const q = aiPrompt.toLowerCase();
      if (q.includes('skill') || q.includes('python') || q.includes('react')) {
        setAiResponse(`Based on your career profile, you have tracked ${skills.length} core skills including ${skills.map(s => s.name).slice(0, 5).join(', ')}. Your proficiency in React and Python is strong.`);
      } else if (q.includes('project')) {
        setAiResponse(`You have completed ${projects.length} major projects, including "${projects[0]?.name}" and "${projects[1]?.name}". They showcase full-stack and AI engineering expertise.`);
      } else if (q.includes('interview')) {
        setAiResponse(`You have ${interviews.filter(i => i.status === 'Scheduled').length} upcoming interviews scheduled (e.g., Google on Sept 25). Make sure to review your DSA problem bank and system design notes.`);
      } else if (q.includes('plan') || q.includes('weekly')) {
        setAiResponse(`Here is your suggested weekly placement preparation plan:\n• Monday: 1.5h LeetCode Hard graphs\n• Tuesday: System design mock practice\n• Wednesday: Project portfolio refinement\n• Thursday: Resume tailoring for Target Role (${careerProfile.targetRole})\n• Friday: Behavioral interview Q&A prep`);
      } else {
        setAiResponse(`Here is a summary of your career preparation for ${careerProfile.targetRole}: Target role is active, ${projects.length} projects stored, ${certs.length} certifications verified, and ${applications.filter(a => a.status === 'Interview' || a.status === 'Offer').length} active advanced applications.`);
      }
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 md:pb-8 animate-fadeIn">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-extrabold text-[10px] uppercase tracking-wider rounded-full border border-amber-500/30 flex items-center gap-1">
              <Briefcase className="w-3 h-3" /> Career & Placement Portal
            </span>
            <span className="text-xs text-indigo-300 font-semibold">• Target Graduation {careerProfile.targetGraduation}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {careerProfile.targetRole}
          </h1>
          <p className="text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
            {careerProfile.description}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>DayVault AI Career Coach</span>
          </button>
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-2xl backdrop-blur-md transition flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Goal</span>
          </button>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: '💼 Dashboard', icon: Briefcase },
          { id: 'skills', label: `🧠 Skills (${skills.length})`, icon: Code },
          { id: 'projects', label: `💻 Projects (${projects.length})`, icon: Layers },
          { id: 'certs', label: `📜 Certifications (${certs.length})`, icon: Award },
          { id: 'internships', label: `🏢 Internships (${internships.length})`, icon: UserCheck },
          { id: 'applications', label: `📋 Applications (${applications.length})`, icon: FileText },
          { id: 'interviews', label: `🎤 Interviews (${interviews.length})`, icon: Calendar },
          { id: 'coding', label: `🧑💻 Coding Practice`, icon: Target },
          { id: 'resume', label: `📄 Resume Manager`, icon: BookOpen },
          { id: 'goals', label: `🎯 Goals`, icon: CheckCircle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab: Overview Dashboard */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { label: 'Target Role', value: careerProfile.targetRole, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40' },
              { label: 'Skills Tracked', value: `${skills.length} / 15`, icon: Code, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
              { label: 'Projects', value: projects.length, icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
              { label: 'Certificates', value: certs.length, icon: Award, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/40' },
              { label: 'Internships', value: internships.length, icon: UserCheck, color: 'text-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
              { label: 'Applications', value: applications.length, icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-950/40' },
              { label: 'Interview Prep', value: `${interviewPrepPercentage}%`, icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/40' },
              { label: 'DSA Solved', value: `${solvedCount} probs`, icon: Target, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className={`w-8 h-8 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">{stat.label}</span>
                    <strong className="text-sm font-extrabold truncate block mt-0.5">{stat.value}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Sections Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Featured Projects & Active Applications */}
            <div className="lg:col-span-2 space-y-8">
              {/* Featured Projects */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-extrabold text-base">Key Projects Portfolio</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('projects')}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>View All ({projects.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.slice(0, 4).map(proj => (
                    <div key={proj.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
                      <div>
                        {proj.imageUrl && (
                          <img src={proj.imageUrl} alt={proj.name} className="w-full h-28 object-cover rounded-xl mb-3" />
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{proj.category}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{proj.status}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-1">{proj.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{proj.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.slice(0, 2).map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-[10px] rounded-md font-semibold">{tech}</span>
                          ))}
                        </div>
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Applications */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-violet-600" />
                    <h3 className="font-extrabold text-base">Active Job Applications</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('applications')}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {applications.slice(0, 4).map(app => (
                    <div key={app.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm">{app.company}</h4>
                          <span className="text-xs text-slate-400">• {app.role}</span>
                        </div>
                        <p className="text-xs text-slate-500">{app.location} • Applied {app.applicationDate}</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        app.status === 'Offer' ? 'bg-emerald-100 text-emerald-700' :
                        app.status === 'Interview' ? 'bg-amber-100 text-amber-700' :
                        app.status === 'Assessment' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Upcoming Interviews & Top Skills */}
            <div className="space-y-8">
              {/* Upcoming Interviews */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <h3 className="font-extrabold text-base">Upcoming Interviews</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('interviews')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {interviews.filter(i => i.status === 'Scheduled').map(intv => (
                    <div key={intv.id} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-amber-900 dark:text-amber-200">{intv.company}</span>
                        <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-lg">{intv.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{intv.round}</p>
                      <p className="text-[11px] text-slate-400">{intv.time} • {intv.type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-extrabold text-base">Top Skills & Proficiency</h3>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('skills')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {skills.slice(0, 5).map(skill => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{skill.name}</span>
                        <span className="text-slate-400">{skill.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Skills */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg">🧠 My Technical Skills</h3>
              <p className="text-xs text-slate-400">Track proficiency, learning status, and last practiced dates across programming, web, AI/ML, and tools.</p>
            </div>
            <button
              onClick={() => setIsAddSkillOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.map(skill => (
              <div key={skill.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold text-[10px] uppercase rounded-lg">{skill.category}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      skill.proficiency === 'Advanced' ? 'bg-emerald-50 text-emerald-600' :
                      skill.proficiency === 'Intermediate' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                    }`}>{skill.proficiency}</span>
                  </div>

                  <h4 className="font-extrabold text-base">{skill.name}</h4>
                  {skill.notes && <p className="text-xs text-slate-500 dark:text-slate-400">{skill.notes}</p>}
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Progress</span>
                    <span>{skill.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${skill.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Status: {skill.status}</span>
                    <span>Practiced {skill.lastPracticed}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Projects */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg">💻 Project Portfolio</h3>
              <p className="text-xs text-slate-400">Showcase full-stack applications, AI tools, and team projects with live demos and repositories.</p>
            </div>
            <button
              onClick={() => setIsAddProjectOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(proj => (
              <div key={proj.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  {proj.imageUrl && (
                    <img src={proj.imageUrl} alt={proj.name} className="w-full h-44 object-cover rounded-2xl" />
                  )}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 text-xs font-bold rounded-xl">{proj.category}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${proj.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{proj.status}</span>
                  </div>
                  <h4 className="font-extrabold text-lg">{proj.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{proj.description}</p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-300">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Role: {proj.role || 'Developer'}</span>
                  <div className="flex items-center gap-2">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Certifications */}
      {activeSubTab === 'certs' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg">📜 Verified Certifications</h3>
              <p className="text-xs text-slate-400">Professional credentials and specialization certificates issued by industry leaders.</p>
            </div>
            <button
              onClick={() => setIsAddCertOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certs.map(cert => (
              <div key={cert.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-base">{cert.name}</h4>
                  <p className="text-xs font-semibold text-slate-500">{cert.organization}</p>
                  <p className="text-[11px] text-slate-400">Issued: {cert.date} • ID: {cert.credentialId || 'N/A'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1">
                  {cert.skills.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded-md">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Internships */}
      {activeSubTab === 'internships' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-extrabold text-lg">🏢 Internship Experience</h3>
            <p className="text-xs text-slate-400">Professional work experience and industry engineering internships.</p>
          </div>

          <div className="space-y-4">
            {internships.map(item => (
              <div key={item.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">{item.role}</h4>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{item.organization}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-extrabold rounded-full">{item.status}</span>
                </div>

                <p className="text-xs text-slate-500">{item.location} • {item.startDate} to {item.endDate}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                {item.notes && <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-xl">{item.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Job Applications */}
      {activeSubTab === 'applications' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg">📋 Job Application Pipeline</h3>
              <p className="text-xs text-slate-400">Track company applications, interview rounds, assessments, and offers.</p>
            </div>
            <button
              onClick={() => setIsAddAppOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </button>
          </div>

          <div className="space-y-3">
            {applications.map(app => (
              <div key={app.id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-extrabold text-base">{app.company}</h4>
                    <span className="text-xs text-slate-400 font-semibold">• {app.role}</span>
                  </div>
                  <p className="text-xs text-slate-500">{app.location} • Applied on {app.applicationDate}</p>
                  {app.notes && <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">{app.notes}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold ${
                    app.status === 'Offer' ? 'bg-emerald-100 text-emerald-700' :
                    app.status === 'Interview' ? 'bg-amber-100 text-amber-700' :
                    app.status === 'Assessment' ? 'bg-indigo-100 text-indigo-700' :
                    app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Interviews */}
      {activeSubTab === 'interviews' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg">🎤 Interview Schedule & Prep</h3>
              <p className="text-xs text-slate-400">Scheduled rounds, mock interviews, and technical questions.</p>
            </div>
            <button
              onClick={() => setIsAddIntvOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Interview</span>
            </button>
          </div>

          <div className="space-y-4">
            {interviews.map(intv => (
              <div key={intv.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-indigo-600">{intv.company} - {intv.role}</h4>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{intv.date} ({intv.time})</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{intv.round}</p>
                <p className="text-xs text-slate-500">Type: {intv.type} • Status: {intv.status}</p>
                {intv.preparationNotes && (
                  <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 text-xs text-indigo-900 dark:text-indigo-200">
                    <strong>Prep Notes:</strong> {intv.preparationNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Coding Practice */}
      {activeSubTab === 'coding' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg">🧑💻 Coding Practice & DSA Problem Bank</h3>
              <p className="text-xs text-slate-400">Master Data Structures & Algorithms across platforms with structured topic tracking.</p>
            </div>
            <button
              onClick={() => setIsAddCodingOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Problem</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Solved Problems</span>
              <h2 className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-200">{solvedCount}</h2>
              <p className="text-xs text-slate-500">Target: 150+ problems for placement readiness</p>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Review Queue</span>
              <h2 className="text-3xl font-extrabold text-amber-900 dark:text-amber-200">24</h2>
              <p className="text-xs text-slate-500">Problems flagged for second-pass review</p>
            </div>

            <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 space-y-2">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">DSA Mastery</span>
              <h2 className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-200">78%</h2>
              <p className="text-xs text-slate-500">Overall syllabus coverage</p>
            </div>
          </div>

          {/* List of problems */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm">Logged Practice Problems</div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {codingProblems.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm">{p.name}</span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold rounded-md">{p.platform}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Topic: {p.topic} • Solved {p.solvedDate || 'Recently'}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                      p.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700' :
                      p.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {p.difficulty}
                    </span>
                    <span className="text-xs font-bold text-indigo-600">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab: Resume Manager */}
      {activeSubTab === 'resume' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg">📄 Resume Manager & Tailored Templates</h3>
              <p className="text-xs text-slate-400">Maintain multiple tailored resumes for software engineering, AI/ML, and data science roles.</p>
            </div>
            <button
              onClick={() => setSelectedResume(resumes[0])}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Resume Version</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumes.map(res => (
              <div key={res.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl uppercase">{res.template} template</span>
                    <span className="text-xs text-slate-400">Updated {res.updatedAt}</span>
                  </div>
                  <h4 className="font-extrabold text-lg">{res.name}</h4>
                  <p className="text-xs text-slate-500">{res.personal.fullName} • {res.personal.email} • {res.personal.location}</p>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t">
                    <p><strong>Education:</strong> {res.education.university}</p>
                    <p><strong>Skills:</strong> {res.skills.join(', ')}</p>
                    <p><strong>Projects:</strong> {res.projects.join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedResume(res)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Preview & Export PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab: Goals */}
      {activeSubTab === 'goals' && (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-extrabold text-lg">🎯 Placement & Career Goals</h3>
            <p className="text-xs text-slate-400">Long-term targets and milestone tracking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {careerGoals.map(goal => (
              <div key={goal.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base">{goal.title}</h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${goal.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {goal.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{goal.description}</p>
                <div className="flex items-center justify-between text-xs font-bold pt-2">
                  <span>Progress: {goal.progress} / {goal.target} {goal.unit}</span>
                  <span className="text-slate-400">Deadline: {goal.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Modal Drawer / Popup */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg">DayVault AI Career Coach</h3>
                  <p className="text-xs text-slate-400">Ask questions about your projects, skills, interviews, or weekly plans.</p>
                </div>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                👋 Hello! I am your AI Career Assistant. I have secure access to your tracked skills, portfolio projects, certifications, and interview schedule. How can I assist your placement preparation today?
              </div>

              {aiResponse && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                  <strong>DayVault AI:</strong>
                  <p className="mt-1">{aiResponse}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                placeholder="Ask e.g., 'Summarize my career preparation' or 'Create a weekly plan'"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleAskAi}
                disabled={isAiLoading}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-2xl shadow-md transition shrink-0"
              >
                {isAiLoading ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-lg">Add New Skill</h3>
              <button onClick={() => setIsAddSkillOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSkill} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g. GraphQL, PyTorch, Kubernetes"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Web">Web</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Proficiency</label>
                  <select
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value as any })}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Progress ({newSkill.progress}%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={newSkill.progress}
                  onChange={(e) => setNewSkill({ ...newSkill, progress: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Notes / Experience</label>
                <input
                  type="text"
                  value={newSkill.notes}
                  onChange={(e) => setNewSkill({ ...newSkill, notes: e.target.value })}
                  placeholder="e.g. Used in Capstone project"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition">
                Save Skill
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-lg">Add New Project</h3>
              <button onClick={() => setIsAddProjectOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Smart Campus Navigator"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe architecture and features..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                  <input
                    type="text"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Technologies</label>
                  <input
                    type="text"
                    value={newProject.technologies}
                    onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                    placeholder="React, Node, SQL"
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={newProject.githubUrl}
                    onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Live URL</label>
                  <input
                    type="url"
                    value={newProject.liveUrl}
                    onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition">
                Save Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Job Application Modal */}
      {isAddAppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-lg">Add Job Application</h3>
              <button onClick={() => setIsAddAppOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddApplication} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={newApp.company}
                    onChange={(e) => setNewApp({ ...newApp, company: e.target.value })}
                    placeholder="e.g. Microsoft"
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={newApp.role}
                    onChange={(e) => setNewApp({ ...newApp, role: e.target.value })}
                    placeholder="Software Engineer"
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Status</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value as any })}
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Assessment">Assessment</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Location</label>
                  <input
                    type="text"
                    value={newApp.location}
                    onChange={(e) => setNewApp({ ...newApp, location: e.target.value })}
                    placeholder="Remote / City"
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Notes</label>
                <input
                  type="text"
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Recruiter contact or referral..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition">
                Save Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
