import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ClerkProvider>
          <ClerkLoading>
            <div>Clerk is loading...</div>
          </ClerkLoading>
          <ClerkLoaded>
            <UserButton />
            {children}
          </ClerkLoaded>
        </ClerkProvider>
      </body>
    </html>
  );
}
