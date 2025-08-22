import { useState, useEffect, useCallback } from 'react';
import { UserProgress, LessonData } from '@/types/progress';
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
} from '@/services/progressService';

// Custom hook for managing user progress
export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress on hook initialization
  useEffect(() => {
    const userProgress = loadProgress();
    setProgress(userProgress);
    setIsLoading(false);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (progress && !isLoading) {
      saveProgress(progress);
    }
  }, [progress, isLoading]);

  // Complete a lesson and update progress
  const completeLessonProgress = useCallback((lesson: LessonData, accuracy: number) => {
    if (!progress) return;

    const updatedProgress = completeLesson(progress, lesson, accuracy);
    setProgress(updatedProgress);
    
    return updatedProgress;
  }, [progress]);

  // Reset all progress
  const resetUserProgress = useCallback(() => {
    const freshProgress = resetProgress();
    setProgress(freshProgress);
    return freshProgress;
  }, []);

  // Check if user has any progress
  const hasProgress = progress ? (progress.xp > 0 || Object.keys(progress.stars).length > 0) : false;

  // Get current progress stats
  const getProgressStats = useCallback(() => {
    if (!progress || !hasProgress) return null;
    
    const totalStars = Object.values(progress.stars).reduce((sum, stars) => sum + stars, 0);
    
    return {
      xp: progress.xp,
      streak: progress.streak,
      stars: totalStars,
      currentSkill: `Mundo ${progress.world} - Habilidade ${progress.skill}`,
      lastSeen: progress.last_seen
    };
  }, [progress, hasProgress]);

  // Get next lesson to take
  const getNextLessonId = useCallback(() => {
    if (!progress) return null;
    
    const nextLesson = getNextLesson(progress);
    return `${nextLesson.world}-${nextLesson.skill}-${nextLesson.lesson}`;
  }, [progress]);

  // Check if should show review
  const shouldShowReviewPrompt = useCallback(() => {
    return progress ? shouldShowReview(progress) : false;
  }, [progress]);

  // Check if a specific skill is unlocked
  const isSkillUnlockedForUser = useCallback((world: number, skill: number) => {
    return progress ? isSkillUnlocked(progress, world, skill) : false;
  }, [progress]);

  // Get stars for a specific skill
  const getSkillStarsForUser = useCallback((world: number, skill: number) => {
    return progress ? getSkillStars(progress, world, skill) : 0;
  }, [progress]);

  // Mark intro as completed for a lesson
  const markLessonIntroCompleted = useCallback((lessonId: string) => {
    if (!progress) return;
    
    const updatedProgress = markIntroCompleted(progress, lessonId);
    setProgress(updatedProgress);
    return updatedProgress;
  }, [progress]);

  // Check if intro is completed for a lesson
  const isLessonIntroCompleted = useCallback((lessonId: string) => {
    return progress ? isIntroCompleted(progress, lessonId) : false;
  }, [progress]);

  return {
    // State
    progress,
    isLoading,
    hasProgress,
    
    // Actions
    completeLessonProgress,
    resetUserProgress,
    markLessonIntroCompleted,
    
    // Computed values
    getProgressStats,
    getNextLessonId,
    shouldShowReviewPrompt,
    isSkillUnlockedForUser,
    getSkillStarsForUser,
    isLessonIntroCompleted,
  };
};