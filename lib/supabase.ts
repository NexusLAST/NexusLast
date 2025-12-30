import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Development fallback - replace with your actual Supabase credentials
const FALLBACK_URL = "https://placeholder.supabase.co";
const FALLBACK_KEY = "placeholder-anon-key";

// Use fallback values if environment variables are not set
const finalUrl = supabaseUrl || FALLBACK_URL;
const finalKey = supabaseAnonKey || FALLBACK_KEY;

// Create Supabase client with validation
let supabase: any;

try {
  supabase = createClient(finalUrl, finalKey);

  // Log warning if using fallback values
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "⚠️ Supabase environment variables not found. Using fallback values for development.",
    );
    console.warn(
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file",
    );
  }
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // Create a mock client for development
  supabase = {
    auth: {
      signUp: () => Promise.reject(new Error("Supabase not configured")),
      signInWithPassword: () =>
        Promise.reject(new Error("Supabase not configured")),
      signInWithOAuth: () =>
        Promise.reject(new Error("Supabase not configured")),
      signOut: () => Promise.reject(new Error("Supabase not configured")),
      getUser: () => Promise.reject(new Error("Supabase not configured")),
    },
  };
}

export { supabase };

// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  photo_url?: string;
  purpose: string;
  isPremium: boolean;
  rating: number;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  created_by: string;
  max_participants?: number;
  category: string;
  is_premium?: boolean;
  created_at: string;
}

export interface Request {
  id: string;
  event_id: string;
  user_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface Rating {
  id: string;
  from_user: string;
  to_user: string;
  event_id: string;
  score: number;
  comment?: string;
  created_at: string;
}

export interface Message {
  id: string;
  event_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}
