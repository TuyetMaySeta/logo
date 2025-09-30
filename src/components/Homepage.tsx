import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {  Users, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Pages ---
export function HomePage() {
  return (
    <div className="p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className={cn("text-4xl font-bold text-primary")}>Employee Management System</h1>
        
      </header>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and manage all employees.</p>
            <Button asChild variant="outline" className="mt-4">
              <a href="/employees">Go to Employees</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage departments and teams.</p>
            <Button asChild variant="outline" className="mt-4">
              <a href="/departments">Go to Departments</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" /> Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>View employee reports and analytics.</p>
            <Button asChild variant="outline" className="mt-4">
              <a href="/reports">View Reports</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




