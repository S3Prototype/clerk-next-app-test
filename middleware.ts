import { auth, clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export default clerkMiddleware((auth, req: NextRequest) => {});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
