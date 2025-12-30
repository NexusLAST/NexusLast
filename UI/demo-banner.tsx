import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlayCircle, X, Info } from "lucide-react";
import { useDemoUser } from "@/contexts/DemoUserContext";
import { useState } from "react";

export function DemoBanner() {
  const { isDemo, logout } = useDemoUser();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isDemo || isDismissed) {
    return null;
  }

  return (
    <Alert className="bg-nexus-50 border-nexus-200 dark:bg-nexus-950 dark:border-nexus-800">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4" />
          <span>
            <strong>Demo Moddasınız</strong> - Tüm özellikler kullanılabilir,
            ancak veriler gerçek değil.
          </span>
          <Badge variant="outline" className="ml-2">
            Demo
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-nexus-600 hover:text-nexus-700"
          >
            Demo'dan Çık
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
