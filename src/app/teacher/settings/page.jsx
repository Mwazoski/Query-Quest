"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ActivityTable from "@/components/ActivityTable";
import { 
  Settings, 
  BarChart3, 
  Users, 
  Book,
  TrendingUp,
  Award,
  Eye,
  Download
} from "lucide-react";
import Link from "next/link";

export default function TeacherSettings() {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averagePoints: 0,
    totalChallenges: 0,
    engagementRate: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeacherData = useCallback(async () => {
    try {
      // Fetch teacher data (using user ID 1 for demo)
      const userId = 1;
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch analytics data
        if (userData.institution_id) {
          await fetchAnalytics(userData.institution_id);
        }
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const fetchAnalytics = async (institutionId) => {
    try {
      // Fetch students from the same institution
      const studentsResponse = await fetch("/api/users");
      const allUsers = studentsResponse.ok ? await studentsResponse.json() : [];
      
      // Filter for students from the same institution
      const students = allUsers.filter(user => 
        user.institution_id === institutionId && 
        !user.isTeacher && 
        !user.isAdmin
      );
      
      // Calculate analytics
      const totalStudents = students.length;
      const activeStudents = students.filter(s => s.solvedChallenges > 0).length;
      const averagePoints = totalStudents > 0 
        ? Math.round(students.reduce((sum, s) => sum + s.points, 0) / totalStudents)
        : 0;
      const engagementRate = totalStudents > 0 
        ? Math.round((activeStudents / totalStudents) * 100)
        : 0;
      
      // Fetch challenges
      const challengesResponse = await fetch("/api/challenges");
      const challenges = challengesResponse.ok ? await challengesResponse.json() : [];
      
      setAnalytics({
        totalStudents,
        activeStudents,
        averagePoints,
        totalChallenges: challenges.length,
        engagementRate,
      });
      
      // Generate mock recent activity
      setRecentActivity([
        { id: 'recent-1', type: 'student', action: 'completed challenge', student: 'John Doe', challenge: 'SQL Basics', time: '2 hours ago' },
        { id: 'recent-2', type: 'student', action: 'earned points', student: 'Jane Smith', points: 150, time: '4 hours ago' },
        { id: 'recent-3', type: 'system', action: 'new challenge available', challenge: 'Advanced Queries', time: '1 day ago' },
        { id: 'recent-4', type: 'student', action: 'joined platform', student: 'Mike Johnson', time: '2 days ago' },
      ]);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleExportData = async () => {
    try {
      // In a real app, you'd generate and download a CSV/Excel file
      console.log("Exporting teacher data...");
      alert("Data export functionality would be implemented here");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Teacher Settings & Analytics</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Manage your preferences and view detailed analytics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/teacher">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <p className="text-2xl font-bold">{analytics.totalStudents}</p>
            <p className="text-xs text-muted-foreground">
              {analytics.activeStudents} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Book className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Available Challenges</span>
            </div>
            <p className="text-2xl font-bold">{analytics.totalChallenges}</p>
            <p className="text-xs text-muted-foreground">
              For your students
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Average Points</span>
            </div>
            <p className="text-2xl font-bold">{analytics.averagePoints}</p>
            <p className="text-xs text-muted-foreground">
              Per student
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Engagement Rate</span>
            </div>
            <p className="text-2xl font-bold">{analytics.engagementRate}%</p>
            <p className="text-xs text-muted-foreground">
              Students participating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest activities from your students and system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTable 
            activities={recentActivity}
            showFooter={true}
            footerLink={
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="/teacher/activity">
                  <Eye className="h-4 w-4 mr-2" />
                  View All Activity Logs
                </Link>
              </Button>
            }
            emptyMessage="No recent activity"
            emptySubMessage="Activity will appear here as students engage"
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing your classroom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4" asChild>
              <Link href="/teacher/students">
                <Users className="h-6 w-6" />
                <span>View Students</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4" asChild>
              <Link href="/teacher/challenges">
                <Book className="h-6 w-6" />
                <span>Manage Challenges</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4" asChild>
              <Link href="/teacher">
                <BarChart3 className="h-6 w-6" />
                <span>Dashboard</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4" asChild>
              <Link href="/main">
                <Book className="h-6 w-6" />
                <span>Back to Main</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Information
          </CardTitle>
          <CardDescription>
            Platform details and technical information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">T</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Access Level</p>
                  <p className="text-xs text-muted-foreground">Role & Permissions</p>
                </div>
              </div>
              <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                Teacher
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">✓</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Account Status</p>
                  <p className="text-xs text-muted-foreground">Active & Verified</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-medium">v</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Platform Version</p>
                  <p className="text-xs text-muted-foreground">Current Release</p>
                </div>
              </div>
              <span className="text-sm font-mono text-purple-600">v1.0.0</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-medium">⏰</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-xs text-muted-foreground">Session Information</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 