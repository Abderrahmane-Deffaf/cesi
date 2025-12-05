'use server';

import { supabase } from '@/lib/supabase';

export interface Talent {
  id?: string;
  name: string;
  prenom: string;
  email: string;
  lat?: number;
  long?: number;
  addresse?: string;
  passion?: string[];
  is_verified?: boolean;
  skills_ids?: string;
  languages_ids?: string;
  projects_ids?: string;
  user_id: string;
}

export async function getTalentByUserId(userId: string) {
  const { data, error } = await supabase
    .from('talents')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function createTalent(talent: Talent) {
  const { data, error } = await supabase
    .from('talents')
    .insert(talent)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function updateTalent(id: string, updates: Partial<Talent>) {
  const { data, error } = await supabase
    .from('talents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function addSkillToTalent(talentId: string, skillId: string) {
  const { data: talent } = await supabase
    .from('talents')
    .select('skills_ids')
    .eq('id', talentId)
    .single();

  const currentSkills = talent?.skills_ids ? talent.skills_ids.split(',') : [];
  if (!currentSkills.includes(skillId)) {
    currentSkills.push(skillId);
  }

  return updateTalent(talentId, { skills_ids: currentSkills.join(',') });
}

export async function removeSkillFromTalent(talentId: string, skillId: string) {
  const { data: talent } = await supabase
    .from('talents')
    .select('skills_ids')
    .eq('id', talentId)
    .single();

  const currentSkills = talent?.skills_ids ? talent.skills_ids.split(',') : [];
  const updatedSkills = currentSkills.filter(id => id !== skillId);

  return updateTalent(talentId, { skills_ids: updatedSkills.join(',') });
}

export async function addLanguageToTalent(talentId: string, languageId: string) {
  const { data: talent } = await supabase
    .from('talents')
    .select('languages_ids')
    .eq('id', talentId)
    .single();

  const currentLanguages = talent?.languages_ids ? talent.languages_ids.split(',') : [];
  if (!currentLanguages.includes(languageId)) {
    currentLanguages.push(languageId);
  }

  return updateTalent(talentId, { languages_ids: currentLanguages.join(',') });
}

export async function addProjectToTalent(talentId: string, projectId: string) {
  const { data: talent } = await supabase
    .from('talents')
    .select('projects_ids')
    .eq('id', talentId)
    .single();

  const currentProjects = talent?.projects_ids ? talent.projects_ids.split(',') : [];
  if (!currentProjects.includes(projectId)) {
    currentProjects.push(projectId);
  }

  return updateTalent(talentId, { projects_ids: currentProjects.join(',') });
}
