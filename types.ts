
export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
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

export interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  thumbnail: string;
  progress: number;
  isPaid: boolean;
  topics: Topic[];
}

export interface Topic {
  id: string;
  title: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  title: string;
  contentUrl?: string;
  type: 'video' | 'note' | 'quiz';
  duration?: string;
  completed: boolean;
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
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
