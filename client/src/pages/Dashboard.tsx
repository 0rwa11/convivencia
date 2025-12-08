import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart3, Users, Calendar, FileText, LogOut, Settings } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/login");
  };

  const menuItems = [
    {
      title: "Evaluations",
      description: "Record and track evaluations",
      icon: FileText,
      href: "/evaluations",
      color: "bg-blue-500",
    },
    {
      title: "Groups",
      description: "Manage participant groups",
      icon: Users,
      href: "/groups",
      color: "bg-green-500",
    },
    {
      title: "Sessions",
      description: "Schedule and track sessions",
      icon: Calendar,
      href: "/sessions",
      color: "bg-purple-500",
    },
    {
      title: "Analytics",
      description: "View statistics and reports",
      icon: BarChart3,
      href: "/analytics",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Convivencia
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Intercultural Coexistence Program
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name || user.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user.role}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, {user.name || user.username}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your evaluations and track program progress
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.href}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setLocation(item.href)}
              >
                <CardHeader>
                  <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Admin Section */}
        {user.role === "admin" && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle>Administration</CardTitle>
              </div>
              <CardDescription>
                Manage users and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => setLocation("/admin/users")}
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
