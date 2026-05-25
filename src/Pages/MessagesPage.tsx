import { ActionIcon, Avatar, Divider, ScrollArea, TextInput, Indicator, Loader, Skeleton } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";
import { IconSend, IconSearch, IconDotsVertical, IconPaperclip, IconPhone, IconVideo, IconChecks } from "@tabler/icons-react";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getConversations, getMessages, sendMessage, ChatRoomPayload, MessagePayload } from "../Services/ChatService";

const MessagesPage = () => {
    const profile = useSelector((state: any) => state.profile);
    const currentProfileId = profile?.id;

    const [searchParams] = useSearchParams();
    const queryRoomId = searchParams.get("roomId");

    const [conversations, setConversations] = useState<ChatRoomPayload[]>([]);
    const [activeChat, setActiveChat] = useState<ChatRoomPayload | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Fetch conversations on load and poll every 4 seconds
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
                    } else if (!activeChat && res.length > 0) {
                        // Default to first chat if none active
                        setActiveChat(res[0]);
                    }
                })
                .catch((err) => {
                    console.error("Failed to load conversations", err);
                    setLoading(false);
                });
        };

        loadConversations();
        const interval = setInterval(loadConversations, 4000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProfileId, queryRoomId]);

    // Fetch messages for active chat and poll every 2.5 seconds for real-time feel
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
        const interval = setInterval(loadMessages, 2500);
        return () => clearInterval(interval);
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
                setMessages(prev => [...prev, res]);
                setMessageInput("");
                setTimeout(() => {
                    if (scrollAreaRef.current) {
                        scrollAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }, 100);
            })
            .catch((err) => console.error("Failed to send message", err));
    };

    const getChatPartner = (room: ChatRoomPayload) => {
        if (room.user1Id === currentProfileId) {
            return { name: room.user2Name, role: room.user2Role };
        }
        return { name: room.user1Name, role: room.user1Role };
    };

    if (!currentProfileId) {
        return (
            <div className="min-h-[85vh] bg-mine-shaft-950 flex flex-col justify-center items-center text-mine-shaft-300">
                <Loader color="brightSun.4" size="lg" className="mb-4" />
                <p className="text-lg font-medium">Please set up your profile to access messaging.</p>
            </div>
        );
    }

    return (
        <div className="min-h-[88vh] bg-mine-shaft-950 font-['poppins'] flex flex-col">
            <Divider size="xs" mx="md"/>
            <div className="flex-1 flex w-full max-w-7xl mx-auto p-4 sm-mx:p-2 gap-4 h-[85vh]">
                
                {/* Left Sidebar - Conversations */}
                <div className="w-1/3 sm-mx:w-[80px] flex flex-col bg-mine-shaft-900 rounded-xl border border-mine-shaft-800 overflow-hidden">
                    <div className="p-4 sm-mx:p-2 border-b border-mine-shaft-800">
                        <div className="text-xl sm-mx:hidden font-semibold text-mine-shaft-100 mb-4">Messaging</div>
                        <TextInput 
                            placeholder="Search messages" 
                            leftSection={<IconSearch size={16} />} 
                            variant="filled" 
                            radius="xl"
                            className="sm-mx:hidden"
                        />
                        <div className="hidden sm-mx:flex justify-center">
                            <IconSearch size={24} className="text-mine-shaft-300" />
                        </div>
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
                        ) : conversations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-70 p-4 mt-10">
                                <img src={WEBSITE_CONFIG.assets.workingGirl || "/Working/Girl.png"} className="w-24 h-24 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300" alt="No messages" />
                                <div className="text-center text-sm font-medium text-mine-shaft-300 sm-mx:hidden">
                                    No conversations yet. Go to Find Talent or Job postings to connect!
                                </div>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const partner = getChatPartner(conv);
                                return (
                                    <div 
                                        key={conv.id} 
                                        onClick={() => {
                                            setActiveChat(conv);
                                            setMessages([]);
                                        }}
                                        className={`p-4 sm-mx:p-2 flex gap-3 cursor-pointer transition-colors border-b border-mine-shaft-800/50 ${activeChat?.id === conv.id ? 'bg-mine-shaft-800 border-l-4 border-l-bright-sun-400' : 'hover:bg-mine-shaft-800/50 border-l-4 border-l-transparent'}`}
                                    >
                                        <Indicator inline size={12} offset={5} position="bottom-end" color="teal" withBorder>
                                            <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=2a2a2a&color=fab005`} size="lg" radius="xl" />
                                        </Indicator>
                                        <div className="flex-1 min-w-0 sm-mx:hidden">
                                            <div className="flex justify-between items-start">
                                                <div className="font-semibold text-mine-shaft-100 truncate">{partner.name}</div>
                                                <div className="text-[10px] text-mine-shaft-400 whitespace-nowrap">
                                                    {conv.lastActive ? new Date(conv.lastActive).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                                </div>
                                            </div>
                                            <div className="text-xs text-bright-sun-400 truncate mb-1">{partner.role}</div>
                                            <div className="text-sm truncate text-mine-shaft-400">
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
                <div className="flex-1 flex flex-col bg-mine-shaft-900 rounded-xl border border-mine-shaft-800 overflow-hidden">
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            {(() => {
                                const partner = getChatPartner(activeChat);
                                return (
                                    <div className="p-4 border-b border-mine-shaft-800 flex justify-between items-center bg-mine-shaft-900/80 backdrop-blur-sm z-10">
                                        <div className="flex gap-3 items-center">
                                            <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=2a2a2a&color=fab005`} size="md" radius="xl" />
                                            <div>
                                                <div className="font-semibold text-mine-shaft-100">{partner.name}</div>
                                                <div className="text-xs text-mine-shaft-400">{partner.role}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 text-mine-shaft-300">
                                            <ActionIcon variant="subtle" color="gray"><IconPhone size={20} /></ActionIcon>
                                            <ActionIcon variant="subtle" color="gray"><IconVideo size={20} /></ActionIcon>
                                            <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={20} /></ActionIcon>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Chat Messages */}
                            <ScrollArea className="flex-1 p-4 bg-mine-shaft-950/30">
                                <div className="flex flex-col gap-4">
                                    <div className="text-center text-xs text-mine-shaft-500 my-2">Security: Messages are stored securely.</div>
                                    
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex max-w-[75%] ${msg.senderId === currentProfileId ? 'self-end' : 'self-start'}`}>
                                            {msg.senderId !== currentProfileId && (
                                                <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(getChatPartner(activeChat).name)}&background=2a2a2a&color=fab005`} size="sm" radius="xl" className="mr-2 mt-1 shrink-0" />
                                            )}
                                            <div className={`flex flex-col ${msg.senderId === currentProfileId ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-2 rounded-2xl text-sm ${msg.senderId === currentProfileId ? 'bg-bright-sun-500 text-mine-shaft-950 rounded-tr-sm' : 'bg-mine-shaft-800 text-mine-shaft-100 rounded-tl-sm'}`}>
                                                    {msg.text}
                                                </div>
                                                <div className="text-[9px] text-mine-shaft-500 mt-1 mx-1 flex items-center gap-1 justify-end">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                                                    {msg.senderId === currentProfileId && <IconChecks size={14} className="text-teal-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollAreaRef} />
                                </div>
                            </ScrollArea>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-mine-shaft-800 bg-mine-shaft-900">
                                <div className="flex gap-2 items-center bg-mine-shaft-950 p-2 rounded-xl border border-mine-shaft-800 focus-within:border-bright-sun-400 transition-colors">
                                    <ActionIcon variant="subtle" color="gray" className="shrink-0"><IconPaperclip size={20} /></ActionIcon>
                                    <input 
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 text-sm"
                                    />
                                    <ActionIcon 
                                        variant="filled" 
                                        color="brightSun.4" 
                                        radius="xl" 
                                        className="shrink-0"
                                        onClick={handleSendMessage}
                                        disabled={!messageInput.trim()}
                                    >
                                        <IconSend size={16} className="text-mine-shaft-950" />
                                    </ActionIcon>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-mine-shaft-400 p-8">
                            <img src={WEBSITE_CONFIG.assets.heroImage} className="w-48 mb-6 opacity-30 grayscale" alt="Start messaging" />
                            <p className="text-lg font-medium text-mine-shaft-300">Select a conversation or start a new one to begin messaging.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;
