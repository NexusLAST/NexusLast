import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { UserCard } from "@/components/Community/UserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  UserPlus,
  Star,
  Calendar,
  MapPin,
  Filter,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "social" | "quality" | "organizer" | "special";
  color: string;
}

interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
  purpose: string;
  rating: number;
  eventsAttended: number;
  lastActive: string;
  location: string;
  isPremium: boolean;
  mutualEvents: number;
  isFriend: boolean;
  badges: UserBadge[];
  bio?: string;
  joinedDate: string;
  eventHistory: Array<{
    id: string;
    title: string;
    date: string;
    rating: number;
  }>;
}

interface PopularEvent {
  id: string;
  title: string;
  category: string;
  participants: number;
  date: string;
  location: string;
  isPopular: boolean;
}

// Mock badges data
const mockBadges: UserBadge[] = [
  {
    id: "1",
    name: "Sosyal Kelebek",
    description: "10+ etkinliğe katıldı",
    icon: "users",
    category: "social",
    color: "blue",
  },
  {
    id: "2",
    name: "Etkinlik Kurdu",
    description: "25+ etkinliğe katıldı",
    icon: "star",
    category: "social",
    color: "green",
  },
  {
    id: "3",
    name: "5 Yıldız",
    description: "4.5+ ortalama puan",
    icon: "star",
    category: "quality",
    color: "gold",
  },
  {
    id: "4",
    name: "Süper Organizatör",
    description: "5+ etkinlik düzenledi",
    icon: "crown",
    category: "organizer",
    color: "purple",
  },
  {
    id: "5",
    name: "İlk Kullanıcı",
    description: "İlk 100 kullanıcı arasında",
    icon: "trophy",
    category: "special",
    color: "gold",
  },
  {
    id: "6",
    name: "Arkadaş Canlısı",
    description: "50+ arkadaş",
    icon: "users",
    category: "social",
    color: "pink",
  },
  {
    id: "7",
    name: "Güvenilir",
    description: "4.8+ güvenilirlik puanı",
    icon: "medal",
    category: "quality",
    color: "silver",
  },
  {
    id: "8",
    name: "Aktif Üye",
    description: "Her hafta etkinliğe katılır",
    icon: "award",
    category: "social",
    color: "green",
  },
];

// Mock data for community users
const mockUsers: CommunityUser[] = [
  {
    id: "1",
    name: "Ayşe Demir",
    avatar: "",
    purpose: "Spor & Fitness",
    rating: 4.8,
    eventsAttended: 24,
    lastActive: "2 saat önce",
    location: "İstanbul",
    isPremium: true,
    mutualEvents: 3,
    isFriend: false,
    bio: "Spor ve sağlıklı yaşam konusunda tutkulu. Koşu, yoga ve outdoor aktiviteler organize ediyorum.",
    joinedDate: "2023-08-15",
    badges: [mockBadges[0], mockBadges[2], mockBadges[4], mockBadges[7]],
    eventHistory: [
      { id: "1", title: "Sabah Koşusu", date: "2024-02-10", rating: 5 },
      { id: "2", title: "Yoga Seansı", date: "2024-02-08", rating: 5 },
      { id: "3", title: "Bisiklet Turu", date: "2024-02-05", rating: 4 },
    ],
  },
  {
    id: "2",
    name: "Can Özkan",
    avatar: "",
    purpose: "Teknoloji",
    rating: 4.5,
    eventsAttended: 18,
    lastActive: "1 gün önce",
    location: "Ankara",
    isPremium: false,
    mutualEvents: 1,
    isFriend: false,
    bio: "Frontend developer ve teknoloji meraklısı. React, Vue.js ve yeni teknolojiler hakkında etkinlikler düzenliyorum.",
    joinedDate: "2023-10-20",
    badges: [mockBadges[0], mockBadges[6]],
    eventHistory: [
      { id: "4", title: "React Workshop", date: "2024-02-12", rating: 5 },
      { id: "5", title: "JavaScript Meetup", date: "2024-02-09", rating: 4 },
    ],
  },
  {
    id: "3",
    name: "Elif Yılmaz",
    avatar: "",
    purpose: "Sanat & Kültür",
    rating: 4.9,
    eventsAttended: 32,
    lastActive: "30 dk önce",
    location: "İzmir",
    isPremium: true,
    mutualEvents: 5,
    isFriend: true,
    bio: "Sanat tarihi mezunu, müze rehberi ve kültür etkinlikleri organizatörü. Şehrin kültürel zenginliklerini keşfetmeyi seviyorum.",
    joinedDate: "2023-06-12",
    badges: [
      mockBadges[1],
      mockBadges[2],
      mockBadges[3],
      mockBadges[4],
      mockBadges[5],
    ],
    eventHistory: [
      { id: "6", title: "Müze Turu", date: "2024-02-11", rating: 5 },
      { id: "7", title: "Fotoğraf Sergisi", date: "2024-02-09", rating: 5 },
      { id: "8", title: "Sanat Atölyesi", date: "2024-02-07", rating: 4 },
    ],
  },
  {
    id: "4",
    name: "Mert Kaya",
    avatar: "",
    purpose: "Girişimcilik",
    rating: 4.3,
    eventsAttended: 15,
    lastActive: "3 saat önce",
    location: "İstanbul",
    isPremium: false,
    mutualEvents: 2,
    isFriend: false,
    bio: "Startup kurucusu ve girişimcilik ekosisteminde aktif. Networking etkinlikleri ve mentorship programları düzenliyorum.",
    joinedDate: "2023-11-05",
    badges: [mockBadges[0], mockBadges[3]],
    eventHistory: [
      { id: "9", title: "Startup Pitch Night", date: "2024-02-10", rating: 4 },
      {
        id: "10",
        title: "Girişimci Kahvaltısı",
        date: "2024-02-08",
        rating: 5,
      },
    ],
  },
  {
    id: "5",
    name: "Zeynep Arslan",
    avatar: "",
    purpose: "Arkadaşlık",
    rating: 4.7,
    eventsAttended: 28,
    lastActive: "5 dk önce",
    location: "Bursa",
    isPremium: true,
    mutualEvents: 4,
    isFriend: false,
    bio: "Yeni insanlarla tanışmayı ve arkadaşlık kurmayı seven sosyal bir kişiyim. Çeşitli sosyal etkinlikler organize ediyorum.",
    joinedDate: "2023-09-18",
    badges: [mockBadges[1], mockBadges[5], mockBadges[7]],
    eventHistory: [
      { id: "11", title: "Arkadaş Buluşması", date: "2024-02-11", rating: 5 },
      { id: "12", title: "Oyun Gecesi", date: "2024-02-09", rating: 4 },
    ],
  },
  {
    id: "6",
    name: "Ali Koç",
    avatar: "",
    purpose: "Oyun & Eğlence",
    rating: 4.4,
    eventsAttended: 21,
    lastActive: "1 saat önce",
    location: "İstanbul",
    isPremium: false,
    mutualEvents: 1,
    isFriend: false,
    bio: "Oyun severim! Board game'lerden video oyunlarına kadar her türlü eğlenceli aktivite organize ediyorum.",
    joinedDate: "2023-12-01",
    badges: [mockBadges[0], mockBadges[7]],
    eventHistory: [
      { id: "13", title: "Board Game Gecesi", date: "2024-02-10", rating: 4 },
      {
        id: "14",
        title: "Video Oyun Turnuvası",
        date: "2024-02-07",
        rating: 5,
      },
    ],
  },
];

// Mock data for popular events
const mockPopularEvents: PopularEvent[] = [
  {
    id: "1",
    title: "Startup Networking Gecesi",
    category: "Girişimcilik",
    participants: 45,
    date: "2024-02-15",
    location: "İstanbul",
    isPopular: true,
  },
  {
    id: "2",
    title: "React Workshop",
    category: "Teknoloji",
    participants: 38,
    date: "2024-02-16",
    location: "Ankara",
    isPopular: true,
  },
  {
    id: "3",
    title: "Yoga ve Meditasyon",
    category: "Sağlık",
    participants: 32,
    date: "2024-02-17",
    location: "İstanbul",
    isPopular: true,
  },
];

const purposes = [
  "Tümü",
  "Girişimcilik",
  "Arkadaşlık",
  "Spor & Fitness",
  "Teknoloji",
  "Sanat & Kültür",
  "Oyun & Eğlence",
  "Sağlık",
];

export default function Community() {
  const [users, setUsers] = useState<CommunityUser[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] =
    useState<CommunityUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("Tümü");
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const { user } = useDemoUser();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter users based on search and purpose
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedPurpose !== "Tümü") {
      filtered = filtered.filter((user) => user.purpose === selectedPurpose);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedPurpose]);

  const handleSendFriendRequest = async (userId: string, userName: string) => {
    setSendingRequest(userId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update user state to show request sent
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFriend: true } : user,
        ),
      );

      toast({
        title: "Arkadaş İsteği Gönderildi!",
        description: `${userName} adlı kullanıcıya arkadaş isteği gönderildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Arkadaş isteği gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSendingRequest(null);
    }
  };

  const EventCard = ({ event }: { event: PopularEvent }) => (
    <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold">{event.title}</h4>
            <Badge
              variant="secondary"
              className="mt-1 bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
            >
              {event.category}
            </Badge>
          </div>
          {event.isPopular && (
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popüler
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString("tr-TR")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{event.participants} katılımcı</span>
          </div>
        </div>

        <Button size="sm" className="w-full mt-3" variant="outline">
          Detayları Gör
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexus-600"></div>
          <span className="ml-3 text-muted-foreground">
            Topluluk yükleniyor...
          </span>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Card>
            <CardContent className="pt-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">Topluluğa Katılın</h2>
              <p className="text-muted-foreground mb-6">
                Nexus topluluğunu keşfetmek için önce giriş yapmanız gerekiyor.
              </p>
              <Button>Giriş Yap</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Nexus Topluluğu</h1>
          <p className="text-muted-foreground text-lg">
            Aynı ilgi alanlarından insanlarla tanışın ve yeni arkadaşlıklar
            kurun
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-nexus-600" />
              <div className="text-2xl font-bold">2.1K+</div>
              <div className="text-sm text-muted-foreground">Aktif Üye</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Etkinlik</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-muted-foreground">Ortalama Puan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-pink-600" />
              <div className="text-2xl font-bold">15K+</div>
              <div className="text-sm text-muted-foreground">Arkadaşlık</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="events">Popüler Etkinlikler</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Kullanıcı ara..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={selectedPurpose}
                  onValueChange={setSelectedPurpose}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {purposes.map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {purpose}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Purpose Tags */}
              <div className="flex flex-wrap gap-2">
                {purposes.slice(1).map((purpose) => (
                  <Badge
                    key={purpose}
                    variant={
                      selectedPurpose === purpose ? "default" : "secondary"
                    }
                    className={`cursor-pointer transition-colors ${
                      selectedPurpose === purpose
                        ? "bg-nexus-600 hover:bg-nexus-700"
                        : "hover:bg-nexus-100 dark:hover:bg-nexus-900"
                    }`}
                    onClick={() => setSelectedPurpose(purpose)}
                  >
                    {purpose}
                  </Badge>
                ))}
              </div>

              {/* Users Grid */}
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Kullanıcı Bulunamadı
                  </h3>
                  <p className="text-muted-foreground">
                    Arama kriterlerinize uygun kullanıcı bulunamadı. Filtreleri
                    değiştirmeyi deneyin.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredUsers.map((communityUser) => (
                    <UserCard
                      key={communityUser.id}
                      user={communityUser}
                      onSendFriendRequest={handleSendFriendRequest}
                      sendingRequest={sendingRequest}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Popüler Etkinlikler</h2>
                <Badge variant="secondary">En çok katılımlı</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPopularEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
