"use client";
import { EnrollMFA } from "@/components/EnrollMFA";
import { createClient } from "@supabase/supabase-js";
import { useRef, useState } from "react";
// Add clerk to Window to avoid type errors
declare global {
  interface Window {
    Clerk: any;
  }
}

function createClerkSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY ?? "",
    {
      auth: {
        autoRefreshToken: false, // All my Supabase access is from server, so no need to refresh the token
        detectSessionInUrl: false, // We are not using OAuth, so we don't need this. Also, we are manually "detecting" the session in the server-side code
        persistSession: false, // All
      },
      global: {
        // Get the Supabase token with a custom fetch method
        fetch: async (url, options = {}) => {
          const clerkToken = await window.Clerk.session?.getToken({
            template: "supabase",
          });

          // Construct fetch headers
          const headers = new Headers(options?.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

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

const client = createClerkSupabaseClient();

export default function Supabase() {
  const [addresses, setAddresses] = useState<any>();
  const listAddresses = async () => {
    // Fetches all addresses scoped to the user
    // Replace "Addresses" with your table name
    const { data, error } = await client.from("Posts").select();
    if (!error) setAddresses(data);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const sendAddress = async () => {
    if (!inputRef.current?.value) return;
    await client.from("Posts").insert({
      // Replace content with whatever field you want
      content: inputRef.current?.value,
    });
  };

  const updateUser = async () => {
    const supbaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY ?? ""
    );
    const { data, error } = await supbaseAdmin.auth.admin.updateUserById(
      "339d9f1b-4b7e-47f2-a90a-76d59ad4637a",
      {
        user_metadata: {
          display_name: "custom display name",
          name: "custom name",
          first_name: "custom first name",
          second_name: "custom second name",
        },
      }
    );
    console.log("Data:", data, "Error:", JSON.stringify(error, null, 2));
  };

  return <EnrollMFA supabase={client} />;

  // return (
  //   <>
  //     <div style={{ display: "flex", flexDirection: "column" }}>
  //       <input onSubmit={sendAddress} type="text" ref={inputRef} />
  //       <button onClick={sendAddress}>Send Address</button>
  //       <button onClick={listAddresses}>Fetch Addresses</button>
  //       <button onClick={updateUser}>Update</button>
  //     </div>
  //     <h2>Addresses</h2>
  //     {!addresses ? (
  //       <p>No addresses</p>
  //     ) : (
  //       <ul>
  //         {addresses.map((address: any) => (
  //           <li key={address.id}>{address.content}</li>
  //         ))}
  //       </ul>
  //     )}
  //   </>
  // );
}
