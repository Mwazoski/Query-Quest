"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Save, 
  X, 
  Database, 
  Target, 
  HelpCircle,
  Code,
  School,
  Star
} from "lucide-react";
import { toast } from "sonner";

export default function CreateChallenge() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    statement: "",
    help: "",
    solution: "",
    level: "1",
    score: "100",
    score_base: "100",
    score_min: "10",
    institution_id: "",
  });

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch("/api/institutions");
      if (response.ok) {
        const institutionsData = await response.json();
        setInstitutions(institutionsData);
      }
    } catch (error) {
      console.error("Error fetching institutions:", error);
      toast.error("Failed to load institutions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.statement.trim() || !formData.solution.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const challengeData = {
        ...formData,
        level: parseInt(formData.level),
        score: parseInt(formData.score),
        score_base: parseInt(formData.score_base),
        score_min: parseInt(formData.score_min),
        // Map "none" or empty string to null for the DB
        institution_id: !formData.institution_id || formData.institution_id === "none"
          ? null
          : parseInt(formData.institution_id),
      };

      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(challengeData),
      });

      if (response.ok) {
        toast.success("Challenge created successfully!");
        router.push("/admin/challenges");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create challenge");
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error("Error creating challenge. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/challenges");
  };

  const getLevelDescription = (level) => {
    const descriptions = {
      1: "Beginner - Basic SQL concepts",
      2: "Easy - Simple queries and joins",
      3: "Medium - Complex queries and aggregations",
      4: "Hard - Advanced SQL features",
      5: "Expert - Complex database operations"
    };
    return descriptions[level] || descriptions[1];
  };

  const getLevelColor = (level) => {
    const colors = {
      1: "bg-green-100 text-green-800",
      2: "bg-yellow-100 text-yellow-800",
      3: "bg-orange-100 text-orange-800",
      4: "bg-red-100 text-red-800",
      5: "bg-purple-100 text-purple-800"
    };
    return colors[level] || colors[1];
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Challenges</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create New Challenge</h1>
            <p className="text-muted-foreground">
              Add a new SQL challenge to the platform
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Creating..." : "Create Challenge"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Challenge Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Challenge Details</span>
              </CardTitle>
              <CardDescription>
                Define the challenge statement and solution
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="statement" className="text-sm font-medium">
                  Challenge Statement *
                </Label>
                <Textarea
                  id="statement"
                  placeholder="Describe the SQL challenge that users need to solve..."
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  className="min-h-[120px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Clearly explain what the user needs to accomplish
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="help" className="text-sm font-medium">
                  Help Text
                </Label>
                <Textarea
                  id="help"
                  placeholder="Optional hints or guidance for users..."
                  value={formData.help}
                  onChange={(e) => setFormData({ ...formData, help: e.target.value })}
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground">
                  Provide helpful hints without giving away the solution
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="solution" className="text-sm font-medium">
                  Solution *
                </Label>
                <Textarea
                  id="solution"
                  placeholder="The correct SQL query that solves the challenge..."
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="min-h-[120px] font-mono text-sm"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  The exact SQL query that should be the correct answer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Scoring Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure how points are awarded for this challenge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score" className="text-sm font-medium">
                    Points *
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    placeholder="100"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    min="1"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum points for correct solution
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score_base" className="text-sm font-medium">
                    Base Score *
                  </Label>
                  <Input
                    id="score_base"
                    type="number"
                    placeholder="100"
                    value={formData.score_base}
                    onChange={(e) => setFormData({ ...formData, score_base: e.target.value })}
                    min="1"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Base score for partial solutions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score_min" className="text-sm font-medium">
                    Minimum Score *
                  </Label>
                  <Input
                    id="score_min"
                    type="number"
                    placeholder="10"
                    value={formData.score_min}
                    onChange={(e) => setFormData({ ...formData, score_min: e.target.value })}
                    min="1"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum points for any attempt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Challenge Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Difficulty Level *
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1 - Beginner</SelectItem>
                    <SelectItem value="2">Level 2 - Easy</SelectItem>
                    <SelectItem value="3">Level 3 - Medium</SelectItem>
                    <SelectItem value="4">Level 4 - Hard</SelectItem>
                    <SelectItem value="5">Level 5 - Expert</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Badge className={getLevelColor(formData.level)}>
                    {getLevelDescription(formData.level)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="institution" className="text-sm font-medium">
                  Institution
                </Label>
                <Select
                  value={formData.institution_id}
                  onValueChange={(value) => setFormData({ ...formData, institution_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select institution (optional)" />
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
                <p className="text-xs text-muted-foreground">
                  Leave empty for platform-wide challenges
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>Challenge Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Level:</span>
                <Badge className={getLevelColor(formData.level)}>
                  Level {formData.level}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Points:</span>
                <span className="text-sm">{formData.score} pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Institution:</span>
                <span className="text-sm text-muted-foreground">
                  {(!formData.institution_id || formData.institution_id === "none")
                    ? 'Platform-wide'
                    : (institutions.find(i => i.id.toString() === formData.institution_id)?.name || 'Unknown')}
                </span>
              </div>
              {formData.statement && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium mb-1">Statement Preview:</p>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {formData.statement}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
