/**
 * Share Event Modal Component
 * Feature 1: Event Share Button
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { toast } from "@/hooks/use-toast";
import {
  Share2,
  Copy,
  MessageCircle,
  Twitter,
  Instagram,
  Link,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
  };
}

export function ShareModal({ isOpen, onOpenChange, event }: ShareModalProps) {
  const [copying, setCopying] = useState(false);

  // Demo mode: use static URL, in production this would be dynamic
  const eventUrl = `https://nexus.app/event/${event.id}`;

  const shareText = `🎉 Check out this event: ${event.title}\n📅 ${new Date(event.date).toLocaleDateString("tr-TR")}\n📍 ${event.location}`;

  const copyToClipboard = async () => {
    try {
      setCopying(true);
      await navigator.clipboard.writeText(eventUrl);
      toast({
        title: "Link copied!",
        description: "Event link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
    }
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + eventUrl)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  const shareToInstagram = () => {
    // Instagram doesn't support direct URL sharing, so we copy to clipboard
    const instagramText = `${shareText}\n\nLink: ${eventUrl}`;
    navigator.clipboard.writeText(instagramText);
    toast({
      title: "Copied for Instagram",
      description: "Content copied! Paste it in Instagram DM",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Etkinliği Paylaş
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Link Copy Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Link</label>
            <div className="flex items-center gap-2">
              <Input value={eventUrl} readOnly className="flex-1" />
              <Button
                size="sm"
                onClick={copyToClipboard}
                disabled={copying}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
                {copying ? "Copying..." : "Copy"}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share to</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={shareToWhatsApp}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <span className="text-xs">WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                onClick={shareToTwitter}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Twitter className="h-5 w-5 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>

              <Button
                variant="outline"
                onClick={shareToInstagram}
                className="flex flex-col items-center gap-1 h-auto py-3"
              >
                <Instagram className="h-5 w-5 text-pink-600" />
                <span className="text-xs">Instagram</span>
              </Button>
            </div>
          </div>

          {/* Event Preview */}
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
            <p className="text-xs text-muted-foreground mb-2">
              {event.description.substring(0, 100)}...
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>📅 {new Date(event.date).toLocaleDateString("tr-TR")}</span>
              <span>📍 {event.location}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
