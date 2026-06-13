import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeScript from "@/components/ThemeScript";

export const metadata: Metadata = {
  title: "Charanjit Singh — Full Stack Developer · Designer · Data Scientist",
  description:
    "Charanjit Singh — multi-disciplinary technologist: full stack development, AI products, design, IBM-certified data science, digital marketing and enterprise IT. Abu Dhabi, UAE.",
  metadataBase: new URL("https://thecharanjitsingh.com"),
  openGraph: {
    title: "Charanjit Singh — Portfolio",
    description:
      "Full stack development, design, IBM-certified data science, digital marketing & IT.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
