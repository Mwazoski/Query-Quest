"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ActivityTable from "@/components/ActivityTable";
import { 
  Eye, 
  Search, 
  Filter,
  Download,
  Calendar,
  Users,
  Book,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default function TeacherActivity() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const fetchTeacherData = useCallback(async () => {
    try {
      // Fetch teacher data (using user ID 1 for demo)
      const userId = 1;
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
        
        // Generate comprehensive activity data
        await generateActivityData(userData);
      }
    } catch (error) {
      console.error("Error fetching teacher data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateActivityData = async (userData) => {
    try {
      // Fetch students from the same institution
      const studentsResponse = await fetch("/api/users");
      const allUsers = studentsResponse.ok ? await studentsResponse.json() : [];
      
      // Filter for students from the same institution
      const students = allUsers.filter(user => 
        user.institution_id === userData.institution_id && 
        !user.isTeacher && 
        !user.isAdmin
      );
      
      // Fetch challenges
      const challengesResponse = await fetch("/api/challenges");
      const challenges = challengesResponse.ok ? await challengesResponse.json() : [];
      
      // Generate comprehensive activity data
      const activityData = [
        // Student activities
        ...students.flatMap(student => [
          {
            id: `student-${student.id}-1`,
            type: 'student',
            student: student.name,
            action: 'completed challenge',
            challenge: 'SQL Basics',
            points: 100,
            time: '2 hours ago',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            id: `student-${student.id}-2`,
            type: 'student',
            student: student.name,
            action: 'earned points',
            points: 150,
            time: '4 hours ago',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
          },
          {
            id: `student-${student.id}-3`,
            type: 'student',
            student: student.name,
            action: 'started new challenge',
            challenge: 'Advanced Queries',
            time: '1 day ago',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        ]),
        
        // System activities
        {
          id: 'system-1',
          type: 'system',
          action: 'new challenge available',
          challenge: 'Database Design',
          time: '1 day ago',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          id: 'system-2',
          type: 'system',
          action: 'weekly report generated',
          time: '2 days ago',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'system-3',
          type: 'system',
          action: 'platform maintenance completed',
          time: '3 days ago',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        
        // More student activities
        ...students.slice(0, 3).flatMap(student => [
          {
            id: `student-${student.id}-4`,
            type: 'student',
            student: student.name,
            action: 'joined platform',
            time: '1 week ago',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: `student-${student.id}-5`,
            type: 'student',
            student: student.name,
            action: 'completed tutorial',
            time: '1 week ago',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        ])
      ];
      
      // Sort by timestamp (newest first)
      activityData.sort((a, b) => b.timestamp - a.timestamp);
      
      setActivities(activityData);
    } catch (error) {
      console.error("Error generating activity data:", error);
    }
  };

  const filterActivities = useCallback(() => {
    let filtered = activities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        (activity.student && activity.student.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.action && activity.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.challenge && activity.challenge.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(activity => activity.type === typeFilter);
    }

    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      const timeRanges = {
        'today': 24 * 60 * 60 * 1000,
        'week': 7 * 24 * 60 * 60 * 1000,
        'month': 30 * 24 * 60 * 60 * 1000
      };
      
      if (timeRanges[timeFilter]) {
        const cutoff = now.getTime() - timeRanges[timeFilter];
        filtered = filtered.filter(activity => activity.timestamp.getTime() > cutoff);
      }
    }

    setFilteredActivities(filtered);
  }, [activities, searchTerm, typeFilter, timeFilter]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  useEffect(() => {
    filterActivities();
  }, [filterActivities]);

  const handleExportLogs = async () => {
    try {
      // In a real app, you'd generate and download a CSV/Excel file
      console.log("Exporting activity logs...");
      alert("Activity logs export functionality would be implemented here");
    } catch (error) {
      console.error("Error exporting logs:", error);
    }
  };

  const getActivityStats = () => {
    const totalActivities = activities.length;
    const studentActivities = activities.filter(a => a.type === 'student').length;
    const systemActivities = activities.filter(a => a.type === 'system').length;
    const todayActivities = activities.filter(a => {
      const today = new Date();
      const activityDate = a.timestamp;
      return activityDate.toDateString() === today.toDateString();
    }).length;

    return { totalActivities, studentActivities, systemActivities, todayActivities };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading activity logs...</p>
        </div>
      </div>
    );
  }

  const stats = getActivityStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Comprehensive view of all activities and system events
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/teacher">
              <TrendingUp className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Activities</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalActivities}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Student Activities</span>
            </div>
            <p className="text-2xl font-bold">{stats.studentActivities}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Book className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">System Events</span>
            </div>
            <p className="text-2xl font-bold">{stats.systemActivities}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <p className="text-2xl font-bold">{stats.todayActivities}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Activities</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by student, action, or challenge..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type-filter">Activity Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="student">Student Activities</SelectItem>
                  <SelectItem value="system">System Events</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-filter">Time Range</Label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({filteredActivities.length})</CardTitle>
          <CardDescription>
            Detailed view of all activities and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTable 
            activities={filteredActivities}
            showFooter={false}
            emptyMessage="No activities found"
            emptySubMessage={
              searchTerm || typeFilter !== 'all' || timeFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Activities will appear here as students engage with the platform'
            }
          />
        </CardContent>
      </Card>
    </div>
  );
} 