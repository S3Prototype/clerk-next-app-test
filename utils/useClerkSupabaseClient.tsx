import { useAuth } from "@clerk/nextjs";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";

function createClerkSupabaseClient(token: string | null) {
  console.log("Create supabase client");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "",
    {
      global: {
        // Get the Supabase token with a custom fetch method
        fetch: async (url, options = {}) => {
          // Construct fetch headers
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${token}`);

          // Now call the default fetch
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}

export default function useClerkSupabaseClient() {
  const { getToken } = useAuth();
  const [client, setClient] = useState<SupabaseClient<any>>();

  return useCallback(async () => {
    const supabaseToken = await getToken({ template: "supabase" });
    return createClerkSupabaseClient(supabaseToken);
  }, [getToken]);
}
