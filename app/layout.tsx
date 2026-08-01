import "./globals.css";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "./providers";
import { TooltipProvider } from "@/components/ui/tooltip";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GearUp - Premium Outdoor Gear Rental",
  description: "Rent top-quality outdoor equipment from trusted providers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#EDEAE0] text-[#20291F]">
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster
              toastOptions={{
                style: {
                  background: "#20291F",
                  color: "#EDEAE0",
                  border: "1px solid rgba(78, 93, 90, 0.2)",
                  fontFamily: "var(--font-inter)",
                },
              }}
            />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
