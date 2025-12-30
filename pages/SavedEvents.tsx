/**
 * Saved Events Page
 * Feature 2: Save Event for Later
 */

import { Layout } from "@/components/Layout/Layout";
import { EventCard } from "@/components/Events/EventCard";
import { Button } from "@/components/UI/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { useSavedEvents } from "@/hooks/useSavedEvents";
import { Bookmark, Trash2, Calendar } from "lucide-react";

export default function SavedEvents() {
  const { savedEvents, clearAllSavedEvents } = useSavedEvents();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-nexus-600" />
                Saved Events
                <span className="text-sm text-muted-foreground font-normal">
                  ({savedEvents.length})
                </span>
              </CardTitle>

              {savedEvents.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllSavedEvents}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Events List */}
        {savedEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No saved events</h3>
              <p className="text-muted-foreground mb-6">
                Start saving events you're interested in by clicking the
                bookmark icon on event cards.
              </p>
              <Button asChild>
                <a href="/dashboard">
                  <Calendar className="h-4 w-4 mr-2" />
                  Browse Events
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedEvents.map((event) => (
              <div key={event.id} className="relative">
                <EventCard event={event} className="h-full" />

                {/* Saved Date Badge */}
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Saved {new Date(event.savedAt).toLocaleDateString("tr-TR")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        {savedEvents.length > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bookmark className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    About Saved Events
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Events you save here are stored locally on your device. You
                    can apply to them later or share them with friends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
