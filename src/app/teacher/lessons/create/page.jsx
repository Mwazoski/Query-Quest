"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Eye, EyeOff, Globe, EyeOff as UnpublishIcon } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import Link from 'next/link';

export default function CreateLesson() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

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
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          order: parseInt(order) || 0,
          isPublished,
          creator_id: user.id
        }),
      });

      if (response.ok) {
        router.push('/teacher/lessons');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Error creating lesson. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
              <h1 className="text-sm font-semibold text-gray-900">New Lesson</h1>
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
                      placeholder: "Write your lesson content in Markdown...\n\n# Use headings for structure\n## Subheadings work too\n\n- Bullet points\n- Are supported\n\n```sql\n-- Code blocks with syntax highlighting\nSELECT * FROM users;\n```",
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