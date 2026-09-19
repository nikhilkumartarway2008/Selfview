export interface UniversityProfile {
  userId: string;
  universityName: string;
  campus: string;
  course: string;
  branch: string;
  semester: string;
  graduationYear: string;
  universityMode: boolean; // ON/OFF
}

export interface UniversityEventItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar' | 'Hackathon' | 'Competition' | 'Club Event' | 'Placement' | 'Academic' | 'Other';
  imageUrl?: string;
  registrationLink?: string;
  contactInfo?: string;
  tags: string[];
  rsvpd?: boolean;
  saved?: boolean;
}

export interface UniversityNoticeItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  category: 'Academic' | 'Examination' | 'Placement' | 'Scholarship' | 'Event' | 'Workshop' | 'General';
  attachmentUrl?: string;
  attachmentName?: string;
  important: boolean;
  expiryDate: string;
  saved?: boolean;
}

export interface ClubItem {
  id: string;
  userId: string;
  name: string;
  logoUrl?: string;
  description: string;
  category: 'Coding' | 'AI/ML' | 'Robotics' | 'Entrepreneurship' | 'Cultural' | 'Music' | 'Sports' | 'Photography' | 'Literature' | 'Social Service' | 'Other';
  facultyCoordinator: string;
  studentCoordinator: string;
  meetingInfo: string;
  contactLink?: string;
  following?: boolean;
}

export interface StudyGroupItem {
  id: string;
  userId: string;
  name: string;
  subject: string;
  topic: string;
  semester: string;
  description: string;
  maxMembers: number;
  currentMembers: number;
  meetingSchedule: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  locationOrLink: string;
  creatorName: string;
  joined?: boolean;
}

export interface AcademicResourceItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  semester: string;
  resourceType: 'PDF' | 'Notes' | 'Images' | 'Links' | 'Question Paper' | 'Study Guide' | 'Reference';
  fileUrl?: string;
  fileName?: string;
  uploadedBy: string;
  uploadDate: string;
  tags: string[];
  bookmarked?: boolean;
}

export interface CampusLocationItem {
  id: string;
  name: string;
  category: 'Library' | 'Labs' | 'Classrooms' | 'Auditorium' | 'Cafeteria' | 'Sports' | 'Administrative' | 'Venue';
  building: string;
  timings: string;
  description: string;
}

export interface CommunityProfileItem {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  course: string;
  branch: string;
  semester: string;
  skills: string[];
  bio: string;
  visibility: 'Public' | 'University Only' | 'Private';
}

const STORAGE_KEYS = {
  PROFILE: 'dayvault_univ_profile',
  EVENTS: 'dayvault_univ_events',
  NOTICES: 'dayvault_univ_notices',
  CLUBS: 'dayvault_univ_clubs',
  GROUPS: 'dayvault_univ_groups',
  RESOURCES: 'dayvault_univ_resources',
  COMMUNITY_PROFILE: 'dayvault_community_profile',
};

export const communityService = {
  getProfile: (userId: string): UniversityProfile => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const map: Record<string, UniversityProfile> = all ? JSON.parse(all) : {};
      if (map[userId]) return map[userId];

      const defaultProfile: UniversityProfile = {
        userId,
        universityName: 'University of California, Berkeley',
        campus: 'Main Campus - Davis Hall',
        course: 'B.S. Computer Science',
        branch: 'Computer Science',
        semester: 'Fall 2026 (7th Semester)',
        graduationYear: '2027',
        universityMode: true,
      };
      map[userId] = defaultProfile;
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(map));
      return defaultProfile;
    } catch {
      return {
        userId,
        universityName: 'UC Berkeley',
        campus: 'Main Campus',
        course: 'Computer Science',
        branch: 'CS',
        semester: 'Semester 7',
        graduationYear: '2027',
        universityMode: true,
      };
    }
  },

  saveProfile: (profile: UniversityProfile) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const map: Record<string, UniversityProfile> = all ? JSON.parse(all) : {};
      map[profile.userId] = profile;
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }
  },

  getEvents: (userId: string): UniversityEventItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const all: UniversityEventItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(e => e.userId === userId || e.userId === 'shared');
      if (userItems.length > 0) return userItems;

      const defaults: UniversityEventItem[] = [
        {
          id: 'evt-1',
          userId: 'shared',
          title: 'Annual Berkeley AI & Autonomous Systems Hackathon 2026',
          description: 'Join 500+ student developers for 36 hours of building cutting-edge LLM applications, robotics, and autonomous agents. Over $20,000 in prizes!',
          date: '2026-09-25',
          startTime: '09:00 AM',
          endTime: '09:00 PM',
          venue: 'Wozniak Lounge & Soda Hall',
          organizer: 'Berkeley AI Research (BAIR) & IEEE',
          category: 'Hackathon',
          imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
          registrationLink: 'https://hackathon.berkeley.edu',
          contactInfo: 'hackathon@berkeley.edu',
          tags: ['AI', 'Hackathon', 'Coding', 'Prizes'],
          rsvpd: true,
          saved: true,
        },
        {
          id: 'evt-2',
          userId: 'shared',
          title: 'Fall 2026 Engineering Career & Internship Fair',
          description: 'Connect with recruiters and engineering leaders from Google, Apple, Stripe, OpenAI, Meta, and 80+ top tech firms.',
          date: '2026-09-28',
          startTime: '10:00 AM',
          endTime: '04:00 PM',
          venue: 'Student Union Ballroom',
          organizer: 'University Career Center',
          category: 'Placement',
          imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
          registrationLink: 'https://career.berkeley.edu/fair',
          contactInfo: 'careers@berkeley.edu',
          tags: ['Placement', 'Internships', 'Networking', 'Jobs'],
          rsvpd: false,
          saved: true,
        },
        {
          id: 'evt-3',
          userId: 'shared',
          title: 'Advanced React & TypeScript Architectural Masterclass',
          description: 'A deep-dive technical workshop on building performant micro-frontends and state management at scale.',
          date: '2026-09-30',
          startTime: '02:00 PM',
          endTime: '05:00 PM',
          venue: 'Cory Hall Room 299',
          organizer: 'Web Development @ Berkeley',
          category: 'Workshop',
          imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
          tags: ['React', 'TypeScript', 'Frontend', 'Workshop'],
          rsvpd: true,
        },
        {
          id: 'evt-4',
          userId: 'shared',
          title: 'Inter-College Robotics & Drone Racing Championship',
          description: 'Witness autonomous aerial drones and ground rovers compete in timed obstacle circuits.',
          date: '2026-10-05',
          startTime: '11:00 AM',
          endTime: '03:00 PM',
          venue: 'Edwards Stadium',
          organizer: 'Robotics Club',
          category: 'Sports',
          imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
          tags: ['Robotics', 'Drones', 'Competition'],
          rsvpd: false,
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveEvent: (event: UniversityEventItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const all: UniversityEventItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(e => e.id === event.id);
      if (idx >= 0) all[idx] = event;
      else all.unshift(event);
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getNotices: (userId: string): UniversityNoticeItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTICES);
      const all: UniversityNoticeItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(n => n.userId === userId || n.userId === 'shared');
      if (userItems.length > 0) return userItems;

      const defaults: UniversityNoticeItem[] = [
        {
          id: 'not-1',
          userId: 'shared',
          title: 'Mid-Semester Examination Schedule Fall 2026 Released',
          description: 'The official timetable for mid-semester examinations across all Computer Science and Engineering courses is now live. Please review venue seat allocations.',
          date: '2026-09-17',
          category: 'Examination',
          important: true,
          expiryDate: '2026-10-10',
          attachmentName: 'MidSem_Timetable_Fall2026.pdf',
          saved: true,
        },
        {
          id: 'not-2',
          userId: 'shared',
          title: 'Google & Stripe Campus Recruitment Drive Registration Deadline',
          description: 'All final-year students wishing to participate in the upcoming tech recruitment drive must complete their profiles on the placement portal by September 24.',
          date: '2026-09-16',
          category: 'Placement',
          important: true,
          expiryDate: '2026-09-24',
          attachmentName: 'Placement_Guidelines_2026.pdf',
        },
        {
          id: 'not-3',
          userId: 'shared',
          title: 'Library Extended Operating Hours During Exam Period',
          description: 'Doe Library and Engineering Library will remain open 24/7 starting October 1st to support student study groups and research preparations.',
          date: '2026-09-15',
          category: 'Academic',
          important: false,
          expiryDate: '2026-10-30',
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  getClubs: (userId: string): ClubItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CLUBS);
      const all: ClubItem[] = raw ? JSON.parse(raw) : [];
      if (all.length > 0) return all;

      const defaults: ClubItem[] = [
        {
          id: 'club-1',
          userId: 'shared',
          name: 'Association for Computing Machinery (ACM)',
          description: 'The premier student chapter for competitive programming, system architecture, and tech talks.',
          category: 'Coding',
          facultyCoordinator: 'Dr. Alan Turing',
          studentCoordinator: 'Alex Morgan',
          meetingInfo: 'Every Thursday at 6:00 PM in Soda Hall 320',
          following: true,
        },
        {
          id: 'club-2',
          userId: 'shared',
          name: 'Berkeley Artificial Intelligence Research (BAIR)',
          description: 'Undergraduate research group exploring deep learning models, natural language processing, and robotics.',
          category: 'AI/ML',
          facultyCoordinator: 'Dr. Geoffrey Hinton',
          studentCoordinator: 'Sarah Chen',
          meetingInfo: 'Bi-weekly Tuesdays at 7:00 PM in Cory Hall',
          following: true,
        },
        {
          id: 'club-3',
          userId: 'shared',
          name: 'Entrepreneurship & Venture Club',
          description: 'Incubating student startup ideas, connecting with Silicon Valley angel investors and Y Combinator alumni.',
          category: 'Entrepreneurship',
          facultyCoordinator: 'Prof. Elon Musk',
          studentCoordinator: 'David Kim',
          meetingInfo: 'Wednesdays at 5:30 PM in Haas Business School',
          following: false,
        },
        {
          id: 'club-4',
          userId: 'shared',
          name: 'Robotics & Automation Society',
          description: 'Building autonomous rovers, quadcopters, and competing in international DARPA challenges.',
          category: 'Robotics',
          facultyCoordinator: 'Dr. Rodney Brooks',
          studentCoordinator: 'Marcus Vance',
          meetingInfo: 'Mondays at 4:00 PM in Etcheverry Hall',
          following: false,
        }
      ];
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(defaults));
      return defaults;
    } catch {
      return [];
    }
  },

  getStudyGroups: (userId: string): StudyGroupItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
      const all: StudyGroupItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(g => g.userId === userId || g.userId === 'shared');
      if (userItems.length > 0) return userItems;

      const defaults: StudyGroupItem[] = [
        {
          id: 'grp-1',
          userId: 'shared',
          name: 'Advanced Algorithms & Graph Theory Study Squad',
          subject: 'Computer Science',
          topic: 'Graph Algorithms & Dynamic Programming',
          semester: 'Fall 2026',
          description: 'Preparing for technical interviews and advanced algorithms exams. Solving LeetCode Hard problems together.',
          maxMembers: 6,
          currentMembers: 4,
          meetingSchedule: 'Mon & Thu 8:00 PM',
          mode: 'Online',
          locationOrLink: 'https://meet.google.com/abc-xyz-pqr',
          creatorName: 'Alex Morgan',
          joined: true,
        },
        {
          id: 'grp-2',
          userId: 'shared',
          name: 'Machine Learning Research & PyTorch Group',
          subject: 'Artificial Intelligence',
          topic: 'Transformer Architectures & Fine-tuning LLMs',
          semester: 'Fall 2026',
          description: 'Reading research papers and implementing state-of-the-art models from scratch in PyTorch.',
          maxMembers: 5,
          currentMembers: 3,
          meetingSchedule: 'Sundays at 3:00 PM',
          mode: 'Hybrid',
          locationOrLink: 'Soda Hall Room 410 / Discord',
          creatorName: 'Sarah Chen',
          joined: false,
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveStudyGroup: (group: StudyGroupItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
      const all: StudyGroupItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(g => g.id === group.id);
      if (idx >= 0) all[idx] = group;
      else all.unshift(group);
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getResources: (userId: string): AcademicResourceItem[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      const all: AcademicResourceItem[] = raw ? JSON.parse(raw) : [];
      const userItems = all.filter(r => r.userId === userId || r.userId === 'shared');
      if (userItems.length > 0) return userItems;

      const defaults: AcademicResourceItem[] = [
        {
          id: 'res-1',
          userId: 'shared',
          title: 'Complete Operating Systems Lecture Notes & Process Synchronization Guide',
          description: 'Comprehensive handwritten & typed notes covering semaphores, deadlocks, virtual memory, and paging.',
          subject: 'Operating Systems',
          topic: 'Concurrency & Deadlocks',
          semester: 'Fall 2026',
          resourceType: 'Notes',
          fileName: 'OS_Lecture_Notes_2026.pdf',
          uploadedBy: 'Alex Morgan',
          uploadDate: '2026-09-14',
          tags: ['OS', 'Semaphores', 'Deadlocks', 'Notes'],
          bookmarked: true,
        },
        {
          id: 'res-2',
          userId: 'shared',
          title: 'Data Structures & Algorithms Final Question Bank with Solutions',
          description: 'Compiled past 5 years midterm and final exam questions with detailed algorithmic complexity breakdowns.',
          subject: 'Data Structures',
          topic: 'Trees, Graphs & Heaps',
          semester: 'Fall 2026',
          resourceType: 'Question Paper',
          fileName: 'DSA_Past_Exams_Solutions.pdf',
          uploadedBy: 'Professor Miller',
          uploadDate: '2026-09-10',
          tags: ['DSA', 'Exams', 'Solutions'],
          bookmarked: true,
        },
        {
          id: 'res-3',
          userId: 'shared',
          title: 'Database Management Systems SQL Optimization Cheat Sheet',
          description: 'B-Trees, indexing strategies, query execution plans, and ACID compliance summary.',
          subject: 'DBMS',
          topic: 'SQL & Indexing',
          semester: 'Fall 2026',
          resourceType: 'Study Guide',
          fileName: 'DBMS_Optimization_CheatSheet.pdf',
          uploadedBy: 'Sarah Chen',
          uploadDate: '2026-09-08',
          tags: ['SQL', 'DBMS', 'Indexes', 'CheatSheet'],
          bookmarked: false,
        }
      ];
      all.push(...defaults);
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(all));
      return defaults;
    } catch {
      return [];
    }
  },

  saveResource: (res: AcademicResourceItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      const all: AcademicResourceItem[] = raw ? JSON.parse(raw) : [];
      const idx = all.findIndex(r => r.id === res.id);
      if (idx >= 0) all[idx] = res;
      else all.unshift(res);
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  },

  getCampusLocations: (): CampusLocationItem[] => [
    { id: 'loc-1', name: 'Doe Memorial Library', category: 'Library', building: 'Center Campus Quad', timings: '24/7 during exams (8AM - 11PM regular)', description: 'Main research library featuring quiet study halls and digital media labs.' },
    { id: 'loc-2', name: 'Soda Hall Computer Science Labs', category: 'Labs', building: 'North Campus', timings: 'Open 24/7 with student ID badge', description: 'High-performance Linux workstations, GPU clusters, and student project spaces.' },
    { id: 'loc-3', name: 'Student Union Plaza & Food Court', category: 'Cafeteria', building: 'Central Campus', timings: '7:30 AM - 9:00 PM', description: 'Dining options, coffee shops, student lounges, and event spaces.' },
    { id: 'loc-4', name: 'Zellerbach Auditorium', category: 'Auditorium', building: 'South Campus', timings: 'Event dependent', description: 'Venue for keynote lectures, cultural performances, and guest speaker seminars.' },
    { id: 'loc-5', name: 'Cory Hall Electrical Engineering Labs', category: 'Labs', building: 'North-East Campus', timings: '8:00 AM - 10:00 PM', description: 'Embedded systems, IoT lab, and robotics assembly benches.' },
    { id: 'loc-6', name: 'Edwards Stadium & Recreational Center', category: 'Sports', building: 'West Campus', timings: '6:00 AM - 10:00 PM', description: 'Olympic swimming pool, track and field stadium, and indoor gym.' },
  ],

  getCommunityProfile: (userId: string): CommunityProfileItem => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.COMMUNITY_PROFILE);
      const map: Record<string, CommunityProfileItem> = all ? JSON.parse(all) : {};
      if (map[userId]) return map[userId];

      const defaultProfile: CommunityProfileItem = {
        userId,
        displayName: 'Alex Morgan',
        course: 'B.S. Computer Science',
        branch: 'Computer Science',
        semester: '7th Semester',
        skills: ['Python', 'TypeScript', 'React', 'Machine Learning', 'Algorithms'],
        bio: 'Passionate student developer, AI enthusiast, and ACM member building scalable tools.',
        visibility: 'University Only',
      };
      map[userId] = defaultProfile;
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_PROFILE, JSON.stringify(map));
      return defaultProfile;
    } catch {
      return {
        userId,
        displayName: 'Student',
        course: 'Computer Science',
        branch: 'CS',
        semester: '7th Semester',
        skills: ['Programming', 'Web'],
        bio: 'University student.',
        visibility: 'University Only',
      };
    }
  },

  saveCommunityProfile: (profile: CommunityProfileItem) => {
    try {
      const all = localStorage.getItem(STORAGE_KEYS.COMMUNITY_PROFILE);
      const map: Record<string, CommunityProfileItem> = all ? JSON.parse(all) : {};
      map[profile.userId] = profile;
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_PROFILE, JSON.stringify(map));
    } catch (e) {
      console.error(e);
    }
  }
};
