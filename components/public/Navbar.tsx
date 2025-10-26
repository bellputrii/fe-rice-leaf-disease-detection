"use client";

import { useState, useEffect } from "react";
import { Menu, X, Home, BookOpen, Users, GraduationCap, ClipboardList, LogIn, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { name: "Home", icon: <Home size={18} />, href: "/home" },
    { name: "E-Learning", icon: <BookOpen size={18} />, href: "/elearning" },
    { name: "Kisah Inspiratif", icon: <Users size={18} />, href: "/kisah-inspiratif" },
    { name: "E-Mentoring", icon: <GraduationCap size={18} />, href: "/ementoring" },
    { name: "Course Saya", icon: <ClipboardList size={18} />, href: "/course" },
  ];

  // Fungsi untuk mengecek apakah link aktif
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 py-2" 
          : "bg-white shadow-sm border-b border-gray-200 py-3"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className={`transition-all duration-300 ${
            isScrolled ? "w-8 h-8" : "w-10 h-10"
          } relative bg-blue-600 rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">AP</span>
          </div>
          <Link 
            href="/" 
            className={`font-semibold transition-all duration-300 ${
              isScrolled ? "text-lg text-blue-800" : "text-xl text-blue-800"
            }`}
          >
            Ambil Prestasi
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 ${
                isActiveLink(item.href)
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"
              } ${isScrolled ? "py-2" : "py-2.5"}`}
            >
              <span className={`transition-transform duration-200 ${
                isActiveLink(item.href) ? "scale-110" : ""
              }`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Auth Buttons & Profile Section */}
        <div className="flex items-center gap-3">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <Link
              href="/auth/login?tab=register"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all duration-200"
            >
              <UserPlus size={16} />
              <span>Daftar</span>
            </Link>
          </div>

          {/* Notification Badge - Tampilkan jika user sudah login nanti */}
          {/* <div className="relative">
            <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-0.5 -right-0.5 animate-pulse"></div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div> */}

          {/* Profile Image - Tampilkan jika user sudah login nanti */}
          {/* <div className={`relative transition-all duration-300 ${
            isScrolled ? "w-8 h-8" : "w-9 h-9"
          }`}>
            <Image
              src="/profile.jpg"
              alt="Profile"
              fill
              className="rounded-full border-2 border-blue-200 object-cover hover:border-blue-400 transition-colors"
            />
          </div> */}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all ${
                  isActiveLink(item.href)
                    ? "bg-blue-600 text-white shadow-inner"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span className={`transition-transform ${
                  isActiveLink(item.href) ? "scale-110" : ""
                }`}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.name}</span>
                {isActiveLink(item.href) && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
            
            {/* Auth Buttons di Mobile */}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-blue-700 hover:bg-blue-50 transition-all"
              >
                <LogIn size={18} />
                <span className="font-medium">Login</span>
              </Link>
              <Link
                href="/auth/login?tab=register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 py-3 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                <UserPlus size={18} />
                <span className="font-medium">Daftar</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}