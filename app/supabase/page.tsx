"use client";
import { createClient } from "@supabase/supabase-js";
import { useRef, useState } from "react";

// Add clerk to Window to avoid type errors
declare global {
  interface Window {
    Clerk: any;
  }
}

function createClerkSupabaseClient() {
  console.log(
    "Create clerk client called. window.Clerk exists?",
    Boolean(window.Clerk)
  );
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "",
    {
      global: {
        // Get the Supabase token with a custom fetch method
        fetch: async (url, options = {}) => {
          console.log(
            "window.Clerk exists at moment fetch called?:",
            Boolean(window.Clerk)
          );
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

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input
          onSubmit={sendAddress}
          style={{ color: "black" }}
          type="text"
          ref={inputRef}
        />
        <button onClick={sendAddress}>Send Address</button>
        <button onClick={listAddresses}>Fetch Addresses</button>
      </div>
      <h2>Addresses</h2>
      {!addresses ? (
        <p>No addresses</p>
      ) : (
        <ul>
          {addresses.map((address: any) => (
            <li key={address.id}>{address.content}</li>
          ))}
        </ul>
      )}
    </>
  );
}
