import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MapPin, Users, Star, User } from "lucide-react";
import { Event } from "@/lib/supabase";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

interface EventApplicationModalProps {
  event: Event & {
    createdBy: {
      name: string;
      avatar?: string;
      rating: number;
      isPremium: boolean;
    };
    participants: number;
    maxParticipants?: number;
    category: string;
    isPremiumEvent?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EventApplicationModal({
  event,
  isOpen,
  onClose,
}: EventApplicationModalProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isDemo } = useDemoUser();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Hata",
        description: "Etkinliğe başvuru yapmak için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo mode, we'll simulate the database operation
      if (isDemo) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
          title: "Başvuru Gönderildi!",
          description:
            "Etkinlik sahibi başvurunuzu inceleyecek ve size geri dönüş yapacak.",
        });
      } else {
        // Real Supabase integration
        const { error } = await supabase.from("requests").insert([
          {
            event_id: event.id,
            user_id: user.id,
            status: "pending",
            message: message || null,
          },
        ]);

        if (error) {
          throw error;
        }

        toast({
          title: "Başvuru Gönderildi!",
          description:
            "Etkinlik sahibi başvurunuzu inceleyecek ve size geri dönüş yapacak.",
        });
      }

      onClose();
      setMessage("");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Hata",
        description:
          "Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Etkinliğe Başvur</DialogTitle>
          <DialogDescription>
            Bu etkinliğe katılmak için başvuru yapıyorsunuz. Etkinlik sahibi
            başvurunuzu inceleyecek.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Info */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-nexus-50 text-nexus-700 dark:bg-nexus-950 dark:text-nexus-300"
                  >
                    {event.category}
                  </Badge>
                  {event.isPremiumEvent && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900">
                      Premium
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-nexus-500" />
                    <span>
                      {formatDate(event.date)} - {formatTime(event.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-nexus-500" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-nexus-500" />
                    <span>
                      {event.participants}
                      {event.maxParticipants &&
                        `/${event.maxParticipants}`}{" "}
                      katılımcı
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Creator */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={event.createdBy.avatar} />
              <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                {event.createdBy.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{event.createdBy.name}</span>
                {event.createdBy.isPremium && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Pro
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">
                  {event.createdBy.rating.toFixed(1)} puan
                </span>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="application-message">
                Başvuru Mesajı (İsteğe bağlı)
              </Label>
              <Textarea
                id="application-message"
                placeholder="Etkinlik sahibine kendini tanıtabilir veya neden katılmak istediğini yazabilirsin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>

            {/* Current User Info */}
            {user && (
              <div className="bg-nexus-50 dark:bg-nexus-950 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Başvuru Sahibi Bilgilerin
                </h4>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{user.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {user.rating.toFixed(1)} puan
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
          >
            {isSubmitting ? "Gönderiliyor..." : "Başvuru Yap"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
