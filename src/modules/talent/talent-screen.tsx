'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { talentFormSchema, type TalentFormData } from './talent-schema';
import { getCurrentUserTalent, updateCurrentUserTalent } from './fetch-talent';

interface Talent {
  id: string;
  name: string;
  prenom: string;
  email: string;
  adresse: string;
  lat: number;
  long: number;
  passion: string;
  is_verified: boolean | null;
  user_id: string;
}

export default function TalentScreen() {
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>('');
  
  const form = useForm<TalentFormData>({
    resolver: zodResolver(talentFormSchema),
    defaultValues: {
      name: '',
      prenom: '',
      adresse: '',
      lat: 0,
      long: 0,
    }
  });

  useEffect(() => {
    async function loadTalent() {
      const result = await getCurrentUserTalent();
      if (result.success && result.data) {
        setTalent(result.data);
        form.reset({
          name: result.data.name || '',
          prenom: result.data.prenom || '',
          adresse: result.data.adresse || '',
          lat: result.data.lat || 0,
          long: result.data.long || 0,
        });
      }
      setLoading(false);
    }
    loadTalent();
  }, [form]);

  const onSubmit = async (data: TalentFormData) => {
    setError('');
    console.log('Submitting talent data:', data);
    const result = await updateCurrentUserTalent(data);
    if (result.success && result.data) {
      setTalent(result.data);
      setEditing(false);
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const passions = talent?.passion ? talent.passion.split(',').map(p => p.trim()) : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Profile Information</h2>
        {!editing && (
          <Button onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      {editing ? (
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      ) : (
                        <p className="text-lg">{talent?.name || '-'}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      {editing ? (
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      ) : (
                        <p className="text-lg">{talent?.prenom || '-'}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    {editing ? (
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    ) : (
                      <p className="text-lg">{talent?.adresse || '-'}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      {editing ? (
                        <FormControl>
                          <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                      ) : (
                        <p className="text-lg">{talent?.lat || '-'}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="long"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      {editing ? (
                        <FormControl>
                          <Input type="number" step="any" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                        </FormControl>
                      ) : (
                        <p className="text-lg">{talent?.long || '-'}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Passions</Label>
                <div className="flex flex-wrap gap-2">
                  {passions.length > 0 ? (
                    passions.map((p, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {p}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No passions added</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              {editing && (
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>

      <Card>
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm ${
              talent?.is_verified 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {talent?.is_verified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}