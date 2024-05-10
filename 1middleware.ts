import {
  auth,
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";

export const x = () => {
  const { sessionClaims } = auth();
  redirect();
};

// export default authMiddleware({
//   // Routes that can be accessed while signed out
//   // publicRoutes: ["/anyone-can-visit-this-route"],
//   // Routes that can always be accessed, and have
//   // no authentication information
//   // ignoredRoutes: ["/no-auth-in-this-route"],
// });

export default clerkMiddleware((auth, req: NextRequest) => {
  auth().sessionClaims?.metad;
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
