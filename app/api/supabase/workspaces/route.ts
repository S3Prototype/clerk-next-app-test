import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("HI");
  const { sessionClaims, getToken } = auth();
  console.log("HI");
  const result = await getToken({ template: "supabase" });
  console.log("Result", result);
  console.log("YOOOOOOOOO");
  return NextResponse.json({ result });
}
