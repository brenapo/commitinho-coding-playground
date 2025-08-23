import { UserProgress } from '@/types/progress';
import { saveProgress } from '@/services/supabaseProgressService';
import { User } from '@supabase/supabase-js';

// Migrate existing localStorage data to Supabase when user signs in
export const migrateLocalStorageToSupabase = async (user: User): Promise<void> => {
  try {
    const stored = localStorage.getItem('commitinho_progress');
    if (!stored) {
      console.log('📭 No localStorage data to migrate');
      return;
    }

    const localProgress = JSON.parse(stored) as UserProgress;
    console.log('📦 Found localStorage progress, migrating to Supabase...');
    console.log('📊 Progress to migrate:', {
      xp: localProgress.xp,
      stars: Object.keys(localProgress.stars).length,
      lessons: Object.keys(localProgress.stars)
    });

    // Save the local progress to Supabase
    await saveProgress(localProgress, user);
    
    // Keep localStorage as backup for now (don't delete immediately)
    console.log('✅ Successfully migrated progress to Supabase');
    
    // Optional: Clear localStorage after successful migration
    // localStorage.removeItem('commitinho_progress');
    
  } catch (error) {
    console.error('❌ Failed to migrate localStorage to Supabase:', error);
  }
};