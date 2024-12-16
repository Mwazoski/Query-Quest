"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Database,
  Book,
  Layout,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-background border-b">
      <div className="container-sm mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Database className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="sr-only">SQL Learn</span>
          </Link>
          <div className="flex items-center">
            <div className="flex justify-center">
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <NavLink href="/main">Home</NavLink>
                <NavLink href="/lessons">Lessons</NavLink>
                <NavLink href="/challenges">Challenges</NavLink>
                <NavLink href="/playground">SQL Playground</NavLink>
              </nav>
            </div>
          </div>
          <div className="hidden md:ml-4 md:flex md:items-center">
            <UserMenu />
          </div>
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="/lessons" mobile>
              Lessons
            </NavLink>
            <NavLink href="/exercises" mobile>
              Exercises
            </NavLink>
            <NavLink href="/playground" mobile>
              SQL Playground
            </NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium">Student Name</div>
                <div className="text-sm font-medium text-muted-foreground">
                  student@example.com
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <MobileMenuItem href="/profile">Profile</MobileMenuItem>
              <MobileMenuItem href="/settings">Settings</MobileMenuItem>
              <MobileMenuItem href="/logout">Sign out</MobileMenuItem>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children, mobile = false }) {
  const baseClasses =
    "text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors";
  const desktopClasses = "px-3 py-2 text-sm font-medium";
  const mobileClasses = "block px-3 py-2 text-base font-medium";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
    >
      {children}
    </Link>
  );
}

function MobileMenuItem({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      {children}
    </Link>
  );
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <Book className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Layout className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-red-500 hover:text-white">
          <LogOut className="mr-2 h-4 w-4 text-inherit" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
