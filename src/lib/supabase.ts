import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these later with supabase gen types typescript)
export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string
          user_id: string
          xp: number
          streak: number
          daily_goal: number
          last_seen: string
          world: number
          skill: number
          lesson: number
          stars: Record<string, number>
          unlocked: Record<string, boolean>
          intro_done: Record<string, boolean>
          settings: {
            reduced_motion: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          xp?: number
          streak?: number
          daily_goal?: number
          last_seen?: string
          world?: number
          skill?: number
          lesson?: number
          stars?: Record<string, number>
          unlocked?: Record<string, boolean>
          intro_done?: Record<string, boolean>
          settings?: {
            reduced_motion: boolean
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          xp?: number
          streak?: number
          daily_goal?: number
          last_seen?: string
          world?: number
          skill?: number
          lesson?: number
          stars?: Record<string, number>
          unlocked?: Record<string, boolean>
          intro_done?: Record<string, boolean>
          settings?: {
            reduced_motion: boolean
          }
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}