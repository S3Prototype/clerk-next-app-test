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
  const [workspaces, setWorkspaces] = useState<any>();
  const listWorkspaces = async () => {
    // Fetches all workspaces scoped to the user
    // Replace "Workspaces" with your table name
    const { data, error } = await client.from("workspaces").select();
    updateWorkspaceList(data, error);
  };

  const nameRef = useRef<HTMLInputElement>(null);
  const darkModeRef = useRef<HTMLInputElement>(null);
  const langRef = useRef<HTMLInputElement>(null);
  const sendWorkspace = async () => {
    if (!nameRef.current?.value) return;
    await client.from("workspaces").insert({
      // Replace name with whatever field you want
      name: nameRef.current?.value,
      settings: {
        dark_mode: darkModeRef.current?.checked,
        default_language: langRef.current?.value,
      },
    });
    await listWorkspaces();
  };

  const updateWorkspaceList = (data: any, error: any) => {
    if (!error) setWorkspaces(data);
    console.log("Error", error);
    console.log("Data", data);
    if (nameRef?.current?.value) nameRef.current.value = "";
  };

  return (
    <div style={{ margin: "40px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <input ref={nameRef} type="text" placeholder="Name" />
        <input ref={langRef} type="text" placeholder="Default Language" />
        <div>
          <label htmlFor="darkMode">Dark Mode</label>
          <input
            ref={darkModeRef}
            id="darkMode"
            type="checkbox"
            value="Dark mode enabled"
          />
        </div>
        <button onClick={sendWorkspace}>Send Workspace</button>
        <button onClick={listWorkspaces}>Fetch Workspaces</button>
      </div>
      <h2>Workspaces</h2>
      {!workspaces || workspaces.length <= 0 ? (
        <p>No workspaces</p>
      ) : (
        <ul>
          {workspaces.map((workspace: any) => (
            <li key={workspace.id}>{JSON.stringify(workspace)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
