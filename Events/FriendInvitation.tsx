import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, UserPlus, Star, Send } from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  name: string;
  avatar?: string;
  purpose: string;
  rating: number;
  location: string;
  isPremium: boolean;
  isOnline: boolean;
  lastActive: string;
}

interface FriendInvitationProps {
  onInvitedFriendsChange: (invitedFriends: Friend[]) => void;
}

// Mock friends data
const mockFriends: Friend[] = [
  {
    id: "friend-1",
    name: "Elif Yılmaz",
    avatar: "",
    purpose: "Sanat & Kültür",
    rating: 4.9,
    location: "İzmir",
    isPremium: true,
    isOnline: true,
    lastActive: "5 dk önce",
  },
  {
    id: "friend-2",
    name: "Can Özkan",
    avatar: "",
    purpose: "Teknoloji",
    rating: 4.5,
    location: "Ankara",
    isPremium: false,
    isOnline: false,
    lastActive: "2 saat önce",
  },
  {
    id: "friend-3",
    name: "Zeynep Arslan",
    avatar: "",
    purpose: "Arkadaşlık",
    rating: 4.7,
    location: "Bursa",
    isPremium: true,
    isOnline: true,
    lastActive: "1 saat önce",
  },
  {
    id: "friend-4",
    name: "Mert Kaya",
    avatar: "",
    purpose: "Girişimcilik",
    rating: 4.3,
    location: "İstanbul",
    isPremium: false,
    isOnline: false,
    lastActive: "1 gün önce",
  },
  {
    id: "friend-5",
    name: "Ayşe Demir",
    avatar: "",
    purpose: "Spor & Fitness",
    rating: 4.8,
    location: "İstanbul",
    isPremium: true,
    isOnline: true,
    lastActive: "Az önce",
  },
];

export function FriendInvitation({
  onInvitedFriendsChange,
}: FriendInvitationProps) {
  const [friends] = useState<Friend[]>(mockFriends);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>(mockFriends);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(
    new Set(),
  );
  const [sendingInvites, setSendingInvites] = useState(false);
  const { user } = useDemoUser();

  // Filter friends based on search
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(value.toLowerCase()) ||
          friend.purpose.toLowerCase().includes(value.toLowerCase()) ||
          friend.location.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredFriends(filtered);
    }
  };

  // Handle friend selection
  const handleFriendToggle = (friendId: string) => {
    const newSelected = new Set(selectedFriends);

    if (newSelected.has(friendId)) {
      newSelected.delete(friendId);
    } else {
      newSelected.add(friendId);
    }

    setSelectedFriends(newSelected);

    // Update parent component with selected friends
    const invitedFriends = friends.filter((friend) =>
      newSelected.has(friend.id),
    );
    onInvitedFriendsChange(invitedFriends);
  };

  // Select all friends
  const handleSelectAll = () => {
    if (selectedFriends.size === filteredFriends.length) {
      setSelectedFriends(new Set());
      onInvitedFriendsChange([]);
    } else {
      const allFilteredIds = new Set(filteredFriends.map((f) => f.id));
      setSelectedFriends(allFilteredIds);
      onInvitedFriendsChange(filteredFriends);
    }
  };

  // Send preview invitations (for demo)
  const handleSendPreviewInvites = async () => {
    if (selectedFriends.size === 0) return;

    setSendingInvites(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const selectedFriendNames = friends
        .filter((f) => selectedFriends.has(f.id))
        .map((f) => f.name)
        .join(", ");

      toast({
        title: "Davetler Gönderildi!",
        description: `${selectedFriendNames} arkadaşlarınıza etkinlik daveti gönderildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Davetler gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setSendingInvites(false);
    }
  };

  const FriendItem = ({ friend }: { friend: Friend }) => (
    <div className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors">
      <Checkbox
        checked={selectedFriends.has(friend.id)}
        onCheckedChange={() => handleFriendToggle(friend.id)}
      />

      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={friend.avatar} />
          <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
            {friend.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {friend.isOnline && (
          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm">{friend.name}</h4>
          {friend.isPremium && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              Pro
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{friend.purpose}</span>
          <span>•</span>
          <span>{friend.location}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{friend.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {friend.isOnline ? "Çevrimiçi" : friend.lastActive}
      </div>
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-nexus-600" />
          Arkadaşlarını Davet Et
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Etkinliğinize katılması için arkadaşlarınızı seçin. Seçtiğiniz
          arkadaşlar otomatik olarak etkinliğe davetli olacak.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {friends.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Henüz Arkadaş Yok</h3>
            <p className="text-sm text-muted-foreground">
              Arkadaş eklemek için etkinliklere katılın ve yeni insanlarla
              tanışın!
            </p>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Arkadaş ara..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            {/* Select All */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    filteredFriends.length > 0 &&
                    selectedFriends.size === filteredFriends.length
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  Tümünü Seç ({filteredFriends.length})
                </span>
              </div>

              {selectedFriends.size > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                >
                  {selectedFriends.size} seçili
                </Badge>
              )}
            </div>

            {/* Friends List */}
            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredFriends.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Arama kriterlerinize uygun arkadaş bulunamadı.
                  </p>
                </div>
              ) : (
                filteredFriends.map((friend) => (
                  <FriendItem key={friend.id} friend={friend} />
                ))
              )}
            </div>

            {/* Selected Friends Summary */}
            {selectedFriends.size > 0 && (
              <div className="bg-nexus-50 dark:bg-nexus-950 rounded-lg p-4">
                <h4 className="font-medium text-sm mb-2">
                  Seçilen Arkadaşlar ({selectedFriends.size})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {friends
                    .filter((f) => selectedFriends.has(f.id))
                    .map((friend) => (
                      <Badge
                        key={friend.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {friend.name}
                      </Badge>
                    ))}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendPreviewInvites}
                  disabled={sendingInvites}
                  className="mt-3 w-full"
                >
                  {sendingInvites ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-1" />
                      Önizleme Davet Gönder
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Info */}
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Bilgi:</strong> Seçtiğiniz arkadaşlar etkinlik
              oluşturulduktan sonra otomatik olarak davet edilecek ve başvuru
              yapmalarına gerek kalmayacak.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
