import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function InstitutionModal({ institution, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: institution?.name || "",
    address: institution?.address || "",
    studentEmailSuffix: institution?.studentEmailSuffix || "",
    teacherEmailSuffix: institution?.teacherEmailSuffix || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...institution,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          {institution ? "Edit Institution" : "Create Institution"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Institution Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="studentEmailSuffix">Student Email Suffix *</Label>
            <Input
              id="studentEmailSuffix"
              value={formData.studentEmailSuffix}
              onChange={(e) => setFormData({ ...formData, studentEmailSuffix: e.target.value })}
              placeholder="e.g., @alum.uca.es"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="teacherEmailSuffix">Teacher Email Suffix *</Label>
            <Input
              id="teacherEmailSuffix"
              value={formData.teacherEmailSuffix}
              onChange={(e) => setFormData({ ...formData, teacherEmailSuffix: e.target.value })}
              placeholder="e.g., @uca.es"
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              {institution ? "Save Changes" : "Create Institution"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 