import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  Users,
  Plus,
  FileText,
  FolderOpen,
  UsersRound,
  Calendar,
  UserPlus,
  Settings,
  FileCheck,
  BarChart3,
} from "lucide-react";
import { protectedPage } from "./auth/AuthWrapper";

const EmployeeOverview = () => {
  const projects = [
    {
      title: "Website Redesign",
      members: 5,
      dueDate: "Due 2/15/2024",
      status: "In Progress",
    },
    {
      title: "Mobile App",
      members: 3,
      dueDate: "Due 3/1/2024",
      status: "Planning",
    },
    {
      title: "HR System Upgrade",
      members: 4,
      dueDate: "Due 2/28/2024",
      status: "Review",
    },
  ];

  const recentActivities = [
    {
      user: "Bob",
      action: 'created Project "Website Redesign"',
      time: "2 hours ago",
      icon: FolderOpen,
    },
    {
      user: "Alice",
      action: 'joined Project "Mobile App"',
      time: "4 hours ago",
      icon: UserPlus,
    },
    {
      user: "Carol",
      action: "updated Org Settings",
      time: "1 day ago",
      icon: Settings,
    },
    {
      user: "David",
      action: 'submitted CV for review "Backend Developer position"',
      time: "2 days ago",
      icon: FileText,
    },
    {
      user: "Emily",
      action: 'approved CV for "Sarah Johnson"',
      time: "3 days ago",
      icon: FileCheck,
    },
  ];

  const quickActions = [
    { label: "Create Employee Profile", icon: Plus },
    { label: "Review CVs", icon: FileText },
    { label: "Manage Projects", icon: FolderOpen },
    { label: "View All Employees", icon: UsersRound },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening in your organization.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FolderKanban className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Employees</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">85</div>
              <p className="text-xs text-muted-foreground mt-1">
                +5 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  Active this week
                </CardTitle>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">34</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects and Recent Activity */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* My Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">My Projects</CardTitle>
                  <CardDescription>
                    Projects you're actively involved in
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{project.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.dueDate}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{project.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <activity.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.action}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you might want to perform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs text-center">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default protectedPage(EmployeeOverview);
