"use client";

import { ClerkRuntimeError } from "@clerk/clerk-js";
import { useUser } from "@clerk/nextjs";

export function CreatePasskeyButton() {
  const { user } = useUser();

  const createClerkPasskey = async () => {
    try {
      const response = await user?.__experimental_createPasskey();
      console.log(response);
    } catch (error: ClerkRuntimeError) {
      console.table(error);
    }
  };

  return <button onClick={createClerkPasskey}>Create a passkey now</button>;
}
