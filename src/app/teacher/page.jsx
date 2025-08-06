"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LevelBadge from "@/components/LevelBadge";
import { 
  Book, 
  Users, 
  TrendingUp, 
  Award,
  Plus,
  Eye,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [institutionStats, setInstitutionStats] = useState({
    totalStudents: 0,
    totalChallenges: 0,
    averagePoints: 0,
    activeStudents: 0,
  });
  const [recentChallenges, setRecentChallenges] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeacherData = useCallback(async () => {
    try {
      // Fetch teacher data (using user ID 1 for demo)
      const userId = 1;
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch institution-specific data
        if (userData.institution_id) {
          await fetchInstitutionData(userData.institution_id);
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

  const fetchInstitutionData = async (institutionId) => {
    try {
      // Fetch students from the same institution
      const studentsResponse = await fetch(`/api/users?institution=${institutionId}`);
      const students = studentsResponse.ok ? await studentsResponse.json() : [];
      
      // Filter only students (not teachers or admins)
      const actualStudents = students.filter(s => !s.isTeacher && !s.isAdmin);
      
      // Calculate statistics
      const totalStudents = actualStudents.length;
      const activeStudents = actualStudents.filter(s => s.solvedChallenges > 0).length;
      const averagePoints = totalStudents > 0 
        ? Math.round(actualStudents.reduce((sum, s) => sum + s.points, 0) / totalStudents)
        : 0;
      
      // Fetch challenges
      const challengesResponse = await fetch("/api/challenges");
      const challenges = challengesResponse.ok ? await challengesResponse.json() : [];
      
      // Get top students
      const topStudents = actualStudents
        .sort((a, b) => b.points - a.points)
        .slice(0, 5);
      
      // Get recent challenges
      const recentChallenges = challenges
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

      setInstitutionStats({
        totalStudents,
        totalChallenges: challenges.length,
        averagePoints,
        activeStudents,
      });
      
      setTopStudents(topStudents);
      setRecentChallenges(recentChallenges);
    } catch (error) {
      console.error("Error fetching institution data:", error);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Welcome back, {user?.name}! Here&apos;s what&apos;s happening with your students.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" asChild>
            <Link href="/teacher/challenges">
              <Book className="h-4 w-4 mr-2" />
              Manage Challenges
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/teacher/students">
              <Users className="h-4 w-4 mr-2" />
              View Students
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <p className="text-2xl font-bold">{institutionStats.totalStudents}</p>
            <p className="text-xs text-muted-foreground">
              {institutionStats.activeStudents} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Book className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Available Challenges</span>
            </div>
            <p className="text-2xl font-bold">{institutionStats.totalChallenges}</p>
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
            <p className="text-2xl font-bold">{institutionStats.averagePoints}</p>
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
            <p className="text-2xl font-bold">
              {institutionStats.totalStudents > 0 
                ? Math.round((institutionStats.activeStudents / institutionStats.totalStudents) * 100)
                : 0}%
            </p>
            <p className="text-xs text-muted-foreground">
              Students participating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Students
            </CardTitle>
            <CardDescription>
              Students with the highest points in your institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.solvedChallenges} challenges solved
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <p className="font-bold text-lg">{student.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {topStudents.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No students found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Recent Challenges
            </CardTitle>
            <CardDescription>
              Latest challenges available for your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentChallenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium truncate">{challenge.statement}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <LevelBadge level={challenge.level} />
                      <Badge variant="outline">{challenge.score} points</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/teacher/challenges/${challenge.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              
              {recentChallenges.length === 0 && (
                <div className="text-center py-8">
                  <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No challenges available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Link href="/teacher/challenges">
                <Book className="h-6 w-6" />
                <span>View Challenges</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4" asChild>
              <Link href="/teacher/students">
                <Users className="h-6 w-6" />
                <span>My Students</span>
              </Link>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4" asChild>
              <Link href="/teacher/settings">
                <BarChart3 className="h-6 w-6" />
                <span>Analytics</span>
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
    </div>
  );
} 