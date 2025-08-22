import { UserProgress, ProgressEvent, LessonData } from '@/types/progress';

const STORAGE_KEY = 'commitinho_progress';
const CURRENT_VERSION = 1;

// Initial progress state for new users
const getInitialProgress = (): UserProgress => ({
  version: CURRENT_VERSION,
  xp: 0,
  streak: 0,
  daily_goal: 10,
  last_seen: new Date().toISOString(),
  world: 1,
  skill: 1,
  lesson: 1,
  unlocked: { '1-1': true },
  stars: {},
  settings: {
    reduced_motion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
});

// Event tracking for analytics
const dispatchProgressEvent = (event: ProgressEvent): void => {
  console.log('🎮 Commitinho Progress Event:', event);
  
  // Dispatch custom event for potential integrations
  window.dispatchEvent(new CustomEvent('commitinho:progress', {
    detail: event
  }));
};

// Load progress from localStorage
export const loadProgress = (): UserProgress => {
  try {
    console.log('🎮 Loading progress from localStorage...');
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('🎮 Stored data:', stored);
    
    if (!stored) {
      console.log('🎮 No stored progress, creating initial progress...');
      const initial = getInitialProgress();
      console.log('🎮 Initial progress:', initial);
      dispatchProgressEvent({
        type: 'start',
        timestamp: new Date().toISOString(),
        data: {}
      });
      return initial;
    }

    const parsed = JSON.parse(stored) as UserProgress;
    
    // Handle version migrations if needed
    if (parsed.version !== CURRENT_VERSION) {
      console.log('🔄 Migrating progress data to new version');
      // Future version migrations would go here
      parsed.version = CURRENT_VERSION;
    }

    // Update settings based on current user preferences
    parsed.settings.reduced_motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return parsed;
  } catch (error) {
    console.error('❌ Failed to load progress from localStorage:', error);
    return getInitialProgress();
  }
};

// Save progress to localStorage
export const saveProgress = (progress: UserProgress): void => {
  try {
    progress.last_seen = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('❌ Failed to save progress to localStorage:', error);
  }
};

// Reset all progress (clear localStorage)
export const resetProgress = (): UserProgress => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = getInitialProgress();
    dispatchProgressEvent({
      type: 'start',
      timestamp: new Date().toISOString(),
      data: {}
    });
    return fresh;
  } catch (error) {
    console.error('❌ Failed to reset progress:', error);
    return getInitialProgress();
  }
};

// Check if user should be prompted for review
export const shouldShowReview = (progress: UserProgress): boolean => {
  const lastSeen = new Date(progress.last_seen);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60);
  
  // If it's been more than 12 hours and user has completed at least one lesson
  return hoursDiff > 12 && Object.keys(progress.stars).length > 0;
};

// Update daily streak
export const updateStreak = (progress: UserProgress): UserProgress => {
  const lastSeen = new Date(progress.last_seen);
  const today = new Date();
  
  // Reset time to compare only dates
  lastSeen.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day - increment streak
    progress.streak += 1;
  } else if (daysDiff > 1) {
    // Missed days - reset streak
    progress.streak = 1;
  }
  // Same day - keep current streak
  
  return progress;
};

// Award XP and update progress
export const awardXP = (progress: UserProgress, amount: number, lessonId?: string): UserProgress => {
  const updated = { ...progress };
  updated.xp += amount;
  
  dispatchProgressEvent({
    type: 'award_xp',
    timestamp: new Date().toISOString(),
    data: {
      lesson_id: lessonId,
      xp: amount
    }
  });
  
  return updated;
};

// Award stars for lesson completion
export const awardStars = (
  progress: UserProgress, 
  lessonId: string, 
  stars: number
): UserProgress => {
  const updated = { ...progress };
  updated.stars[lessonId] = Math.max(updated.stars[lessonId] || 0, stars);
  
  dispatchProgressEvent({
    type: 'award_stars',
    timestamp: new Date().toISOString(),
    data: {
      lesson_id: lessonId,
      stars
    }
  });
  
  return updated;
};

// Complete a lesson and handle progression
export const completeLesson = (
  progress: UserProgress,
  lesson: LessonData,
  accuracy: number
): UserProgress => {
  let updated = { ...progress };
  
  // Calculate stars based on accuracy
  let stars = 1; // Always at least 1 star for completion
  if (accuracy >= 85) stars = 3;
  else if (accuracy >= 70) stars = 2;
  
  // Award XP and stars
  updated = awardXP(updated, lesson.xp_reward, lesson.id);
  updated = awardStars(updated, lesson.id, stars);
  updated = updateStreak(updated);
  
  // Check if we should unlock next skill/lesson
  const nextSkillKey = `${lesson.world}-${lesson.skill + 1}`;
  const currentSkillLessons = 3; // Assuming 3 lessons per skill for now
  
  // If this was the last lesson in the skill, unlock next skill
  if (lesson.lesson === currentSkillLessons && !updated.unlocked[nextSkillKey]) {
    updated.unlocked[nextSkillKey] = true;
    
    dispatchProgressEvent({
      type: 'unlock_skill',
      timestamp: new Date().toISOString(),
      data: {
        skill_unlocked: nextSkillKey
      }
    });
  }
  
  // Update current position to next lesson
  if (lesson.lesson < currentSkillLessons) {
    updated.lesson = lesson.lesson + 1;
  } else if (updated.unlocked[nextSkillKey]) {
    updated.skill = lesson.skill + 1;
    updated.lesson = 1;
  }
  
  dispatchProgressEvent({
    type: 'complete',
    timestamp: new Date().toISOString(),
    data: {
      lesson_id: lesson.id,
      xp: lesson.xp_reward,
      stars
    }
  });
  
  return updated;
};

// Get next lesson the user should take
export const getNextLesson = (progress: UserProgress): { world: number; skill: number; lesson: number } => {
  return {
    world: progress.world,
    skill: progress.skill,
    lesson: progress.lesson
  };
};

// Check if a skill is unlocked
export const isSkillUnlocked = (progress: UserProgress, world: number, skill: number): boolean => {
  return progress.unlocked[`${world}-${skill}`] === true;
};

// Get total stars for a skill
export const getSkillStars = (progress: UserProgress, world: number, skill: number): number => {
  let total = 0;
  for (let lesson = 1; lesson <= 3; lesson++) { // Assuming 3 lessons per skill
    const lessonId = `${world}-${skill}-${lesson}`;
    total += progress.stars[lessonId] || 0;
  }
  return total;
};