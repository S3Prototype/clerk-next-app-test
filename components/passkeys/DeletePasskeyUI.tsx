"use client";

import { useUser } from "@clerk/nextjs";
import { useRef, useState } from "react";

export function DeletePasskeyUI() {
  const { user } = useUser();
  const passkeyToDeleteId = useRef<HTMLInputElement>(null);
  const passkeys = user?.__experimental_passkeys;
  const [success, setSuccess] = useState(false);

  const deletePasskey = () => {
    (async () => {
      try {
        const passkeyToDelete = passkeys?.find(
          (pk: any) => pk.id === passkeyToDeleteId.current?.value
        );
        const response = await passkeyToDelete?.delete();
        console.log("Response", response);
        setSuccess(true);
      } catch (error) {
        console.log("Error", error);
        setSuccess(false);
      }
    })();
  };

  return (
    <>
      <p>Passkeys:</p>
      <ul>
        {passkeys?.map((pk: any) => {
          return (
            <li key={pk.id}>
              Name: {pk.name} | ID: {pk.id}
            </li>
          );
        })}
      </ul>
      <input
        ref={passkeyToDeleteId}
        type="text"
        placeholder="ID of passkey to delete"
      />
      <button onClick={deletePasskey}>Delete passkey</button>
      <p>Passkey deleted: {success ? "Yes" : "No"}</p>
    </>
  );
}
