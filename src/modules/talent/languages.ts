'use server';

import { supabase } from '@/lib/supabase';

export interface Language {
  id: string;
  name: string;
  level: string;
}

export async function getAllLanguages() {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('name');

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function getLanguagesByIds(ids: string) {
  if (!ids) return { data: [] };
  
  const languageIds = ids.split(',').filter(id => id.trim());
  
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .in('id', languageIds);

  if (error) {
    return { error: error.message, data: [] };
  }

  return { data };
}

export async function createLanguage(language: Omit<Language, 'id'>) {
  const { data, error } = await supabase
    .from('languages')
    .insert(language)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function updateLanguage(id: string, level: string) {
  const { data, error } = await supabase
    .from('languages')
    .update({ level })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
