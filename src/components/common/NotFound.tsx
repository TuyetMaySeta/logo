import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "@tanstack/react-router";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* 404 Number */}
            <div className="space-y-2">
              <h1 className="text-6xl md:text-8xl font-bold text-primary">
                404
              </h1>
              <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
            </div>

            {/* Error Message */}
            <Alert className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-center">
                <strong>Page Not Found</strong>
                <br />
                The page you're looking for doesn't exist or has been moved.
              </AlertDescription>
            </Alert>

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

            {/* Additional Help */}
            <p className="text-sm text-muted-foreground pt-2">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}