"use client";

import { useSignIn } from "@clerk/nextjs";

export function SignInWithPasskeyButton() {
  const { signIn } = useSignIn();

  const signInWithPasskey = async () => {
    try {
      const response = await signIn?.__experimental_authenticateWithPasskey();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={signInWithPasskey}>Sign in with a passkey</button>;
}
