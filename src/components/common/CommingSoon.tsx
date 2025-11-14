import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "@tanstack/react-router";
import { Home, Rocket, Clock, Bell } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Icon and Title */}
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <Rocket className="h-16 w-16 md:h-20 md:w-20 text-primary relative animate-pulse" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Coming Soon
              </h1>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            </div>

            {/* Description Alert */}
            <Alert className="border-primary/50 bg-primary/5">
              <Clock className="h-4 w-4" />
              <AlertDescription className="text-center">
                <strong>We're working on something awesome!</strong>
                <br />
                This feature is currently under development and will be available soon.
              </AlertDescription>
            </Alert>

            {/* Features Preview */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                What to expect:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Enhanced user experience</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Powerful new features</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Improved performance</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/" onClick={() => window.history.back()}>
                  Go Back
                </Link>
              </Button>
            </div>

            {/* Notification Option */}
            <div className="pt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Bell className="mr-2 h-4 w-4" />
                Notify me when ready
              </Button>
            </div>

            {/* Footer Text */}
            <p className="text-xs text-muted-foreground pt-2">
              Stay tuned for updates. We'll launch this feature very soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}