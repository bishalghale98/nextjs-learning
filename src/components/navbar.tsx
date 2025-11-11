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
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Mystery Message
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <div className="hidden sm:flex flex-col text-right leading-tight">
                <span className="text-xs text-gray-500">Welcome back</span>
                <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                  {user?.username || user?.email}
                </span>
              </div>

              <Avatar className="bg-indigo-100 text-indigo-700 shadow-inner">
                <AvatarFallback className="font-semibold">
                  {(user?.username?.[0] || user?.email?.[0] || "?").toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <Button
                variant="outline"
                onClick={() => signOut()}
                className={cn(
                  "border-gray-200 text-gray-800 hover:bg-gray-100 active:scale-[0.98] transition-all"
                )}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
