import { useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { EventList } from "@/components/Events/EventList";
import { LoadMoreEvents } from "@/components/Dashboard/LoadMoreEvents";

import { DynamicRecommendations } from "@/components/Dashboard/DynamicRecommendations";
import { TodayScheduleModal } from "@/components/Dashboard/TodayScheduleModal";
import { FriendRequestsModal } from "@/components/Dashboard/FriendRequestsModal";
import { PremiumPlansModal } from "@/components/Dashboard/PremiumPlansModal";
import { PostEventFriendSuggestions } from "@/components/Events/PostEventFriendSuggestions";
import { PostEventFeedbackForm } from "@/components/Events/PostEventFeedbackForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Plus,
  Calendar,
  Users,
  Star,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { mockEvents } from "@/data/mockData";

// Use the first few events from mock data for dashboard
const initialDashboardEvents = mockEvents.slice(0, 6).map((event) => ({
  id: event.id,
  title: event.title,
  description: event.description,
  date: event.date,
  location: event.location,
  createdBy: {
    name: event.createdBy.name,
    rating: event.createdBy.rating,
    isPremium: event.createdBy.isPremium,
  },
  participants: event.participants,
  maxParticipants: event.maxParticipants,
  category: event.category,
  isPremiumEvent: event.isPremiumEvent,
}));

const stats = [
  {
    label: "Katıldığın Etkinlik",
    value: "12",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    label: "Oluşturdu��un Etkinlik",
    value: "3",
    icon: Plus,
    color: "text-green-600",
  },
  { label: "Yeni Arkadaş", value: "28", icon: Users, color: "text-purple-600" },
  {
    label: "Ortalama Puanın",
    value: "4.7",
    icon: Star,
    color: "text-yellow-600",
  },
];

export default function Dashboard() {
  const { user, isDemo } = useDemoUser();
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [friendRequestsModalOpen, setFriendRequestsModalOpen] = useState(false);
  const [premiumPlansModalOpen, setPremiumPlansModalOpen] = useState(false);
  const [postEventModalOpen, setPostEventModalOpen] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <Card>
            <CardContent className="pt-8">
              <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-4">Dashboard'a Erişim</h2>
              <p className="text-muted-foreground mb-6">
                Dashboard'ı kullanmak için önce giriş yapmanız gerekiyor.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/login">
                  <Button>Giriş Yap</Button>
                </Link>
                <Link to="/">
                  <Button variant="outline">Ana Sayfaya Dön</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-nexus-500 to-nexus-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Hoş geldin, {user.name}! 👋
              </h1>
              <p className="text-nexus-100 text-lg">
                {isDemo
                  ? "Demo modunda etkinlikleri keşfet"
                  : "Bugün seni bekleyen harika etkinlikler var"}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/create-event">
                <Button
                  size="lg"
                  className="bg-white text-nexus-600 hover:bg-nexus-50"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Etkinlik Oluştur
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Post-Event Button */}
        {isDemo && (
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">🎉 Etkinlik Tamamlandı!</h3>
                <p className="text-sm text-muted-foreground">
                  "React Workshop" etkinliği sona erdi. Diğer katılımcılarla
                  arkadaş olun!
                </p>
              </div>
              <Button
                onClick={() => setPostEventModalOpen(true)}
                className="bg-gradient-to-r from-nexus-500 to-nexus-600 hover:from-nexus-600 hover:to-nexus-700"
              >
                Katılımcıları Gör
              </Button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">
                    {stat.label === "Ortalama Puanın"
                      ? user.rating.toFixed(1)
                      : stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={() => setScheduleModalOpen(true)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
                <Calendar className="h-5 w-5 text-nexus-600" />
                Bugünkü Etkinlikler
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Bugün katılacağın 2 etkinlik var
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:bg-nexus-50 group-hover:border-nexus-300 transition-colors"
              >
                Programını Gör
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={() => setFriendRequestsModalOpen(true)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
                <Users className="h-5 w-5 text-nexus-600" />
                Arkadaş İstekleri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                4 yeni arkadaş isteğin var
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full group-hover:bg-nexus-50 group-hover:border-nexus-300 transition-colors"
              >
                İstekleri Gör
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            onClick={() => setPremiumPlansModalOpen(true)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
                <TrendingUp className="h-5 w-5 text-nexus-600" />
                {user.isPremium ? "Premium Planları" : "Premium'a Geç"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {user.isPremium
                  ? "Plan detaylarını gör ve değiştir"
                  : "Sınırsız özellikler için"}
              </p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-nexus-500 to-nexus-600 group-hover:from-nexus-600 group-hover:to-nexus-700 transition-all"
              >
                {user.isPremium ? "Planları Gör" : "Keşfet"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Events Section */}
        <div className="space-y-8">
          <DynamicRecommendations maxItems={6} />
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Tüm Etkinlikler</h2>
            </div>
            <LoadMoreEvents
              initialEvents={initialDashboardEvents}
              pageSize={6}
              showCloneButton={false}
            />
          </div>
        </div>

        {/* Modals */}
        <TodayScheduleModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
        />

        <FriendRequestsModal
          isOpen={friendRequestsModalOpen}
          onClose={() => setFriendRequestsModalOpen(false)}
        />

        <PremiumPlansModal
          isOpen={premiumPlansModalOpen}
          onClose={() => setPremiumPlansModalOpen(false)}
        />

        <PostEventFriendSuggestions
          isOpen={postEventModalOpen}
          onClose={() => setPostEventModalOpen(false)}
          eventTitle="React Workshop"
          eventId="demo-event-1"
        />
      </div>
    </Layout>
  );
}
