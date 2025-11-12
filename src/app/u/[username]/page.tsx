'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Send, Copy, Loader2, MessageSquare, RefreshCw } from "lucide-react"
import { useParams } from 'next/navigation'





export default function Page() {

	const params = useParams()
	const username = params.username as string



	const [suggestedMessages, setSuggestedMessages] = useState<string[]>([])
	const [loading, setLoading] = useState(false)
	const [isMessageSubmitting, setIsMessageSubmitting] = useState(false)

	const form = useForm({
		resolver: zodResolver(messageSchema),
		defaultValues: { content: "" },
	})
	const { reset, register, handleSubmit, setValue, watch } = form
	const messageContent = watch("content")



	const onSubmitMessage = async (data: z.infer<typeof messageSchema>) => {
		setIsMessageSubmitting(true)

		try {
			const response = await axios.post<ApiResponse>('/api/send-message', {
				username,
				content: data.content,
			})

			toast.success(response.data.message)
			reset()
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>
			toast.error(axiosError.response?.data.message ?? 'Failed to send message')
		} finally {
			setIsMessageSubmitting(false)
		}
	}

	const fetchSuggestions = async () => {
		setLoading(true)
		try {
			const response = await axios.post('/api/suggest-messages')
			const messages = response.data.suggestions.split('||').filter(Boolean)
			setSuggestedMessages(messages)
			toast.success("Suggestions updated ✨")
		} catch {
			toast.error("Failed to load suggestions")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSuggestions()
	}, [])

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 p-6">
			<motion.div
				className="max-w-5xl mx-auto space-y-8"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: 'easeOut' }}
			>
				{/* Header */}
				<div className="text-center space-y-2 mt-10">
					<div className="flex justify-center items-center gap-3">
						<div className="p-3 bg-blue-600 rounded-2xl shadow-md">
							<MessageSquare className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
							Message Center
						</h1>
					</div>
					<p className="text-gray-500 text-sm">
						Communicate smarter — AI-crafted suggestions just for you.
					</p>
				</div>

				<div className="grid lg:grid-cols-2 gap-8">
					{/* Left: Send Message */}
					<motion.div whileHover={{ scale: 1.01 }}>
						<Card className="shadow-sm hover:shadow-md rounded-2xl bg-white border border-gray-200 transition-all duration-300">
							<CardContent className="p-6 space-y-6">
								<h2 className="text-xl font-medium flex items-center gap-2 text-gray-800">
									<Send className="w-5 h-5 text-blue-600" />
									Send Message
								</h2>

								<form onSubmit={handleSubmit(onSubmitMessage)} className="space-y-4">
									<Label htmlFor="content" className="text-gray-700 font-medium text-sm">
										Your Message
									</Label>
									<textarea
										{...register("content")}
										id="content"
										placeholder="Type your message..."
										className="w-full min-h-[120px] p-3 rounded-xl border border-gray-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
									/>

									<Button
										type="submit"
										disabled={isMessageSubmitting || !messageContent}
										className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 transition-colors"
									>
										{isMessageSubmitting ? (
											<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
										) : (
											<><Send className="w-4 h-4 mr-2" /> Send Message</>
										)}
									</Button>
								</form>
							</CardContent>
						</Card>
					</motion.div>

					{/* Right: Suggested Messages */}
					<motion.div whileHover={{ scale: 1.01 }}>
						<Card className="shadow-sm hover:shadow-md rounded-2xl border border-gray-200 bg-white transition-all duration-300">
							<CardContent className="p-6">
								<div className="flex items-center justify-between mb-5">
									<h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
										<MessageSquare className="w-5 h-5 text-green-600" />
										Suggested Messages
									</h2>
									<Button
										onClick={fetchSuggestions}
										disabled={loading}
										variant="outline"
										size="sm"
										className="flex items-center gap-2 border-gray-300 hover:bg-slate-100"
									>
										{loading ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<RefreshCw className="w-4 h-4" />
										)}
										Refresh
									</Button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
									{suggestedMessages.map((msg, index) => (
										<motion.div
											key={index}
											whileHover={{ scale: 1.02 }}
											className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 shadow-sm transition-all cursor-pointer group"
											onClick={() => setValue("content", msg)}
										>
											<div className="flex justify-between items-start gap-3">
												<p className="text-gray-700 flex-1">{msg}</p>
												<Button
													variant="ghost"
													size="sm"
													className="opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={(e) => {
														e.stopPropagation()
														navigator.clipboard.writeText(msg)
														toast.success("Copied to clipboard ✅")
													}}
												>
													<Copy className="w-4 h-4 text-gray-600" />
												</Button>
											</div>
										</motion.div>
									))}
								</div>

							</CardContent>
						</Card>
					</motion.div>
				</div>
			</motion.div>
		</div>
	)
}
