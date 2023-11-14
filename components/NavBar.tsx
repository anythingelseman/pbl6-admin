"use client";
import { useState, useEffect } from "react";
import { Dropdown, Navbar, Avatar } from "flowbite-react";
import Image from "next/image";
import { PiFilmReelBold } from "react-icons/pi";
import { UserAuthenticate } from "@/app/types/user";
import { useRouter } from "next/navigation";
export default function NavBar() {
  const [user, setUser] = useState<any>();
  const router = useRouter();
  const getUser = () => {
    setUser(JSON.parse(localStorage.getItem("USER") as any) || null);
  };
  useEffect(() => {
    getUser();
  }, [router]);

  const logoutHandler = () => {
    localStorage.removeItem("USER");
    router.push("/login");
  };
  return (
    <Navbar
      fluid
      rounded
      className="sticky top-0 z-10 rounded-none bg-slate-900"
    >
      <Navbar.Brand href="/">
        <PiFilmReelBold className="h-10 w-10 text-white" />
        <span className="self-center whitespace-nowrap pl-3 text-xl font-semibold text-white">
          Cinema
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2 text-white">
        <Dropdown
          inline
          label={<h1>Hello, {user?.employeeNo}</h1>}
          className="bg-slate-900 border-current"
        >
          <Dropdown.Header>
            <span className="block text-sm text-white">{user?.email}</span>
            <span className="block truncate text-sm font-medium text-white">
              Role: {user?.role}
            </span>
          </Dropdown.Header>
          <Dropdown.Item className="text-white" onClick={logoutHandler}>
            Log out
          </Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse></Navbar.Collapse>
    </Navbar>
  );
}
