import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FollowBusinessButtonProps {
  business: {
    id: string;
    name: string;
    type: "user" | "business";
  };
  isFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

export function FollowBusinessButton({
  business,
  isFollowing = false,
  onFollowChange,
  size = "sm",
  variant = "outline",
  className = "",
}: FollowBusinessButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [following, setFollowing] = useState(isFollowing);

  // Only show for business accounts
  if (business.type !== "business") {
    return null;
  }

  const handleToggleFollow = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newFollowingState = !following;
      setFollowing(newFollowingState);

      if (onFollowChange) {
        onFollowChange(newFollowingState);
      }

      toast({
        title: newFollowingState ? "Takip Edildi!" : "Takip Bırakıldı",
        description: newFollowingState
          ? `${business.name} işletmesini takip ediyorsunuz. Yeni etkinlikleri hakkında bildirim alacaksınız.`
          : `${business.name} işletmesini takip etmeyi bıraktınız.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Takip işlemi gerçekleştirilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleToggleFollow}
      disabled={isProcessing}
      className={`${className} ${following ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-800" : ""}`}
    >
      {isProcessing ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
      ) : following ? (
        <>
          <UserCheck className="h-4 w-4 mr-2" />
          Takip Ediliyor
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          <Building2 className="h-3 w-3 mr-1" />
          Takip Et
        </>
      )}
    </Button>
  );
}
