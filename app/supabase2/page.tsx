import { createClient } from "@supabase/supabase-js";

function createClerkSupabaseClient() {
  return createClient(url, publickey, {
    global: {
      fetch: async (url, options = {}) => {
        // 1. Grab getToken from window instead of useAuth(). This might need handling for signed out?
        const clerkToken = await window.Clerk.session.getToken({
          template: "supabase",
        });

        // 2. Construct fetch headers. I'm not certain about this syntax, needs testing.
        const headers = options?.headers || new Headers();
        headers.set("Authorization", `Bearer ${clerkToken}`);

        // 3. Now call the default fetch
        return fetch(url, {
          ...options,
          headers,
        });
      },
    },
  });
}
