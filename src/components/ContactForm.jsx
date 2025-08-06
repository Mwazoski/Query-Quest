"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Building, Mail, Phone, Globe } from "lucide-react";

export default function ContactForm({ onClose, userEmail = "" }) {
  const [formData, setFormData] = useState({
    institutionName: "",
    contactName: "",
    contactEmail: userEmail,
    contactPhone: "",
    website: "",
    studentEmailSuffix: "",
    teacherEmailSuffix: "",
    message: "",
    estimatedStudents: "",
    estimatedTeachers: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success" | "error" | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitStatus === "success") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Thank you for your interest. We'll review your institution's request and contact you soon.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Request Institution Access
            </CardTitle>
            <CardDescription>
              Fill out this form to request access for your institution
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === "error" && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  Error submitting request. Please try again.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institutionName">Institution Name *</Label>
                <Input
                  id="institutionName"
                  value={formData.institutionName}
                  onChange={(e) => handleChange("institutionName", e.target.value)}
                  placeholder="e.g., Universidad de Cádiz"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                  placeholder="Full name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  placeholder="contact@institution.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  placeholder="+34 123 456 789"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Institution Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://www.institution.edu"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentEmailSuffix">Student Email Suffix *</Label>
                <Input
                  id="studentEmailSuffix"
                  value={formData.studentEmailSuffix}
                  onChange={(e) => handleChange("studentEmailSuffix", e.target.value)}
                  placeholder="e.g., @alum.uca.es"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherEmailSuffix">Teacher Email Suffix *</Label>
                <Input
                  id="teacherEmailSuffix"
                  value={formData.teacherEmailSuffix}
                  onChange={(e) => handleChange("teacherEmailSuffix", e.target.value)}
                  placeholder="e.g., @uca.es"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedStudents">Estimated Students</Label>
                <Input
                  id="estimatedStudents"
                  type="number"
                  value={formData.estimatedStudents}
                  onChange={(e) => handleChange("estimatedStudents", e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedTeachers">Estimated Teachers</Label>
                <Input
                  id="estimatedTeachers"
                  type="number"
                  value={formData.estimatedTeachers}
                  onChange={(e) => handleChange("estimatedTeachers", e.target.value)}
                  placeholder="e.g., 200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Information</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Please provide any additional information about your institution, courses, or specific requirements..."
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 