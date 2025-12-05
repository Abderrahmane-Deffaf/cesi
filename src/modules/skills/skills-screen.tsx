'use client';

import {  useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { skillsFormSchema, type SkillsFormData } from './skills-schema';
import { getUserSkillsData, addSkillToTalent, removeSkillFromTalent } from './actions';

interface Skill {
  id: string;
  skill: string;
}

interface TalentSkill {
  skill_id: string;
  skills: Skill;
}

export default function SkillsScreen() {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<TalentSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const form = useForm<SkillsFormData>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      skill_id: '',
    },
  });

  
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const result = await getUserSkillsData();
      if (result.success && result.data) {
        setAvailableSkills(result.data);
      }

      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const usersSkills = async () => {
      const usersSkills = await getUserSkillsData()
      if (usersSkills.success && usersSkills.data) {
        setUserSkills(usersSkills.data.userSkills);
      }
    };
    usersSkills();
  }, [form.formState.isSubmitSuccessful]);

  const onSubmit = async (data: SkillsFormData) => {
    setError('');
    setSuccess('');

    const result = await addSkillToTalent(data.skill_id);
    
    if (result.success) {
      setSuccess('Skill added successfully!');
    } else {
      setError(result.error || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (skill_id: string) => {
    setError('');
    setSuccess('');

    const result = await removeSkillFromTalent(skill_id);
    
    if (result.success) {
      setSuccess('Skill removed successfully!');
      await loadData(); // Reload the skills
    } else {
      setError(result.error || 'Failed to remove skill');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter out skills that user already has

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Manage Your Skills</h2>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
          <CardDescription>Select a skill from the list to add to your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="skill_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Skill</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select a skill --</option>
                        {availableSkills.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.skill}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add Skill'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Skills</CardTitle>
          <CardDescription>Skills you have added to your profile</CardDescription>
        </CardHeader>
        <CardContent>
          {userSkills.length === 0 ? (
            <p className="text-gray-500">No skills added yet</p>
          ) : (
            <div className="space-y-3">
              {userSkills.map((userSkill) => (
                <div
                  key={userSkill.skill_id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                >
                  <div className="flex-1">
                    <p className="font-medium">{userSkill.skills.skill}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleRemoveSkill(userSkill.skill_id)}
                    className="ml-4"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
