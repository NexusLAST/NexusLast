// Mock data for My Events functionality

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

// Events that the current user has joined
export const mockJoinedEvents: MockEvent[] = [
  {
    id: "joined-1",
    title: "React Istanbul Meetup",
    description:
      "React geliştiricilerinin buluştuğu aylık teknik meetup. Bu ay state management konusunu ele alacağız.",
    date: "2024-02-25T14:00:00", // Tomorrow (upcoming)
    location: "Maslak, İstanbul",
    category: "Teknoloji",
    participants: 35,
    maxParticipants: 50,
    createdBy: {
      id: "business-1",
      name: "TechCamp İstanbul",
      rating: 4.9,
      isPremium: true,
      type: "business",
    },
    status: "upcoming",
    purpose: "React geliştiricilerini buluşturmak",
    activities: ["Technical talks", "Networking", "Q&A session"],
    requirements: ["React knowledge", "Laptop (optional)"],
  },
  {
    id: "joined-2",
    title: "Startup Pitch Night",
    description:
      "Girişimcilerin projelerini sunduğu ve investor buluşması yapıldığı etkinlik.",
    date: "2024-02-26T19:00:00", // Day after tomorrow (upcoming)
    location: "Beyoğlu, İstanbul",
    category: "Girişimcilik",
    participants: 45,
    maxParticipants: 60,
    createdBy: {
      id: "business-2",
      name: "Startup Hub İstanbul",
      rating: 4.7,
      isPremium: true,
      type: "business",
    },
    status: "upcoming",
    purpose: "Girişimci ve investor buluşması",
    activities: ["Pitch presentations", "Networking", "Investor meetings"],
    requirements: ["Business presentation (for pitchers)"],
  },
  {
    id: "joined-6",
    title: "Digital Marketing Workshop",
    description: "Sosyal medya pazarlama ve Google Ads stratejileri eğitimi.",
    date: "2024-02-28T10:00:00", // 6 days from now (upcoming)
    location: "Şişli, İstanbul",
    category: "Teknoloji",
    participants: 22,
    maxParticipants: 30,
    createdBy: {
      id: "business-1",
      name: "TechCamp İstanbul",
      rating: 4.9,
      isPremium: true,
      type: "business",
    },
    status: "upcoming",
    purpose: "Dijital pazarlama becerilerini geliştirmek",
    activities: ["Hands-on workshop", "Case studies", "Strategy session"],
    requirements: ["Basic marketing knowledge"],
  },
  {
    id: "joined-7",
    title: "Weekend Hiking Trip",
    description: "Büy��kada'da doğa yürüyüşü ve manzara fotoğrafçılığı.",
    date: "2024-03-02T09:00:00", // Next weekend (upcoming)
    location: "Büyükada, İstanbul",
    category: "Spor",
    participants: 15,
    maxParticipants: 20,
    createdBy: {
      id: "user-5",
      name: "Outdoor Club Istanbul",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Doğa ile iç içe spor aktivitesi",
    activities: ["Hiking", "Photography", "Nature observation"],
    requirements: ["Comfortable shoes", "Water bottle"],
  },
  {
    id: "joined-3",
    title: "Morning Yoga Session",
    description:
      "Haftaya enerjik başlamak için sabah yoga seansı. Başlangıç seviyesi için uygun.",
    date: "2024-02-19T08:00:00", // 3 days ago (completed)
    location: "Caddebostan Sahili, İstanbul",
    category: "Sağlık",
    participants: 20,
    maxParticipants: 25,
    createdBy: {
      id: "business-3",
      name: "Wellness Center Maçka",
      rating: 4.8,
      isPremium: true,
      type: "business",
    },
    status: "completed",
    completedAt: "2024-02-19T09:30:00",
    averageRating: 4.9,
    totalRatings: 18,
    feedback: [
      {
        id: "feedback-joined-1",
        userId: "demo-user-id",
        userName: "Demo Kullanıcı",
        rating: 5,
        comment:
          "Harika bir başlangıç! Çok rahatlatıcı ve enerjik bir seans oldu. Kesinlikle tekrar katılacağım.",
        createdAt: "2024-02-19T10:00:00",
      },
      {
        id: "feedback-joined-2",
        userId: "user-2",
        userName: "Ayşe Demir",
        rating: 5,
        comment: "Sabah yapmaya değer! Günüme harika bir başlangıç yaptı.",
        createdAt: "2024-02-19T10:15:00",
      },
    ],
  },
  {
    id: "joined-4",
    title: "Board Game Night",
    description:
      "Çeşitli board game'ler oynayıp eğlenceli vakit geçireceğimiz sosyal etkinlik.",
    date: "2024-02-16T19:00:00", // 6 days ago (completed)
    location: "Kadıköy Moda, İstanbul",
    category: "Oyun",
    participants: 16,
    maxParticipants: 20,
    createdBy: {
      id: "user-1",
      name: "Ali Koç",
      rating: 4.4,
      isPremium: false,
      type: "user",
    },
    status: "completed",
    completedAt: "2024-02-16T23:00:00",
    averageRating: 4.7,
    totalRatings: 14,
    feedback: [
      {
        id: "feedback-joined-3",
        userId: "demo-user-id",
        userName: "Demo Kullanıcı",
        rating: 4,
        comment:
          "Çok eğlenceli bir geceydi! Yeni oyunlar öğrendim ve güzel arkadaşlıklar kurdum.",
        createdAt: "2024-02-16T23:30:00",
      },
    ],
  },
  {
    id: "joined-5",
    title: "Photography Walk - Balat",
    description:
      "Balat'ın renkli sokaklarında fotoğraf çekimi turu. Her seviyeden fotoğrafçı katılabilir.",
    date: "2024-02-14T15:00:00", // 8 days ago (completed)
    location: "Balat, İstanbul",
    category: "Sanat",
    participants: 12,
    maxParticipants: 15,
    createdBy: {
      id: "user-2",
      name: "Mert Arslan",
      rating: 4.6,
      isPremium: false,
      type: "user",
    },
    status: "completed",
    completedAt: "2024-02-14T18:00:00",
    averageRating: 4.8,
    totalRatings: 10,
    // No feedback from current user yet
  },
];

// Events that the current user has created
export const mockMyEvents: MockEvent[] = [
  // YAKLAŞAN ETKİNLİKLER (>24 saat) - 6 ADET
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
    participants_data: [
      {
        id: "participant-1",
        name: "Ahmet Yılmaz",
        purpose: "Kariyer geliştirme",
        rating: 4.3,
        badges: ["Öğrenmeye Açık", "Teknoloji Meraklısı"],
        joinedAt: "2024-02-20T10:30:00",
      },
      {
        id: "participant-2",
        name: "Zeynep Kaya",
        purpose: "Mobil uygulama geliştirme",
        rating: 4.7,
        badges: ["React Uzmanı", "5 Yıldız"],
        joinedAt: "2024-02-20T14:15:00",
      },
      {
        id: "participant-3",
        name: "Can Özkan",
        purpose: "Beceri geliştirme",
        rating: 4.2,
        badges: ["Aktif Katılımcı"],
        joinedAt: "2024-02-21T09:45:00",
      },
    ],
  },
  {
    id: "my-event-8",
    title: "Python Data Science Bootcamp",
    description:
      "Veri bilimi ve machine learning için Python eğitimi. Pandas, NumPy ve Scikit-learn kullanımı.",
    date: "2024-02-25T10:00:00", // 3 days from now (upcoming >24h)
    location: "Maslak, İstanbul",
    category: "Teknoloji",
    participants: 28,
    maxParticipants: 35,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Veri bilimi becerilerini geliştirmek",
    activities: ["Python coding", "Data analysis", "ML algorithms"],
    requirements: ["Python basics", "Laptop", "Jupyter Notebook"],
    participants_data: [
      {
        id: "participant-15",
        name: "Data Enthusiast",
        purpose: "Kariyer değişikliği",
        rating: 4.5,
        badges: ["Öğrenmeye Açık", "Analitik Düşünür"],
        joinedAt: "2024-02-22T16:00:00",
      },
    ],
  },
  {
    id: "my-event-9",
    title: "Blockchain & Web3 Introduction",
    description:
      "Blockchain teknolojisi ve Web3 dünyasına giriş. Ethereum, smart contracts ve DeFi konuları.",
    date: "2024-02-26T14:00:00", // 4 days from now (upcoming >24h)
    location: "Beyoğlu, İstanbul",
    category: "Teknoloji",
    participants: 22,
    maxParticipants: 30,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Blockchain ve Web3 teknolojilerini tanıtmak",
    activities: [
      "Blockchain fundamentals",
      "Smart contract demo",
      "DeFi overview",
    ],
    requirements: ["Basic tech knowledge", "Laptop optional"],
    participants_data: [
      {
        id: "participant-17",
        name: "Crypto Curious",
        purpose: "Yeni teknoloji öğrenme",
        rating: 4.4,
        badges: ["Teknoloji Meraklısı", "İnovatif"],
        joinedAt: "2024-02-21T12:00:00",
      },
    ],
  },
  {
    id: "my-event-10",
    title: "Weekend Art Workshop",
    description:
      "Acryllic boyama teknikleri ve manzara resmi. Sanat malzemeleri dahil.",
    date: "2024-02-27T11:00:00", // 5 days from now (upcoming >24h)
    location: "Kadıköy, İstanbul",
    category: "Sanat",
    participants: 15,
    maxParticipants: 20,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Sanat becerilerini geliştirmek ve yaratıcılığı artırmak",
    activities: ["Painting techniques", "Color theory", "Landscape painting"],
    requirements: ["None - materials provided"],
    participants_data: [
      {
        id: "participant-18",
        name: "Creative Soul",
        purpose: "Hobi geliştirme",
        rating: 4.6,
        badges: ["Sanat Aşığı", "Yaratıcı"],
        joinedAt: "2024-02-20T14:45:00",
      },
    ],
  },
  {
    id: "my-event-11",
    title: "Istanbul Food Tour",
    description:
      "Tarihi yarımada'da geleneksel lezzetler turu. Yerel rehber eşliğinde.",
    date: "2024-02-29T15:00:00", // 7 days from now (upcoming >24h)
    location: "Eminönü, İstanbul",
    category: "Sanat",
    participants: 12,
    maxParticipants: 16,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Geleneksel İstanbul mutfağını tanıtmak",
    activities: ["Local food tasting", "Historical sites", "Cultural stories"],
    requirements: ["Comfortable walking shoes", "Appetite for adventure"],
    participants_data: [
      {
        id: "participant-20",
        name: "Food Explorer",
        purpose: "Kültür keşfi",
        rating: 4.7,
        badges: ["Gurme", "Kültür Aşığı", "Gezgin"],
        joinedAt: "2024-02-19T16:30:00",
      },
    ],
  },
  {
    id: "my-event-13",
    title: "Public Speaking Workshop",
    description:
      "Etkili konuşma teknikleri ve sahne korkusunu yenme. Pratik sunumlar dahil.",
    date: "2024-03-01T16:00:00", // 8 days from now (upcoming >24h)
    location: "Şişli, İstanbul",
    category: "Girişimcilik",
    participants: 20,
    maxParticipants: 25,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "İletişim becerilerini geliştirmek",
    activities: [
      "Speaking exercises",
      "Confidence building",
      "Presentation skills",
    ],
    requirements: ["Willingness to practice"],
    participants_data: [
      {
        id: "participant-23",
        name: "Shy Speaker",
        purpose: "Kendini geliştirme",
        rating: 4.3,
        badges: ["Cesur", "Öğrenmeye Açık"],
        joinedAt: "2024-02-21T14:00:00",
      },
    ],
  },

  // 24 SAAT İÇİNDE OLAN ETKİNLİKLER - 6 ADET
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
    participants_data: [
      {
        id: "participant-4",
        name: "Elif Demir",
        purpose: "Mentor arama",
        rating: 4.8,
        badges: ["Girişimci", "Lider", "5 Yıldız"],
        joinedAt: "2024-02-18T16:20:00",
      },
      {
        id: "participant-5",
        name: "Murat Çelik",
        purpose: "Networking",
        rating: 4.4,
        badges: ["Startup Guru", "Mentor"],
        joinedAt: "2024-02-19T11:30:00",
      },
    ],
  },
  {
    id: "my-event-7",
    title: "Coffee Chat Networking",
    description: "Rahat ortamda profesyonel networking ve deneyim paylaşımı.",
    date: "2024-02-23T18:00:00", // Tomorrow evening (within 24h)
    location: "Cihangir, İstanbul",
    category: "Girişimcilik",
    participants: 12,
    maxParticipants: 15,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Rahat ortamda networking yapmak",
    participants_data: [
      {
        id: "participant-14",
        name: "Coffee Lover",
        purpose: "Networking",
        rating: 4.4,
        badges: ["Sosyal", "Konuşkan"],
        joinedAt: "2024-02-22T15:30:00",
      },
    ],
  },
  {
    id: "my-event-15",
    title: "Evening Book Club Discussion",
    description:
      "Haftalık kitap kulübü buluşması. Bu hafta 'Saatleri Ayarlama Enstitüsü' kitabını tartışacağız.",
    date: "2024-02-22T19:00:00", // Today evening (within 24h)
    location: "Cihangir, İstanbul",
    category: "Sanat",
    participants: 8,
    maxParticipants: 12,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Edebiyat sevgisini paylaşmak",
    activities: ["Book discussion", "Author insights", "Next book selection"],
    requirements: ["Having read the book"],
    participants_data: [
      {
        id: "participant-25",
        name: "Book Worm",
        purpose: "Edebiyat tartışması",
        rating: 4.8,
        badges: ["Kitap Kurdu", "Düşünür", "5 Yıldız"],
        joinedAt: "2024-02-20T16:45:00",
      },
    ],
  },
  {
    id: "my-event-16",
    title: "Morning Runners Club",
    description:
      "Boğaziçi Köprüsü'ne koşu. Başlangıç seviyesi koşucular için uygun.",
    date: "2024-02-23T06:30:00", // Tomorrow morning (within 24h)
    location: "Ortaköy, İstanbul",
    category: "Spor",
    participants: 14,
    maxParticipants: 18,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Spor aktivitesi ve motivasyon",
    activities: ["Group running", "Stretching", "Healthy breakfast"],
    requirements: ["Running shoes", "Water bottle"],
    participants_data: [
      {
        id: "participant-26",
        name: "Running Enthusiast",
        purpose: "Fitness",
        rating: 4.7,
        badges: ["Atlet", "Motivasyon Kaynağı", "Sağlık Guru"],
        joinedAt: "2024-02-21T08:00:00",
      },
    ],
  },
  {
    id: "my-event-17",
    title: "Quick Lunch & Learn: Excel Tips",
    description:
      "Öğle arası hızlı Excel ipuçları semineri. İş hayatında kullanışlı formüller.",
    date: "2024-02-23T12:30:00", // Tomorrow lunch (within 24h)
    location: "Levent, İstanbul",
    category: "Teknoloji",
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
    purpose: "İş verimliliğini artırmak",
    activities: ["Excel formulas", "Data analysis", "Quick tips"],
    requirements: ["Laptop with Excel"],
    participants_data: [
      {
        id: "participant-27",
        name: "Office Worker",
        purpose: "İş becerilerini geliştirme",
        rating: 4.4,
        badges: ["Verimli", "Öğrenmeye Açık"],
        joinedAt: "2024-02-22T09:15:00",
      },
    ],
  },
  {
    id: "my-event-19",
    title: "Late Night Coding Session",
    description:
      "Geç saatte coding session. Open source projelere katkıda bulunalım.",
    date: "2024-02-22T21:00:00", // Tonight (within 24h)
    location: "Beşiktaş, İstanbul",
    category: "Teknoloji",
    participants: 12,
    maxParticipants: 15,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "upcoming",
    purpose: "Açık kaynak projelere katkı",
    activities: ["Coding", "Code review", "GitHub collaboration"],
    requirements: ["Laptop", "Programming experience"],
    participants_data: [
      {
        id: "participant-29",
        name: "Night Coder",
        purpose: "Open source katkı",
        rating: 4.6,
        badges: ["Gece Kuşu", "Developer", "GitHub Star"],
        joinedAt: "2024-02-22T15:30:00",
      },
    ],
  },

  // TAMAMLANAN ETKİNLİKLER
  {
    id: "my-event-3",
    title: "Photography Walk - Sultanahmet",
    description: "İstanbul'un tarihi mekanlarında fotoğraf çekimi turu.",
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
        id: "participant-6",
        name: "Elif Yılmaz",
        purpose: "Sanat",
        rating: 4.9,
        badges: ["Sanat Aşığı", "Fotoğraf Ustası", "5 Yıldız"],
        joinedAt: "2024-02-15T15:45:00",
      },
      {
        id: "participant-7",
        name: "Murat Özkan",
        purpose: "Fotoğrafçılık",
        rating: 4.6,
        badges: ["Yaratıcı", "Düzenli Katılımcı"],
        joinedAt: "2024-02-15T15:50:00",
      },
      {
        id: "participant-8",
        name: "Ayşe Koç",
        purpose: "Hobiden",
        rating: 4.3,
        badges: ["Yeni Başlayan", "Öğrenmeye Açık"],
        joinedAt: "2024-02-15T15:55:00",
      },
    ],
    feedback: [
      {
        id: "feedback-my-1",
        userId: "participant-6",
        userName: "Elif Yılmaz",
        rating: 5,
        comment:
          "Muhteşem lokasyonlar ve çok iyi rehberlik. Fotoğraf tekniklerimi geliştirdi.",
        createdAt: "2024-02-15T20:00:00",
      },
      {
        id: "feedback-my-2",
        userId: "participant-7",
        userName: "Murat Özkan",
        rating: 4,
        comment: "Güzel bir deneyimdi. Tarihi yerler hakkında da bilgi aldık.",
        createdAt: "2024-02-15T20:15:00",
      },
    ],
  },
  {
    id: "my-event-4",
    title: "Digital Marketing Workshop",
    description: "Sosyal medya pazarlama stratejileri ve Google Ads eğitimi.",
    date: "2024-02-12T13:00:00", // 10 days ago (completed)
    location: "Şişli, İstanbul",
    category: "Teknoloji",
    participants: 22,
    maxParticipants: 25,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "completed",
    completedAt: "2024-02-12T17:00:00",
    averageRating: 4.5,
    totalRatings: 20,
    participants_data: [
      {
        id: "participant-9",
        name: "Selin Arslan",
        purpose: "Profesyonel gelişim",
        rating: 4.4,
        badges: ["Pazarlama Uzmanı", "Aktif Katılımcı"],
        joinedAt: "2024-02-12T12:45:00",
      },
      {
        id: "participant-10",
        name: "Burak Yıldız",
        purpose: "İş geliştirme",
        rating: 4.1,
        badges: ["Girişimci", "Yeni Başlayan"],
        joinedAt: "2024-02-12T12:50:00",
      },
    ],
    feedback: [
      {
        id: "feedback-my-3",
        userId: "participant-9",
        userName: "Selin Arslan",
        rating: 5,
        comment: "Çok pratik bilgiler aldım. Hemen işimde uygulamaya başladım.",
        createdAt: "2024-02-12T17:30:00",
      },
      {
        id: "feedback-my-4",
        userId: "participant-10",
        userName: "Burak Yıldız",
        rating: 4,
        comment:
          "Başlangıç seviyesi için çok faydalıydı. Google Ads kısmı çok iyiydi.",
        createdAt: "2024-02-12T17:45:00",
      },
    ],
  },
  {
    id: "my-event-5",
    title: "Book Club - Modern Türk Edebiyatı",
    description:
      "Güncel Türk yazarlarından seçili eserleri tartıştığımız kitap kulübü.",
    date: "2024-02-08T18:00:00", // 14 days ago (completed)
    location: "Beyoğlu, İstanbul",
    category: "Sanat",
    participants: 8,
    maxParticipants: 12,
    createdBy: {
      id: "demo-user-id",
      name: "Demo Kullanıcı",
      rating: 4.5,
      isPremium: false,
      type: "user",
    },
    status: "completed",
    completedAt: "2024-02-08T20:00:00",
    averageRating: 4.8,
    totalRatings: 7,
    participants_data: [
      {
        id: "participant-11",
        name: "Deniz Kara",
        purpose: "Kitap tutkusu",
        rating: 4.9,
        badges: ["Kitap Kurdu", "Entelektüel", "5 Yıldız"],
        joinedAt: "2024-02-08T17:45:00",
      },
      {
        id: "participant-12",
        name: "Ece Güzel",
        purpose: "Edebiyat sevgisi",
        rating: 4.6,
        badges: ["Okur Yazar", "Düşünür"],
        joinedAt: "2024-02-08T17:50:00",
      },
    ],
    feedback: [
      {
        id: "feedback-my-5",
        userId: "participant-11",
        userName: "Deniz Kara",
        rating: 5,
        comment:
          "Harika tartışmalar oldu. Farklı bakış açıları çok değerliydi.",
        createdAt: "2024-02-08T20:30:00",
      },
    ],
  },
];
