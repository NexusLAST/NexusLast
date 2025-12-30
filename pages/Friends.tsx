import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  MessageCircle,
  Calendar,
  Star,
  MapPin,
  UserPlus,
  Send,
  Heart,
  Coffee,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { ChatInterface } from "@/components/Friends/ChatInterface";
import { FriendRequestManager } from "@/components/Friends/FriendRequestManager";
import { FollowingManager } from "@/components/Friends/FollowingManager";
import { toast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  purpose: string;
  rating: number;
  lastActive: string;
  mutualEvents: number;
  location: string;
  isPremium: boolean;
  isOnline: boolean;
}

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  fromUserRating: number;
  message?: string;
  createdAt: string;
  mutualEvents: number;
}

// Mock data for friends
const mockFriends: Friend[] = [
  {
    id: "friend-1",
    name: "Elif Yılmaz",
    avatar: "",
    purpose: "Sanat & Kültür",
    rating: 4.9,
    lastActive: "5 dk önce",
    mutualEvents: 5,
    location: "İzmir",
    isPremium: true,
    isOnline: true,
  },
  {
    id: "friend-2",
    name: "Can Özkan",
    avatar: "",
    purpose: "Teknoloji",
    rating: 4.5,
    lastActive: "2 saat önce",
    mutualEvents: 3,
    location: "Ankara",
    isPremium: false,
    isOnline: false,
  },
  {
    id: "friend-3",
    name: "Zeynep Arslan",
    avatar: "",
    purpose: "Arkadaşlık",
    rating: 4.7,
    lastActive: "1 saat önce",
    mutualEvents: 4,
    location: "Bursa",
    isPremium: true,
    isOnline: true,
  },
  {
    id: "friend-4",
    name: "Mert Kaya",
    avatar: "",
    purpose: "Girişimcilik",
    rating: 4.3,
    lastActive: "1 gün önce",
    mutualEvents: 2,
    location: "İstanbul",
    isPremium: false,
    isOnline: false,
  },
];

// Mock data for pending friend requests
const mockFriendRequests: FriendRequest[] = [
  {
    id: "req-1",
    fromUserId: "user-pending-1",
    fromUserName: "Ayşe Demir",
    fromUserAvatar: "",
    fromUserRating: 4.8,
    message: "Basketbol etkinliğinde tanıştık, arkadaş olmak ister misin?",
    createdAt: "2024-02-12T10:30:00",
    mutualEvents: 1,
  },
  {
    id: "req-2",
    fromUserId: "user-pending-2",
    fromUserName: "Ali Koç",
    fromUserAvatar: "",
    fromUserRating: 4.4,
    createdAt: "2024-02-11T15:45:00",
    mutualEvents: 2,
  },
];

export default function Friends() {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [friendRequests, setFriendRequests] =
    useState<FriendRequest[]>(mockFriendRequests);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(mockFriends);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null,
  );
  const { user } = useDemoUser();

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter friends based on search
  useEffect(() => {
    let filtered = friends;

    if (searchTerm) {
      filtered = filtered.filter(
        (friend) =>
          friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          friend.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredFriends(filtered);
  }, [friends, searchTerm]);

  const handleAcceptFriendRequest = async (request: FriendRequest) => {
    setProcessingRequest(request.id);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add to friends list
      const newFriend: Friend = {
        id: request.fromUserId,
        name: request.fromUserName,
        avatar: request.fromUserAvatar,
        purpose: "Yeni Arkadaş", // Could be fetched from user data
        rating: request.fromUserRating,
        lastActive: "Az önce",
        mutualEvents: request.mutualEvents,
        location: "İstanbul", // Could be fetched from user data
        isPremium: false,
        isOnline: true,
      };

      setFriends((prev) => [...prev, newFriend]);
      setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));

      toast({
        title: "Arkadaş ��steği Kabul Edildi!",
        description: `${request.fromUserName} artık arkadaş listenizde.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Arkadaş isteği kabul edilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectFriendRequest = async (request: FriendRequest) => {
    setProcessingRequest(request.id);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFriendRequests((prev) => prev.filter((req) => req.id !== request.id));

      toast({
        title: "Arkadaş İsteği Reddedildi",
        description: `${request.fromUserName} adlı kullanıcının isteği reddedildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Arkadaş isteği reddedilirken bir hata olu��tu.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleInviteToEvent = (friend: Friend) => {
    toast({
      title: "Davet Gönderildi",
      description: `${friend.name} adlı arkadaşınıza etkinlik daveti gönderildi.`,
    });
  };

  const FriendCard = ({ friend }: { friend: Friend }) => (
    <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={friend.avatar} />
              <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                {friend.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {friend.isOnline && (
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{friend.name}</h3>
                  {friend.isPremium && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      Pro
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {friend.purpose}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 inline mr-1" />
                  {friend.location}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{friend.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {friend.mutualEvents} ortak etkinlik
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Son aktif: {friend.lastActive}
            </p>

            <div className="flex gap-2 mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                    onClick={() => setSelectedFriend(friend)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Mesaj Gönder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      {friend.name} ile Sohbet
                    </DialogTitle>
                    <DialogDescription>
                      Arkadaşınızla özel mesajlaşma
                    </DialogDescription>
                  </DialogHeader>
                  {selectedFriend && <ChatInterface friend={selectedFriend} />}
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleInviteToEvent(friend)}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Davet Et
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const RequestCard = ({ request }: { request: FriendRequest }) => (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.fromUserAvatar} />
            <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
              {request.fromUserName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{request.fromUserName}</h4>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{request.fromUserRating.toFixed(1)}</span>
                  </div>
                  <span>{request.mutualEvents} ortak etkinlik</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(request.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>

            {request.message && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm italic">"{request.message}"</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => handleAcceptFriendRequest(request)}
                disabled={processingRequest === request.id}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {processingRequest === request.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Heart className="h-4 w-4 mr-1" />
                    Kabul Et
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRejectFriendRequest(request)}
                disabled={processingRequest === request.id}
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                Reddet
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexus-600"></div>
          <span className="ml-3 text-muted-foreground">
            Arkadaşlar yükleniyor...
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
              <h2 className="text-2xl font-bold mb-4">Arkadaşlarınızı Görün</h2>
              <p className="text-muted-foreground mb-6">
                Arkadaşlarınızı görmek için önce giriş yapmanız gerekiyor.
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
          <h1 className="text-3xl font-bold mb-2">Arkadaşlarım</h1>
          <p className="text-muted-foreground text-lg">
            Arkadaşlarınızla bağlantıda kalın ve yeni etkinlikler keşfedin
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-nexus-600" />
              <div className="text-2xl font-bold">{friends.length}</div>
              <div className="text-sm text-muted-foreground">Arkadaş</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <UserPlus className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{friendRequests.length}</div>
              <div className="text-sm text-muted-foreground">İstek</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">
                {friends.filter((f) => f.isOnline).length}
              </div>
              <div className="text-sm text-muted-foreground">Çevrimiçi</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Coffee className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Buluşma</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">
              Arkadaşlarım ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              İstekler ({friendRequests.length})
            </TabsTrigger>
            <TabsTrigger value="following">Takip Ettiklerim</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="mt-6">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Arkadaş ara..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Friends Grid */}
              {filteredFriends.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchTerm ? "Arkadaş Bulunamadı" : "Henüz Arkadaş Yok"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm
                      ? "Arama kriterlerinize uygun arkadaş bulunamadı."
                      : "Yeni arkadaşlar edinmek için etkinliklere katılın!"}
                  </p>
                  {!searchTerm && (
                    <Button className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700">
                      Etkinlikleri Keşfet
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredFriends.map((friend) => (
                    <FriendCard key={friend.id} friend={friend} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <FriendRequestManager />
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <FollowingManager />
          </TabsContent>

          <TabsContent value="old-requests" className="mt-6">
            <div className="space-y-6">
              {friendRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Arkadaş İsteği Yok
                  </h3>
                  <p className="text-muted-foreground">
                    Şu anda bekleyen arkadaş isteğiniz bulunmuyor.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {friendRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
