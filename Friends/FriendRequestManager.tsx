import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  X,
  Clock,
  Send,
  Star,
  Users,
  MessageCircle,
  UserX,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string;
  fromUserPurpose: string;
  fromUserRating: number;
  fromUserLocation: string;
  mutualEvents: number;
  message?: string;
  sentAt: string;
  status: "pending" | "accepted" | "rejected";
}

interface SentRequest {
  id: string;
  toUserId: string;
  toUserName: string;
  toUserAvatar?: string;
  toUserPurpose: string;
  sentAt: string;
  status: "pending" | "accepted" | "rejected";
  message?: string;
}

// Mock data for incoming friend requests
const mockIncomingRequests: FriendRequest[] = [
  {
    id: "req-1",
    fromUserId: "user-1",
    fromUserName: "Ayşe Demir",
    fromUserAvatar: "",
    fromUserPurpose: "Spor & Fitness",
    fromUserRating: 4.8,
    fromUserLocation: "İstanbul",
    mutualEvents: 3,
    message:
      "Merhaba! Aynı spor etkinliklerine katıldığımızı gördüm. Arkadaş olmak ister misin?",
    sentAt: "2024-02-12T14:30:00",
    status: "pending",
  },
  {
    id: "req-2",
    fromUserId: "user-2",
    fromUserName: "Can Özkan",
    fromUserAvatar: "",
    fromUserPurpose: "Teknoloji",
    fromUserRating: 4.5,
    fromUserLocation: "Ankara",
    mutualEvents: 1,
    message:
      "Teknoloji etkinliklerinde görüştük sanıyorum. Bağlantıda kalalım!",
    sentAt: "2024-02-11T16:45:00",
    status: "pending",
  },
  {
    id: "req-3",
    fromUserId: "user-3",
    fromUserName: "Mert Kaya",
    fromUserAvatar: "",
    fromUserPurpose: "Girişimcilik",
    fromUserRating: 4.3,
    fromUserLocation: "İstanbul",
    mutualEvents: 2,
    sentAt: "2024-02-10T12:20:00",
    status: "pending",
  },
];

// Mock data for sent friend requests
const mockSentRequests: SentRequest[] = [
  {
    id: "sent-1",
    toUserId: "user-4",
    toUserName: "Elif Yılmaz",
    toUserAvatar: "",
    toUserPurpose: "Sanat & Kültür",
    message: "Müze turunda tanıştık, arkadaş olmak isterim.",
    sentAt: "2024-02-13T10:15:00",
    status: "pending",
  },
  {
    id: "sent-2",
    toUserId: "user-5",
    toUserName: "Zeynep Arslan",
    toUserAvatar: "",
    toUserPurpose: "Arkadaşlık",
    sentAt: "2024-02-12T18:30:00",
    status: "accepted",
  },
  {
    id: "sent-3",
    toUserId: "user-6",
    toUserName: "Ali Koç",
    toUserAvatar: "",
    toUserPurpose: "Oyun & Eğlence",
    message: "Board game gecesinde tanıştık!",
    sentAt: "2024-02-09T20:00:00",
    status: "rejected",
  },
];

export function FriendRequestManager() {
  const [incomingRequests, setIncomingRequests] =
    useState<FriendRequest[]>(mockIncomingRequests);
  const [sentRequests, setSentRequests] =
    useState<SentRequest[]>(mockSentRequests);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null,
  );
  const [cancellingRequest, setCancellingRequest] = useState<string | null>(
    null,
  );

  const handleAcceptRequest = async (requestId: string, userName: string) => {
    setProcessingRequest(requestId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIncomingRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "accepted" as const } : req,
        ),
      );

      toast({
        title: "Arkadaş İsteği Kabul Edildi!",
        description: `${userName} artık arkadaş listenizde.`,
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

  const handleRejectRequest = async (requestId: string, userName: string) => {
    setProcessingRequest(requestId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIncomingRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" as const } : req,
        ),
      );

      toast({
        title: "Arkadaş İsteği Reddedildi",
        description: `${userName} kullanıcısının isteği reddedildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Arkadaş isteği reddedilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleCancelRequest = async (requestId: string, userName: string) => {
    setCancellingRequest(requestId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSentRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast({
        title: "Arkadaş İsteği İptal Edildi",
        description: `${userName} kullanıcısına gönderilen istek iptal edildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Arkadaş isteği iptal edilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setCancellingRequest(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Bekliyor";
      case "accepted":
        return "Kabul Edildi";
      case "rejected":
        return "Reddedildi";
      default:
        return "Bilinmiyor";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Az önce";
    if (diffInHours < 24) return `${diffInHours} saat önce`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} gün önce`;

    return date.toLocaleDateString("tr-TR");
  };

  const pendingIncoming = incomingRequests.filter(
    (req) => req.status === "pending",
  );
  const pendingSent = sentRequests.filter((req) => req.status === "pending");

  return (
    <Tabs defaultValue="incoming" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="incoming" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Bekleyen İstekler ({pendingIncoming.length})
        </TabsTrigger>
        <TabsTrigger value="sent" className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Gönderilen İstekler ({pendingSent.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incoming" className="mt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Gelen Arkadaş İstekleri</h3>
            <Badge variant="secondary">{pendingIncoming.length} bekliyor</Badge>
          </div>

          {pendingIncoming.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">
                  Bekleyen İstek Yok
                </h4>
                <p className="text-muted-foreground">
                  Şu anda size gönderilmiş bekleyen arkadaş isteği bulunmuyor.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingIncoming.map((request) => (
                <Card
                  key={request.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.fromUserAvatar} />
                        <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                          {request.fromUserName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              {request.fromUserName}
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {request.fromUserPurpose}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{request.fromUserRating.toFixed(1)}</span>
                            </div>
                            <span>{request.fromUserLocation}</span>
                            {request.mutualEvents > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>
                                  {request.mutualEvents} ortak etkinlik
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {request.message && (
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-1 mb-1">
                              <MessageCircle className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Mesaj:
                              </span>
                            </div>
                            <p className="text-sm">{request.message}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(request.sentAt)}
                          </span>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRejectRequest(
                                  request.id,
                                  request.fromUserName,
                                )
                              }
                              disabled={processingRequest === request.id}
                            >
                              {processingRequest === request.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-1" />
                                  Reddet
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleAcceptRequest(
                                  request.id,
                                  request.fromUserName,
                                )
                              }
                              disabled={processingRequest === request.id}
                              className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                            >
                              {processingRequest === request.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <Check className="h-4 w-4 mr-1" />
                                  Kabul Et
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="sent" className="mt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Gönderilen Arkadaş İstekleri
            </h3>
            <Badge variant="secondary">{sentRequests.length} toplam</Badge>
          </div>

          {sentRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Send className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-lg font-semibold mb-2">
                  Gönderilmiş İstek Yok
                </h4>
                <p className="text-muted-foreground">
                  Henüz hiç arkadaş isteği göndermediniz.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sentRequests.map((request) => (
                <Card
                  key={request.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={request.toUserAvatar} />
                        <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                          {request.toUserName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {request.toUserName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {request.toUserPurpose}
                            </p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>

                        {request.message && (
                          <div className="mb-3 p-2 bg-muted/30 rounded text-sm">
                            <span className="text-muted-foreground">
                              Mesajınız:{" "}
                            </span>
                            {request.message}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(request.sentAt)}
                          </span>

                          {request.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleCancelRequest(
                                  request.id,
                                  request.toUserName,
                                )
                              }
                              disabled={cancellingRequest === request.id}
                            >
                              {cancellingRequest === request.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : (
                                <>
                                  <UserX className="h-4 w-4 mr-1" />
                                  İptal Et
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
