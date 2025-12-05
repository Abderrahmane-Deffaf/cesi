'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function getCurrentUserTalent() {
  try {
    // Get current user session
    const cookiesStore = await cookies();
    
    if (!cookiesStore.get("user_id") ) {
      console.error('Session error:');
      return { success: false, error: 'Not authenticated' };
    }

    const userId = cookiesStore.get("user_id")!.value;

    // Fetch talent by user_id
    console.log("Fetching talent for user_id:", userId);
    const { data, error } = await supabase
      .from('talent')
      .select('*')
      .eq('user_id', userId);
    console.log("Fetched talent data:", data, "error:", error);

    if (error) throw error;
    
    // Return first talent or null if none found
    const talent = data && data.length > 0 ? data[0] : null;
    return { success: true, data: talent };
  } catch (error) {
    console.error('Error fetching current user talent:', error);
    return { success: false, error: 'Failed to fetch talent' };
  }
}

export async function updateCurrentUserTalent(talentData: {
  name: string;
  prenom: string;
  adresse?: string;
  lat?: number;
  long?: number;
}) {
  try {
    // Get current user session
    const cookiesStore = await cookies();
    if (!cookiesStore.get("user_id")) {
      return { success: false, error: 'Not authenticated' };
    } 
    
    const userId = cookiesStore.get("user_id")!.value;

    // Update talent by user_id
    console.log("Updating talent for user_id:", userId, "with data:", talentData);
    const { data, error } = await supabase
      .from('talent')
      .update(talentData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error updating talent:', error);
    return { success: false, error: 'Failed to update talent' };
  }
}
