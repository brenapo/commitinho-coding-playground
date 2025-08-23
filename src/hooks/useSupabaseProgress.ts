import { useState, useEffect, useCallback } from 'react';
import { UserProgress, LessonData } from '@/types/progress';
import { useAuth } from '@/hooks/useAuth';
import { 
  loadProgress, 
  saveProgress, 
  completeLesson, 
  resetProgress, 
  shouldShowReview,
  getNextLesson,
  isSkillUnlocked,
  getSkillStars,
  markIntroCompleted,
  isIntroCompleted
} from '@/services/supabaseProgressService';

// Custom hook for managing user progress with Supabase
export const useSupabaseProgress = () => {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on hook initialization or when user changes
  useEffect(() => {
    if (authLoading) return;
    
    const loadUserProgress = async () => {
      try {
        const userProgress = await loadProgress(user);
        setProgress(userProgress);
      } catch (error) {
        console.error('Failed to load progress:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProgress();
  }, [user, authLoading]);

  // Save progress whenever it changes
  useEffect(() => {
    if (progress && !isLoading && !authLoading) {
      saveProgress(progress, user);
    }
  }, [progress, isLoading, user, authLoading]);

  // Complete a lesson and update progress
  const completeLessonProgress = useCallback((lesson: LessonData, accuracy: number) => {
    if (!progress) return;

    const updatedProgress = completeLesson(progress, lesson, accuracy);
    setProgress(updatedProgress);
  }, [progress]);

  // Reset all progress
  const resetUserProgress = useCallback(async () => {
    const freshProgress = await resetProgress(user);
    setProgress(freshProgress);
  }, [user]);

  // Mark lesson intro as completed
  const markLessonIntroCompleted = useCallback((lessonId: string) => {
    if (!progress) return;

    const updatedProgress = markIntroCompleted(progress, lessonId);
    setProgress(updatedProgress);
  }, [progress]);

  // Check if lesson intro is completed
  const isLessonIntroCompleted = useCallback((lessonId: string): boolean => {
    if (!progress) return false;
    return isIntroCompleted(progress, lessonId);
  }, [progress]);

  // Get progress statistics for display
  const getProgressStats = useCallback(() => {
    if (!progress) return null;

    const next = getNextLesson(progress);
    return {
      xp: progress.xp,
      streak: progress.streak,
      stars: Object.values(progress.stars).reduce((sum, stars) => sum + stars, 0),
      currentSkill: `${next.world}-${next.skill}-${next.lesson}`,
      unlockedSkills: Object.keys(progress.unlocked).length,
      completedLessons: Object.keys(progress.stars).length
    };
  }, [progress]);

  // Get next lesson ID for navigation
  const getNextLessonId = useCallback((): string | null => {
    if (!progress) return null;

    const next = getNextLesson(progress);
    return `${next.world}-${next.skill}-${next.lesson}`;
  }, [progress]);

  // Check if should show review prompt
  const shouldShowReviewPrompt = useCallback((): boolean => {
    if (!progress) return false;
    return shouldShowReview(progress);
  }, [progress]);

  return {
    // State
    progress,
    isLoading: isLoading || authLoading,
    hasProgress: progress !== null && (progress.xp > 0 || Object.keys(progress.stars).length > 0),
    
    // Auth state
    user,
    isAuthenticated: !!user,
    
    // Actions
    completeLessonProgress,
    resetUserProgress,
    markLessonIntroCompleted,
    
    // Computed values
    getProgressStats,
    getNextLessonId,
    shouldShowReviewPrompt,
    isLessonIntroCompleted,
    
    // Utility functions (pass through from service)
    isSkillUnlocked: (world: number, skill: number) => 
      progress ? isSkillUnlocked(progress, world, skill) : false,
    getSkillStars: (world: number, skill: number) => 
      progress ? getSkillStars(progress, world, skill) : 0,
    
    // Alias functions for backward compatibility
    isSkillUnlockedForUser: (world: number, skill: number) => 
      progress ? isSkillUnlocked(progress, world, skill) : false,
    getSkillStarsForUser: (world: number, skill: number) => 
      progress ? getSkillStars(progress, world, skill) : 0,
  };
};