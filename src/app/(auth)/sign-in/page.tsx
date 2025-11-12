'use client'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

export default function SignInPage() {
  const { data: session } = useSession()
  const router = useRouter()



  // Zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    },
  })


  // api call
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    })


    if (result?.error) {
      toast.error(result.error)
    }
  }





  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        {/* Card with Material Design elevation and HIG clarity */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-auto
                      border border-gray-100/50 backdrop-blur-sm
                      transition-all duration-300 hover:shadow-xl">

          {/* Profile header with clear hierarchy */}
          <div className="text-center mb-8">
            {/* Avatar with subtle depth */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 
                          rounded-full mx-auto mb-4 shadow-md flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                {session.user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Clear, readable text with proper hierarchy */}
            <p className="text-gray-600 text-base mb-2">Signed in as</p>
            <p className="text-gray-900 text-lg font-semibold break-words">
              {session.user?.email}
            </p>
          </div>

          {/* Action buttons with clear affordance */}
          <div className="space-y-4">
            {/* Primary action with Material Design button */}
            <button
              onClick={() => signOut()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                       py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg
                       transition-all duration-200 active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign Out
            </button>

            {/* Secondary action with HIG clarity */}
            <Link
              href={'/dashboard'}
              className="w-full border border-gray-300 text-gray-700 
                       py-3 px-4 rounded-xl font-medium text-center block
                       transition-all duration-200 hover:bg-gray-50
                       active:bg-gray-100 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </Link>
          </div>

          {/* Subtle footer text */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Secure • Private • Encrypted
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 transition-all duration-200 hover:shadow-xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md mb-4">
              <span className="text-white font-bold text-xl">MM</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Sign In to Mystery Message
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email / Username */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email or Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email or username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
              >
                Sign In
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Don’t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
