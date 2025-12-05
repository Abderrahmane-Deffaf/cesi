'use server';

import { cookies } from "next/headers";


export async function signOutAction() {
   const cookiesStore = await cookies() ; 
    ( cookiesStore).delete("access_token");
    ( cookiesStore).delete("user_id"); 
    return {};
}  