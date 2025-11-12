'use client';

import { MessageCard } from '@/components/message-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Link2, MessageSquare, Settings, User, Share2 } from 'lucide-react';
import { User as NextAuthUser } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [acceptMessages, setAcceptMessages] = useState<boolean>(false);

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema),
    });

    const { setValue, register } = form;

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        if (!session || !session.user) return;

        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            const isAccepting = response.data?.isAcceptingMessages as boolean;
            setAcceptMessages(isAccepting);
            setValue('acceptMessages', isAccepting);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Failed to fetch message settings');
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, session]);

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);

                if (refresh) {
                    toast.success("Messages updated");
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data.message ?? 'Failed to fetch messages');
            } finally {
                setIsLoading(false);
            }
        },
        [setIsLoading, setMessages]
    );

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessages();
    }, [session, fetchAcceptMessages, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setAcceptMessages(!acceptMessages);
            setValue('acceptMessages', !acceptMessages);
            toast.success(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Failed to update message settings');
        }
    };

    if (!session || !session.user) {
        return <div />;
    }

    const { username } = session.user as NextAuthUser;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success('Link copied to clipboard');
    };

    const shareProfile = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Send me anonymous messages',
                    text: 'Share your thoughts with me anonymously',
                    url: profileUrl,
                });
            } catch (error) {
               
            }
        } else {
            copyToClipboard();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 py-8 px-4">
            {/* Main Container with Material Design Elevation */}
            <div className="max-w-6xl mx-auto">
                {/* Header Section with Depth */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                                    <User className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                                        Message Dashboard
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Manage your anonymous messages and sharing preferences
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={acceptMessages ? "default" : "secondary"}
                                className="mt-4 md:mt-0 px-3 py-1.5 text-sm font-medium"
                            >
                                <div className="flex items-center space-x-1.5">
                                    <div className={`w-2 h-2 rounded-full ${acceptMessages ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    <span>
                                        {acceptMessages ? "Active" : "Paused"} • {messages.length}
                                    </span>
                                </div>
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Profile & Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Link Card with Material Shadow */}
                        <Card className="rounded-2xl shadow-sm border-0 bg-white overflow-hidden">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                                    <Link2 className="h-5 w-5 text-blue-600" />
                                    <span>Your Sharing Link</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Share this link to receive anonymous messages from anyone
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex space-x-2">
                                    <Input
                                        value={profileUrl}
                                        readOnly
                                        className="flex-1 font-mono text-sm bg-gray-50 border-gray-200 rounded-lg"
                                    />
                                    <Button
                                        onClick={copyToClipboard}
                                        size="sm"
                                        className="rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={shareProfile}
                                        size="sm"
                                        className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Messages Section */}
                        <Card className="rounded-2xl shadow-sm border-0 bg-white">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <MessageSquare className="h-5 w-5 text-gray-700" />
                                        <CardTitle className="text-lg font-semibold">Messages</CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            fetchMessages(true);
                                        }}
                                        disabled={isLoading}
                                        className="rounded-lg text-gray-600 hover:text-gray-900"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <RefreshCcw className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <CardDescription className="text-gray-600">
                                    {messages.length > 0
                                        ? `${messages.length} message${messages.length !== 1 ? 's' : ''} received`
                                        : acceptMessages
                                            ? 'No messages yet. Share your link to get started.'
                                            : 'Enable message reception to start receiving messages'
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index} className="flex space-x-3 p-4 rounded-xl bg-gray-50">
                                                <Skeleton className="h-10 w-10 rounded-full" />
                                                <div className="space-y-2 flex-1">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : messages.length > 0 ? (
                                    <div className="space-y-3">
                                        {messages.map((message) => (
                                            <MessageCard
                                                key={message?._id || message.id}
                                                message={message}
                                                onMessageDelete={handleDeleteMessage}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            No messages yet
                                        </h3>
                                        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                            {acceptMessages
                                                ? 'Share your unique link to start receiving anonymous messages from friends and followers.'
                                                : 'Turn on message reception to allow people to send you messages.'
                                            }
                                        </p>
                                        {acceptMessages && (
                                            <Button
                                                onClick={shareProfile}
                                                className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm"
                                            >
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Share Your Link
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Settings */}
                    <div className="space-y-6">
                        {/* Settings Card */}
                        <Card className="rounded-2xl shadow-sm border-0 bg-white sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-lg font-semibold">
                                    <Settings className="h-5 w-5 text-gray-700" />
                                    <span>Settings</span>
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Control your message preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-900">
                                                Accept Messages
                                            </label>
                                            <p className="text-sm text-gray-600">
                                                Allow people to send you anonymous messages
                                            </p>
                                        </div>
                                        <Switch
                                            {...register('acceptMessages')}
                                            checked={acceptMessages}
                                            onCheckedChange={handleSwitchChange}
                                            disabled={isSwitchLoading}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>

                                    {isSwitchLoading && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                            <span>Updating preferences...</span>
                                        </div>
                                    )}

                                    <Separator className="bg-gray-200" />

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
                                        <p className="text-sm text-gray-600">
                                            {acceptMessages
                                                ? 'You are currently accepting anonymous messages. Share your link to receive messages.'
                                                : 'Message reception is paused. People cannot send you new messages.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card className="rounded-2xl shadow-sm border-0 bg-white">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
                                        <div className="text-sm text-blue-600 font-medium">Total Messages</div>
                                    </div>
                                    <div className={`rounded-xl p-4 text-center ${acceptMessages ? 'bg-green-50' : 'bg-gray-100'}`}>
                                        <div className={`text-2xl font-bold ${acceptMessages ? 'text-green-600' : 'text-gray-600'}`}>
                                            {acceptMessages ? 'On' : 'Off'}
                                        </div>
                                        <div className={`text-sm font-medium ${acceptMessages ? 'text-green-600' : 'text-gray-600'}`}>
                                            Status
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserDashboard;