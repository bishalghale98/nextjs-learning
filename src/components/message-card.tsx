"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X, Calendar, Clock, Trash2, MessageCircle } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Badge } from "./ui/badge";

type MessageCardProps = {
	message: Message
	onMessageDelete: (messageId: string) => void
}

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
	const handleDeleteConfirm = async () => {

		console.log(message)


		try {
			const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
			toast.success(response.data.message)
			onMessageDelete(message._id as string)
		} catch (error) {
			toast.error("Failed to delete message")
		}
	}

	
	const formatDate = (dateValue: string | Date) => {
		const date = new Date(dateValue)
		const now = new Date()
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

		if (diffInHours < 24) {
			return date.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			})
		} else {
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
			})
		}
	}

	const getRelativeTime = (dateValue: string | Date) => {
		const date = new Date(dateValue)
		const now = new Date()
		const diffInMs = now.getTime() - date.getTime()
		const diffInHours = diffInMs / (1000 * 60 * 60)
		const diffInDays = diffInHours / 24

		if (diffInHours < 1) {
			const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
			return `${diffInMinutes}m ago`
		} else if (diffInHours < 24) {
			return `${Math.floor(diffInHours)}h ago`
		} else if (diffInDays < 7) {
			return `${Math.floor(diffInDays)}d ago`
		} else {
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric'
			})
		}
	}

	return (
		<Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-blue-600">
			<CardHeader className="pb-3">
				<div className="flex justify-between items-start gap-4">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<MessageCircle className="w-4 h-4 text-blue-500" />
							<Badge variant="secondary" className="text-xs font-normal">
								Message
							</Badge>
						</div>
						<CardTitle className="text-lg font-semibold text-gray-900 leading-relaxed break-words">
							{message.content}
						</CardTitle>
					</div>

					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 text-gray-400 hover:text-destructive hover:bg-destructive/10"
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent className="max-w-md">
							<AlertDialogHeader>
								<div className="flex items-center gap-2 text-destructive mb-2">
									<Trash2 className="w-5 h-5" />
									<AlertDialogTitle>Delete Message</AlertDialogTitle>
								</div>
								<AlertDialogDescription className="text-gray-600">
									Are you sure you want to delete this message? This action cannot be undone and the message will be permanently removed.
								</AlertDialogDescription>
							</AlertDialogHeader>

							<div className="bg-gray-50 rounded-lg p-4 my-2 border">
								<p className="text-sm text-gray-700 line-clamp-3">{message.content}</p>
							</div>

							<AlertDialogFooter>
								<AlertDialogCancel className="mt-2 sm:mt-0">
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteConfirm}
									className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
								>
									<Trash2 className="w-4 h-4 mr-2" />
									Delete Message
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</CardHeader>

			<CardContent className="pb-3">
				<div className="flex items-center gap-4 text-sm text-gray-500">
					<div className="flex items-center gap-1">
						<Calendar className="w-4 h-4" />
						<span>{formatDate(message.createdAt)}</span>
					</div>
					<div className="flex items-center gap-1">
						<Clock className="w-4 h-4" />
						<span>{getRelativeTime(message.createdAt)}</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="pt-0">
				<div className="w-full flex justify-between items-center text-xs text-gray-400">
					<span>ID: {message._id?.slice(-8)}</span>
					<span>Click to copy</span>
				</div>
			</CardFooter>
		</Card>
	);
}