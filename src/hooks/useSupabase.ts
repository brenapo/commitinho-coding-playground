import { useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'

interface UpdateProfileData {
  display_name?: string
}

export function useSupabase() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const updateUserProfile = async (data: UpdateProfileData) => {
    if (!user) return null

    setLoading(true)
    try {
      // For now, we'll just store in localStorage since we don't have a profiles table set up
      // If you want to store in Supabase, you'd need to create a profiles table first
      if (data.display_name) {
        localStorage.setItem('commitinho.display_name', data.display_name)
      }
      
      // Uncomment this if you have a profiles table:
      // const { data: result, error } = await supabase
      //   .from('profiles')
      //   .upsert({
      //     user_id: user.id,
      //     ...data,
      //     updated_at: new Date().toISOString()
      //   })
      
      // if (error) throw error
      // return result

      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    updateUserProfile,
  }
}