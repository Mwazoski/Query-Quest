"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LevelBadge from "@/components/LevelBadge";
import { 
  Users, 
  Database, 
  Trophy, 
  TrendingUp, 
  Activity,
  Plus,
  Eye,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, challengesRes, institutionsRes, contactRequestsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/challenges`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/institutions`),
          fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/contact-requests`)
        ]);

        const usersData = await usersRes.json();
        const challengesData = await challengesRes.json();
        const institutionsData = await institutionsRes.json();
        const contactRequestsData = await contactRequestsRes.json();

        setUsers(usersData);
        setChallenges(challengesData);
        setInstitutions(institutionsData);
        setContactRequests(contactRequestsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const totalChallenges = challenges.length;
  const totalInstitutions = institutions.length;
  const totalContactRequests = contactRequests.length;
  const pendingContactRequests = contactRequests.filter(req => req.status === 'pending').length;
  const activeUsers = users.filter(user => user.solvedChallenges > 0).length;
  const totalPoints = users.reduce((sum, user) => sum + user.points, 0);
  const avgPoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      description: "Registered users",
      icon: <Users className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: activeUsers,
      description: "Users with solved challenges",
      icon: <Activity className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Challenges",
      value: totalChallenges,
      description: "Available challenges",
      icon: <Database className="h-4 w-4" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Institutions",
      value: totalInstitutions,
      description: "Registered institutions",
      icon: <Trophy className="h-4 w-4" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Contact Requests",
      value: totalContactRequests,
      description: `${pendingContactRequests} pending`,
      icon: <MessageSquare className="h-4 w-4" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  const recentUsers = users.slice(0, 5);
  const recentChallenges = challenges.slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Overview of your platform&apos;s performance and user activity
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/admin/users">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Link>
          </Button>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/admin/challenges">
              <Database className="h-4 w-4 mr-2" />
              Manage Challenges
            </Link>
          </Button>
          {pendingContactRequests > 0 && (
            <Button asChild size="sm" variant="destructive" className="w-full sm:w-auto">
              <Link href="/admin/contact-requests">
                <MessageSquare className="h-4 w-4 mr-2" />
                Review Requests ({pendingContactRequests})
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <div className={stat.color}>{stat.icon}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Platform Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Points per User</span>
              <Badge variant="secondary">{avgPoints}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Points Earned</span>
              <Badge variant="secondary">{totalPoints}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">User Engagement Rate</span>
              <Badge variant="secondary">
                {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start text-sm">
              <Link href="/admin/users">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-sm">
              <Link href="/admin/challenges">
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start text-sm">
              <Link href="/admin/institutions">
                <Plus className="h-4 w-4 mr-2" />
                Add Institution
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.solvedChallenges} challenges solved • {user.points} points
                    </p>
                  </div>
                  <Badge variant={user.isAdmin ? "destructive" : user.isTeacher ? "default" : "secondary"} className="w-fit">
                    {user.isAdmin ? "Admin" : user.isTeacher ? "Teacher" : "Student"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/users">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Users
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Challenges</CardTitle>
            <CardDescription>Latest created challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentChallenges.map((challenge) => (
                <div key={challenge.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <LevelBadge level={challenge.level} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {challenge.solves} solves • {challenge.score} points
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit">{challenge.score} pts</Badge>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/challenges">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Challenges
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 