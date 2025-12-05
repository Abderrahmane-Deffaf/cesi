'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProjectsStore } from '@/store/projectsStore';
import { useSkillsStore } from '@/store/skillsStore';
import { useTalentStore } from '@/store/talentStore';
import { type Project } from '@/modules/talent/projects';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProjectFormData {
  name: string;
  description: string;
  skills_included_ids: string;
}

export default function ProjectsPage() {
  const { projects, loading, fetchProjects, addProject, editProject, removeProject } = useProjectsStore();
  const { allSkills, fetchAllSkills } = useSkillsStore();
  const { talent, fetchTalent } = useTalentStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
      skills_included_ids: '',
    }
  });

  const skillsIncluded = watch('skills_included_ids');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userId = 'current-user-id'; // Replace with actual user ID
    await fetchTalent(userId);
    await fetchAllSkills();
  };

  useEffect(() => {
    if (talent?.projects_ids) {
      fetchProjects(talent.projects_ids);
    }
  }, [talent, fetchProjects]);

  const onSubmit = async (data: ProjectFormData) => {
    if (editingProject?.id) {
      await editProject(editingProject.id, data);
    } else if (talent?.id) {
      await addProject(data, talent.id);
    }

    reset();
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    reset({
      name: project.name,
      description: project.description,
      skills_included_ids: project.skills_included_ids || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await removeProject(projectId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
    reset();
  };

  const toggleSkill = (skillId: string) => {
    const currentSkills = skillsIncluded ? skillsIncluded.split(',') : [];
    const index = currentSkills.indexOf(skillId);
    
    if (index > -1) {
      currentSkills.splice(index, 1);
    } else {
      currentSkills.push(skillId);
    }
    
    setValue('skills_included_ids', currentSkills.filter(s => s).join(','));
  };

  if (loading && projects.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Projects</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Add New Project</Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
            <CardDescription>Fill in the project details</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Project name is required' })}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Skills Used</Label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                  {allSkills.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        skillsIncluded?.split(',').includes(skill.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {skill.skill}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Add Project'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{project.description}</p>
              {project.skills_included_ids && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skills_included_ids.split(',').map((skillId, i) => {
                      const skill = allSkills.find(s => s.id === skillId);
                      return skill ? (
                        <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {skill.skill}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id!)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No projects yet. Click "Add New Project" to get started.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
