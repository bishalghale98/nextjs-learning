'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-gray-900 hover:text-gray-700 transition-colors duration-200"
        >
          Mystery Message
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              {/* Dashboard Link - Clear and accessible */}
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Dashboard
              </Link>

              {/* User info with better hierarchy */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="flex flex-col text-right leading-tight">
                  <span className="text-xs text-gray-500 font-normal">Signed in as</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[140px]">
                    {user?.username || user?.email}
                  </span>
                </div>

                {/* Avatar with subtle depth */}
                <Avatar className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md border border-blue-200">
                  <AvatarFallback className="font-semibold">
                    {(user?.username?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Sign out with clear affordance */}
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className={cn(
                    "border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                    "active:scale-95 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  )}
                >
                  Sign Out
                </Button>
              </div>

              {/* Mobile view */}
              <div className="sm:hidden flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                  <AvatarFallback className="font-medium">
                    {(user?.username?.[0] || user?.email?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </>
          ) : (
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}