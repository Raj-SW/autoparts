"use client";

import { Button } from "@/components/ui/button";
import { Car, MessageCircle, Menu, X, Phone, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ShoppingCartComponent from "./ShoppingCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Parts Catalog" },
    { href: "/quote", label: "Get Quote" },
    { href: "/partner", label: "Partners" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-1 text-center text-sm">
        <div className="container mx-auto px-4 flex items-center justify-center space-x-4">
          <span>📞 Emergency Parts Hotline: +230 5712-3456</span>
          <span>•</span>
          <span>⚡ 1-Hour Quote Guarantee</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#D72638] rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-montserrat">
                A.M.O Distribution
              </h1>
              <p className="text-sm text-gray-600">
                🇲🇺 #1 Spare Parts in Mauritius
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-700 hover:text-[#D72638] transition-colors font-medium ${
                  pathname === item.href ? "text-[#D72638] font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Shopping Cart */}
            <ShoppingCartComponent />

            {/* Auth Buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}

            <Button
              variant="outline"
              className="border-[#D72638] text-[#D72638] hover:bg-[#D72638] hover:text-white"
              onClick={() => window.open("tel:+23057123456", "_self")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-lg font-medium transition-colors ${
                    pathname === item.href
                      ? "text-[#D72638] font-semibold"
                      : "text-gray-700 hover:text-[#D72638]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 pt-4 border-t space-y-3">
              {/* Mobile Cart */}
              <div className="flex justify-center">
                <ShoppingCartComponent />
              </div>

              {/* Mobile Auth Buttons */}
              {user ? (
                <div className="space-y-2">
                  <div className="text-center text-sm text-gray-600">
                    Welcome, {user.name}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    {user.role === "admin" && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href="/admin" onClick={() => setIsOpen(false)}>
                          Admin
                        </Link>
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}

              <Button
                className="w-full bg-[#D72638] hover:bg-[#B91C2C] text-white font-semibold"
                onClick={() => {
                  window.open(
                    "https://wa.me/23057123456?text=🚗 I need spare parts quote!",
                    "_blank"
                  );
                  setIsOpen(false);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Quote
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#D72638] text-[#D72638]"
                onClick={() => {
                  window.open("tel:+23057123456", "_self");
                  setIsOpen(false);
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                📞 Call: 5712-3456
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
