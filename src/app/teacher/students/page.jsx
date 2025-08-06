"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Search, 
  Filter,
  TrendingUp,
  Award,
  Eye,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const fetchTeacherData = useCallback(async () => {
    try {
      // Fetch teacher data (using user ID 1 for demo)
      const userId = 1;
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        
        // Fetch students from the same institution
        if (userData.institution_id) {
          await fetchInstitutionStudents(userData.institution_id);
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

  const fetchInstitutionStudents = async (institutionId) => {
    try {
      // Fetch all users and filter for students from the same institution
      const response = await fetch("/api/users");
      if (response.ok) {
        const allUsers = await response.json();
        
        // Filter for students (not teachers or admins) from the same institution
        const institutionStudents = allUsers.filter(user => 
          user.institution_id === institutionId && 
          !user.isTeacher && 
          !user.isAdmin
        );
        
        setStudents(institutionStudents);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const filteredAndSortedStudents = students
    .filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.alias?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "points":
          return b.points - a.points;
        case "challenges":
          return b.solvedChallenges - a.solvedChallenges;
        default:
          return 0;
      }
    });

  const getRoleBadge = (student) => {
    if (student.isAdmin) return <Badge variant="destructive">Admin</Badge>;
    if (student.isTeacher) return <Badge variant="default">Teacher</Badge>;
    return <Badge variant="secondary">Student</Badge>;
  };

  const getPerformanceBadge = (student) => {
    if (student.points >= 1000) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (student.points >= 500) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (student.points >= 100) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">Beginner</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Students</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Students from {user?.institution?.name || 'your institution'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" asChild>
            <Link href="/teacher">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/teacher/challenges">
              <Eye className="h-4 w-4 mr-2" />
              View Challenges
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Students</span>
            </div>
            <p className="text-2xl font-bold">{students.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Active Students</span>
            </div>
            <p className="text-2xl font-bold">
              {students.filter(s => s.solvedChallenges > 0).length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Average Points</span>
            </div>
            <p className="text-2xl font-bold">
              {students.length > 0 
                ? Math.round(students.reduce((sum, s) => sum + s.points, 0) / students.length)
                : 0}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Engagement Rate</span>
            </div>
            <p className="text-2xl font-bold">
              {students.length > 0 
                ? Math.round((students.filter(s => s.solvedChallenges > 0).length / students.length) * 100)
                : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Students</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or alias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="name">Name</option>
                <option value="points">Points (High to Low)</option>
                <option value="challenges">Challenges Solved (High to Low)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredAndSortedStudents.length})</CardTitle>
          <CardDescription>
            All students from your institution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAndSortedStudents.map((student) => (
              <div key={student.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">
                      {student.name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                      <h3 className="font-medium">{student.name}</h3>
                      {getRoleBadge(student)}
                      {getPerformanceBadge(student)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {student.alias && `@${student.alias} • `}
                      {student.solvedChallenges} challenges solved • {student.points} points
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/profile/${student.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredAndSortedStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "No students found matching your search" : "No students found in your institution"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            Key metrics about your students&apos; performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {students.filter(s => s.points >= 500).length}
              </div>
              <div className="text-sm text-muted-foreground">High Performers</div>
              <div className="text-xs text-muted-foreground">500+ points</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {students.filter(s => s.solvedChallenges >= 5).length}
              </div>
              <div className="text-sm text-muted-foreground">Active Learners</div>
              <div className="text-xs text-muted-foreground">5+ challenges</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {students.filter(s => s.solvedChallenges === 0).length}
              </div>
              <div className="text-sm text-muted-foreground">Need Support</div>
              <div className="text-xs text-muted-foreground">0 challenges</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 