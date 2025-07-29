import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "My Porto",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
