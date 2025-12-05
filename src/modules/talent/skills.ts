'use server';

import { supabase } from '@/lib/supabase';

export interface Skill {
  id: string;
  skill: string;
  level: number;
}

export async function getAllSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('skill');

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function getSkillsByIds(ids: string) {
  if (!ids) return { data: [] };
  
  const skillIds = ids.split(',').filter(id => id.trim());
  
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .in('id', skillIds);

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function createSkill(skill: Omit<Skill, 'id'>) {
  const { data, error } = await supabase
    .from('skills')
    .insert(skill)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function updateSkill(id: string, level: number) {
  const { data, error } = await supabase
    .from('skills')
    .update({ level })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
