import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Smile, Paperclip, MoreVertical } from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isRead: boolean;
}

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

interface ChatInterfaceProps {
  friend: Friend;
}

// Mock messages for demo
const generateMockMessages = (
  friendId: string,
  friendName: string,
): Message[] => [
  {
    id: "1",
    senderId: "demo-user-id",
    senderName: "Demo Kullanıcı",
    content: "Merhaba! Startup networking etkinliğinde tanıştık sanırım 😊",
    timestamp: "2024-02-12T10:30:00",
    type: "text",
    isRead: true,
  },
  {
    id: "2",
    senderId: friendId,
    senderName: friendName,
    content:
      "Evet evet! Çok keyifli bir etkinlikti. Projeniz hakkında daha fazla konuşmak isterim.",
    timestamp: "2024-02-12T10:32:00",
    type: "text",
    isRead: true,
  },
  {
    id: "3",
    senderId: "demo-user-id",
    senderName: "Demo Kullanıcı",
    content: "Harika! Yarın da bir React workshop'u var, ilgin var mı?",
    timestamp: "2024-02-12T10:35:00",
    type: "text",
    isRead: true,
  },
  {
    id: "4",
    senderId: friendId,
    senderName: friendName,
    content: "Kesinlikle! Detayları paylaşabilir misin?",
    timestamp: "2024-02-12T10:37:00",
    type: "text",
    isRead: true,
  },
  {
    id: "5",
    senderId: "demo-user-id",
    senderName: "Demo Kullanıcı",
    content: "Tabii ki! Link göndereyim sana.",
    timestamp: "2024-02-12T10:38:00",
    type: "text",
    isRead: false,
  },
];

export function ChatInterface({ friend }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() =>
    generateMockMessages(friend.id, friend.name),
  );
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useDemoUser();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate friend typing
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        setIsTyping(Math.random() > 0.7); // Random typing indicator
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setIsSending(true);

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      isRead: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSending(false);

    // Simulate friend response (randomly)
    if (Math.random() > 0.3) {
      setTimeout(() => {
        setIsTyping(true);

        setTimeout(() => {
          const responses = [
            "Harika! Bunu duyduğuma sevindim 😊",
            "Kesinlikle katılıyorum!",
            "Bu konuda daha fazla konuşalım.",
            "Çok ilginç, daha detay verebilir misin?",
            "Evet, bu güzel bir fikir!",
            "Hmmm, bu konuda düşünmem lazım.",
            "Haklısın, ben de öyle düşünüyorum.",
          ];

          const friendResponse: Message = {
            id: `msg-${Date.now()}-friend`,
            senderId: friend.id,
            senderName: friend.name,
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date().toISOString(),
            type: "text",
            isRead: true,
          };

          setMessages((prev) => [...prev, friendResponse]);
          setIsTyping(false);
        }, 1500);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Bugün";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Dün";
    } else {
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
      });
    }
  };

  const MessageBubble = ({ message }: { message: Message }) => {
    const isOwnMessage = message.senderId === user?.id;

    return (
      <div
        className={cn(
          "flex gap-3 mb-4",
          isOwnMessage ? "justify-end" : "justify-start",
        )}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={friend.avatar} />
            <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300 text-xs">
              {friend.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            "max-w-[70%] space-y-1",
            isOwnMessage ? "items-end" : "items-start",
          )}
        >
          <div
            className={cn(
              "px-4 py-2 rounded-lg text-sm",
              isOwnMessage
                ? "bg-nexus-600 text-white rounded-br-none"
                : "bg-muted rounded-bl-none",
            )}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>

          <div
            className={cn(
              "flex items-center gap-1 text-xs text-muted-foreground",
              isOwnMessage ? "justify-end" : "justify-start",
            )}
          >
            <span>{formatTime(message.timestamp)}</span>
            {isOwnMessage && <span>{message.isRead ? "✓✓" : "✓"}</span>}
          </div>
        </div>

        {isOwnMessage && (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300 text-xs">
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
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

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{friend.name}</h3>
              {friend.isPremium && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  Pro
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {friend.isOnline
                ? "Çevrimiçi"
                : `Son aktif: ${friend.lastActive}`}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Date separator */}
          <div className="flex items-center justify-center">
            <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
              {formatDate(messages[0]?.timestamp || new Date().toISOString())}
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 mb-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="bg-nexus-100 text-nexus-700 dark:bg-nexus-900 dark:text-nexus-300 text-xs">
                  {friend.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="bg-muted rounded-lg rounded-bl-none px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Mesajınızı yazın..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
