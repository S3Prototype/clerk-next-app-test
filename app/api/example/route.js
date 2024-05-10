import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId, getToken } = auth();

  let value = "Yo";
  await getToken({ template: "integration_firebase" })
    .then((result) => (value = result))
    .catch((error) => (value = error));

  return Response.json(value);
}
