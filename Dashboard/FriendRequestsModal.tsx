import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Check, X, Star, Clock, Heart } from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface FriendRequest {
  id: string;
  senderName: string;
  senderAvatar?: string;
  senderRating: number;
  senderPurpose: string;
  mutualFriends: number;
  requestDate: string;
  message?: string;
}

// Mock data for demo mode
const mockFriendRequests: FriendRequest[] = [
  {
    id: "1",
    senderName: "Ayşe Demir",
    senderAvatar: "",
    senderRating: 4.8,
    senderPurpose: "Spor & Fitness",
    mutualFriends: 3,
    requestDate: "2024-02-10",
    message:
      "Merhaba! Basketbol etkinliğinde tanıştık, arkadaş olmak ister misin?",
  },
  {
    id: "2",
    senderName: "Can Özkan",
    senderAvatar: "",
    senderRating: 4.5,
    senderPurpose: "Teknoloji",
    mutualFriends: 1,
    requestDate: "2024-02-09",
    message: "Kod workshop'unda sohbet etmiştik. Bağlantıda kalalım!",
  },
  {
    id: "3",
    senderName: "Elif Yılmaz",
    senderAvatar: "",
    senderRating: 4.9,
    senderPurpose: "Sanat & Kültür",
    mutualFriends: 5,
    requestDate: "2024-02-08",
  },
  {
    id: "4",
    senderName: "Mert Kaya",
    senderAvatar: "",
    senderRating: 4.3,
    senderPurpose: "Girişimcilik",
    mutualFriends: 2,
    requestDate: "2024-02-07",
    message:
      "Startup networking gecesinde tanıştık. Projeler hakkında konuşalım!",
  },
];

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendRequestsModal({
  isOpen,
  onClose,
}: FriendRequestsModalProps) {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user, isDemo } = useDemoUser();

  const loadFriendRequests = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        // Demo mode: use mock data
        await new Promise((resolve) => setTimeout(resolve, 500));
        setRequests(mockFriendRequests);
      } else {
        // Real Supabase integration would go here
        // For now, fallback to mock data
        setRequests(mockFriendRequests);
      }
    } catch (error) {
      console.error("Error loading friend requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFriendRequests();
    }
  }, [isOpen, isDemo]);

  const handleAcceptRequest = async (requestId: string, senderName: string) => {
    setProcessingId(requestId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove from requests list
      setRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast({
        title: "Arkadaş İsteği Kabul Edildi!",
        description: `${senderName} artık arkadaş listenizde.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Arkadaş isteği kabul edilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectRequest = async (requestId: string, senderName: string) => {
    setProcessingId(requestId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Remove from requests list
      setRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast({
        title: "Arkadaş İsteği Reddedildi",
        description: `${senderName} adlı kullanıcının isteği reddedildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Arkadaş isteği reddedilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Bugün";
    if (diffDays === 2) return "Dün";
    if (diffDays <= 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserPlus className="h-6 w-6 text-nexus-600" />
            Arkadaş İstekleri
          </DialogTitle>
          <DialogDescription>
            Size gönderilen arkadaş isteklerini inceleyin ve kabul edin ya da
            reddedin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nexus-600"></div>
              <span className="ml-3 text-muted-foreground">
                İstekler yükleniyor...
              </span>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Henüz Arkadaş İsteği Yok
              </h3>
              <p className="text-muted-foreground mb-6">
                Şu anda size gönderilmiş arkadaş isteği bulunmuyor. Etkinliklere
                katılarak yeni insanlarla tanışın!
              </p>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              >
                Etkinlikleri Keşfet
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {requests.length} arkadaş isteği
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                >
                  {requests.length} bekliyor
                </Badge>
              </div>

              <div className="grid gap-4">
                {requests.map((request) => (
                  <Card
                    key={request.id}
                    className="hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.senderAvatar} />
                          <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                            {request.senderName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-lg">
                                {request.senderName}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{request.senderRating.toFixed(1)}</span>
                                </div>
                                <span>{request.senderPurpose}</span>
                                {request.mutualFriends > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>
                                      {request.mutualFriends} ortak arkadaş
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(request.requestDate)}
                            </div>
                          </div>

                          {/* Message */}
                          {request.message && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm italic">
                                "{request.message}"
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-4">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAcceptRequest(
                                  request.id,
                                  request.senderName,
                                )
                              }
                              disabled={processingId === request.id}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {processingId === request.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Kabul Et
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRejectRequest(
                                  request.id,
                                  request.senderName,
                                )
                              }
                              disabled={processingId === request.id}
                              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                            >
                              {processingId === request.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Reddet
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {requests.length > 0 && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Kapat
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
