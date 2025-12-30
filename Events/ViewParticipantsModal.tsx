import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  Star,
  UserPlus,
  Eye,
  Award,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  purpose: string;
  rating: number;
  badges: string[];
  joinedAt: string;
  avatar?: string;
}

interface ViewParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  participants: Participant[];
}

export function ViewParticipantsModal({
  isOpen,
  onClose,
  eventTitle,
  participants,
}: ViewParticipantsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);

  const filteredParticipants = participants.filter(
    (participant) =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.purpose.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendFriendRequest = async (
    participantId: string,
    participantName: string,
  ) => {
    setSendingRequest(participantId);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Arkadaş İsteği Gönderildi!",
        description: `${participantName} adlı kullanıcıya arkadaş isteği gönderildi.`,
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

  const handleViewProfile = (
    participantId: string,
    participantName: string,
  ) => {
    toast({
      title: "Profil Görüntüleniyor",
      description: `${participantName} kullanıcısının profili açılıyor...`,
    });
    // In real app, navigate to user profile page
  };

  const formatJoinTime = (joinedAt: string) => {
    const date = new Date(joinedAt);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBadgeColor = (badge: string) => {
    const colorMap: Record<string, string> = {
      "Sosyal Kelebek":
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      "5 Yıldız":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      "Aktif Üye":
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      "Sanat Aşığı":
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      "Fotoğraf Ustası":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      "Wellness Guru":
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      Güvenilir:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      Yaratıcı:
        "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300",
      "Düzenli Katılımcı":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      "Oyun Sever":
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    };
    return (
      colorMap[badge] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {eventTitle} - Katılımcılar
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{participants.length}</div>
                <div className="text-sm text-muted-foreground">Katılımcı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {(
                    participants.reduce((sum, p) => sum + p.rating, 0) /
                      participants.length || 0
                  ).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Ort. Puan</div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Tamamlandı
            </Badge>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Katılımcı ara..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Participants Grid */}
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "Katılımcı Bulunamadı" : "Katılımcı Bilgisi Yok"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Arama kriterlerinize uygun katılımcı bulunamadı."
                  : "Bu etkinlik için katılımcı bilgisi mevcut değil."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-muted">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                        {participant.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-semibold">{participant.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {participant.purpose}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">
                            {participant.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatJoinTime(participant.joinedAt)}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      {participant.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {participant.badges
                            .slice(0, 3)
                            .map((badge, index) => (
                              <Badge
                                key={index}
                                className={`text-xs px-2 py-1 ${getBadgeColor(badge)}`}
                              >
                                <Award className="h-2 w-2 mr-1" />
                                {badge}
                              </Badge>
                            ))}
                          {participant.badges.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-1"
                            >
                              +{participant.badges.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleSendFriendRequest(
                              participant.id,
                              participant.name,
                            )
                          }
                          disabled={sendingRequest === participant.id}
                          className="flex-1"
                        >
                          {sendingRequest === participant.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                          ) : (
                            <UserPlus className="h-3 w-3 mr-1" />
                          )}
                          Arkadaş Ekle
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleViewProfile(participant.id, participant.name)
                          }
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Profil
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Info */}
          <div className="text-center text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
            <MessageCircle className="h-4 w-4 inline mr-1" />
            Bu etkinliğe katılan kişilerle arkadaş olabilir ve gelecek
            etkinliklerde beraber katılabilirsiniz.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
