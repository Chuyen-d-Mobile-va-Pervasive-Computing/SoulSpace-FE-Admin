"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleUser, List, BarChart2, FileText } from "lucide-react";
import { LogoutButton } from "@/components/ui/logout";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

function Sidebar({
  isOpen,
  onClose,
  nhanVienId,
}: {
  isOpen: boolean;
  onClose: () => void;
  nhanVienId?: string;
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
        <nav className="p-4 flex flex-col space-y-2">
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

        <div className="flex md:hidden items-center justify-between px-4 py-3 border-t bg-white sticky bottom-0">
          <div className="flex items-center space-x-2">
            <CircleUser className="h-6 w-6 text-[#1E40AF]" />
            <span className="font-medium">Mã NV: {nhanVienId || "—"}</span>
          </div>
          <LogoutButton />
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

function Header({
  onToggleSidebar,
  nhanVienId,
}: {
  onToggleSidebar: () => void;
  nhanVienId?: string;
}) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white text-white h-16 flex items-center justify-between px-4 z-30">
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
        <CircleUser className="h-6 w-6" />
        <span>Mã NV: {nhanVienId || "—"}</span>
        <LogoutButton />
      </div>
    </header>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nhanVienId, setNhanVienId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setNhanVienId(parsed?.nhan_vien_id || parsed?.cashier_id);
      } catch (e) {
        console.error("Parse user failed", e);
      }
    }

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
      <Header onToggleSidebar={toggleSidebar} nhanVienId={nhanVienId} />
      <div className="flex pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          nhanVienId={nhanVienId}
        />
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 transition-all duration-300",
            isSidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
