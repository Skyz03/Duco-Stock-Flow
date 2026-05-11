import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Browser / client-component Supabase client (anon key).
 * Import only from client components (`"use client"`).
 */
export const supabase = createClientComponentClient();
