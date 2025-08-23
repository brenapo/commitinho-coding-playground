import { UserProgress, ProgressEvent, LessonData } from '@/types/progress';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

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
  intro_done: {},
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

// Load progress from Supabase or localStorage fallback
export const loadProgress = async (user?: User | null): Promise<UserProgress> => {
  try {
    // If user is logged in, try to load from Supabase
    if (user) {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        console.log('✅ Loaded progress from Supabase');
        return {
          version: CURRENT_VERSION,
          xp: data.xp,
          streak: data.streak,
          daily_goal: data.daily_goal,
          last_seen: data.last_seen,
          world: data.world,
          skill: data.skill,
          lesson: data.lesson,
          unlocked: data.unlocked as Record<string, boolean>,
          stars: data.stars as Record<string, number>,
          intro_done: data.intro_done as Record<string, boolean>,
          settings: data.settings as { reduced_motion: boolean }
        };
      }
      
      console.log('📝 No progress found in Supabase, creating initial progress');
    }

    // Fallback to localStorage or create initial progress
    const stored = localStorage.getItem('commitinho_progress');
    if (!stored) {
      const initial = getInitialProgress();
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
      parsed.version = CURRENT_VERSION;
    }

    // Ensure intro_done field exists
    if (!parsed.intro_done) {
      parsed.intro_done = {};
    }

    // Update settings based on current user preferences
    parsed.settings.reduced_motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return parsed;
  } catch (error) {
    console.error('❌ Failed to load progress:', error);
    return getInitialProgress();
  }
};

// Save progress to Supabase and localStorage
export const saveProgress = async (progress: UserProgress, user?: User | null): Promise<void> => {
  try {
    progress.last_seen = new Date().toISOString();
    
    // Save to Supabase if user is logged in
    if (user) {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          xp: progress.xp,
          streak: progress.streak,
          daily_goal: progress.daily_goal,
          last_seen: progress.last_seen,
          world: progress.world,
          skill: progress.skill,
          lesson: progress.lesson,
          stars: progress.stars,
          unlocked: progress.unlocked,
          intro_done: progress.intro_done,
          settings: progress.settings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('❌ Failed to save progress to Supabase:', error);
        // Fall back to localStorage
        localStorage.setItem('commitinho_progress', JSON.stringify(progress));
      } else {
        console.log('✅ Progress saved to Supabase');
      }
    } else {
      // Save to localStorage for anonymous users
      localStorage.setItem('commitinho_progress', JSON.stringify(progress));
    }
  } catch (error) {
    console.error('❌ Failed to save progress:', error);
    // Always try to save to localStorage as fallback
    localStorage.setItem('commitinho_progress', JSON.stringify(progress));
  }
};

// Reset all progress
export const resetProgress = async (user?: User | null): Promise<UserProgress> => {
  try {
    const fresh = getInitialProgress();
    
    if (user) {
      // Delete from Supabase
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);
      
      if (error) {
        console.error('❌ Failed to reset progress in Supabase:', error);
      }
    }
    
    // Always clear localStorage
    localStorage.removeItem('commitinho_progress');
    
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

// Mark lesson intro as completed
export const markIntroCompleted = (progress: UserProgress, lessonId: string): UserProgress => {
  const currentIntroData = progress.intro_done || {};
  
  const updated = {
    ...progress,
    intro_done: {
      ...currentIntroData,
      [lessonId]: true
    },
    last_seen: new Date().toISOString()
  };

  return updated;
};

// Check if lesson intro is completed
export const isIntroCompleted = (progress: UserProgress, lessonId: string): boolean => {
  return progress.intro_done?.[lessonId] === true;
};

// Check if user should be prompted for review
export const shouldShowReview = (progress: UserProgress): boolean => {
  const lastSeen = new Date(progress.last_seen);
  const now = new Date();
  const hoursDiff = (now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff > 12 && Object.keys(progress.stars).length > 0;
};

// Update daily streak
export const updateStreak = (progress: UserProgress): UserProgress => {
  const lastSeen = new Date(progress.last_seen);
  const today = new Date();
  
  lastSeen.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    progress.streak += 1;
  } else if (daysDiff > 1) {
    progress.streak = 1;
  }
  
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
  let stars = 1;
  if (accuracy >= 85) stars = 3;
  else if (accuracy >= 70) stars = 2;
  
  // Award XP and stars
  updated = awardXP(updated, lesson.xp_reward, lesson.id);
  updated = awardStars(updated, lesson.id, stars);
  updated = updateStreak(updated);
  
  // Check if we should unlock next skill/lesson
  const nextSkillKey = `${lesson.world}-${lesson.skill + 1}`;
  const currentSkillLessons = 3;
  
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
  for (let lesson = 1; lesson <= 3; lesson++) {
    const lessonId = `${world}-${skill}-${lesson}`;
    total += progress.stars[lessonId] || 0;
  }
  return total;
};