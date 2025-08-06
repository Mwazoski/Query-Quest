"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Mail, 
  Phone, 
  Globe, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from "lucide-react";

export default function ContactRequestsPage() {
  const [contactRequests, setContactRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const fetchContactRequests = async () => {
    try {
      const response = await fetch('/api/contact-requests');
      const data = await response.json();
      setContactRequests(data);
    } catch (error) {
      console.error('Error fetching contact requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await fetch('/api/contact-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        await fetchContactRequests(); // Refresh the list
        setShowModal(false);
        setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Requests</h1>
        <p className="text-gray-600">
          Review and manage institution access requests
        </p>
      </div>

      <div className="grid gap-6">
        {contactRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Contact Requests</h3>
              <p className="text-gray-600">There are no pending institution access requests.</p>
            </CardContent>
          </Card>
        ) : (
          contactRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.institutionName}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {request.contactEmail}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(request.created_at)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Contact:</span> {request.contactName}
                      </div>
                      <div>
                        <span className="font-medium">Students:</span> {request.estimatedStudents || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Teachers:</span> {request.estimatedTeachers || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Student Email:</span> {request.studentEmailSuffix}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {request.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'approved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {selectedRequest.institutionName}
                </CardTitle>
                <CardDescription>
                  Contact Request Details
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequest.contactEmail}</span>
                    </div>
                    {selectedRequest.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedRequest.contactPhone}</span>
                      </div>
                    )}
                    {selectedRequest.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a href={selectedRequest.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedRequest.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Institution Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Student Email Suffix:</span>
                      <div className="text-gray-600">{selectedRequest.studentEmailSuffix}</div>
                    </div>
                    <div>
                      <span className="font-medium">Teacher Email Suffix:</span>
                      <div className="text-gray-600">{selectedRequest.teacherEmailSuffix}</div>
                    </div>
                    <div>
                      <span className="font-medium">Estimated Students:</span>
                      <div className="text-gray-600">{selectedRequest.estimatedStudents || 'Not specified'}</div>
                    </div>
                    <div>
                      <span className="font-medium">Estimated Teachers:</span>
                      <div className="text-gray-600">{selectedRequest.estimatedTeachers || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                  <div className="bg-gray-50 p-3 rounded-md text-sm">
                    {selectedRequest.message}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  Requested on {formatDate(selectedRequest.created_at)}
                </div>
                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve Institution
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject Request
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 