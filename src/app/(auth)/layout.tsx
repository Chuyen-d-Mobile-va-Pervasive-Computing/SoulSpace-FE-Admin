"use client";

import { ReactNode, useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CircleUser,
  List,
  BarChart2,
  FileText,
  ChevronDown,
  ScanFace,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart2,
  },
  {
    title: "Post Moderation",
    href: "/post-moderation",
    icon: FileText,
  },
];

function UserDropdown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100">
        <img
          src="https://i.pravatar.cc/40?img=26"
          alt="Avatar"
          className="h-10 w-10 rounded-full"
        />

        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">PLuynh</span>
          <span className="text-xs text-gray-500">Admin</span>
        </div>
        <ChevronDown className="w-4 h-4" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border rounded-md shadow-lg focus:outline-none z-50">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/profile"
                  className={cn(
                    "block px-4 py-2 text-sm text-gray-700 hover:bg-[#E0D7F9]",
                    active ? "bg-gray-100" : ""
                  )}
                >
                  Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="#"
                  className={cn(
                    "block px-4 py-2 text-sm text-gray-700 hover:bg-[#E0D7F9]",
                    active ? "bg-gray-100" : ""
                  )}
                >
                  Logout
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          "fixed top-16 left-0 h-[calc(100dvh-4rem)] w-64 bg-white border-r transform transition-transform duration-300 ease-in-out z-20 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="px-4 lg:px-8 py-4 flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
                pathname === item.href
                  ? "bg-[#7F56D9] text-white hover:bg-[#7F56D9]"
                  : "text-gray-700"
              )}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.title}
            </Link>
          ))}
        </nav>

        {/* User section at the bottom - mobile only */}
        <div className="md:hidden absolute bottom-0 w-full border-t bg-white px-4 lg:px-8 py-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/40?img=26"
                alt="Avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">PLuynh</span>
                <span className="text-xs text-gray-500">Admin</span>
              </div>
            </Link>
            <Link
              href="#"
              className="bg-destructive flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 !text-white"
              onClick={onClose}
            >
              Logout
            </Link>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
}

function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white h-16 flex items-center justify-between px-4 lg:px-8 z-30 border-b">
      <div className="flex items-center min-w-0 gap-4">
        <Button
          variant="default"
          className="p-0 mr-2"
          onClick={onToggleSidebar}
        >
          <List className="h-6 w-6" />
        </Button>
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
        <h1 className="text-[#7F56D9] text-base md:text-xl font-bold truncate">
          SOULSPACE
        </h1>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <UserDropdown />
      </div>
    </header>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-100 text-sm md:text-base">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex pt-16">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-2 lg:p-4 transition-all duration-300",
            isSidebarOpen ? "ml-64" : "ml-4"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
