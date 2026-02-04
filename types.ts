
export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

export type PricingType = 'FREE' | 'PAID' | 'TRIAL';

export type NotificationCategory = 'class' | 'test' | 'study' | 'announcement';

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  deepLink?: string;
}

export interface NotificationPreference {
  category: NotificationCategory;
  enabled: boolean;
  label: string;
}

export interface SyllabusTag {
  syllabusName: 'NEET PG' | 'NEXT' | 'FMGE' | 'INI-CET';
  code: string; // e.g., "AN1.1"
  weightage: 'High' | 'Medium' | 'Low';
}

export interface Annotation {
  id: string;
  type: 'highlight' | 'text' | 'drawing';
  content?: string;
  position: { x: number; y: number; page: number };
  color: string;
}

export interface VideoNote {
  id: string;
  timestamp: number; // in seconds
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  targetExam: string;
  attemptYear: number;
  streak: number;
}

export interface LearningContent {
  id: string;
  title: string;
  type: 'video' | 'note' | 'quiz';
  duration?: string;
  isCompleted: boolean;
  contentUrl?: string;
  syllabusTags?: SyllabusTag[];
  resumePosition?: number; // seconds
  expiryDate?: string; // ISO string
  notes?: VideoNote[];
  summary?: string;
  isDownloaded?: boolean;
  annotations?: Annotation[];
}

export interface Subtopic {
  id: string;
  title: string;
  contents: LearningContent[];
  syllabusTags?: SyllabusTag[];
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  subtopics: Subtopic[];
  syllabusTags?: SyllabusTag[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  pricing: PricingType;
  progress: number;
  topics: Topic[];
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  clinicalClue?: string;
  mnemonic?: string;
  conceptHint?: string;
  eliminationHint?: string;
  subject?: string;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  timeSpent: number; // seconds
  score: number;
  accuracy: number;
  subjectBreakdown: { [key: string]: { correct: number, total: number } };
}

export interface PerformanceStats {
  rank: number;
  percentile: number;
  totalTests: number;
  avgAccuracy: number;
  subjectWise: { subject: string; accuracy: number; total: number }[];
  confidenceRatio: { name: string; value: number; color: string }[];
  strengths: string[];
  weaknesses: string[];
}

export interface StudyPlanItem {
  id: string;
  title: string;
  type: 'video' | 'note' | 'quiz' | 'practice';
  subject: string;
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface DailyStudyPlan {
  summary: string;
  tasks: StudyPlanItem[];
  focusArea: string;
}

export interface StudyLog {
  id: string;
  date: string; // ISO
  duration: number; // minutes
  type: 'video' | 'practice' | 'test' | 'notes';
  topic: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'class' | 'test' | 'revision';
  time: string;
}

export interface DiscussionThread {
  id: string;
  author: string;
  authorAvatar: string;
  subject: string;
  topic: string;
  title: string;
  content: string;
  timestamp: number;
  upvotes: number;
  commentsCount: number;
  isVerified: boolean;
  aiSuggested?: string[];
}

export interface Comment {
  id: string;
  author: string;
  authorRole: UserRole;
  authorAvatar: string;
  text: string;
  timestamp: number;
  isVerified: boolean;
  upvotes: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  type?: 'general' | 'mnemonic' | 'explanation' | 'clinical_clue';
  isExpanded?: boolean;
}
