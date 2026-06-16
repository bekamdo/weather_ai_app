import type { PropsWithChildren } from "react";
import { Header } from "./header";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-rose-100 dark:from-[#1a0a05] dark:via-[#2a1008] dark:to-[#1f0d0d] min-h-screen">
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t backdrop-blur supports-backdrop-filter:bg-background/60 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
           <p className="text-sm"> © {new Date().getFullYear()} Ben Kamau. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}