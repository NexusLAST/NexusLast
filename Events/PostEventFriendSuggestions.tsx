import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Star,
  Users,
  Heart,
  MessageCircle,
  Check,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { toast } from "@/hooks/use-toast";

interface EventParticipant {
  id: string;
  name: string;
  avatar?: string;
  purpose: string;
  rating: number;
  eventsAttended: number;
  location: string;
  isPremium: boolean;
  mutualInterests: string[];
  connectionStatus: "none" | "sent" | "received" | "friends";
}

interface PostEventFriendSuggestionsProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventId: string;
}

// Mock participants for demo
const mockParticipants: EventParticipant[] = [
  {
    id: "participant-1",
    name: "Selin Kaya",
    avatar: "",
    purpose: "Teknoloji",
    rating: 4.7,
    eventsAttended: 18,
    location: "İstanbul",
    isPremium: true,
    mutualInterests: ["React", "TypeScript", "Startup"],
    connectionStatus: "none",
  },
  {
    id: "participant-2",
    name: "Barış Özdemir",
    avatar: "",
    purpose: "Girişimcilik",
    rating: 4.5,
    eventsAttended: 22,
    location: "İstanbul",
    isPremium: false,
    mutualInterests: ["Startup", "Networking"],
    connectionStatus: "none",
  },
  {
    id: "participant-3",
    name: "Deniz Yılmaz",
    avatar: "",
    purpose: "Sanat & Kültür",
    rating: 4.9,
    eventsAttended: 31,
    location: "Ankara",
    isPremium: true,
    mutualInterests: ["Fotoğrafçılık", "Tasarım"],
    connectionStatus: "none",
  },
  {
    id: "participant-4",
    name: "Cem Arslan",
    avatar: "",
    purpose: "Spor & Fitness",
    rating: 4.4,
    eventsAttended: 15,
    location: "İstanbul",
    isPremium: false,
    mutualInterests: ["Basketbol", "Fitness"],
    connectionStatus: "none",
  },
];

export function PostEventFriendSuggestions({
  isOpen,
  onClose,
  eventTitle,
  eventId,
}: PostEventFriendSuggestionsProps) {
  const [participants, setParticipants] =
    useState<EventParticipant[]>(mockParticipants);
  const [selectedParticipant, setSelectedParticipant] =
    useState<EventParticipant | null>(null);
  const [friendMessage, setFriendMessage] = useState("");
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const { user } = useDemoUser();

  const handleSendFriendRequest = async (participant: EventParticipant) => {
    setSendingRequest(participant.id);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update participant status
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participant.id ? { ...p, connectionStatus: "sent" } : p,
        ),
      );

      toast({
        title: "Arkadaş İsteği Gönderildi!",
        description: `${participant.name} adlı kullanıcıya arkadaş isteği gönderildi.`,
      });

      setSelectedParticipant(null);
      setFriendMessage("");
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

  const getConnectionStatusInfo = (status: string) => {
    switch (status) {
      case "sent":
        return {
          text: "İstek Gönderildi",
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          icon: Check,
        };
      case "received":
        return {
          text: "İstek Bekliyor",
          color:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
          icon: UserPlus,
        };
      case "friends":
        return {
          text: "Arkadaş",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          icon: Heart,
        };
      default:
        return null;
    }
  };

  const ParticipantCard = ({
    participant,
  }: {
    participant: EventParticipant;
  }) => {
    const statusInfo = getConnectionStatusInfo(participant.connectionStatus);
    const StatusIcon = statusInfo?.icon;

    return (
      <Card className="hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={participant.avatar} />
              <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                {participant.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">
                      {participant.name}
                    </h3>
                    {participant.isPremium && (
                      <Badge variant="outline" className="text-xs px-1 py-0">
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {participant.purpose}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {participant.location}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{participant.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {participant.eventsAttended} etkinlik
                  </p>
                </div>
              </div>

              {/* Mutual Interests */}
              {participant.mutualInterests.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    Ortak İlgi Alanları:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {participant.mutualInterests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {participant.connectionStatus === "none" ? (
                  <Button
                    size="sm"
                    onClick={() => setSelectedParticipant(participant)}
                    className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Arkadaş Ekle
                  </Button>
                ) : statusInfo ? (
                  <Button size="sm" variant="outline" disabled>
                    {StatusIcon && <StatusIcon className="h-4 w-4 mr-1" />}
                    {statusInfo.text}
                  </Button>
                ) : null}

                <Button size="sm" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Mesaj
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Main Suggestions Dialog */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Users className="h-6 w-6 text-nexus-600" />
              Etkinlik Katılımcıları
            </DialogTitle>
            <DialogDescription>
              "{eventTitle}" etkinliğindeki diğer katılımcılarla bağlantı kurun
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-nexus-50 dark:bg-nexus-950 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🎉 Etkinlik Tamamlandı!</h3>
              <p className="text-sm text-muted-foreground">
                Harika bir etkinlikti! Aşağıdaki katılımcılarla arkadaş olup
                gelecek etkinliklerde de buluşabilirsiniz.
              </p>
            </div>

            {participants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Katılımcı Bulunamadı
                </h3>
                <p className="text-muted-foreground">
                  Bu etkinlikte başka katılımcı bulunmuyor.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {participants.map((participant) => (
                  <ParticipantCard
                    key={participant.id}
                    participant={participant}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Kapat
              </Button>
              <Button
                onClick={onClose}
                className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              >
                Dashboard'a Dön
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Friend Request Dialog */}
      <Dialog
        open={!!selectedParticipant}
        onOpenChange={() => setSelectedParticipant(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Arkadaş İsteği Gönder</DialogTitle>
            <DialogDescription>
              {selectedParticipant?.name} adlı kullanıcıya arkadaş isteği
              göndermek istediğinizden emin misiniz?
            </DialogDescription>
          </DialogHeader>

          {selectedParticipant && (
            <div className="space-y-4">
              {/* Participant Preview */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedParticipant.avatar} />
                  <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                    {selectedParticipant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{selectedParticipant.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedParticipant.purpose} •{" "}
                    {selectedParticipant.location}
                  </p>
                </div>
              </div>

              {/* Optional Message */}
              <div className="space-y-2">
                <Label htmlFor="friend-message">Mesaj (İsteğe bağlı)</Label>
                <Textarea
                  id="friend-message"
                  placeholder="Merhaba! Etkinlikte tanıştık, arkadaş olmak ister misin?"
                  value={friendMessage}
                  onChange={(e) => setFriendMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedParticipant(null)}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  onClick={() => handleSendFriendRequest(selectedParticipant)}
                  disabled={sendingRequest === selectedParticipant.id}
                  className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
                >
                  {sendingRequest === selectedParticipant.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      İstek Gönder
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
