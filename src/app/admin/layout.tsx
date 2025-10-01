"use client";
import { ReactNode, useState, useEffect, forwardRef } from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Users,
  ShoppingCart,
  Menu as MenuIcon,
  Package,
  FileText,
  CircleUser,
  List,
  ChevronRight,
} from "lucide-react";
import { LogoutButton } from "@/components/ui/logout";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Thống kê doanh thu",
    href: "/admin/statics",
    icon: BarChart2,
  },
  {
    title: "Quản lý",
    icon: Users,
    children: [
      { title: "Nhân viên", href: "/admin/manage/employee" },
      { title: "Ca làm việc", href: "/admin/manage/shift" },
      { title: "Phân công làm việc", href: "/admin/manage/shift-assignment" },
    ],
  },
  {
    title: "Đơn hàng",
    icon: ShoppingCart,
    children: [
      { title: "Chờ thanh toán", href: "/admin/order/pending" },
      { title: "Đã thanh toán", href: "/admin/order/paid" },
      { title: "Hủy đơn hàng", href: "/admin/order/cancelled" },
    ],
  },
  {
    title: "Thực đơn",
    icon: MenuIcon,
    children: [
      { title: "Món Ăn", href: "/admin/menu/food" },
      { title: "Tạo thực đơn tuần", href: "/admin/menu/weekly-menu" },
    ],
  },
  {
    title: "Tồn kho",
    icon: Package,
    children: [
      { title: "Tồn kho ngày", href: "/admin/inventory/daily" },
      { title: "Báo cáo", href: "/admin/inventory/report" },
    ],
  },
];

const handleLogout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.error("Logout failed", e);
  } finally {
    localStorage.removeItem("user");
    localStorage.setItem("justLoggedOut", "1");
    window.location.href = "/login";
  }
};

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
        className={`fixed top-16 left-0 h-[calc(100dvh-4rem)] w-64 bg-white border-r transform transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex flex-col h-full">
          {/* Menu nav items */}
          <nav className="p-4 flex-1">
            <Accordion type="multiple" className="w-full">
              {navItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={item.title}
                  className="border-b-0"
                >
                  {item.children ? (
                    <AccordionItem
                      key={index}
                      value={item.title}
                      className="border-b-0"
                    >
                      <AccordionTrigger className="hover:bg-gray-100 px-2 py-3 flex items-center justify-between !font-medium !no-underline">
                        <div className="flex items-center">
                          <item.icon className="h-5 w-5 mr-2 text-[#1E40AF]" />
                          {item.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="ml-6 space-y-2">
                          {item.children.map((child, childIndex) => (
                            <li key={childIndex}>
                              <Link
                                href={child.href}
                                className={`block px-2 py-2 rounded-md text-sm ${
                                  pathname === child.href
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "hover:bg-gray-100"
                                }`}
                                onClick={() => {
                                  if (window.innerWidth < 768) {
                                    onClose();
                                  }
                                }}
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-2 py-3 rounded-md text-[14px] !md:text-base font-medium no-underline ${
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        if (window.innerWidth < 768) {
                          onClose();
                        }
                      }}
                    >
                      <item.icon className="h-5 w-5 mr-2 text-[#1E40AF]" />
                      {item.title}
                    </Link>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </nav>

          {/* User info always at the bottom with fixed position */}
          <div className="flex md:hidden items-center justify-between px-4 py-3 border-t bg-white sticky">
            <div className="flex items-center space-x-2">
              <CircleUser className="h-6 w-6 text-[#1E40AF]" />
              <span className="font-medium">Mã NV: {nhanVienId || "—"}</span>
            </div>
            <LogoutButton />
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
  nhanVienId,
}: {
  onToggleSidebar: () => void;
  nhanVienId?: string;
}) {
  return (
    <header className="fixed top-0 left-0 w-full bg-[#1E40AF] text-white h-16 flex items-center justify-between px-4 z-30">
      {/* Bên trái */}
      <div className="flex items-center min-w-0">
        <Button variant="ghost" className="p-0 mr-2" onClick={onToggleSidebar}>
          <List className="h-6 w-6" />
        </Button>
        <h1 className="text-base md:text-xl font-bold truncate">
          Hệ Thống Bán Hàng Quán Ăn Thông Minh
        </h1>
      </div>

      {/* Bên phải: chỉ hiện từ md trở lên */}
      <div className="hidden md:flex items-center space-x-4">
        <CircleUser className="h-6 w-6" />
        <span>Mã NV: {nhanVienId || "—"}</span>
        <LogoutButton />
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-sm md:text-base">
      <Header
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        nhanVienId={nhanVienId}
      />
      <div className="flex pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          nhanVienId={nhanVienId}
        />
        <main
          className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
