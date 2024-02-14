"use client";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabaseClient = async (supabaseAccessToken: string | null) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ?? "",
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );
  // set Supabase JWT on the client object,
  // so it is sent up with all Supabase requests
  return supabase;
};

export default function Home() {
  const { getToken } = useAuth();

  const fetchData = async () => {
    // Replace with your JWT template name
    const supabaseAccessToken = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(supabaseAccessToken);

    // Replace with your database table name
    const { data, error } = await supabase.from("your_table").select();

    // Handle the response

    console.log("Data", data);
    console.log("-------------");
    console.log("Error", error);

    setFetchedData(data);
    setFetchedError(error);
  };

  const [fetchedData, setFetchedData] = useState<any>(null);
  const [fetchedError, setFetchedError] = useState<any>(null);

  return (
    <>
      <div>
        <button
          style={{
            color: "black",
            background: "white",
            padding: "15px",
            margin: "15px",
          }}
          onClick={fetchData}
        >
          Fetch data
        </button>
      </div>
      <h2>Data</h2>
      <p>
        <code>{fetchedData?.length ? fetchedData : "No data"}</code>
      </p>
      <h2>Errors</h2>
      <p>
        <code>{fetchedError?.length ? fetchedError : "No errors"}</code>
      </p>
    </>
  );
}
