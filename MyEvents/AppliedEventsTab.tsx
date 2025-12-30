import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/UI/card";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Skeleton } from "@/components/UI/skeleton";
import { EventDetailModal } from "@/components/Events/EventDetailModal";
import { EventStatusTag } from "@/components/MyEvents/EventStatusTag";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  MessageCircle,
  CalendarDays,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Hourglass,
} from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { mockAppliedEvents, type MockEvent } from "@/data/mockMyEvents";
import { toast } from "@/hooks/use-toast";

export function AppliedEventsTab() {
  const { user } = useDemoUser();
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { pendingEvents, approvedEvents, rejectedEvents } = useMemo(() => {
    const pending = mockAppliedEvents.filter(
      (event) => event.applicationStatus === "pending",
    );
    const approved = mockAppliedEvents.filter(
      (event) => event.applicationStatus === "approved",
    );
    const rejected = mockAppliedEvents.filter(
      (event) => event.applicationStatus === "rejected",
    );

    return {
      pendingEvents: pending,
      approvedEvents: approved,
      rejectedEvents: rejected,
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAppliedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getApplicationStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: <Hourglass className="h-4 w-4" />,
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          text: "Beklemede",
        };
      case "approved":
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          text: "Onaylandı",
        };
      case "rejected":
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          text: "Reddedildi",
        };
      default:
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
          text: "Bilinmiyor",
        };
    }
  };

  const handleViewDetails = (event: MockEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleCancelApplication = async (
    eventId: string,
    eventTitle: string,
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Başvuru İptal Edildi",
        description: `"${eventTitle}" etkinliği için başvurunuz iptal edildi.`,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Başvuru iptal edilirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEventCard = (event: MockEvent) => {
    const statusInfo = getApplicationStatusInfo(event.applicationStatus || "");

    return (
      <Card key={event.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header with Status */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
              </div>
              <Badge className={`ml-4 ${statusInfo.color}`}>
                {statusInfo.icon}
                <span className="ml-1">{statusInfo.text}</span>
              </Badge>
            </div>

            {/* Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>
                  {event.participants} / {event.maxParticipants || "∞"}{" "}
                  katılımcı
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{event.createdBy.name}</span>
                {event.createdBy.isPremium && (
                  <Badge variant="outline" className="text-xs">
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            {/* Application Info */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>
                  <strong>Başvuru:</strong>{" "}
                  {formatAppliedDate(event.appliedAt || "")}
                </span>
              </div>

              {event.applicationStatus === "approved" && event.approvedAt && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    <strong>Onaylandı:</strong>{" "}
                    {formatAppliedDate(event.approvedAt)}
                  </span>
                </div>
              )}

              {event.applicationStatus === "rejected" && event.rejectedAt && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span>
                      <strong>Reddedildi:</strong>{" "}
                      {formatAppliedDate(event.rejectedAt)}
                    </span>
                  </div>
                  {event.rejectionReason && (
                    <p className="text-xs text-muted-foreground ml-6">
                      <strong>Sebep:</strong> {event.rejectionReason}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDetails(event)}
                className="flex-1"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                Detayları Gör
              </Button>

              {event.applicationStatus === "pending" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCancelApplication(event.id, event.title)}
                  disabled={isLoading}
                  className="flex-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  İptal Et
                </Button>
              )}

              {event.applicationStatus === "approved" && (
                <Button
                  size="sm"
                  onClick={() => handleViewDetails(event)}
                  className="flex-1"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Etkinliğe Git
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (mockAppliedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">
          Henüz Başvuru Yapmamışsınız
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          İlginizi çeken etkinliklere başvurarak yeni deneyimler kazanın ve
          community'ye katılın.
        </p>
        <Button onClick={() => (window.location.href = "/dashboard")}>
          <Calendar className="h-4 w-4 mr-2" />
          Etkinlikleri Keşfet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {pendingEvents.length}
            </div>
            <div className="text-sm text-muted-foreground">Beklemede</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {approvedEvents.length}
            </div>
            <div className="text-sm text-muted-foreground">Onaylandı</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {rejectedEvents.length}
            </div>
            <div className="text-sm text-muted-foreground">Reddedildi</div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {/* Pending Applications */}
        {pendingEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Hourglass className="h-5 w-5 text-yellow-600" />
              Bekleyen Başvurular ({pendingEvents.length})
            </h3>
            <div className="grid gap-4">
              {pendingEvents.map(renderEventCard)}
            </div>
          </div>
        )}

        {/* Approved Applications */}
        {approvedEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Onaylanan Başvurular ({approvedEvents.length})
            </h3>
            <div className="grid gap-4">
              {approvedEvents.map(renderEventCard)}
            </div>
          </div>
        )}

        {/* Rejected Applications */}
        {rejectedEvents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reddedilen Başvurular ({rejectedEvents.length})
            </h3>
            <div className="grid gap-4">
              {rejectedEvents.map(renderEventCard)}
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
