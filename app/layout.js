import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/Header";
import Provider from "./Provider";
import '@smastrom/react-rating/style.css'
import Footer from "./_components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "QuickBite | SNU",
  description: "Online Food Ordering site for SNU students",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>

      <html lang="en">
        <body className={`${inter.className} antialiased bg-gray-100`}>
          <Provider>{children}</Provider>
          {/* <Footer /> */}
        </body>
      </html>

    </ClerkProvider>
  );
}
