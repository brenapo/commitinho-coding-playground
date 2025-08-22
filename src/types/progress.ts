// Types for the Commitinho progress system

export interface UserProgress {
  version: number;
  xp: number;
  streak: number;
  daily_goal: number;
  last_seen: string; // ISO8601 format
  world: number;
  skill: number;
  lesson: number;
  unlocked: Record<string, boolean>; // "world-skill" format
  stars: Record<string, number>; // "world-skill-lesson" format, 0-3 stars
  settings: {
    reduced_motion: boolean;
  };
}

export interface LessonData {
  id: string;
  world: number;
  skill: number;
  lesson: number;
  title: string;
  description: string;
  concept: string;
  xp_reward: number;
  required_accuracy: number; // 0-100, minimum to get stars
}

export interface ProgressEvent {
  type: 'start' | 'complete' | 'award_xp' | 'award_stars' | 'unlock_skill';
  timestamp: string;
  data: {
    lesson_id?: string;
    xp?: number;
    stars?: number;
    skill_unlocked?: string;
  };
}

export interface SkillNode {
  id: string;
  world: number;
  skill: number;
  title: string;
  concept: string;
  lessons: LessonData[];
  unlocked: boolean;
  completed: boolean;
  totalStars: number;
  maxStars: number;
}

export interface WorldData {
  id: number;
  title: string;
  description: string;
  skills: SkillNode[];
  unlocked: boolean;
}