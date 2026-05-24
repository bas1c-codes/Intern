'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { apiService } from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

export default function RequestServicePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    service: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      service: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.phone ||
      !formData.city ||
      !formData.service ||
      !formData.description
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      await apiService.createLead({
        name: formData.name,
        phone: Number(formData.phone),
        city: formData.city,
        service: formData.service as
          | 'Service 1'
          | 'Service 2'
          | 'Service 3',
        description: formData.description,
      });

      toast.success('Lead submitted successfully!');
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        city: '',
        service: '',
        description: '',
      });

      // Reset form state after 2 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data || error?.message || 'Failed to submit lead';
      toast.error(
        typeof errorMessage === 'string'
          ? errorMessage
          : 'Failed to submit lead'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="mx-auto max-w-md">
        <Card className="border-slate-700 bg-slate-800 shadow-2xl">
          <div className="space-y-6 p-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-white">Request Service</h1>
              <p className="text-sm text-slate-400">
                Fill out the form to request a service
              </p>
            </div>

            {submitted ? (
              <div className="rounded-lg bg-green-900/30 p-4 text-center">
                <p className="text-green-200">✓ Lead submitted successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-300">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-300">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service" className="text-slate-300">
                    Service Type
                  </Label>
                  <Select
                    value={formData.service}
                    onValueChange={handleServiceChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="border-slate-600 bg-slate-700">
                      <SelectItem value="Service 1">Service 1</SelectItem>
                      <SelectItem value="Service 2">Service 2</SelectItem>
                      <SelectItem value="Service 3">Service 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your service needs..."
                    className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                    rows={4}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Lead'
                  )}
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-slate-500">
              Or visit the{' '}
              <a href="/dashboard" className="text-blue-400 hover:text-blue-300">
                provider dashboard
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
