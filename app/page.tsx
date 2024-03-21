import { CreatePasskeyButton } from "@/components/passkeys/CreatePasskeyButton";
import { DeletePasskeyUI } from "@/components/passkeys/DeletePasskeyUI";
import { SignInWithPasskeyButton } from "@/components/passkeys/SignInWithPasskeyButton.tsx";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      <CreatePasskeyButton />
      <SignInWithPasskeyButton />
      <DeletePasskeyUI />
    </main>
  );
}
