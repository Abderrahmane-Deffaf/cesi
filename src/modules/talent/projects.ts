'use server';

import { supabase } from '@/lib/supabase';

export interface Project {
  id?: string;
  name: string;
  description: string;
  images?: string[];
  skills_included_ids?: string;
}

export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('name');

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function getProjectsByIds(ids: string) {
  if (!ids) return { data: [] };
  
  const projectIds = ids.split(',').filter(id => id.trim());
  
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .in('id', projectIds);

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function createProject(project: Omit<Project, 'id'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
