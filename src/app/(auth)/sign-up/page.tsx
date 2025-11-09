"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, Search, X } from "lucide-react"

function SignUpPage() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const [debouncedUsername] = useDebounceValue(username, 300)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })

  // Check username availability with better UX
  useEffect(() => {
    let active = true
    const checkUsernameUnique = async () => {
      if (debouncedUsername?.length >= 2) {
        setIsCheckingUsername(true)
        setUsernameMessage("")
        try {
          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          console.log(response.data)
          if (active) setUsernameMessage(response.data.message)
        } catch (err) {
          const axiosError = err as AxiosError<ApiResponse>
          if (active)
            setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          if (active) setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
    return () => {
      active = false
    }
  }, [debouncedUsername])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data)
      toast.success(response.data.message)
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUsernameStatus = () => {
    if (!username) return "idle"
    if (username.length <= 1) return "too-short"
    if (isCheckingUsername) return "checking"
    if (usernameMessage.includes("available")) return "available"
    if (usernameMessage && !usernameMessage.includes("available")) return "unavailable"
    return "idle"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "text-green-600"
      case "unavailable": return "text-red-600"
      case "too-short": return "text-amber-600"
      case "checking": return "text-blue-600"
      default: return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "unavailable":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "checking":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case "too-short":
        return null
      default:
        return null
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "available":
        return usernameMessage
      case "unavailable":
        return usernameMessage
      case "checking":
        return "Checking availability..."
      case "too-short":
        return "Username must be at least 2 characters"
      default:
        return ""
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Card with elevation shadow */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 transition-all duration-200 hover:shadow-xl">
          {/* Header with better hierarchy */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md mb-4">
              <span className="text-white font-bold text-xl">MM</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Join Mystery Message
            </h1>
            <p className="text-gray-600 text-sm">
              Create your account to start anonymous conversations
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => {
                  const status = getUsernameStatus()
                  const statusColor = getStatusColor(status)

                  return (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            placeholder="Choose a username (min. 2 characters)"
                            type="text"
                            autoComplete="username"
                            className={`h-11 transition-all duration-200 focus:ring-2 ${status === "available"
                              ? "focus:ring-green-500 border-green-200"
                              : status === "unavailable"
                                ? "focus:ring-red-500 border-red-200"
                                : status === "too-short"
                                  ? "focus:ring-amber-500 border-amber-200"
                                  : "focus:ring-blue-500 border-gray-200"
                              } focus:border-transparent pr-10`}
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value.toLowerCase().replace(/\s+/g, "")
                              field.onChange(value)
                              setUsername(value)
                            }}
                          />

                          {/* Status indicator */}
                          <div className="absolute right-3 top-1/2  transform -translate-y-1/2 flex items-center space-x-1">
                            {username && (
                              <>
                                {getStatusIcon(status)}
                                <button
                                  type="button"
                                  className="opacity-0  group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-600 ml-1"
                                  onClick={() => {
                                    field.onChange("")
                                    setUsername("")
                                  }}
                                >
                                  <X className="h-4 w-4 " />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />

                      {/* Username status message with smooth transitions */}
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${username ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        {username && (
                          <div className={`flex items-center gap-2 text-sm mt-2 ${statusColor}`}>
                            {getStatusIcon(status)}
                            <span className="animate-pulse-subtle">
                              {getStatusMessage(status)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Character count indicator */}
                      {username && (
                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-xs ${username.length < 2 ? 'text-amber-600' :
                            username.length > 20 ? 'text-red-600' : 'text-gray-500'
                            }`}>
                            {username.length}/20 characters
                          </span>
                          {username.length >= 2 && (
                            <span className="text-xs text-gray-400">
                              {username.length >= 2 && username.length <= 20 ? "Good length" : ""}
                            </span>
                          )}
                        </div>
                      )}
                    </FormItem>
                  )
                }}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email address"
                        className="h-11 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Create a strong password"
                          type={showPassword ? "text" : "password"}
                          className="h-11 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || getUsernameStatus() === "checking"}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Add custom styles for smooth animations */}
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default SignUpPage