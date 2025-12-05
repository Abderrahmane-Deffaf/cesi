'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function signUp(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: undefined, // Disable email confirmation redirect
    },
  });

  if (error) {
    return { error: error.message };
  }

  const cookiesStore = await cookies();
  if (!data?.user?.id || !data?.session?.access_token) {
    return { error: 'User data is missing' };
  }
  cookiesStore.set("access_token", data.session.access_token);
  cookiesStore.set("user_id", data.user.id);

  const { data: talentData, error: talentError } = await supabase
    .from("talent")
    .insert([{ user_id: data.user.id }]);
  if (talentError) {
    return { error: talentError.message };
  }
  console.log("Created talent profile for user:", talentData);
  
  return { data };
}
