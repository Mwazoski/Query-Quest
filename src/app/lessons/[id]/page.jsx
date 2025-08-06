"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Book, 
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Eye
} from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import Link from "next/link";

export default function LessonDetail() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchLesson();
  }, [params.id]);

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${params.id}`);
      if (response.ok) {
        const lessonData = await response.json();
        setLesson(lessonData);
      } else {
        setError("Lesson not found");
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
      setError("Failed to load lesson");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
                <p className="text-lg text-gray-600">Loading lesson...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !lesson) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
              <p className="text-gray-600 mb-6">{error || "The lesson you're looking for doesn't exist."}</p>
              <Button asChild>
                <Link href="/lessons">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Lessons
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back Button */}
          <div className="mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/lessons">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lessons
              </Link>
            </Button>
          </div>

          {/* Lesson Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Book className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {lesson.title}
                </h1>
              </div>
            </div>
            
            {lesson.description && (
              <p className="text-gray-600 mb-3">
                {lesson.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>By {lesson.creator.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(lesson.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="mt-10 prose prose-sm max-w-none bg-white px-2 [&_.w-md-editor]:!bg-transparent [&_.w-md-editor]:!text-gray-700 [&_pre]:!bg-gray-100 [&_pre]:!text-gray-800 [&_code]:!bg-gray-100 [&_code]:!text-gray-800 [&_pre_code]:!bg-transparent [&_h1]:!text-3xl [&_h1]:!font-bold [&_h1]:!text-gray-900 [&_h1]:!border-b [&_h1]:!border-gray-200 [&_h1]:!pb-2 [&_h1]:!mb-6 [&_h2]:!text-2xl [&_h2]:!font-semibold [&_h2]:!text-gray-800 [&_h2]:!mt-8 [&_h2]:!mb-4 [&_h3]:!text-xl [&_h3]:!font-medium [&_h3]:!text-gray-700 [&_h3]:!mt-6 [&_h3]:!mb-3 [&_h4]:!text-lg [&_h4]:!font-medium [&_h4]:!text-gray-600 [&_h4]:!mt-4 [&_h4]:!mb-2 [&_h5]:!text-base [&_h5]:!font-medium [&_h5]:!text-gray-600 [&_h5]:!mt-3 [&_h5]:!mb-2">
            <MDEditor.Markdown 
              source={lesson.content} 
              style={{ 
                padding: 0,
                backgroundColor: 'white',
                color: '#374151'
              }}
            />
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button variant="outline" size="sm" asChild>
              <Link href="/lessons">
                <ArrowLeft className="h-4 w-4 mr-2" />
                All Lessons
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/challenges">
                <Eye className="h-4 w-4 mr-2" />
                Practice with Challenges
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
} 