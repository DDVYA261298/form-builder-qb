import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import "./globals.scss";

export const metadata = {
  title: "Form Builder",
  description: "qb assessment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
