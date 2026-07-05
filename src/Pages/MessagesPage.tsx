import { ActionIcon, Avatar, Divider, ScrollArea, TextInput, Indicator, Loader, Skeleton, Badge } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";
import { IconSend, IconSearch, IconDotsVertical, IconPaperclip, IconPhone, IconVideo, IconChecks, IconArrowLeft, IconBriefcase, IconUser } from "@tabler/icons-react";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getConversations, getMessages, sendMessage, ChatRoomPayload, MessagePayload } from "../Services/ChatService";
import { Client } from '@stomp/stompjs';
import { API_BASE_URL } from "../config";

const MessagesPage = () => {
    const profile = useSelector((state: any) => state.profile);
    const currentProfileId = profile?.id;
    const hasInitialized = useRef(false);

    const [searchParams] = useSearchParams();
    const queryRoomId = searchParams.get("roomId");

    const [conversations, setConversations] = useState<ChatRoomPayload[]>([]);
    const [activeChat, setActiveChat] = useState<ChatRoomPayload | null>(null);
    const activeChatRef = useRef<ChatRoomPayload | null>(null);

    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    const [loading, setLoading] = useState(true);
    const [showChatList, setShowChatList] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Setup STOMP WebSocket Connection
    useEffect(() => {
        if (!currentProfileId) return;

        const wsUrl = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws-native';
        const client = new Client({
            brokerURL: wsUrl,
            onConnect: () => {
                console.log('Connected to WebSocket natively');
                client.subscribe(`/topic/messages/${currentProfileId}`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    setMessages(prev => {
                        if (activeChatRef.current?.id !== receivedMessage.chatRoomId) return prev;
                        const newMessages = [...prev, receivedMessage];
                        setTimeout(() => {
                            if (scrollAreaRef.current) {
                                scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                            }
                        }, 100);
                        return newMessages;
                    });
                    
                    // Also refresh conversations to update the snippet/timestamp
                    if (currentProfileId) getConversations(currentProfileId).then(setConversations);
                });
            },
            onStompError: (frame) => {
                console.error('Broker error: ', frame.headers['message']);
            }
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [currentProfileId]);

    // Fetch conversations on load
    useEffect(() => {
        if (!currentProfileId) return;

        const loadConversations = () => {
            getConversations(currentProfileId)
                .then((res) => {
                    setConversations(res);
                    setLoading(false);

                    // If search params had a roomId, set it as active
                    if (queryRoomId) {
                        const found = res.find(c => c.id === queryRoomId);
                        if (found) {
                            setActiveChat(found);
                        }
                    } else if (!hasInitialized.current && res.length > 0) {
                        // Default to first chat if none active
                        setActiveChat(res[0]);
                        hasInitialized.current = true;
                    }
                })
                .catch((err) => {
                    console.error("Failed to load conversations", err);
                    setLoading(false);
                });
        };

        loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProfileId, queryRoomId]);

    // Fetch messages for active chat (Initial Load Only - WebSockets handle real-time)
    useEffect(() => {
        if (!activeChat) return;

        const loadMessages = () => {
            getMessages(activeChat.id)
                .then((res) => {
                    setMessages(prev => {
                        // Only update if new messages arrived (compare last id to avoid stale comparison)
                        const prevLastId = prev[prev.length - 1]?.id;
                        const newLastId = res[res.length - 1]?.id;
                        if (prevLastId !== newLastId || prev.length !== res.length) {
                            setTimeout(() => {
                                if (scrollAreaRef.current) {
                                    scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                }
                            }, 100);
                            return res;
                        }
                        return prev;
                    });
                })
                .catch((err) => console.error("Failed to load messages", err));
        };

        loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeChat]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !activeChat || !currentProfileId) return;

        const recipientId = activeChat.user1Id === currentProfileId ? activeChat.user2Id : activeChat.user1Id;
        const payload: MessagePayload = {
            chatRoomId: activeChat.id,
            senderId: currentProfileId,
            recipientId: recipientId,
            text: messageInput
        };

        sendMessage(payload)
            .then((res) => {
                setMessages(prev => {
                    const updated = [...prev, res];
                    setTimeout(() => {
                        if (scrollAreaRef.current) {
                            scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                        }
                    }, 100);
                    return updated;
                });
                setMessageInput("");
                // Refresh list snippet instantly
                getConversations(currentProfileId).then(setConversations);
            })
            .catch((err) => console.error("Failed to send message", err));
    };

    const getChatPartner = useCallback((room: ChatRoomPayload) => {
        if (room.user1Id === currentProfileId) {
            return { name: room.user2Name, role: room.user2Role };
        }
        return { name: room.user1Name, role: room.user1Role };
    }, [currentProfileId]);

    const renderRoleBadge = (role: string) => {
        const isEmployer = (role ?? '').toUpperCase() === 'EMPLOYER';
        return (
            <Badge 
                color={isEmployer ? 'teal.5' : 'brightSun.4'} 
                variant="light" 
                size="sm" 
                leftSection={isEmployer ? <IconBriefcase size={10} /> : <IconUser size={10} />}
                className={`border ${isEmployer ? 'border-teal-500/20' : 'border-bright-sun-400/20'}`}
            >
                {isEmployer ? 'Company' : 'Candidate'}
            </Badge>
        );
    };

    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        return conversations.filter(c => {
            const partner = getChatPartner(c);
            return (partner.name ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [conversations, searchQuery, getChatPartner]);

    if (!currentProfileId) {
        return (
            <div className="min-h-[85vh] bg-mine-shaft-950 flex flex-col justify-center items-center text-mine-shaft-300">
                <Loader color="brightSun.4" size="lg" className="mb-4" />
                <p className="text-lg font-medium">Please set up your profile to access messaging.</p>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)] bg-mine-shaft-950 font-['poppins'] flex flex-col relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>

            <Divider className="border-mine-shaft-800/60 z-10" />
            
            <div className="flex-1 min-h-0 flex w-full max-w-7xl mx-auto p-4 sm-mx:p-2 sm-mx:pb-2 gap-5 z-10">
                
                {/* Left Sidebar - Conversations */}
                <div className={`w-1/3 flex flex-col bg-mine-shaft-900/40 border border-mine-shaft-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl relative ${!showChatList ? 'sm-mx:hidden' : 'sm-mx:w-full'}`}>
                    <div className="p-5 border-b border-mine-shaft-800/60 bg-mine-shaft-900/40">
                        <div className="text-2xl font-bold text-mine-shaft-100 mb-5 tracking-tight">Messaging</div>
                        <TextInput 
                            placeholder="Search messages by name" 
                            leftSection={<IconSearch size={16} className="text-mine-shaft-400" />} 
                            variant="filled" 
                            radius="xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.currentTarget.value)}
                            classNames={{ input: 'bg-mine-shaft-950/50 border-mine-shaft-800 focus:border-bright-sun-400/50 text-mine-shaft-200' }}
                        />
                    </div>
                    
                    <ScrollArea className="flex-1">
                        {loading ? (
                            <div className="flex flex-col gap-4 p-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <Skeleton height={48} circle mb="xl" />
                                        <div className="flex-1">
                                            <Skeleton height={12} radius="xl" width="60%" />
                                            <Skeleton height={8} mt={6} radius="xl" />
                                            <Skeleton height={8} mt={6} width="80%" radius="xl" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-70 p-4 mt-10">
                                <img src={WEBSITE_CONFIG.assets.workingGirl || "/Working/Girl.png"} className="w-24 h-24 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300" alt="No messages" />
                                <div className="text-center text-sm font-medium text-mine-shaft-300 sm-mx:hidden">
                                    {searchQuery ? "No matches found." : "No conversations yet. Connect with Talent or Employers!"}
                                </div>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const partner = getChatPartner(conv);
                                return (
                                    <div 
                                        key={conv.id} 
                                        onClick={() => {
                                            setActiveChat(conv);
                                            setMessages([]);
                                            setShowChatList(false);
                                        }}
                                        className={`p-4 flex gap-3 cursor-pointer transition-all duration-300 border-b border-mine-shaft-800/40 hover:bg-mine-shaft-800/60 relative ${activeChat?.id === conv.id ? 'bg-mine-shaft-800/80 backdrop-blur-md' : 'bg-transparent'}`}
                                    >
                                        {/* Active indicator bar */}
                                        {activeChat?.id === conv.id && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-bright-sun-400 rounded-r-md shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                                        )}
                                        <Indicator inline size={12} offset={5} position="bottom-end" color="teal" withBorder>
                                            <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name ?? "User")}&background=2a2a2a&color=fab005`} size="lg" radius="xl" />
                                        </Indicator>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <div className={`font-semibold truncate ${activeChat?.id === conv.id ? 'text-bright-sun-400' : 'text-mine-shaft-100'}`}>{partner.name}</div>
                                                <div className="text-[10px] text-mine-shaft-400 whitespace-nowrap mt-1">
                                                    {conv.lastActive ? new Date(conv.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                                </div>
                                            </div>
                                            <div className="mb-1.5">{renderRoleBadge(partner.role)}</div>
                                            <div className={`text-sm truncate ${activeChat?.id === conv.id ? 'text-mine-shaft-300' : 'text-mine-shaft-400'}`}>
                                                {conv.lastMessage}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </ScrollArea>
                </div>

                {/* Right Side - Active Chat */}
                <div className={`flex-1 min-h-0 flex flex-col bg-mine-shaft-900/40 border border-mine-shaft-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl ${showChatList ? 'sm-mx:hidden' : 'sm-mx:flex'}`}>
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            {(() => {
                                const partner = getChatPartner(activeChat);
                                return (
                                    <div className="p-4 border-b border-mine-shaft-800/60 flex justify-between items-center bg-mine-shaft-900/60 backdrop-blur-md z-10 shadow-sm">
                                        <div className="flex gap-4 items-center">
                                            <ActionIcon variant="subtle" color="gray" className="hidden sm-mx:block" onClick={() => setShowChatList(true)}>
                                                <IconArrowLeft size={20} />
                                            </ActionIcon>
                                            <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name ?? "User")}&background=2a2a2a&color=fab005`} size="md" radius="xl" className="shadow-md" />
                                            <div className="flex flex-col gap-0.5">
                                                <div className="font-bold text-lg text-mine-shaft-100 leading-tight">{partner.name}</div>
                                                <div>{renderRoleBadge(partner.role)}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-mine-shaft-300">
                                            <ActionIcon variant="subtle" color="gray" className="hover:text-bright-sun-400 transition-colors"><IconPhone size={22} /></ActionIcon>
                                            <ActionIcon variant="subtle" color="gray" className="hover:text-bright-sun-400 transition-colors"><IconVideo size={22} /></ActionIcon>
                                            <ActionIcon variant="subtle" color="gray" className="hover:text-bright-sun-400 transition-colors"><IconDotsVertical size={22} /></ActionIcon>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Chat Messages */}
                            <ScrollArea className="flex-1 p-5 bg-mine-shaft-950/30">
                                <div className="flex flex-col gap-6">
                                    <div className="text-center text-xs text-mine-shaft-500 my-2 px-4 py-1.5 bg-mine-shaft-900/50 rounded-full w-max mx-auto border border-mine-shaft-800/50">
                                        End-to-End Encryption enabled. Messages are securely stored.
                                    </div>
                                    
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex max-w-[80%] ${msg.senderId === currentProfileId ? 'self-end' : 'self-start'}`}>
                                            {msg.senderId !== currentProfileId && (
                                                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getChatPartner(activeChat).name)}&background=2a2a2a&color=fab005`} size="sm" radius="xl" className="mr-3 mt-auto shrink-0 shadow-sm" />
                                            )}
                                            <div className={`flex flex-col ${msg.senderId === currentProfileId ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-5 py-3 rounded-[20px] text-[14px] shadow-md max-w-prose leading-relaxed 
                                                    ${msg.senderId === currentProfileId 
                                                        ? 'bg-gradient-to-br from-bright-sun-400 to-bright-sun-500 text-mine-shaft-950 rounded-br-sm font-medium shadow-[0_4px_15px_rgba(250,204,21,0.2)]' 
                                                        : 'bg-mine-shaft-800/90 backdrop-blur-md text-mine-shaft-100 rounded-bl-sm border border-mine-shaft-700/50'}`}
                                                >
                                                    {msg.text}
                                                </div>
                                                <div className="text-[10px] text-mine-shaft-500 mt-1.5 mx-1 flex items-center gap-1.5 justify-end font-medium">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                                    {msg.senderId === currentProfileId && <IconChecks size={15} className="text-bright-sun-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollAreaRef} />
                                </div>
                            </ScrollArea>

                            {/* Chat Input */}
                            <div className="p-5 border-t border-mine-shaft-800/60 bg-mine-shaft-900/60 backdrop-blur-md">
                                <div className="flex gap-3 items-center bg-mine-shaft-950 p-2.5 rounded-2xl border border-mine-shaft-800 focus-within:border-bright-sun-400/50 focus-within:shadow-[0_0_20px_rgba(250,204,21,0.1)] transition-all">
                                    <ActionIcon variant="subtle" color="gray" size="lg" className="shrink-0 hover:bg-mine-shaft-800 hover:text-bright-sun-400"><IconPaperclip size={22} /></ActionIcon>
                                    <input 
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Write your message here..."
                                        className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 text-[15px] px-2 placeholder:text-mine-shaft-500"
                                    />
                                    <ActionIcon 
                                        variant="filled" 
                                        color="brightSun.4" 
                                        radius="xl" 
                                        size="xl"
                                        className="shrink-0 transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]"
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim()}
                                    >
                                        <IconSend size={20} className="text-[#111]" />
                                    </ActionIcon>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-mine-shaft-400 p-8 relative">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bright-sun-400/5 via-mine-shaft-950/0 to-mine-shaft-950/0 pointer-events-none" />
                            <img src={WEBSITE_CONFIG.assets.heroImage} className="w-56 mb-8 opacity-20 grayscale hover:opacity-40 hover:grayscale-0 transition-all duration-500" alt="Start messaging" />
                            <div className="text-2xl font-bold text-mine-shaft-200 mb-2">Your Messages</div>
                            <p className="text-base text-mine-shaft-400 max-w-sm text-center">Select a conversation from the left sidebar or find talent/jobs to start networking.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;
