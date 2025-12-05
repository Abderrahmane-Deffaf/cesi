


'use server';

import { supabase } from '@/lib/supabase';

export async function fetchAllTalents() {
  try {
    const { data, error } = await supabase
      .from('talent')
      .select('*')

    if (error) throw error;
    console.log('Fetched talents:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching talents:', error);
    return { success: false, error: 'Failed to fetch talents' };
  }
}

export async function fetchTalentById(id: string) {
  try {
    const { data, error } = await supabase
      .from('talent')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching talent:', error);
    return { success: false, error: 'Failed to fetch talent' };
  }
}

export async function fetchTalentSkills(userId: string) {
  try {
    const { data, error } = await supabase
      .from("talent_skill")
      .select("skill_id, skill(skill)")
      .eq("talent_id", userId);
    
    console.log('Fetched talent skills:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching talent skills:', error);
    return { success: false, error: 'Failed to fetch talent skills' };
  }
}
