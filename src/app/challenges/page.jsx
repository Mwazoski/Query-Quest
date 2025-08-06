"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import { ChallengeCard } from "@/components/ChallengeCard";
import { Loader2, Database, TrendingUp, Users, Target } from "lucide-react";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0,
    totalSolves: 0
  });

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          throw new Error('User not authenticated');
        }
        
        const user = JSON.parse(userData);
        setUser(user);
        
        // Fetch challenges for user's institution
        const url = user.institution_id 
          ? `/api/challenges?institutionId=${user.institution_id}`
          : '/api/challenges';
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch challenges');
        }
        const data = await response.json();
        setChallenges(data);
        
        // Calculate stats
        const total = data.length;
        const totalSolves = data.reduce((sum, challenge) => sum + challenge.solves, 0);
        const averageScore = total > 0 ? Math.round(data.reduce((sum, challenge) => sum + challenge.score, 0) / total) : 0;
        
        setStats({
          total,
          completed: 0, // This would need to be calculated based on user's completed challenges
          averageScore,
          totalSolves
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Loading challenges...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-red-600 text-lg">Error: {error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              SQL Challenges
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master SQL through interactive challenges designed to enhance your database skills
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Challenges</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Database className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Total Solves</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalSolves}</p>
                </div>
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Avg. Score</p>
                  <p className="text-xl font-bold text-gray-900">{stats.averageScore}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">Your Progress</p>
                  <p className="text-xl font-bold text-gray-900">{stats.completed}/{stats.total}</p>
                </div>
                <Target className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Challenges Grid */}
          {user && !user.institution_id ? (
            <div className="text-center py-12">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">No Institution Assigned</h3>
                <p className="text-yellow-700 mb-4">
                  You don&apos;t have an institution assigned. Please contact your administrator to get access to challenges.
                </p>
              </div>
            </div>
          ) : (
            <ChallengeCard challenges={challenges} />
          )}
        </div>
      </div>
    </>
  );
}
