/**
 * Hook for managing saved events
 * Feature 2: Save Event for Later
 */

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDemoUser } from "@/contexts/DemoUserContext";

export interface SavedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  createdBy: {
    name: string;
    avatar?: string;
    rating: number;
    isPremium: boolean;
  };
  participants: number;
  maxParticipants?: number;
  isPremiumEvent?: boolean;
  savedAt: string;
}

const SAVED_EVENTS_KEY = "nexus-saved-events";

export function useSavedEvents() {
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const { user, isDemo } = useDemoUser();

  // Load saved events from localStorage on mount
  useEffect(() => {
    if (isDemo) {
      const saved = localStorage.getItem(SAVED_EVENTS_KEY);
      if (saved) {
        try {
          setSavedEvents(JSON.parse(saved));
        } catch (error) {
          console.error("Error loading saved events:", error);
        }
      }
    }
  }, [isDemo]);

  // Save to localStorage whenever savedEvents changes
  useEffect(() => {
    if (isDemo) {
      localStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEvents));
    }
  }, [savedEvents, isDemo]);

  const saveEvent = async (event: Omit<SavedEvent, "savedAt">) => {
    try {
      const savedEvent: SavedEvent = {
        ...event,
        savedAt: new Date().toISOString(),
      };

      if (isDemo) {
        // Demo mode: use localStorage
        setSavedEvents((prev) => {
          const exists = prev.find((e) => e.id === event.id);
          if (exists) {
            toast({
              title: "Already saved",
              description: "This event is already in your saved list",
            });
            return prev;
          }

          toast({
            title: "Saved to your list",
            description: `${event.title} has been saved for later`,
          });

          return [savedEvent, ...prev];
        });
      } else {
        // In production: save to Supabase
        // const { error } = await supabase
        //   .from('saved_events')
        //   .insert({
        //     user_id: user?.id,
        //     event_id: event.id,
        //     event_data: savedEvent,
        //   });

        setSavedEvents((prev) => [savedEvent, ...prev]);
        toast({
          title: "Saved to your list",
          description: `${event.title} has been saved for later`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to save event",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const unsaveEvent = async (eventId: string) => {
    try {
      if (isDemo) {
        // Demo mode: remove from state
        setSavedEvents((prev) => {
          const filtered = prev.filter((e) => e.id !== eventId);
          const removedEvent = prev.find((e) => e.id === eventId);

          if (removedEvent) {
            toast({
              title: "Removed from saved",
              description: `${removedEvent.title} has been removed from your saved list`,
            });
          }

          return filtered;
        });
      } else {
        // In production: remove from Supabase
        // const { error } = await supabase
        //   .from('saved_events')
        //   .delete()
        //   .eq('user_id', user?.id)
        //   .eq('event_id', eventId);

        setSavedEvents((prev) => prev.filter((e) => e.id !== eventId));
      }
    } catch (error) {
      toast({
        title: "Failed to remove event",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const isEventSaved = (eventId: string): boolean => {
    return savedEvents.some((e) => e.id === eventId);
  };

  const clearAllSavedEvents = () => {
    setSavedEvents([]);
    if (isDemo) {
      localStorage.removeItem(SAVED_EVENTS_KEY);
    }
    toast({
      title: "All saved events cleared",
      description: "Your saved events list has been cleared",
    });
  };

  return {
    savedEvents,
    saveEvent,
    unsaveEvent,
    isEventSaved,
    clearAllSavedEvents,
  };
}
