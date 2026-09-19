export interface CareerProfile {
  userId: string;
  targetRole: string;
  domain: string;
  targetGraduation: string;
  preferredLocation: string;
  description: string;
  targetCompanies: string[];
}

export interface SkillItem {
  id: string;
  userId: string;
  name: string;
  category: 'Programming' | 'Web' | 'AI/ML' | 'Tools' | 'Other' | string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number; // 0-100
  startedDate: string;
  lastPracticed: string;
  notes?: string;
  status: 'Learning' | 'Practicing' | 'Project Applied' | 'Completed';
}

export interface ProjectItem {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  status: 'Idea' | 'Planning' | 'In Progress' | 'Completed' | 'Archived';
  githubUrl?: string;
  liveUrl?: string;
  role?: string;
  teamMembers?: string;
  imageUrl?: string;
  documentation?: string;
  achievements?: string[];
}

export interface CertificationItem {
  id: string;
  userId: string;
  name: string;
  organization: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  skills: string[];
  fileUrl?: string;
  fileName?: string;
}

export interface InternshipItem {
  id: string;
  userId: string;
  organization: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'Interested' | 'Applied' | 'Interview' | 'Selected' | 'Completed' | 'Rejected';
  description: string;
  skills: string[];
  certificate?: string;
  notes?: string;
}

export interface JobApplicationItem {
  id: string;
  userId: string;
  company: string;
  role: string;
  jobUrl?: string;
  applicationDate: string;
  deadline?: string;
  status: 'Saved' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  location?: string;
  jobType?: 'Full-time' | 'Internship' | 'Contract' | string;
  notes?: string;
}

export interface InterviewItem {
  id: string;
  userId: string;
  company: string;
  role: string;
  date: string;
  time: string;
  type: 'Technical' | 'HR' | 'Behavioral' | 'Managerial' | 'Coding' | 'Group Discussion' | 'System Design' | 'Other';
  round: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Passed' | 'Failed';
  notes?: string;
  questionsAsked?: string[];
  preparationNotes?: string;
}

export interface InterviewQuestionItem {
  id: string;
  userId: string;
  question: string;
  category: 'Technical' | 'Behavioral' | 'Company-specific' | string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  answer?: string;
  notes?: string;
  company?: string;
  lastPracticed?: string;
  confidence: 'Low' | 'Medium' | 'High';
}

export interface CodingProblemItem {
  id: string;
  userId: string;
  name: string;
  platform: 'LeetCode' | 'CodeChef' | 'HackerRank' | 'GeeksforGeeks' | 'Other';
  url?: string;
  topic: 'Arrays' | 'Strings' | 'Linked Lists' | 'Stacks' | 'Queues' | 'Trees' | 'Graphs' | 'Recursion' | 'Dynamic Programming' | 'Sorting' | 'Searching' | 'Hashing' | 'Greedy' | 'Other';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Not Started' | 'Attempted' | 'Solved' | 'Review';
  solvedDate?: string;
  notes?: string;
}

export interface ResumeItem {
  id: string;
  userId: string;
  name: string;
  template: 'modern' | 'classic' | 'minimal';
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  education: {
    university: string;
    course: string;
    branch: string;
    semester: string;
    graduationYear: string;
  };
  skills: string[];
  projects: string[];
  experiences: string[];
  internships: string[];
  certifications: string[];
  achievements: string[];
  links: {
    github: string;
    linkedin: string;
    portfolio: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CareerGoalItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
}

const STORAGE_KEYS = {
  PROFILE: 'dayvault_career_profile',
  SKILLS: 'dayvault_career_skills',
  PROJECTS: 'dayvault_career_projects',
  CERTS: 'dayvault_career_certs',
  INTERNSHIPS: 'dayvault_career_internships',
  APPLICATIONS: 'dayvault_career_applications',
  INTERVIEWS: 'dayvault_career_interviews',
  QUESTIONS: 'dayvault_career_questions',
  CODING: 'dayvault_career_coding',
  RESUMES: 'dayvault_career_resumes',
  GOALS: 'dayvault_career_goals',
};

export const careerService = {
  getProfile: (userId: string): CareerProfile => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const map: Record<string, CareerProfile> = all ? JSON.parse(all) : {};
      if (map[userId]) return map[userId];

      const defaultProfile: CareerProfile = {
        userId,
        targetRole: 'Software Engineer',
        domain: 'Full Stack & AI Systems',
        targetGraduation: '2027',
        preferredLocation: 'San Francisco, CA / Remote',
        description: 'Passionate student engineer focused on building scalable web apps and AI-powered productivity tools.',
        targetCompanies: ['Google', 'Stripe', 'OpenAI', 'Meta', 'Apple'],
      };
      map[userId] = defaultProfile;
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(map));
      return defaultProfile;
    } catch {
      return {
        userId,
        targetRole: 'Software Engineer',
        domain: 'Full Stack',
        targetGraduation: '2027',
        preferredLocation: 'Remote',
        description: 'Computer Science student and full-stack developer.',
        targetCompanies: ['Google', 'Microsoft'],
      };
    }
  },

  saveProfile: (profile: CareerProfile) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const map: Record<string, CareerProfile> = all ? JSON.parse(all) : {};
      map[profile.userId] = profile;
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }
  },

  getSkills: (userId: string): SkillItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SKILLS);
      const all: SkillItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(s => s.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: SkillItem[] = [
        { id: 'sk-1', userId, name: 'Python', category: 'Programming', proficiency: 'Advanced', progress: 85, startedDate: '2024-09-01', lastPracticed: '2026-09-17', status: 'Practicing', notes: 'Used for AI pipelines and backend microservices.' },
        { id: 'sk-2', userId, name: 'React', category: 'Web', proficiency: 'Advanced', progress: 90, startedDate: '2025-01-10', lastPracticed: '2026-09-18', status: 'Project Applied', notes: 'Primary UI framework for DayVault.' },
        { id: 'sk-3', userId, name: 'TypeScript', category: 'Programming', proficiency: 'Intermediate', progress: 78, startedDate: '2025-05-15', lastPracticed: '2026-09-18', status: 'Practicing', notes: 'Strict typing for robust frontend and backend services.' },
        { id: 'sk-4', userId, name: 'C++', category: 'Programming', proficiency: 'Advanced', progress: 82, startedDate: '2024-08-15', lastPracticed: '2026-09-14', status: 'Completed', notes: 'Data structures & algorithms mastery.' },
        { id: 'sk-5', userId, name: 'Node.js & Express', category: 'Web', proficiency: 'Intermediate', progress: 75, startedDate: '2025-03-20', lastPracticed: '2026-09-16', status: 'Practicing', notes: 'REST API design and middleware.' },
        { id: 'sk-6', userId, name: 'Machine Learning', category: 'AI/ML', proficiency: 'Intermediate', progress: 70, startedDate: '2025-09-01', lastPracticed: '2026-09-10', status: 'Learning', notes: 'Scikit-learn, TensorFlow fundamentals.' },
        { id: 'sk-7', userId, name: 'Docker & Git', category: 'Tools', proficiency: 'Intermediate', progress: 80, startedDate: '2025-02-10', lastPracticed: '2026-09-18', status: 'Project Applied', notes: 'Containerization and version control workflows.' },
        { id: 'sk-8', userId, name: 'SQL & PostgreSQL', category: 'Tools', proficiency: 'Advanced', progress: 88, startedDate: '2024-11-10', lastPracticed: '2026-09-15', status: 'Completed', notes: 'Relational schema design and complex joins.' },
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveSkill: (skill: SkillItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SKILLS);
      const all: SkillItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(s => s.id === skill.id);
      if (idx >= 0) all[idx] = skill;
      else all.unshift(skill);
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteSkill: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SKILLS);
      let all: SkillItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getProjects: (userId: string): ProjectItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const all: ProjectItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(p => p.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: ProjectItem[] = [
        {
          id: 'proj-1',
          userId,
          name: 'DayVault - Student Life Platform',
          description: 'A comprehensive full-stack student life-management & productivity platform with AI integration, attendance trackers, and memory vaults.',
          category: 'Full Stack Web App',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Gemini AI'],
          startDate: '2026-08-01',
          endDate: '2026-09-18',
          status: 'Completed',
          githubUrl: 'https://github.com/example/dayvault',
          liveUrl: 'https://dayvault.app',
          role: 'Lead Full Stack Developer',
          teamMembers: 'Solo project',
          imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          achievements: ['Achieved 100% test coverage and lightning-fast local persistence', 'Integrated server-side Gemini AI features']
        },
        {
          id: 'proj-2',
          userId,
          name: 'Campus Ride Share',
          description: 'Peer-to-peer carpooling and ride-sharing app specifically tailored for university students and faculty.',
          category: 'Mobile Web App',
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Mapbox API'],
          startDate: '2026-04-10',
          endDate: '2026-06-30',
          status: 'Completed',
          githubUrl: 'https://github.com/example/campus-ride',
          liveUrl: 'https://campusride.edu',
          role: 'Backend & Database Engineer',
          teamMembers: 'Team of 3',
          imageUrl: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
          achievements: ['Adopted by over 1,200 students in first month']
        },
        {
          id: 'proj-3',
          userId,
          name: 'AI Code Reviewer Agent',
          description: 'Automated code review microservice utilizing LLMs to detect code smells, security vulnerabilities, and adherence to style guides.',
          category: 'AI / Developer Tool',
          technologies: ['Python', 'FastAPI', 'Gemini API', 'Docker'],
          startDate: '2026-07-01',
          endDate: '2026-08-15',
          status: 'Completed',
          githubUrl: 'https://github.com/example/ai-reviewer',
          role: 'Creator & Maintainer',
          imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'proj-4',
          userId,
          name: 'Algorithm Visualizer Pro',
          description: 'Interactive web application visualizing graph traversal algorithms, sorting algorithms, and dynamic programming tables in real time.',
          category: 'Educational Tool',
          technologies: ['React', 'JavaScript', 'HTML5 Canvas'],
          startDate: '2026-01-15',
          endDate: '2026-03-01',
          status: 'Archived',
          githubUrl: 'https://github.com/example/algo-viz',
          role: 'Solo Developer',
          imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveProject: (project: ProjectItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const all: ProjectItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(p => p.id === project.id);
      if (idx >= 0) all[idx] = project;
      else all.unshift(project);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteProject: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      let all: ProjectItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getCertifications: (userId: string): CertificationItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CERTS);
      const all: CertificationItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(c => c.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: CertificationItem[] = [
        {
          id: 'cert-1',
          userId,
          name: 'AWS Certified Developer - Associate',
          organization: 'Amazon Web Services',
          date: '2026-06-12',
          credentialId: 'AWS-DEV-984210',
          credentialUrl: 'https://aws.amazon.com/verification',
          skills: ['Cloud Computing', 'AWS Lambda', 'DynamoDB', 'Docker'],
          fileName: 'AWS_Developer_Certificate.pdf',
          fileUrl: '#'
        },
        {
          id: 'cert-2',
          userId,
          name: 'Google Advanced Data Analytics Specialization',
          organization: 'Google Career Certificates',
          date: '2026-05-20',
          credentialId: 'GGL-ADA-7731',
          credentialUrl: 'https://coursera.org/verify/google-ada',
          skills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
          fileName: 'Google_Data_Analytics.pdf',
          fileUrl: '#'
        },
        {
          id: 'cert-3',
          userId,
          name: 'Deep Learning Specialization',
          organization: 'DeepLearning.AI',
          date: '2026-04-15',
          credentialId: 'DL-SPEC-449',
          credentialUrl: 'https://coursera.org/verify/dl',
          skills: ['Neural Networks', 'TensorFlow', 'Convolutional Networks'],
          fileName: 'Deep_Learning_Cert.pdf',
          fileUrl: '#'
        },
        {
          id: 'cert-4',
          userId,
          name: 'PostgreSQL Advanced Database Administration',
          organization: 'PostgreSQL Global Development Group',
          date: '2026-03-10',
          credentialId: 'PG-DBA-901',
          skills: ['SQL', 'Database Optimization', 'Indexes'],
          fileName: 'Postgres_Cert.pdf',
          fileUrl: '#'
        },
        {
          id: 'cert-5',
          userId,
          name: 'React & TypeScript Masterclass',
          organization: 'Frontend Masters',
          date: '2026-02-14',
          credentialId: 'FM-TS-112',
          skills: ['React', 'TypeScript', 'State Management'],
          fileName: 'React_TS_Cert.pdf',
          fileUrl: '#'
        },
        {
          id: 'cert-6',
          userId,
          name: 'Git & GitHub Professional Certificate',
          organization: 'GitHub',
          date: '2026-01-10',
          credentialId: 'GH-PRO-334',
          skills: ['Git', 'GitHub Actions', 'CI/CD'],
          fileName: 'Git_Cert.pdf',
          fileUrl: '#'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveCertification: (cert: CertificationItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CERTS);
      const all: CertificationItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(c => c.id === cert.id);
      if (idx >= 0) all[idx] = cert;
      else all.unshift(cert);
      localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteCertification: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CERTS);
      let all: CertificationItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getInternships: (userId: string): InternshipItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INTERNSHIPS);
      const all: InternshipItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(i => i.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: InternshipItem[] = [
        {
          id: 'int-1',
          userId,
          organization: 'Stripe',
          role: 'Software Engineering Intern',
          location: 'San Francisco, CA (Hybrid)',
          startDate: '2025-06-01',
          endDate: '2025-08-25',
          status: 'Completed',
          description: 'Worked on payment gateway microservices and API reliability improvements in Ruby and TypeScript.',
          skills: ['TypeScript', 'Ruby', 'API Design', 'PostgreSQL'],
          certificate: 'Stripe_Internship_Certificate.pdf',
          notes: 'Received return full-time offer recommendation.'
        },
        {
          id: 'int-2',
          userId,
          organization: 'Google',
          role: 'AI / ML Research Intern',
          location: 'Mountain View, CA (Remote)',
          startDate: '2026-06-01',
          endDate: '2026-08-30',
          status: 'Completed',
          description: 'Researched efficient model quantization techniques and edge AI deployment pipelines.',
          skills: ['Python', 'TensorFlow', 'PyTorch', 'Model Optimization'],
          certificate: 'Google_Internship_Completion.pdf',
          notes: 'Co-authored an internal whitepaper on edge compute efficiency.'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveInternship: (item: InternshipItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INTERNSHIPS);
      const all: InternshipItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(i => i.id === item.id);
      if (idx >= 0) all[idx] = item;
      else all.unshift(item);
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteInternship: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INTERNSHIPS);
      let all: InternshipItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getJobApplications: (userId: string): JobApplicationItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      const all: JobApplicationItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(a => a.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: JobApplicationItem[] = [
        {
          id: 'app-1',
          userId,
          company: 'Google',
          role: 'Software Engineer, University Graduate',
          jobUrl: 'https://careers.google.com',
          applicationDate: '2026-09-01',
          deadline: '2026-10-15',
          status: 'Interview',
          location: 'Mountain View, CA',
          jobType: 'Full-time',
          notes: 'Completed online assessment. Onsite technical rounds scheduled for next week.'
        },
        {
          id: 'app-2',
          userId,
          company: 'Stripe',
          role: 'Backend Software Engineer',
          jobUrl: 'https://stripe.com/jobs',
          applicationDate: '2026-09-05',
          status: 'Assessment',
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          notes: 'Recruiter reached out following internship completion.'
        },
        {
          id: 'app-3',
          userId,
          company: 'OpenAI',
          role: 'Member of Technical Staff, AI Engineering',
          jobUrl: 'https://openai.com/careers',
          applicationDate: '2026-09-10',
          status: 'Applied',
          location: 'San Francisco, CA',
          jobType: 'Full-time',
          notes: 'Submitted resume and portfolio.'
        },
        {
          id: 'app-4',
          userId,
          company: 'Apple',
          role: 'iOS / Systems Engineer',
          jobUrl: 'https://apple.com/jobs',
          applicationDate: '2026-08-20',
          status: 'Offer',
          location: 'Cupertino, CA',
          jobType: 'Full-time',
          notes: 'Received formal offer letter with competitive compensation package.'
        },
        {
          id: 'app-5',
          userId,
          company: 'Meta',
          role: 'Production Engineer',
          jobUrl: 'https://metacareers.com',
          applicationDate: '2026-08-10',
          status: 'Rejected',
          location: 'Menlo Park, CA',
          jobType: 'Full-time',
          notes: 'Position filled internally.'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveJobApplication: (app: JobApplicationItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      const all: JobApplicationItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(a => a.id === app.id);
      if (idx >= 0) all[idx] = app;
      else all.unshift(app);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteJobApplication: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      let all: JobApplicationItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getInterviews: (userId: string): InterviewItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      const all: InterviewItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(i => i.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: InterviewItem[] = [
        {
          id: 'intv-1',
          userId,
          company: 'Google',
          role: 'Software Engineer',
          date: '2026-09-25',
          time: '10:00 AM',
          type: 'Technical',
          round: 'Round 1: Data Structures & Algorithms',
          status: 'Scheduled',
          notes: 'Focus on graph cycle detection and dynamic programming tree problems.',
          preparationNotes: 'Review LeetCode medium/hard graph problems.'
        },
        {
          id: 'intv-2',
          userId,
          company: 'Google',
          role: 'Software Engineer',
          date: '2026-09-26',
          time: '02:00 PM',
          type: 'System Design',
          round: 'Round 2: Distributed System Design',
          status: 'Scheduled',
          notes: 'Design a distributed rate limiter and URL shortener.',
          preparationNotes: 'Review Alex Xu System Design volume 1 & 2.'
        },
        {
          id: 'intv-3',
          userId,
          company: 'Stripe',
          role: 'Backend Engineer',
          date: '2026-09-20',
          time: '11:00 AM',
          type: 'Coding',
          round: 'Technical Coding Round',
          status: 'Completed',
          notes: 'Implemented concurrent transaction ledger in TypeScript.',
          questionsAsked: ['Design an in-memory database with transaction rollbacks'],
          preparationNotes: 'Went exceptionally well.'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveInterview: (item: InterviewItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      const all: InterviewItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(i => i.id === item.id);
      if (idx >= 0) all[idx] = item;
      else all.unshift(item);
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteInterview: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INTERVIEWS);
      let all: InterviewItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getInterviewQuestions: (userId: string): InterviewQuestionItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      const all: InterviewQuestionItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(q => q.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: InterviewQuestionItem[] = [
        {
          id: 'q-1',
          userId,
          question: 'Explain the difference between process and thread.',
          category: 'Operating Systems',
          difficulty: 'Easy',
          answer: 'A process is an independent execution unit with its own memory space, whereas threads exist within a process and share memory resources.',
          company: 'Google',
          confidence: 'High'
        },
        {
          id: 'q-2',
          userId,
          question: 'How do you detect a cycle in a directed graph?',
          category: 'Technical',
          difficulty: 'Medium',
          answer: 'Use Depth First Search (DFS) with a recursion stack / visited color array (white, gray, black).',
          company: 'Stripe',
          confidence: 'High'
        },
        {
          id: 'q-3',
          userId,
          question: 'Tell me about a challenging project you built under a tight deadline.',
          category: 'Behavioral',
          difficulty: 'Medium',
          answer: 'Discussed building DayVault with robust offline persistence and AI integrations.',
          company: 'OpenAI',
          confidence: 'High'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveInterviewQuestion: (q: InterviewQuestionItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      const all: InterviewQuestionItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(item => item.id === q.id);
      if (idx >= 0) all[idx] = q;
      else all.unshift(q);
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteInterviewQuestion: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      let all: InterviewQuestionItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(q => q.id !== id);
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getCodingProblems: (userId: string): CodingProblemItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CODING);
      const all: CodingProblemItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(c => c.userId === userId);
      if (userItems.length > 0) return userItems;

      // 120 total mock count simulated with core items
      const topics: CodingProblemItem['topic'][] = ['Arrays', 'Strings', 'Dynamic Programming', 'Trees', 'Graphs', 'Linked Lists', 'Sorting', 'Hashing'];
      const platforms: CodingProblemItem['platform'][] = ['LeetCode', 'GeeksforGeeks', 'HackerRank'];
      const difficulties: CodingProblemItem['difficulty'][] = ['Easy', 'Medium', 'Hard'];

      const defaults: CodingProblemItem[] = [
        { id: 'cp-1', userId, name: 'Two Sum', platform: 'LeetCode', url: 'https://leetcode.com/problems/two-sum', topic: 'Arrays', difficulty: 'Easy', status: 'Solved', solvedDate: '2026-08-01' },
        { id: 'cp-2', userId, name: 'Longest Substring Without Repeating Characters', platform: 'LeetCode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters', topic: 'Strings', difficulty: 'Medium', status: 'Solved', solvedDate: '2026-08-05' },
        { id: 'cp-3', userId, name: 'Median of Two Sorted Arrays', platform: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays', topic: 'Searching', difficulty: 'Hard', status: 'Review', solvedDate: '2026-08-12' },
        { id: 'cp-4', userId, name: 'Course Schedule II', platform: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule-ii', topic: 'Graphs', difficulty: 'Medium', status: 'Solved', solvedDate: '2026-08-20' },
        { id: 'cp-5', userId, name: 'Coin Change', platform: 'LeetCode', url: 'https://leetcode.com/problems/coin-change', topic: 'Dynamic Programming', difficulty: 'Medium', status: 'Solved', solvedDate: '2026-08-25' },
        { id: 'cp-6', userId, name: 'LRU Cache', platform: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache', topic: 'Linked Lists', difficulty: 'Medium', status: 'Solved', solvedDate: '2026-09-02' },
        { id: 'cp-7', userId, name: 'Merge K Sorted Lists', platform: 'LeetCode', url: 'https://leetcode.com/problems/merge-k-sorted-lists', topic: 'Trees', difficulty: 'Hard', status: 'Attempted', solvedDate: '2026-09-10' },
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.CODING, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveCodingProblem: (problem: CodingProblemItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CODING);
      const all: CodingProblemItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(p => p.id === problem.id);
      if (idx >= 0) all[idx] = problem;
      else all.unshift(problem);
      localStorage.setItem(STORAGE_KEYS.CODING, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteCodingProblem: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CODING);
      let all: CodingProblemItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.CODING, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getResumes: (userId: string): ResumeItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESUMES);
      const all: ResumeItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(r => r.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: ResumeItem[] = [
        {
          id: 'res-1',
          userId,
          name: 'Software Engineer Resume',
          template: 'modern',
          personal: {
            fullName: 'Alex Morgan',
            email: 'alex.morgan@university.edu',
            phone: '+1 (555) 234-5678',
            location: 'San Francisco, CA'
          },
          education: {
            university: 'University of California, Berkeley',
            course: 'B.S. Computer Science',
            branch: 'Computer Science',
            semester: '7th Semester',
            graduationYear: '2027'
          },
          skills: ['Python', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
          projects: ['DayVault - Student Life Platform', 'Campus Ride Share'],
          experiences: ['Software Engineering Intern at Stripe (Summer 2025)'],
          internships: ['Stripe - Software Engineering Intern', 'Google - AI Research Intern'],
          certifications: ['AWS Certified Developer', 'Google Data Analytics'],
          achievements: ['Dean List 4 Semesters', 'Hackathon Winner 2025'],
          links: {
            github: 'https://github.com/example',
            linkedin: 'https://linkedin.com/in/example',
            portfolio: 'https://example.dev'
          },
          createdAt: '2026-08-15',
          updatedAt: '2026-09-18'
        },
        {
          id: 'res-2',
          userId,
          name: 'AI / ML Engineer Resume',
          template: 'minimal',
          personal: {
            fullName: 'Alex Morgan',
            email: 'alex.morgan@university.edu',
            phone: '+1 (555) 234-5678',
            location: 'San Francisco, CA'
          },
          education: {
            university: 'University of California, Berkeley',
            course: 'B.S. Computer Science',
            branch: 'AI & Systems',
            semester: '7th Semester',
            graduationYear: '2027'
          },
          skills: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch'],
          projects: ['AI Code Reviewer Agent', 'DayVault - Student Life Platform'],
          experiences: ['AI Research Intern at Google (Summer 2026)'],
          internships: ['Google - AI Research Intern'],
          certifications: ['Deep Learning Specialization (DeepLearning.AI)'],
          achievements: ['Published internal AI whitepaper'],
          links: {
            github: 'https://github.com/example',
            linkedin: 'https://linkedin.com/in/example',
            portfolio: 'https://example.dev'
          },
          createdAt: '2026-09-01',
          updatedAt: '2026-09-18'
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveResume: (resume: ResumeItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESUMES);
      const all: ResumeItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(r => r.id === resume.id);
      if (idx >= 0) all[idx] = { ...resume, updatedAt: new Date().toISOString().split('T')[0] };
      else all.unshift(resume);
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteResume: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESUMES);
      let all: ResumeItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getCareerGoals: (userId: string): CareerGoalItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      const all: CareerGoalItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(g => g.userId === userId);
      if (userItems.length > 0) return userItems;

      const defaults: CareerGoalItem[] = [
        { id: 'cg-1', userId, title: 'Master Data Structures & Algorithms', description: 'Solve 150+ LeetCode problems covering all major topics.', target: 150, progress: 120, unit: 'problems', deadline: '2026-11-30', status: 'active' },
        { id: 'cg-2', userId, title: 'Complete Full-Stack Capstone Project', description: 'Finish DayVault platform with AI features and high polish.', target: 1, progress: 1, unit: 'project', deadline: '2026-09-20', status: 'completed' },
        { id: 'cg-3', userId, title: 'Obtain AWS Developer Certification', description: 'Pass associate certification exam.', target: 1, progress: 1, unit: 'cert', deadline: '2026-06-30', status: 'completed' },
        { id: 'cg-4', userId, title: 'Secure Top-tier Tech Internship / Job', description: 'Receive full-time software engineering offer.', target: 1, progress: 1, unit: 'offer', deadline: '2026-10-31', status: 'active' },
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveCareerGoal: (goal: CareerGoalItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      const all: CareerGoalItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(g => g.id === goal.id);
      if (idx >= 0) all[idx] = goal;
      else all.unshift(goal);
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  deleteCareerGoal: (id: string) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      let all: CareerGoalItem[] = raw ? JSON.parse(raw) : [];
      all = all.filter(g => g.id !== id);
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }
};
