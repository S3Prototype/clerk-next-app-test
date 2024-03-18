import { EnrollMFA } from "@/components/EnrollMFA";
import { auth } from "@clerk/nextjs/server";
import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function createClerkSupabaseClient() {
  const cookieStore = cookies();
  const { getToken } = auth();

  const token = await getToken({ template: "supabase" });
  const authToken = token ? { Authorization: `Bearer ${token}` } : null;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      auth: {
        autoRefreshToken: false, // All my Supabase access is from server, so no need to refresh the token
        detectSessionInUrl: false, // We are not using OAuth, so we don't need this. Also, we are manually "detecting" the session in the server-side code
        persistSession: false, // All our access is from server, so no need to persist the session to browser's local storage
      },
      global: { headers: { "Cache-Control": "no-store", ...authToken } },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export default async function Supabase() {
  const client = await createClerkSupabaseClient();

  const { data, error } = await client.from("Posts").select();

  if (error) {
    return <p>Error: {JSON.stringify(error, null, 2)}</p>;
  }

  return (
    <div>
      <h2>Addresses</h2>
      {!data ? (
        <p>No addresses</p>
      ) : (
        <ul>
          {data.map((address: any) => (
            <li key={address.id}>{address.content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
