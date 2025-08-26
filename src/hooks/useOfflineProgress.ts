import { useState, useEffect } from 'react';
import { useSecureStorage } from './useSecureStorage';
import { useSupabaseProgress } from './useSupabaseProgress';

interface OfflineProgressEntry {
  lessonId: string;
  stars: number;
  xp: number;
  timestamp: number;
  synced: boolean;
}

interface ProgressState {
  totalXP: number;
  streak: number;
  lastActivity: number;
  entries: OfflineProgressEntry[];
}

export const useOfflineProgress = () => {
  const { getValue, setValue } = useSecureStorage();
  const { progress: supabaseProgress, completeLessonProgress } = useSupabaseProgress();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineProgress, setOfflineProgress] = useState<ProgressState>({
    totalXP: 0,
    streak: 0,
    lastActivity: 0,
    entries: []
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline progress on mount
  useEffect(() => {
    loadOfflineProgress();
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (isOnline && offlineProgress.entries.some(e => !e.synced)) {
      syncOfflineProgress();
    }
  }, [isOnline, offlineProgress]);

  const loadOfflineProgress = async () => {
    try {
      const stored = await getValue('commitinho.offline_progress');
      if (stored) {
        setOfflineProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading offline progress:', error);
    }
  };

  const saveOfflineProgress = async (newProgress: ProgressState) => {
    try {
      await setValue('commitinho.offline_progress', JSON.stringify(newProgress));
      setOfflineProgress(newProgress);
    } catch (error) {
      console.error('Error saving offline progress:', error);
    }
  };

  const recordLessonCompletion = async (lessonId: string, stars: number, xp: number) => {
    const now = Date.now();
    
    // Create new entry
    const newEntry: OfflineProgressEntry = {
      lessonId,
      stars,
      xp,
      timestamp: now,
      synced: false
    };

    // Calculate streak
    const lastActivity = offlineProgress.lastActivity || now;
    const daysSinceLastActivity = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
    let newStreak = offlineProgress.streak;
    
    if (daysSinceLastActivity === 1) {
      newStreak += 1; // Continue streak
    } else if (daysSinceLastActivity === 0) {
      // Same day, keep streak
    } else {
      newStreak = 1; // Reset streak
    }

    const updatedProgress: ProgressState = {
      totalXP: offlineProgress.totalXP + xp,
      streak: newStreak,
      lastActivity: now,
      entries: [...offlineProgress.entries, newEntry]
    };

    await saveOfflineProgress(updatedProgress);

    // Try to sync immediately if online
    if (isOnline) {
      await syncSingleEntry(newEntry);
    }
  };

  const syncSingleEntry = async (entry: OfflineProgressEntry) => {
    try {
      // Create fake lesson data for Supabase sync
      const fakeLesson = {
        id: entry.lessonId,
        title: `Lição ${entry.lessonId}`,
        concept: 'sync'
      };

      await completeLessonProgress(fakeLesson, entry.stars * 33.33); // Convert stars to percentage

      // Mark as synced
      const updatedProgress = {
        ...offlineProgress,
        entries: offlineProgress.entries.map(e => 
          e.timestamp === entry.timestamp ? { ...e, synced: true } : e
        )
      };

      await saveOfflineProgress(updatedProgress);
    } catch (error) {
      console.error('Error syncing entry:', error);
    }
  };

  const syncOfflineProgress = async () => {
    if (!isOnline) return;

    try {
      const unsynced = offlineProgress.entries.filter(e => !e.synced);
      
      for (const entry of unsynced) {
        await syncSingleEntry(entry);
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Synced ${unsynced.length} offline progress entries`);
    } catch (error) {
      console.error('Error syncing offline progress:', error);
    }
  };

  const getProgressSummary = () => {
    // Combine offline and online progress
    const onlineXP = supabaseProgress?.xp || 0;
    const onlineStreak = supabaseProgress?.streak || 0;
    
    // Use whichever is higher (in case of sync issues)
    return {
      xp: Math.max(offlineProgress.totalXP, onlineXP),
      streak: Math.max(offlineProgress.streak, onlineStreak),
      lastActivity: offlineProgress.lastActivity,
      isOnline,
      hasUnsyncedData: offlineProgress.entries.some(e => !e.synced)
    };
  };

  return {
    isOnline,
    recordLessonCompletion,
    syncOfflineProgress,
    getProgressSummary,
    offlineProgress
  };
};