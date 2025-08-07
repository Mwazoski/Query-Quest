"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Save, 
  Database, 
  Users, 
  Shield, 
  Bell,
  Palette,
  Globe,
  Lock,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "Query-Quest",
    maxUsersPerInstitution: 1000,
    defaultUserRole: "student",
    enableEmailVerification: false,
    maintenanceMode: false,
    theme: "light",
    language: "en",
    maxChallengesPerUser: 50,
    pointsPerChallenge: 100,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      // In a real app, you'd fetch settings from an API
      // For now, we'll use the default settings
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading settings:", error);
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, you'd save settings to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Settings saved:", settings);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/admin/export-data");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `query-quest-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleResetSystem = async () => {
    if (window.confirm("Are you sure you want to reset the system? This action cannot be undone.")) {
      try {
        const response = await fetch("/api/admin/reset-system", {
          method: "POST",
        });
        if (response.ok) {
          alert("System reset successfully");
        }
      } catch (error) {
        console.error("Error resetting system:", error);
      }
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
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Configure platform settings and system preferences
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full lg:w-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>
              Basic platform configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxUsersPerInstitution">Max Users per Institution</Label>
              <Input
                id="maxUsersPerInstitution"
                type="number"
                value={settings.maxUsersPerInstitution}
                onChange={(e) => setSettings({ ...settings, maxUsersPerInstitution: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultUserRole">Default User Role</Label>
              <Select 
                value={settings.defaultUserRole} 
                onValueChange={(value) => setSettings({ ...settings, defaultUserRole: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* User Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Settings
            </CardTitle>
            <CardDescription>
              User-related configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require email verification for new users</p>
              </div>
              <Button
                variant={settings.enableEmailVerification ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, enableEmailVerification: !settings.enableEmailVerification })}
              >
                {settings.enableEmailVerification ? "Enabled" : "Disabled"}
              </Button>
            </div>



            <div className="space-y-2">
              <Label htmlFor="maxChallengesPerUser">Max Challenges per User</Label>
              <Input
                id="maxChallengesPerUser"
                type="number"
                value={settings.maxChallengesPerUser}
                onChange={(e) => setSettings({ ...settings, maxChallengesPerUser: parseInt(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pointsPerChallenge">Points per Challenge</Label>
              <Input
                id="pointsPerChallenge"
                type="number"
                value={settings.pointsPerChallenge}
                onChange={(e) => setSettings({ ...settings, pointsPerChallenge: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              System-wide configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put platform in maintenance mode</p>
              </div>
              <Button
                variant={settings.maintenanceMode ? "destructive" : "outline"}
                size="sm"
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              >
                {settings.maintenanceMode ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Default Theme</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => setSettings({ ...settings, theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Default Language</Label>
              <Select 
                value={settings.language} 
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Security and access control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Password Policy</Label>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Minimum 8 characters</Badge>
                  <Badge variant="secondary">Include numbers</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Include special characters</Badge>
                  <Badge variant="secondary">Mixed case</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Session Management</Label>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Session timeout</span>
                  <Badge variant="outline">24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max concurrent sessions</span>
                  <Badge variant="outline">3</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Access Control</Label>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Admin panel access</span>
                  <Badge variant="destructive">Admin only</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>API rate limiting</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Actions
          </CardTitle>
          <CardDescription>
            Administrative actions and data management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" onClick={handleExportData} className="flex flex-col items-center space-y-2 h-auto py-4">
              <Download className="h-6 w-6" />
              <span>Export Data</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
              <Upload className="h-6 w-6" />
              <span>Import Data</span>
            </Button>
            
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
              <RefreshCw className="h-6 w-6" />
              <span>Clear Cache</span>
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleResetSystem}
              className="flex flex-col items-center space-y-2 h-auto py-4"
            >
              <Shield className="h-6 w-6" />
              <span>Reset System</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 