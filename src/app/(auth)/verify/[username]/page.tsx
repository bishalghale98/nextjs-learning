"use client"

import { verifySchema } from "@/schemas/verifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FieldDescription, } from "@/components/ui/field"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useState } from "react"

const VerifyPage = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: "" },
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setLoading(true)
        try {
            const response = await axios.post("/api/verify-code", {
                username: params.username,
                code: data.code,
            })

            toast.success(response.data.message || "Verification successful!")
            router.replace("/sign-in")
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message ?? "Verification failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center box-border min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-4 space-y-8 transition-all duration-200 hover:shadow-xl">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md mb-4">
                            <span className="text-white font-bold text-xl">MM</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            Verify Code
                        </h1>
                        <p className="text-gray-600 text-sm">Verify your account</p>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Verification Code</FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                value={field.value}
                                                onChange={field.onChange}
                                            >
                                                <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                                                    {[0, 1, 2, 3, 4, 5].map((i) => (
                                                        <InputOTPSlot key={i} index={i} />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FieldDescription>
                                            Enter the 6-digit code sent to your email.
                                        </FieldDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default VerifyPage
