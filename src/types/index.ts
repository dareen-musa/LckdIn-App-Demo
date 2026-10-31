/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OpportunityKind = 'event' | 'student_project';

export type EventType = 'hackathon' | 'career_fair' | 'recruiter_visit' | 'tech_talk';

export type ProjectType =
  | 'Hackathon Partner'
  | 'Startup / Side Hustle'
  | 'Side Project'
  | 'Class Project';

export type InvolvedProjectStatus = 'Owner' | 'Joined' | 'Applied';

export interface InvolvedProject {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  status: InvolvedProjectStatus;
  skills: string[];
  timeline: string;
  university: string;
  ownerName: string;
  ownerSchool?: string;
  cardId?: string;
  createdAt: string;
}

export interface OpportunityCard {
  id: string;
  kind: OpportunityKind;
  category: string;
  title: string;
  subtitle: string;
  organization: string; // Host company, lab, or student club
  leadName?: string;
  leadTitle?: string;
  leadMajor?: string;
  leadGradYear?: string;
  leadBio?: string;
  leadInterests?: string[];
  university: string; // e.g. "NC State University", "Duke University", "UNC Chapel Hill"
  location: string;
  venue?: string; // Campus building/room (e.g. "Engineering Building II", "Hunt Library", "Talley Student Union")
  eventDate?: string;
  eventTime?: string;
  eventType?: EventType;
  remoteType: 'In-Person Campus' | 'Hybrid' | 'Remote';
  commitment: string;
  duration?: string;
  compensation: string;
  summary: string;
  editorialBrief: string[];
  skills: string[];
  matchScore: number;
  whyYouFit?: string; // One-sentence explanation from Gemma AI
  isAiEvaluated?: boolean;
  eligibility: string;
  verified: boolean;
  teamSize?: string;
  rsvpCount?: number;
  capacity?: string;
  founderNote?: string;
  bookmarked?: boolean;
  projectType?: ProjectType;
}

export type ApplicationStatus = 'confirmed' | 'waitlist' | 'checked_in';

export interface EventRSVP {
  id: string;
  cardId: string;
  card: OpportunityCard;
  appliedAt: string;
  status: ApplicationStatus;
  lastUpdated: string;
  ticketCode: string;
  candidateNote?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export interface StudentMatch {
  id: string;
  cardId: string;
  card: OpportunityCard;
  matchedAt: string;
  unreadCount: number;
  messages: ChatMessage[];
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface UserProfile {
  name: string;
  school: string;
  major: string;
  gradYear: string;
  bio: string;
  email: string;
  verified: boolean;
  skills: string[];
  interests: string[];
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeName: string;
  resumeUrl?: string;
  openToEvents: boolean;
  openToProjects: boolean;
  campusOnlyFilter: boolean;
}

export interface PublicStudentProfile {
  id: string;
  name: string;
  school: string;
  major: string;
  gradYear: string;
  bio: string;
  skills: string[];
  interests: string[];
  projects: InvolvedProject[];
  matchScore?: number;
  whyYouFit?: string;
  cardId?: string;
  card?: OpportunityCard;
}

export type ActiveTab = 'swipe' | 'activity' | 'profile';
export type FilterType = 'all' | 'event' | 'student_project';
