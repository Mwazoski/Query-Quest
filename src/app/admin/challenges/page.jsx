"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LevelBadge from "@/components/LevelBadge";
import { 
  Database, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  TrendingUp
} from "lucide-react";

export default function ChallengesManagement() {
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [institutions, setInstitutions] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchAdminData = useCallback(async () => {
    try {
      // Fetch admin data (using user ID 1 for demo)
      const userId = 1;
      const userResponse = await fetch(`/api/users/${userId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData);
      }
      
      // Fetch institutions for filtering
      const institutionsResponse = await fetch("/api/institutions");
      if (institutionsResponse.ok) {
        const institutionsData = await institutionsResponse.json();
        setInstitutions(institutionsData);
      }
      
      await fetchChallenges();
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const fetchChallenges = async () => {
    try {
      const response = await fetch("/api/challenges");
      if (response.ok) {
        const challengesData = await response.json();
        setChallenges(challengesData);
      }
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handleCreateChallenge = async (newChallenge) => {
    try {
      const response = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newChallenge,
          creator_id: user.id,
        }),
      });

      if (response.ok) {
        await fetchChallenges(); // Refresh the list
        setIsCreateModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Error creating challenge: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      alert("Error creating challenge");
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.statement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || challenge.level.toString() === levelFilter;
    const matchesInstitution = institutionFilter === "all" || 
      (challenge.institution_id && challenge.institution_id.toString() === institutionFilter);
    return matchesSearch && matchesLevel && matchesInstitution;
  });



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading challenges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenges Management</h1>
          <p className="text-muted-foreground">
            Manage all SQL challenges and their difficulty levels
          </p>
        </div>
        <Button size="sm"  onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Challenges</span>
            </div>
            <p className="text-2xl font-bold">{challenges.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Solves</span>
            </div>
            <p className="text-2xl font-bold">
              {challenges.reduce((sum, challenge) => sum + challenge.solves, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Avg Difficulty</span>
            </div>
            <p className="text-2xl font-bold">
              {challenges.length > 0 
                ? Math.round(challenges.reduce((sum, challenge) => sum + challenge.level, 0) / challenges.length * 10) / 10
                : 0
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Total Points</span>
            </div>
            <p className="text-2xl font-bold">
              {challenges.reduce((sum, challenge) => sum + challenge.score, 0)}
            </p>
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
              <Label htmlFor="search">Search Challenges</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by challenge statement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level-filter">Difficulty Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1">Level 1 - Beginner</SelectItem>
                  <SelectItem value="2">Level 2 - Easy</SelectItem>
                  <SelectItem value="3">Level 3 - Medium</SelectItem>
                  <SelectItem value="4">Level 4 - Hard</SelectItem>
                  <SelectItem value="5">Level 5 - Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution-filter">Institution</Label>
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by institution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutions</SelectItem>
                  <SelectItem value="null">No Institution</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id.toString()}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenges List */}
      <Card>
        <CardHeader>
          <CardTitle>Challenges ({filteredChallenges.length})</CardTitle>
          <CardDescription>
            All available SQL challenges on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredChallenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">Challenge #{challenge.id}</h3>
                    <LevelBadge level={challenge.level} />
                    <Badge variant="outline">{challenge.score} points</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {challenge.statement}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                    <span>{challenge.solves} solves</span>
                    {challenge.institution && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {challenge.institution.name}
                      </span>
                    )}
                    <span>Created: {new Date(challenge.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(challenge.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredChallenges.length === 0 && (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No challenges found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Challenge Modal */}
      {isCreateModalOpen && (
        <CreateChallengeModal
          institutions={institutions}
          onSave={handleCreateChallenge}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}

function CreateChallengeModal({ institutions, onSave, onClose }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      level: parseInt(formData.level),
      score: parseInt(formData.score),
      score_base: parseInt(formData.score_base),
      score_min: parseInt(formData.score_min),
      institution_id: formData.institution_id || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Create New Challenge</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="statement">Challenge Statement</Label>
            <Input
              id="statement"
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="help">Help Text (Optional)</Label>
            <Input
              id="help"
              value={formData.help}
              onChange={(e) => setFormData({ ...formData, help: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="solution">Solution</Label>
            <Input
              id="solution"
              value={formData.solution}
              onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution (Optional)</Label>
            <Select
              value={formData.institution_id}
              onValueChange={(value) => setFormData({ ...formData, institution_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an institution (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Institution</SelectItem>
                {institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id.toString()}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                  <SelectItem value="5">Level 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="score">Points</Label>
              <Input
                id="score"
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="score_base">Base Score</Label>
              <Input
                id="score_base"
                type="number"
                value={formData.score_base}
                onChange={(e) => setFormData({ ...formData, score_base: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score_min">Minimum Score</Label>
            <Input
              id="score_min"
              type="number"
              value={formData.score_min}
              onChange={(e) => setFormData({ ...formData, score_min: e.target.value })}
              required
              min="1"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button type="submit" className="flex-1">Create Challenge</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 