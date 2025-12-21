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
  BookOpen,
  Search,
  Check,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { getMe } from "@/lib/api";
const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: BarChart2,
  },
  {
    title: "Expert Verify",
    href: "/expert-verify",
    icon: ScanFace,
  },
  {
    title: "Test Management",
    href: "/test-management",
    icon: BookOpen,
  },
  {
    title: "Post Moderation",
    href: "/post-moderation",
    icon: FileText,
  },
  {
    title: "Expert Review",
    href: "/expert-review",
    icon: Check,
  },
  {
    title: "View Community",
    href: "/view-community",
    icon: CircleUser,
  },
];

function UserDropdown({
  username,
  role,
  avatarUrl,
  onLogout,
}: {
  username: string;
  role: string;
  avatarUrl?: string;
  onLogout?: () => void;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100">
        <img
          src={avatarUrl || "https://i.pravatar.cc/40?img=26"}
          alt="Avatar"
          className="h-10 w-10 rounded-full"
        />

        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">{username}</span>
          <span className="text-xs text-gray-500 capitalize">{role}</span>
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
                <button
                  type="button"
                  onClick={() => {
                    if (onLogout) {
                      onLogout();
                      return;
                    }
                    // Fallback inline logout
                    if (typeof window !== "undefined") {
                      localStorage.removeItem("token");
                      localStorage.removeItem("username");
                      localStorage.removeItem("role");
                      localStorage.removeItem("avatar_url");
                      window.location.href = "/login";
                    }
                  }}
                  className={cn(
                    "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#E0D7F9]",
                    active ? "bg-gray-100" : ""
                  )}
                >
                  Logout
                </button>
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
  avatarUrl,
  onLogout,
  username,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string;
  onLogout?: () => void;
  username?: string;
  role?: string;
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
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100",
                  isActive
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
            );
          })}
        </nav>

        {/* User section at the bottom - mobile only */}
        <div className="md:hidden absolute bottom-0 w-full border-t bg-white px-4 lg:px-8 py-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-2">
              <img
                src={avatarUrl || "https://i.pravatar.cc/40?img=26"}
                alt="Avatar"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">
                  {username || "PLuynh"}
                </span>
                <span className="text-xs text-gray-500">{role || "Admin"}</span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onLogout) {
                  onLogout();
                  return;
                }
                if (typeof window !== "undefined") {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  localStorage.removeItem("role");
                  localStorage.removeItem("avatar_url");
                  window.location.href = "/login";
                }
              }}
              className="bg-destructive flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 !text-white"
            >
              Logout
            </button>
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

function Header({
  onToggleSidebar,
  username,
  role,
  avatarUrl,
  onLogout,
}: {
  onToggleSidebar: () => void;
  username: string;
  role: string;
  avatarUrl?: string;
  onLogout?: () => void;
}) {
  const [searchTopic, setSearchTopic] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = searchTopic.trim();
    if (value === "") {
      router.push("/view-community");
      return;
    }
    router.push(`/view-community?topic=${encodeURIComponent(value)}`);
  };

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

      {/* Center Search Bar (Facebook-style) */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center w-full max-w-md mx-6 relative"
      >
        <Search className="absolute left-3 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search topics..."
          value={searchTopic}
          onChange={(e) => setSearchTopic(e.target.value)}
          className="pl-10 rounded-full bg-gray-100 border-gray-300 focus:ring-2 focus:ring-[#7F56D9]"
        />
      </form>

      <div className="hidden md:flex items-center space-x-4">
        <UserDropdown
          username={username}
          role={role}
          avatarUrl={avatarUrl}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("avatar_url");
    }
    // navigate to login
    router.replace("/login");
  };

  useEffect(() => {
    // run only on client
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    (async () => {
      try {
        setIsCheckingAuth(true);
        const data: any = await getMe();
        setUsername(data?.username || "");
        setRole(data?.role || "");
        setAvatarUrl(data?.avatar_url || "");
        setIsCheckingAuth(false);
      } catch (err) {
        // on failure, clear storage and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("role");
          localStorage.removeItem("avatar_url");
        }
        router.replace("/login");
      }
    })();
  }, [router]);

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
    // don't render any protected UI until auth check finishes to avoid flash
    isCheckingAuth ? (
      <div className="min-h-screen bg-white" />
    ) : (
      <div className="min-h-screen bg-gray-100 text-sm md:text-base">
        <Header
          onToggleSidebar={toggleSidebar}
          username={username}
          role={role}
          avatarUrl={avatarUrl}
          onLogout={handleLogout}
        />
        <div className="flex pt-16">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            avatarUrl={avatarUrl}
            onLogout={handleLogout}
            username={username}
            role={role}
          />
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
    )
  );
}
