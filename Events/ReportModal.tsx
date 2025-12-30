/**
 * Report Event Modal Component
 * Feature 3: Report Event Button
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import { Label } from "@/components/UI/label";
import { RadioGroup, RadioGroupItem } from "@/components/UI/radio-group";
import { Textarea } from "@/components/UI/textarea";
import { toast } from "@/hooks/use-toast";
import { Flag, AlertTriangle } from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";

interface ReportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    title: string;
  };
}

const reportReasons = [
  { value: "spam", label: "Spam or promotional content" },
  { value: "inappropriate", label: "Inappropriate content" },
  { value: "fake", label: "Fake or misleading event" },
  { value: "harassment", label: "Harassment or abuse" },
  { value: "copyright", label: "Copyright violation" },
  { value: "other", label: "Other" },
];

export function ReportModal({ isOpen, onOpenChange, event }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isDemo } = useDemoUser();

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast({
        title: "Please select a reason",
        description: "You must select a reason for reporting this event",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isDemo) {
        // Demo mode: simulate submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast({
          title: "Report submitted",
          description: "Thank you for your report. We'll review it shortly.",
        });
      } else {
        // In production, this would submit to Supabase
        // const { error } = await supabase
        //   .from('reports')
        //   .insert({
        //     event_id: event.id,
        //     user_id: user?.id,
        //     reason: selectedReason,
        //     additional_info: additionalInfo,
        //   });

        toast({
          title: "Report submitted",
          description: "Thank you for your report. We'll review it shortly.",
        });
      }

      onOpenChange(false);
      setSelectedReason("");
      setAdditionalInfo("");
    } catch (error) {
      toast({
        title: "Failed to submit report",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5 text-red-500" />
            Report Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Why are you reporting "{event.title}"?
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                Please select the most appropriate reason below.
              </p>
            </div>
          </div>

          {/* Report Reasons */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Reason for reporting</Label>
            <RadioGroup
              value={selectedReason}
              onValueChange={setSelectedReason}
            >
              {reportReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label
                    htmlFor={reason.value}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additional-info" className="text-sm font-medium">
              Additional information (optional)
            </Label>
            <Textarea
              id="additional-info"
              placeholder="Please provide any additional details that might help us understand the issue..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
