import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  purpose: string;
  isPremium: boolean;
  rating: number;
  type: "user" | "business";
  age?: number;
  school?: string;
  city?: string;
  profession?: string;
  bio?: string;
  photo_url?: string;
  plan?: string;
}

interface DemoUserContextType {
  user: DemoUser | null;
  setUser: (user: DemoUser | null) => void;
  loginAsDemo: () => void;
  logout: () => void;
  isDemo: boolean;
}

const demoUserData: DemoUser = {
  id: "demo-user-id",
  name: "Demo Kullanıcı",
  email: "demo@example.com",
  purpose: "arkadaşlık",
  isPremium: false,
  rating: 4.5,
  type: "user",
  age: 25,
  school: "İstanbul Teknik Üniversitesi",
  city: "İstanbul",
  profession: "Yazılım Geliştirici",
  bio: "Teknoloji ve sosyal etkinliklere ilgi duyan, yeni insanlarla tanışmayı seven biriyim.",
  plan: "free",
};

const DemoUserContext = createContext<DemoUserContextType | undefined>(
  undefined,
);

export function DemoUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  // Check if demo mode is active on mount
  useEffect(() => {
    const isDemoMode = localStorage.getItem("demo-mode") === "true";
    if (isDemoMode) {
      setUser(demoUserData);
    }
  }, []);

  const loginAsDemo = () => {
    setUser(demoUserData);
    localStorage.setItem("demo-mode", "true");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("demo-mode");
  };

  const isDemo = user?.id === "demo-user-id";

  return (
    <DemoUserContext.Provider
      value={{
        user,
        setUser,
        loginAsDemo,
        logout,
        isDemo,
      }}
    >
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (context === undefined) {
    throw new Error("useDemoUser must be used within a DemoUserProvider");
  }
  return context;
}
