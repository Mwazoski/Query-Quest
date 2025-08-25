"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
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
  X,
  Check,
  Mail,
  Calendar
} from "lucide-react";
import { ImportUsersModal, AddUserModal, EditUserModal, InstitutionModal, ConfirmModal } from "@/components/modals";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pagination, setPagination] = useState({
    totalUsers: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users when search term changes (debounced)
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return; // Only trigger when debounced value matches current
    fetchUsers(true); // true = isSearching
  }, [debouncedSearchTerm]);

  // Fetch users when other filters change
  useEffect(() => {
    fetchUsers(false); // false = not searching
  }, [currentPage, pageSize, roleFilter, institutionFilter]);

  // Initial load
  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchUsers = async (isSearch = false) => {
    try {
      if (isSearch) {
        setIsSearching(true);
      } else {
        setIsLoading(true);
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        search: debouncedSearchTerm,
        role: roleFilter === "all" ? "" : roleFilter,
        institution: institutionFilter === "all" ? "" : institutionFilter,
      });

      const response = await fetch(`/api/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      if (isSearch) {
        setIsSearching(false);
      } else {
        setIsLoading(false);
      }
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedUsers([]); // Clear selection when changing pages
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(parseInt(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
    setSelectedUsers([]); // Clear selection
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
    setSelectedUsers([]); // Clear selection
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
    setSelectedUsers([]); // Clear selection
  };

  const handleInstitutionFilterChange = (value) => {
    setInstitutionFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
    setSelectedUsers([]); // Clear selection
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId, checked) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUsers(false);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        // Remove from selected users if it was selected
        setSelectedUsers(prev => prev.filter(id => id !== userToDelete.id));
      } else {
        const error = await response.json();
        console.error("Failed to delete user:", error);
        alert("Failed to delete user. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedUsers.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const response = await fetch('/api/users/bulk-delete', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (response.ok) {
        setSelectedUsers([]);
        await fetchUsers(false);
        setIsBulkDeleteModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error bulk deleting users:", error);
      alert("Error deleting users. Please try again.");
    } finally {
      setIsBulkDeleting(false);
    }
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
        await fetchUsers(false);
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
        await fetchUsers(false);
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
    try {
      const response = await fetch("/api/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ users: usersData }),
      });

      if (response.ok) {
        await fetchUsers(false);
        setIsImportModalOpen(false);
      } else {
        const error = await response.json();
        console.error("Import failed:", error);
      }
    } catch (error) {
      console.error("Error importing users:", error);
    }
  };

  const getRoleBadge = (user) => {
    if (user.isAdmin) return <Badge variant="destructive" className="text-xs">Admin</Badge>;
    if (user.isTeacher) return <Badge variant="default" className="text-xs">Teacher</Badge>;
    return <Badge variant="secondary" className="text-xs">Student</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage all users, their roles, and permissions
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setIsImportModalOpen(true)}
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import Users
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Select value={institutionFilter} onValueChange={handleInstitutionFilterChange}>
                <SelectTrigger id="institution">
                  <SelectValue placeholder="All institutions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All institutions</SelectItem>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id.toString()}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-size">Items per page</Label>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger id="page-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Users ({pagination.totalUsers} total)</CardTitle>
              {selectedUsers.length > 0 && (
                <CardDescription>
                  {selectedUsers.length} user(s) selected
                </CardDescription>
              )}
            </div>
            {selectedUsers.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full sm:w-auto"
                onClick={handleBulkDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected ({selectedUsers.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No users found matching your criteria</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox 
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="min-w-[120px] sm:min-w-[200px]">User</TableHead>
                      <TableHead className="min-w-[60px] sm:min-w-[100px]">Role</TableHead>
                      <TableHead className="min-w-[100px] hidden sm:table-cell">Institution</TableHead>
                      <TableHead className="min-w-[70px] hidden md:table-cell">Stats</TableHead>
                      <TableHead className="min-w-[90px] hidden lg:table-cell">Last Login</TableHead>
                      <TableHead className="w-12 sm:w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-medium">
                                {user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-xs truncate">{user.name}</p>
                              <p className="text-xs text-muted-foreground truncate hidden sm:block">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <p className="text-xs text-muted-foreground">
                            {user.institution?.name || 'None'}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs text-muted-foreground">
                            <p>{user.solvedChallenges} solved</p>
                            <p>{user.points} pts</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(user.last_login)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 sm:h-6 sm:w-6 p-0"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 sm:h-6 sm:w-6 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-0">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
            />
          </CardContent>
        </Card>
      )}

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
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete User"
        onConfirm={confirmDeleteUser}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        isLoading={isDeleting}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        title="Delete Selected Users"
        message={`Are you sure you want to delete ${selectedUsers.length} selected user(s)? This action cannot be undone.`}
        confirmText="Delete Users"
        onConfirm={confirmBulkDelete}
        onCancel={() => {
          setIsBulkDeleteModalOpen(false);
        }}
        isLoading={isBulkDeleting}
      />
    </div>
  );
} 