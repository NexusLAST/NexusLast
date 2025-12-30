import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout/Layout";
import { JoinedEventsTab } from "@/components/MyEvents/JoinedEventsTab";
import { CreatedEventsTab } from "@/components/MyEvents/CreatedEventsTab";
import { Users, Calendar } from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";

export default function MyEvents() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useDemoUser();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Giriş Yapın</h3>
              <p className="text-muted-foreground">
                Etkinliklerinizi görmek için giriş yapmanız gerekiyor.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Etkinliklerim</h1>
            <p className="text-muted-foreground mt-2">
              Katıldığınız ve oluşturduğunuz etkinlikleri yönetin
            </p>
          </div>

          <Tabs defaultValue="joined" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="joined" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Katıldıklarım
              </TabsTrigger>
              <TabsTrigger value="created" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Oluşturduklarım
              </TabsTrigger>
            </TabsList>

            <TabsContent value="joined" className="mt-6">
              <JoinedEventsTab />
            </TabsContent>

            <TabsContent value="created" className="mt-6">
              <CreatedEventsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
