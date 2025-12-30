import { supabase } from "./supabase";

// Check if we're in demo mode (no valid Supabase config)
const isDemoMode = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return !url || !key || url.includes("placeholder");
};

export async function signUp(
  email: string,
  password: string,
  userData: {
    name: string;
    purpose: string;
  },
) {
  try {
    // In demo mode, simulate successful signup
    if (isDemoMode()) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return mock successful response
      return {
        user: {
          id: "demo-user-" + Date.now(),
          email,
          user_metadata: {
            name: userData.name,
            purpose: userData.purpose,
          },
        },
        session: null, // No session in demo mode
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          purpose: userData.purpose,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    // If it's a network error in demo mode, handle gracefully
    if (
      isDemoMode() &&
      (error.message?.includes("Failed to fetch") ||
        error.message?.includes("fetch"))
    ) {
      throw new Error(
        "Demo modda kayıt işlemi simüle edildi. Gerçek hesap oluşturmak için Supabase yapılandırması gerekli.",
      );
    }

    // If Supabase is not configured, show a helpful message
    if (error.message?.includes("Supabase not configured")) {
      throw new Error(
        "Supabase henüz yapılandırılmamış. .env dosyasında VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerini ayarlayın.",
      );
    }
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    // In demo mode, simulate successful login
    if (isDemoMode()) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return mock successful response
      return {
        user: {
          id: "demo-user-login",
          email,
          user_metadata: {
            name: "Demo Kullanıcı",
            purpose: "arkadaşlık",
          },
        },
        session: {
          access_token: "demo-token",
          token_type: "bearer",
        },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    // If it's a network error in demo mode, handle gracefully
    if (
      isDemoMode() &&
      (error.message?.includes("Failed to fetch") ||
        error.message?.includes("fetch"))
    ) {
      throw new Error(
        "Demo modda giriş işlemi simüle edildi. Gerçek hesap girişi için Supabase yapılandırması gerekli.",
      );
    }

    // If Supabase is not configured, show a helpful message
    if (error.message?.includes("Supabase not configured")) {
      throw new Error(
        "Supabase henüz yapılandırılmamış. .env dosyasında VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY değerlerini ayarlayın.",
      );
    }
    throw error;
  }
}

export async function signOut() {
  if (isDemoMode()) {
    // In demo mode, just simulate sign out
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentUser() {
  if (isDemoMode()) {
    // In demo mode, return null (no current user)
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

export async function signInWithGoogle() {
  try {
    if (isDemoMode()) {
      throw new Error(
        "Google giriş demo modda mevcut değil. 'Demo Dene' butonunu kullanarak uygulamayı keşfedin.",
      );
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    // If it's a network error in demo mode, handle gracefully
    if (
      isDemoMode() &&
      (error.message?.includes("Failed to fetch") ||
        error.message?.includes("fetch"))
    ) {
      throw new Error(
        "Google giriş demo modda mevcut değil. 'Demo Dene' butonunu kullanarak uygulamayı keşfedin.",
      );
    }

    // If Supabase is not configured, show a helpful message
    if (error.message?.includes("Supabase not configured")) {
      throw new Error(
        "Supabase henüz yapılandırılmamış. Google giriş için önce Supabase ayarlarını yapın.",
      );
    }
    throw error;
  }
}
