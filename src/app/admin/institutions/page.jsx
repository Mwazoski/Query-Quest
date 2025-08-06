"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Building,
  MapPin,
  Mail
} from "lucide-react";
import InstitutionModal from "@/components/modals/InstitutionModal";

export default function InstitutionsManagement() {
  const [institutions, setInstitutions] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchInstitutions();
    fetchUsers();
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredInstitutions = institutions.filter(institution => 
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditInstitution = (institution) => {
    setSelectedInstitution(institution);
    setIsEditModalOpen(true);
  };

  const handleSaveInstitution = async (institutionData) => {
    try {
      const url = institutionData.id 
        ? `/api/institutions/${institutionData.id}`
        : "/api/institutions";
      
      const method = institutionData.id ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(institutionData),
      });

      if (response.ok) {
        await fetchInstitutions();
        setIsEditModalOpen(false);
        setIsCreateModalOpen(false);
        setSelectedInstitution(null);
      }
    } catch (error) {
      console.error("Error saving institution:", error);
    }
  };

  const handleDeleteInstitution = async (institution) => {
    const userCount = getUsersCount(institution.id);
    const challengeCount = institution.challengeCount || 0;
    
    const message = `Are you sure you want to delete "${institution.name}"?\n\n` +
      `This will permanently delete:\n` +
      `• ${userCount} user(s)\n` +
      `• ${challengeCount} challenge(s)\n` +
      `• All related logs and user progress\n\n` +
      `This action cannot be undone.`;
    
    if (window.confirm(message)) {
      try {
        const response = await fetch(`/api/institutions/${institution.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message); // Show the success message with counts
          await fetchInstitutions();
          await fetchUsers(); // Refresh users list as well
        } else {
          const error = await response.json();
          alert(`Error: ${error.error}`);
        }
      } catch (error) {
        console.error("Error deleting institution:", error);
        alert("Error deleting institution. Please try again.");
      }
    }
  };

  const getUsersCount = (institutionId) => {
    return users.filter(user => user.institution_id === institutionId).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading institutions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Institutions Management</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Manage educational institutions and their associated users
          </p>
        </div>
        <Button 
          size="sm" 
          className="w-full lg:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Institution
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Institutions</span>
            </div>
            <p className="text-2xl font-bold">{institutions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Active Institutions</span>
            </div>
            <p className="text-2xl font-bold">
              {institutions.filter(inst => getUsersCount(inst.id) > 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Institutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="search">Search by name or address</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search institutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institutions List */}
      <Card>
        <CardHeader>
          <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
          <CardDescription>
            All registered educational institutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInstitutions.map((institution) => (
              <div key={institution.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                      <h3 className="font-medium truncate">{institution.name}</h3>
                      <Badge variant="secondary">{getUsersCount(institution.id)} users</Badge>
                      <Badge variant="outline">{institution.challengeCount || 0} challenges</Badge>
                    </div>
                    {institution.address && (
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground truncate">{institution.address}</p>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>Students: {institution.studentEmailSuffix}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>Teachers: {institution.teacherEmailSuffix}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditInstitution(institution)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteInstitution(institution)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredInstitutions.length === 0 && (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No institutions found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Institution Modal */}
      {isEditModalOpen && selectedInstitution && (
        <InstitutionModal
          institution={selectedInstitution}
          onSave={handleSaveInstitution}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedInstitution(null);
          }}
        />
      )}

      {/* Create Institution Modal */}
      {isCreateModalOpen && (
        <InstitutionModal
          onSave={handleSaveInstitution}
          onClose={() => {
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 