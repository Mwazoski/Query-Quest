"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  MoreHorizontal,
  Upload,
  FileText,
  X
} from "lucide-react";
import { ImportUsersModal, AddUserModal, EditUserModal, InstitutionModal } from "@/components/modals";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState([]);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchInstitutions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.alias?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || 
                       (roleFilter === "admin" && user.isAdmin) ||
                       (roleFilter === "teacher" && user.isTeacher) ||
                       (roleFilter === "student" && !user.isAdmin && !user.isTeacher);
    
    const matchesInstitution = institutionFilter === "all" || 
                              user.institution_id?.toString() === institutionFilter;

    return matchesSearch && matchesRole && matchesInstitution;
  });

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleSaveUser = async (updatedUser) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setIsEditModalOpen(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setIsAddModalOpen(false);
      } else {
        const error = await response.json();
        console.error("Failed to add user:", error);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleBulkImport = async (usersData) => {
    setIsImporting(true);
    try {
      const response = await fetch("/api/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: usersData }),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setIsImportModalOpen(false);
        setImportFile(null);
        setImportPreview([]);
      } else {
        const error = await response.json();
        console.error("Import failed:", error);
      }
    } catch (error) {
      console.error("Error importing users:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const getRoleBadge = (user) => {
    if (user.isAdmin) return <Badge variant="destructive">Admin</Badge>;
    if (user.isTeacher) return <Badge variant="default">Teacher</Badge>;
    return <Badge variant="secondary">Student</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Manage all users, their roles, and permissions
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </Button>
        </div>
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
              <Label htmlFor="search">Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or alias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role-filter">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
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

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            All registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm truncate">{user.name}</h3>
                      {getRoleBadge(user)}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-0.5">
                      {user.alias && <span>@{user.alias}</span>}
                      <span>{user.institution?.name || 'No institution'}</span>
                      <span>{user.solvedChallenges} solved</span>
                      <span>{user.points} pts</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleEditUser(user)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-6">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No users found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <AddUserModal
          institutions={institutions}
          onSave={handleAddUser}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          onInstitutionAdded={(newInstitution) => {
            setInstitutions(prev => [...prev, newInstitution]);
          }}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          institutions={institutions}
          onSave={handleSaveUser}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Import Users Modal */}
      {isImportModalOpen && (
        <ImportUsersModal
          institutions={institutions}
          onImport={handleBulkImport}
          onClose={() => {
            setIsImportModalOpen(false);
            setImportFile(null);
            setImportPreview([]);
          }}
        />
      )}
    </div>
  );
} 