"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";   
import { Label } from "@/components/ui/label";
import { 
  Book, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  ArrowUp,
  ArrowDown,
  Globe,
  EyeOff
} from "lucide-react";


export default function TeacherLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserAndLessons();
  }, []);

  const fetchUserAndLessons = async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        
        // Fetch lessons for user's institution
        const url = user.institution_id 
          ? `/api/lessons?institutionId=${user.institution_id}`
          : '/api/lessons';
          
        const response = await fetch(url);
        if (response.ok) {
          const lessonsData = await response.json();
          setLessons(lessonsData);
        }
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleTogglePublish = async (lesson) => {
    try {
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: lesson.title,
          content: lesson.content,
          description: lesson.description,
          order: lesson.order,
          isPublished: !lesson.isPublished,
          updater_id: user.id
        }),
      });

      if (response.ok) {
        await fetchUserAndLessons();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error toggling lesson publish status:", error);
      alert("Error updating lesson. Please try again.");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/lessons/${lessonId}?deleter_id=${user.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchUserAndLessons();
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error("Error deleting lesson:", error);
        alert("Error deleting lesson. Please try again.");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Lessons Management</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Create and manage educational content for your students
          </p>
        </div>
        <Button 
          size="sm" 
          className="w-full lg:w-auto"
          asChild
        >
          <Link href="/teacher/lessons/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Lesson
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Book className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Lessons</span>
            </div>
            <p className="text-2xl font-bold">{lessons.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Published</span>
            </div>
            <p className="text-2xl font-bold">
              {lessons.filter(lesson => lesson.isPublished).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Your Lessons</span>
            </div>
            <p className="text-2xl font-bold">
              {lessons.filter(lesson => lesson.creator_id === user?.id).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Lessons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="search">Search by title or description</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <Card>
        <CardHeader>
          <CardTitle>Lessons ({filteredLessons.length})</CardTitle>
          <CardDescription>
            All lessons for your institution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLessons.map((lesson) => (
              <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Book className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                      <h3 className="font-medium truncate">{lesson.title}</h3>
                                             <div className="flex items-center space-x-2">
                         {lesson.isPublished ? (
                           <Badge variant="default" className="bg-green-100 text-green-800 flex items-center">
                             <Globe className="h-3 w-3 mr-1" />
                             Published
                           </Badge>
                         ) : (
                           <Badge variant="secondary" className="flex items-center">
                             <EyeOff className="h-3 w-3 mr-1" />
                             Draft
                           </Badge>
                         )}
                         <Badge variant="outline">Order: {lesson.order}</Badge>
                       </div>
                    </div>
                    {lesson.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {lesson.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{lesson.creator.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(lesson.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublish(lesson)}
                    className={lesson.isPublished ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}
                    title={lesson.isPublished ? "Unpublish lesson" : "Publish lesson"}
                  >
                    {lesson.isPublished ? <EyeOff className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                  >
                    <Link href={`/teacher/lessons/${lesson.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteLesson(lesson.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredLessons.length === 0 && (
              <div className="text-center py-8">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No lessons found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  );
} 