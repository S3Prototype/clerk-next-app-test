"use client";

import { useUser } from "@clerk/nextjs";

export function CreatePasskeyButton() {
  const { user } = useUser();

  const createClerkPasskey = () => {
    (async () => {
      try {
        const response = await user?.__experimental_createPasskey();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    })();
  };

  return <button onClick={createClerkPasskey}>Create a passkey now</button>;
}
