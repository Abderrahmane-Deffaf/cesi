'use server';

import { supabase } from '@/lib/supabase';
import { cookies } from 'next/dist/server/request/cookies';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });


  if (error) {
    return { error: error.message };
  }
  const cookiesStore = await cookies();
  cookiesStore.set("access_token", data.session.access_token);
  cookiesStore.set("user_id", data.user.id);

  return { data };
}
