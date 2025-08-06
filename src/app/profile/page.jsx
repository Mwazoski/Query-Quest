"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, User, Trophy, Target, School } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    institution_id: "",
  });

  // For demo purposes, using user ID 1 - in a real app, this would come from authentication
  const userId = 1;

  useEffect(() => {
    fetchUserData();
    fetchInstitutions();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name || "",
          alias: userData.alias || "",
          institution_id: userData.institution_id?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await fetch("/api/institutions");
      if (response.ok) {
        const institutionsData = await response.json();
        setInstitutions(institutionsData);
      }
    } catch (error) {
      console.error("Error fetching institutions:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      alias: user.alias || "",
      institution_id: user.institution_id?.toString() || "none",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading profile...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">User not found</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Points</span>
                  <Badge variant="secondary">{user.points}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Challenges Solved</span>
                  <Badge variant="secondary">{user.solvedChallenges}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant={user.isAdmin ? "destructive" : user.isTeacher ? "default" : "outline"}>
                    {user.isAdmin ? "Admin" : user.isTeacher ? "Teacher" : "Student"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                    {user.isEmailVerified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tutorial Completed</span>
                  <Badge variant={user.tutorial ? "default" : "secondary"}>
                    {user.tutorial ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alias">Alias</Label>
                    {isEditing ? (
                      <Input
                        id="alias"
                        value={formData.alias}
                        onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                        placeholder="Enter your alias"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{user.alias || "Not set"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  {isEditing ? (
                    <Select
                      value={formData.institution_id}
                      onValueChange={(value) => setFormData({ ...formData, institution_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your institution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Institution</SelectItem>
                        {institutions.map((institution) => (
                          <SelectItem key={institution.id} value={institution.id.toString()}>
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {user.institution?.name || "No institution assigned"}
                      </p>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Member since: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
  