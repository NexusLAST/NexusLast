// Centralized mock data for consistent testing across components

export interface BusinessUser {
  id: string;
  name: string;
  email: string;
  type: "business";
  category: string;
  rating: number;
  isPremium: boolean;
  avatar?: string;
  description: string;
  location: string;
  joinedDate: string;
  totalEvents: number;
  followers: number;
}

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  participants: number;
  maxParticipants?: number;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    isPremium: boolean;
    type: "user" | "business";
  };
  status: "upcoming" | "active" | "completed" | "cancelled";
  isPremiumEvent?: boolean;
  purpose?: string;
  activities?: string[];
  requirements?: string[];
  price?: number;
  completedAt?: string;
  averageRating?: number;
  totalRatings?: number;
  feedback?: Array<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  participants_data?: Array<{
    id: string;
    name: string;
    purpose: string;
    rating: number;
    badges: string[];
    joinedAt: string;
  }>;
}

// Mock business users
export const mockBusinessUsers: BusinessUser[] = [
  {
    id: "business-1",
    name: "TechCamp İstanbul",
    email: "contact@techcamp.istanbul",
    type: "business",
    category: "Teknoloji",
    rating: 4.9,
    isPremium: true,
    description:
      "Teknoloji eğitimleri ve bootcamp organizasyonu yapan lider eğitim kurumu. Modern teknolojiler üzerine hands-on workshop'lar düzenliyoruz.",
    location: "Maslak, İstanbul",
    joinedDate: "2023-06-15",
    totalEvents: 45,
    followers: 1250,
  },
  {
    id: "business-2",
    name: "Startup Hub İstanbul",
    email: "hello@startuphub.istanbul",
    type: "business",
    category: "Girişimcilik",
    rating: 4.7,
    isPremium: true,
    description:
      "Girişimci ekosistemi için networking, mentorship ve pitch etkinlikleri düzenleyen hub. Startup'ların büyümesine odaklanıyoruz.",
    location: "Beyoğlu, İstanbul",
    joinedDate: "2023-08-20",
    totalEvents: 32,
    followers: 890,
  },
  {
    id: "business-3",
    name: "Wellness Center Maçka",
    email: "info@wellnessmacka.com",
    type: "business",
    category: "Sağlık",
    rating: 4.8,
    isPremium: false,
    description:
      "Yoga, meditasyon, mindfulness ve wellness programları düzenleyen merkez. Şehrin stresinden uzaklaşmak isteyenler için.",
    location: "Maçka, İstanbul",
    joinedDate: "2023-09-10",
    totalEvents: 28,
    followers: 425,
  },
];

// Mock events with different statuses and business creators
export const mockEvents: MockEvent[] = [
  // Business events - Upcoming
  {
    id: "biz-event-1",
    title: "Advanced React Patterns Bootcamp",
    description:
      "3 günlük intensive React bootcamp. Modern patterns, hooks, performance optimization ve real-world projeler.",
    date: "2024-02-25T09:00:00", // 3 days from now (upcoming)
    location: "TechCamp Maslak Kampüsü, İstanbul",
    category: "Teknologi",
    participants: 18,
    maxParticipants: 24,
    createdBy: {
      id: "business-1",
      name: "TechCamp İstanbul",
      rating: 4.9,
      isPremium: true,
      type: "business",
    },
    status: "upcoming",
    isPremiumEvent: true,
    purpose: "Advanced React development skills kazandırmak",
    activities: [
      "Hands-on coding sessions",
      "Real-world project development",
      "Code review sessions",
      "Industry best practices",
    ],
    requirements: [
      "Intermediate JavaScript knowledge",
      "React basics",
      "Laptop",
    ],
    price: 299,
  },
  {
    id: "biz-event-2",
    title: "Startup Pitch Night #15",
    description:
      "Girişimcilerin projelerini sunduğu ve investor feedback'i aldığı networking gecesi.",
    date: "2024-02-23T18:30:00", // Tomorrow (within 24h)
    location: "Startup Hub Beyoğlu, İstanbul",
    category: "Girişimcilik",
    participants: 42,
    maxParticipants: 60,
    createdBy: {
      id: "business-2",
      name: "Startup Hub İstanbul",
      rating: 4.7,
      isPremium: true,
      type: "business",
    },
    status: "upcoming",
    purpose: "Startup projelerini investor ve mentorlarla buluşturmak",
    activities: [
      "5 dakikalık pitch sunumları",
      "Investor Q&A sessions",
      "Networking cocktail",
      "Mentor speed meetings",
    ],
    requirements: ["Startup project", "Pitch deck", "Business plan"],
  },
  {
    id: "biz-event-3",
    title: "Mindfulness & Meditation Workshop",
    description:
      "Stres yönetimi ve mindfulness teknikleri üzerine rehberli workshop.",
    date: "2024-02-20T17:00:00", // 2 days ago (completed)
    location: "Wellness Center Maçka, İstanbul",
    category: "Sağlık",
    participants: 15,
    maxParticipants: 20,
    createdBy: {
      id: "business-3",
      name: "Wellness Center Maçka",
      rating: 4.8,
      isPremium: false,
      type: "business",
    },
    status: "completed",
    completedAt: "2024-02-20T19:00:00",
    averageRating: 4.6,
    totalRatings: 13,
    purpose: "Mindfulness ve stres yönetimi tekniklerini öğretmek",
    activities: [
      "Guided meditation sessions",
      "Breathing techniques",
      "Mindfulness exercises",
      "Group sharing circle",
    ],
    requirements: ["Comfortable clothing", "Open mind"],
    price: 75,
    feedback: [
      {
        id: "feedback-1",
        userId: "demo-user-id",
        userName: "Demo Kullanıcı",
        rating: 5,
        comment:
          "Harika bir deneyimdi! Rehber çok deneyimli ve teknikleri çok faydalı.",
        createdAt: "2024-02-20T20:15:00",
      },
      {
        id: "feedback-2",
        userId: "user-2",
        userName: "Ayşe Demir",
        rating: 4,
        comment: "Stresimi azaltmada gerçekten yardımcı oldu. Önerilir!",
        createdAt: "2024-02-20T21:30:00",
      },
    ],
    participants_data: [
      {
        id: "demo-user-id",
        name: "Demo Kullanıcı",
        purpose: "Arkadaşlık",
        rating: 4.5,
        badges: ["Sosyal Kelebek", "Aktif Üye"],
        joinedAt: "2024-02-20T16:45:00",
      },
      {
        id: "user-2",
        name: "Ayşe Demir",
        purpose: "Sağlık",
        rating: 4.8,
        badges: ["5 Yıldız", "Wellness Guru", "Güvenilir"],
        joinedAt: "2024-02-20T16:30:00",
      },
      {
        id: "user-3",
        name: "Mert Kaya",
        purpose: "Stres Yönetimi",
        rating: 4.2,
        badges: ["Düzenli Katılımcı"],
        joinedAt: "2024-02-20T16:50:00",
      },
    ],
  },
  // User events for comparison
  {
    id: "user-event-1",
    title: "Hafta Sonu Bisiklet Turu",
    description: "Büyükada'da doğa ile iç içe bisiklet turu ve piknik.",
    date: "2024-02-24T10:00:00", // Tomorrow
    location: "Büyükada İskelesi, İstanbul",
    category: "Spor",
    participants: 8,
    maxParticipants: 12,
    createdBy: {
      id: "user-1",
      name: "Can Özkan",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Doğa ile iç içe spor yapma ve arkadaşlık",
    activities: ["Bisiklet turu", "Piknik", "Fotoğraf çekimi"],
    requirements: ["Bisiklet", "Spor kıyafeti"],
  },
  {
    id: "user-event-2",
    title: "Board Game Gecesi",
    description:
      "Çeşitli board game'ler oynayıp eğlenceli vakit geçireceğimiz sosyal etkinlik.",
    date: "2024-02-18T19:00:00", // 4 days ago (completed)
    location: "Kadıköy Moda, İstanbul",
    category: "Oyun",
    participants: 12,
    maxParticipants: 15,
    createdBy: {
      id: "user-4",
      name: "Ali Koç",
      rating: 4.4,
      isPremium: false,
      type: "user",
    },
    status: "completed",
    completedAt: "2024-02-18T23:00:00",
    averageRating: 4.8,
    totalRatings: 10,
    participants_data: [
      {
        id: "demo-user-id",
        name: "Demo Kullanıcı",
        purpose: "Arkada��lık",
        rating: 4.5,
        badges: ["Sosyal Kelebek", "Oyun Sever"],
        joinedAt: "2024-02-18T18:45:00",
      },
    ],
  },
];

// My Events mock data for current user
export const mockMyEvents: MockEvent[] = [
  {
    id: "my-event-1",
    title: "React Native Workshop",
    description:
      "Mobile uygulama geliştirme için React Native eğitimi ve hands-on practice.",
    date: "2024-02-28T14:00:00", // 6 days from now (upcoming, >24h)
    location: "Levent, İstanbul",
    category: "Teknoloji",
    participants: 12,
    maxParticipants: 20,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "React Native development skills öğretmek",
    activities: ["Hands-on coding", "App development", "Publishing workshop"],
    requirements: ["JavaScript knowledge", "Laptop"],
  },
  {
    id: "my-event-2",
    title: "Startup Mentor Buluşması",
    description:
      "Girişimciler ve deneyimli mentorların buluştuğu networking etkinliği.",
    date: "2024-02-23T09:00:00", // Tomorrow morning (within 24h)
    location: "Kadıköy, İstanbul",
    category: "Girişimcilik",
    participants: 25,
    maxParticipants: 30,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Girişimci ve mentor eşleşmesi sağlamak",
  },
  {
    id: "my-event-3",
    title: "Photography Walk",
    description: "İstanbul'un güzel lokasyonlarında fotoğraf çekimi turu.",
    date: "2024-02-15T16:00:00", // 1 week ago (completed)
    location: "Sultanahmet, İstanbul",
    category: "Sanat",
    participants: 18,
    maxParticipants: 20,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "completed",
    completedAt: "2024-02-15T19:00:00",
    averageRating: 4.7,
    totalRatings: 15,
    participants_data: [
      {
        id: "participant-1",
        name: "Elif Yılmaz",
        purpose: "Sanat",
        rating: 4.9,
        badges: ["Sanat Aşığı", "Fotoğraf Ustası", "5 Yıldız"],
        joinedAt: "2024-02-15T15:45:00",
      },
      {
        id: "participant-2",
        name: "Murat Özkan",
        purpose: "Fotoğrafçılık",
        rating: 4.6,
        badges: ["Yaratıcı", "Düzenli Katılımcı"],
        joinedAt: "2024-02-15T15:50:00",
      },
    ],
    feedback: [
      {
        id: "feedback-3",
        userId: "participant-1",
        userName: "Elif Yılmaz",
        rating: 5,
        comment:
          "Muhteşem lokasyonlar ve çok iyi rehberlik. Fotoğraf tekniklerimi geliştirdi.",
        createdAt: "2024-02-15T20:00:00",
      },
    ],
  },
];
