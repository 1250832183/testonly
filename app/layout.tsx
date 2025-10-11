import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { PostHogProvider } from "@/components/PostHogProvider";
import { PostHogPageView } from "@/components/PostHogPageView";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Turnitin Checker - Check Your Documents",
  description:
    "Check your documents for plagiarism with official Turnitin integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PostHogProvider>
          <AnalyticsProvider>
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
            <Navbar />
            <main style={{ minHeight: "calc(100vh - 72px)" }}>{children}</main>
          </AnalyticsProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
