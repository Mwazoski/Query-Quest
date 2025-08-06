"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye, EyeOff, Loader2, Globe, EyeOff as UnpublishIcon } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import Link from 'next/link';

export default function EditLesson() {
  const [lesson, setLesson] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchUserAndLesson();
  }, [fetchUserAndLesson]);

  const fetchUserAndLesson = useCallback(async () => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Fetch lesson data
      const response = await fetch(`/api/lessons/${params.id}`);
      if (response.ok) {
        const lessonData = await response.json();
        setLesson(lessonData);
        setTitle(lessonData.title);
        setDescription(lessonData.description || '');
        setContent(lessonData.content);
        setOrder(lessonData.order);
        setIsPublished(lessonData.isPublished);
      } else {
        setError('Lesson not found');
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError('Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required');
      return;
    }

    if (!user) {
      alert('User not authenticated');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/lessons/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          order: parseInt(order) || 0,
          isPublished,
          updater_id: user.id
        }),
      });

      if (response.ok) {
        router.push('/teacher/lessons');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      alert('Error updating lesson. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The lesson you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/teacher/lessons">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lessons
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/teacher/lessons">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                </Link>
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">Edit Lesson</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={isPublished ? "destructive" : "default"}
                size="sm"
                onClick={() => setIsPublished(!isPublished)}
                className={isPublished ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
              >
                {isPublished ? (
                  <>
                    <UnpublishIcon className="h-4 w-4 mr-1" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-1" />
                    Publish
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter lesson title"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="order" className="text-sm font-medium">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="0"
                    min="0"
                    className="mt-1"
                  />
                </div>

              </div>
              <div className="mt-3">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the lesson"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content with Preview Toggle */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Content *</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                    {showPreview ? 'Hide Preview' : 'Preview'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!showPreview ? (
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={setContent}
                    height={600}
                    preview="edit"
                    hideToolbar={false}
                    textareaProps={{
                      placeholder: "Write your lesson content in Markdown...",
                    }}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span>Characters: {content.length}</span>
                    <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
                    <span>Lines: {content.split('\n').length}</span>
                  </div>
                  <div className="prose prose-lg max-w-none min-h-[600px]">
                    {content ? (
                      <MDEditor.Markdown 
                        source={content} 
                        style={{ padding: 0 }}
                      />
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        Start typing to see the preview...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 