import { useCallback } from "react";

export default function CustomCreatePasskeysButton() {
  const createClerkPasskey = useCallback(async () => {
    // The following code would be inside an event handler
    try {
      const passkey = await clerk.user.createPasskey();
      console.log(`Passkey with id=${passkey} is created.`);
    } catch (error) {
      if (isClerkRuntimeError(error)) {
        switch (error.code) {
          case "passkey_exists":
            return console.log("Passkey already registered");
          case "passkey_registration_cancelled":
            return console.log("Registration was cancelled by the user");
          case "passkeys_unsupported":
            return console.log("Passkeys are not supported in this device");
          case "passkeys_unsupported_platform_authenticator":
            return console.log(
              "Your device cannot be used as the authenticator"
            );
          default:
            return console.log("Unexpected error");
        }
      }
    }
  }, []);

  return <button onSubmit={createClerkPasskey}>Create Passkey</button>;
}
