import { Outlet } from "react-router-dom";
import { useState, useRef } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  ChevronDown,
  Users,
  LayoutDashboard,
  Settings,
  LogOut,
  UserCheck,
  FileText,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useAuth } from "../hooks/useAuth";
import Logo from "../components/common/Logo";

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<string | null>(null);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState<string | null>(
    null
  );

  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Navigation items
  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Employees",
      href: "/employees",
      icon: Users,
      subItems: [
        { name: "All Employees", href: "/employees" },
      ],
    },
    { name: "Settings", href: "/settings", icon: Settings },
    {
      name: "User Management",
      href: "/user-management",
      icon: UserCheck,
      subItems: [
        { name: "User List", href: "/user-management/users" },
        { name: "Roles", href: "/user-management/roles" },
        { name: "Permissions", href: "/user-management/permissions" },
      ],
    },
    {
      name: "Reports",
      href: "/reports",
      icon: FileText,
      subItems: [
        { name: "Sales Reports", href: "/reports/sales" },
        { name: "Employee Performance", href: "/reports/performance" },
        { name: "Inventory", href: "/reports/inventory" },
      ],
    },
  ];

  const toggleSubmenu = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setIsSubmenuOpen((prev) => (prev === name ? null : name));
  };

  const toggleMobileSubmenu = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    setIsMobileSubmenuOpen((prev) => (prev === name ? null : name));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <Logo className="ml-0 md:ml-2" />
              </div>
            </div>

            {/* Horizontal Navigation Menu - Desktop */}
            <nav className="hidden md:flex space-x-6 ml-6">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <a
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-600 h-16"
                    onClick={(e) => {
                      if (item.subItems) {
                        e.preventDefault();
                        toggleSubmenu(e, item.name);
                      }
                    }}
                  >
                    {item.name}
                    {item.subItems && (
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                    )}
                  </a>

                  {/* Submenu */}
                  {item.subItems && isSubmenuOpen === item.name && (
                    <div
                      ref={(el) => (submenuRefs.current[item.name] = el)}
                      className="absolute z-10 left-0 mt-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 animate-fade-in"
                    >
                      {item.subItems.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Profile Dropdown */}
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-4 relative flex-shrink-0">
                <div>
                  <button
                    type="button"
                    className="flex items-center space-x-3 focus:outline-none"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="hidden md:block text-left">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                      <p className="text-xs text-gray-500 capitalize">
                        {user?.role}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Profile dropdown menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fade-in">
                    <a href="/profile" className="menu-item flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>
                    <a href="/settings" className="menu-item flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                    <button
                      onClick={logout}
                      className="menu-item flex items-center w-full text-left"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden bg-white shadow-lg fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pt-5 pb-6 px-4">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-6">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600 rounded-md"
                    onClick={(e) => {
                      if (item.subItems) {
                        e.preventDefault();
                        toggleMobileSubmenu(e, `mobile-${item.name}`);
                      }
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5 text-gray-500" />
                    {item.name}
                    {item.subItems && (
                      <ChevronDown className="ml-auto h-4 w-4 text-gray-500" />
                    )}
                  </a>

                  {/* Mobile submenu */}
                  {item.subItems &&
                    isMobileSubmenuOpen === `mobile-${item.name}` && (
                      <div className="pl-10 space-y-1 animate-slide-down">
                        {item.subItems.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block py-2 text-sm text-gray-700 hover:text-primary-600"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                </div>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary-600 rounded-md"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

