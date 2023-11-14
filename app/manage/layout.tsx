"use client";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    let user = localStorage.getItem("USER");
    if (!user) {
      router.push("/login");
    }
  }, []);
  return (
    <>
      <NavBar />
      <div className="flex items-start">
        <SideBar />
        <main className="relative min-h-screen w-full overflow-y-auto bg-gray-50 dark:bg-gray-900 lg:ml-64">
          {children}
        </main>
      </div>
    </>
  );
}
