'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function getAllSkills() {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('skill', { ascending: true });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching skills:', error);
    return { success: false, error: 'Failed to fetch skills' };
  }
}

export async function addSkillToTalent(skill_id: string) {
  try {
    const cookiesStore = await cookies();
    
    if (!cookiesStore.get('user_id')) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const userId = cookiesStore.get('user_id')!.value;

    // Check if skill already exists for this user
    const { data: existing } = await supabase
      .from('talent_skill')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_id', skill_id)
      .single();

    if (existing) {
      return { success: false, error: 'Skill already added' };
    }

    // Insert new skill association
    const { data, error } = await supabase
      .from('talent_skill')
      .insert({ user_id: userId, skill_id })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error adding skill:', error);
    return { success: false, error: 'Failed to add skill' };
  }
}

export async function removeSkillFromTalent(skill_id: string) {
  try {
    const cookiesStore = await cookies();
    
    if (!cookiesStore.get('user_id')) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const userId = cookiesStore.get('user_id')!.value;

    const { error } = await supabase
      .from('talent_skill')
      .delete()
      .eq('user_id', userId)
      .eq('skill_id', skill_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error removing skill:', error);
    return { success: false, error: 'Failed to remove skill' };
  }
}

export async function getUserSkillsData() {
  try {
    const cookiesStore = await cookies();
    
    if (!cookiesStore.get('user_id')) {
      return { success: false, error: 'Not authenticated' };
    }
    
    const userId = cookiesStore.get('user_id')!.value;

    // Fetch user's skills with join to skills table
    const { data, error } = await supabase
      .from('talent_skill')
      .select('skill_id, skills:skill_id(id, skill)')
      .eq('user_id', userId);

    if (error) throw error;
    return { 
      success: true, 
      data: data || []
    };
  } catch (error) {
    console.error('Error fetching user skills data:', error);
    return { success: false, error: 'Failed to load skills data' };
  }
}
