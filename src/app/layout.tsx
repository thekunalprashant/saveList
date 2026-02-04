import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import AppLayout from "@/components/layout/AppLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaveList | Unified Productivity",
  description: "Manage tasks, goals, and your watchlist in one beautiful dashboard.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SaveList",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import OfflineStatus from "@/components/OfflineStatus";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <OfflineStatus />
              <AppLayout>
                {children}
              </AppLayout>
            </ToastProvider>
          </ThemeProvider>

        </AuthProvider >
      </body >
    </html >
  );
}




