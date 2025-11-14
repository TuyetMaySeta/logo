import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Users, Building2, Target, Sparkles } from "lucide-react";
import { fetchOverviewInfo } from "@/service/overviewService";
import { useEffect, useState } from "react";
import { useCountUp } from "@/utils/countUp.utils";

const WelcomeScreen = () => {
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [activeEmployeesCount, setActiveEmployeesCount] = useState(0);
  const [activeThisWeekCount, setActiveThisWeekCount] = useState(0);

  const animatedProjectsCount = useCountUp(activeProjectsCount, 1000);
  const animatedEmployeesCount = useCountUp(activeEmployeesCount, 2000);
  const animatedThisWeekCount = useCountUp(activeThisWeekCount, 2500);

  // const quickStart = [
  //   {
  //     title: "Create New Employee",
  //     description: "Start by adding new employee information",
  //     action: "Create Now",
  //     route: "/employees/new",
  //   },
  //   {
  //     title: "Create New Project",
  //     description: "Initiate and assign projects to your team",
  //     action: "Create Now",
  //     route: "/projects/new",
  //   },
  //   {
  //     title: "Review Profile Approvals",
  //     description: "Check resumes waiting for approval",
  //     action: "View Now",
  //     route: "/hr/approve",
  //   },
  // ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewInfo = await fetchOverviewInfo();
        setActiveEmployeesCount(overviewInfo.total_employees);
        setActiveProjectsCount(overviewInfo.total_projects);
        setActiveThisWeekCount(overviewInfo.new_employees_last_month);
      } catch (error) {
        console.error("Failed to fetch overview info:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" />
            SETA International
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Welcome to
            <span className="text-primary"> EMS</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Comprehensive Employee Management System - The optimal solution for
            modern enterprises
          </p>
          {/* <div className="flex items-center justify-center gap-4">
            <Button size="lg" className=" gap-2 cursor-pointer">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" className="cursor-pointer" variant="outline">
              Learn More
            </Button>
          </div> */}
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FolderKanban className="w-6 h-6 text-primary" />
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {animatedProjectsCount}
              </div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {animatedEmployeesCount}
              </div>
              <p className="text-sm text-muted-foreground">
                Employees in System
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {animatedThisWeekCount}
              </div>
              <p className="text-sm text-muted-foreground">Active This Month</p>
            </CardContent>
          </Card>
        </div>
        {/* Features Section
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-primary mb-3">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Discover powerful tools that make your work more efficient
          </p>
          <div className="grid grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => {
                    window.location.href = feature.route;
                  }}
                >
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div> */}
        {/* Quick Start Section */}
        {/* <Card className="bg-accent/50">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold  text-primary text-center mb-3">
              Quick Start
            </CardTitle>
            <CardDescription className="text-center text-base">
              Choose one of these common actions to begin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {quickStart.map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-background rounded-xl border-2 hover:border-primary transition-all duration-300 hover:shadow-md"
                >
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {item.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full gap-2 cursor-pointer"
                    onClick={() => {
                      window.location.href = item.route;
                    }}
                  >
                    {item.action}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default WelcomeScreen;
