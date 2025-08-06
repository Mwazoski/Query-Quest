"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Database, 
  BarChart3, 
  Settings, 
  Shield, 
  Home,
  Menu,
  X,
  Landmark,
  MessageSquare,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // For demo purposes, using user ID 1 - in a real app, this would come from authentication
  const userId = 1;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Check if user is admin, if not redirect to main page
        if (!userData.isAdmin) {
          window.location.href = "/main";
        }
      } else {
        // If user not found or not admin, redirect to main page
        window.location.href = "/main";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      window.location.href = "/main";
    } finally {
      setIsLoading(false);
    }
  };

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      title: "Users Management",
      href: "/admin/users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Challenges",
      href: "/admin/challenges",
      icon: <Database className="h-4 w-4" />,
    },
    {
      title: "Institutions",
      href: "/admin/institutions",
      icon: <Landmark className="h-4 w-4" />,
    },
    {
      title: "Contact Requests",
      href: "/admin/contact-requests",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">You don&apos;t have permission to access the admin panel.</p>
            <Button asChild>
              <Link href="/main">Go to Main Page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Admin Panel</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link href="/main" className="flex items-center space-x-3">
                <Home className="h-4 w-4" />
                <span>Back to Main</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen bg-gray-50">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome back, {user.name}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 