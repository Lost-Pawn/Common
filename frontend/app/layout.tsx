import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Common — Good things, shared.",
  description:
    "Borrow useful things. Share what you have. A community for tools, books, gear and spaces.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("common-theme");document.documentElement.dataset.theme=t||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}catch(e){document.documentElement.dataset.theme="light"}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
