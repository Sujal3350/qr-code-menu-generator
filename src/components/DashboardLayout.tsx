
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { QrCode, Menu as MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationItem {
  name: string;
  path: string;
  icon?: JSX.Element;
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Create Menu", path: "/create-menu" },
  { name: "My Menus", path: "/my-menus" },
  { name: "Profile", path: "/profile" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation for mobile */}
      <header className="bg-white shadow-sm lg:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-brand-600 p-2 rounded-full mr-2">
              <QrCode size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-semibold">QR Menu</h1>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <div className="flex items-center space-x-2 px-4 mb-6">
                    <div className="bg-brand-600 p-2 rounded-full">
                      <QrCode size={20} className="text-white" />
                    </div>
                    <h2 className="font-semibold">QR Menu</h2>
                  </div>
                  <nav className="space-y-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-4 py-2 text-sm ${
                          isActive(item.path)
                            ? "bg-brand-100 text-brand-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="mt-auto p-4">
                  <Button 
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <div className="bg-brand-600 p-2 rounded-full mr-2">
                <QrCode size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold">QR Menu</h1>
            </div>

            {/* Navigation */}
            <nav className="mt-5 flex-1 flex flex-col px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? "bg-brand-100 text-brand-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* User profile */}
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center mb-4">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {user?.businessName || "Business Name"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "email@example.com"}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100"
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
