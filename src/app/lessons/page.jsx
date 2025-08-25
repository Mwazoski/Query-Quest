"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Book, 
  Search, 
  Calendar,
  User,
  Eye,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function Lessons() {
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
        
        // Fetch published lessons for user's institution
        const url = user.institution_id 
          ? `/api/lessons?institutionId=${user.institution_id}&published=true`
          : '/api/lessons?published=true';
          
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading lessons...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Database Lessons
            </h1>
            <p className="text-gray-600">
              Learn database concepts through comprehensive lessons
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lessons List */}
          <div className="space-y-3">
            {filteredLessons.length === 0 ? (
              <div className="text-center py-8">
                <Book className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">
                  {searchTerm ? 'No lessons match your search criteria.' : 'No lessons have been published yet.'}
                </p>
              </div>
            ) : (
              filteredLessons.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Book className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end space-x-3 text-xs text-gray-500 mt-3 lg:mt-0 lg:ml-3">
                      <div className="flex items-center space-x-3">
                        <span>{lesson.creator.name}</span>
                        <span className="hidden lg:inline">•</span>
                        <span>{formatDate(lesson.created_at)}</span>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/lessons/${lesson.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Read
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
