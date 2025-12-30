import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Star, Send, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApplicationFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
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
  onSubmit: (message: string) => Promise<void>;
}

export function EventApplicationForm({
  event,
  isOpen,
  onClose,
  onSubmit,
}: ApplicationFormProps) {
  const [introMessage, setIntroMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const maxCharacters = 500;
  const minCharacters = 20;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMessageChange = (value: string) => {
    if (value.length <= maxCharacters) {
      setIntroMessage(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = async () => {
    if (introMessage.length < minCharacters) {
      toast({
        title: "Mesaj Çok Kısa",
        description: `Lütfen en az ${minCharacters} karakter yazın.`,
        variant: "destructive",
      });
      return;
    }

    if (introMessage.length > maxCharacters) {
      toast({
        title: "Mesaj Çok Uzun",
        description: `Mesaj ${maxCharacters} karakteri geçemez.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(introMessage);
      setIntroMessage("");
      setCharCount(0);
      onClose();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Başvuru gönderilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIntroMessage("");
    setCharCount(0);
    onClose();
  };

  const getCharCountColor = () => {
    if (charCount < minCharacters) return "text-red-500";
    if (charCount > maxCharacters * 0.8) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Etkinliğe Başvuru Yap
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Summary */}
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={event.createdBy.avatar} />
                <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300">
                  {event.createdBy.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{event.createdBy.name}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{event.createdBy.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Badge variant="secondary">{event.category}</Badge>
                {event.isPremiumEvent && (
                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-nexus-600" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-nexus-600" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-nexus-600" />
                <span>
                  {event.participants}/{event.maxParticipants || "∞"}
                </span>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="intro-message" className="text-base font-medium">
                Kendini Tanıt
              </Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Etkinlik organizatörüne kendin hakkında kısa bilgi ver. Neden bu
                etkinliğe katılmak istiyorsun?
              </p>
            </div>

            <div className="space-y-2">
              <Textarea
                id="intro-message"
                placeholder="Merhaba! Ben [ismin], [yaş] yaşındayım ve [ilgi alanların/mesleğin] ile ilgileniyorum. Bu etkinliğe katılmak istiyorum çünkü..."
                value={introMessage}
                onChange={(e) => handleMessageChange(e.target.value)}
                className="min-h-[120px] resize-none"
                disabled={isSubmitting}
              />

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  Minimum {minCharacters} karakter gerekli
                </span>
                <span className={`font-medium ${getCharCountColor()}`}>
                  {charCount}/{maxCharacters}
                </span>
              </div>
            </div>

            {/* Example Messages */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Örnek mesajlar:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  • "Yeni başlayan bir developer olarak deneyim kazanmak
                  istiyorum."
                </li>
                <li>
                  • "Bu konuda bilgilerimi artırmak ve yeni insanlarla tanışmak
                  için."
                </li>
                <li>
                  • "Startup dünyasına yeni girdim, network kurma fırsatı
                  arıyorum."
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || charCount < minCharacters}
              className="flex-1 bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Başvuru Gönder
                </>
              )}
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="text-xs text-muted-foreground text-center p-2 bg-muted/20 rounded">
            <User className="h-3 w-3 inline mr-1" />
            Tanıtım mesajın sadece etkinlik organizatörü tarafından görülecek
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
