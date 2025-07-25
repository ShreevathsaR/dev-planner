import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/lib/providers/providers";
import { SidebarTrigger } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ weight: "500" });

export const metadata: Metadata = {
  title: "Dev Planner | AI Chatbot to plan your web dev projects",
  description: "AI Chatbot to plan your web dev projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
