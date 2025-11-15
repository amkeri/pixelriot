export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      connected_platforms: {
        Row: {
          id: string
          user_id: string
          platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'facebook'
          platform_user_id: string | null
          platform_username: string | null
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          is_active: boolean
          connected_at: string
          last_synced_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'facebook'
          platform_user_id?: string | null
          platform_username?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          is_active?: boolean
          connected_at?: string
          last_synced_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'facebook'
          platform_user_id?: string | null
          platform_username?: string | null
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          is_active?: boolean
          connected_at?: string
          last_synced_at?: string | null
          created_at?: string
        }
      }
      analytics_snapshots: {
        Row: {
          id: string
          connection_id: string
          snapshot_date: string
          viewers: number
          average_watch_time: number
          likes: number
          comments: number
          shares: number
          followers: number
          engagement_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          connection_id: string
          snapshot_date: string
          viewers?: number
          average_watch_time?: number
          likes?: number
          comments?: number
          shares?: number
          followers?: number
          engagement_rate?: number
          created_at?: string
        }
        Update: {
          id?: string
          connection_id?: string
          snapshot_date?: string
          viewers?: number
          average_watch_time?: number
          likes?: number
          comments?: number
          shares?: number
          followers?: number
          engagement_rate?: number
          created_at?: string
        }
      }
      hourly_analytics: {
        Row: {
          id: string
          connection_id: string
          date: string
          hour: number
          viewers: number
          engagement_count: number
          created_at: string
        }
        Insert: {
          id?: string
          connection_id: string
          date: string
          hour: number
          viewers?: number
          engagement_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          connection_id?: string
          date?: string
          hour?: number
          viewers?: number
          engagement_count?: number
          created_at?: string
        }
      }
      content_posts: {
        Row: {
          id: string
          connection_id: string
          platform_post_id: string
          title: string | null
          description: string | null
          thumbnail_url: string | null
          post_url: string | null
          published_at: string | null
          views: number
          likes: number
          comments: number
          shares: number
          watch_time_seconds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          connection_id: string
          platform_post_id: string
          title?: string | null
          description?: string | null
          thumbnail_url?: string | null
          post_url?: string | null
          published_at?: string | null
          views?: number
          likes?: number
          comments?: number
          shares?: number
          watch_time_seconds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          connection_id?: string
          platform_post_id?: string
          title?: string | null
          description?: string | null
          thumbnail_url?: string | null
          post_url?: string | null
          published_at?: string | null
          views?: number
          likes?: number
          comments?: number
          shares?: number
          watch_time_seconds?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
