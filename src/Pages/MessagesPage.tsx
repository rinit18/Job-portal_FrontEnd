import { ActionIcon, Avatar, Divider, ScrollArea, TextInput, Indicator } from "@mantine/core";
import { IconSend, IconSearch, IconDotsVertical, IconPaperclip, IconPhone, IconVideo } from "@tabler/icons-react";
import { useState } from "react";

const MOCK_CONVERSATIONS = [
    { id: 1, name: "Sarah Jenkins", role: "Technical Recruiter at Airbnb", lastMessage: "Are you available for a quick chat tomorrow?", time: "10:30 AM", unread: 2, online: true },
    { id: 2, name: "David Chen", role: "Engineering Manager at Google", lastMessage: "We reviewed your application and would like to proceed.", time: "Yesterday", unread: 0, online: false },
    { id: 3, name: "Elena Rodriguez", role: "HR Specialist at Meta", lastMessage: "Please find the interview details attached.", time: "Tuesday", unread: 0, online: true },
    { id: 4, name: "Marcus Johnson", role: "Startup Founder", lastMessage: "Thanks for connecting! Your profile looks great.", time: "Mon", unread: 0, online: false },
];

const MOCK_CHAT = [
    { id: 1, sender: "them", text: "Hi! I saw your profile and was really impressed with your React experience.", time: "10:00 AM" },
    { id: 2, sender: "them", text: "We have an opening for a Senior Frontend Engineer at Airbnb that I think you'd be a great fit for.", time: "10:01 AM" },
    { id: 3, sender: "me", text: "Hi Sarah! Thanks for reaching out. I'm definitely interested in learning more about the role.", time: "10:15 AM" },
    { id: 4, sender: "them", text: "That's great! Are you available for a quick chat tomorrow to discuss the details?", time: "10:30 AM" },
];

const MessagesPage = () => {
    const [activeChat, setActiveChat] = useState(MOCK_CONVERSATIONS[0]);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState(MOCK_CHAT);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        setMessages([...messages, { 
            id: Date.now(), 
            sender: "me", 
            text: messageInput, 
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
        }]);
        setMessageInput("");
        
        // Mock reply after 1 second
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: "them",
                text: "Thanks! I'll send over a calendar invite shortly.",
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            }]);
        }, 1500);
    };

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
                        {MOCK_CONVERSATIONS.map((conv) => (
                            <div 
                                key={conv.id} 
                                onClick={() => setActiveChat(conv)}
                                className={`p-4 sm-mx:p-2 flex gap-3 cursor-pointer transition-colors border-b border-mine-shaft-800/50 ${activeChat.id === conv.id ? 'bg-mine-shaft-800 border-l-4 border-l-bright-sun-400' : 'hover:bg-mine-shaft-800/50 border-l-4 border-l-transparent'}`}
                            >
                                <Indicator inline size={12} offset={5} position="bottom-end" color="teal" withBorder disabled={!conv.online}>
                                    <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=random`} size="lg" radius="xl" />
                                </Indicator>
                                <div className="flex-1 min-w-0 sm-mx:hidden">
                                    <div className="flex justify-between items-start">
                                        <div className="font-semibold text-mine-shaft-100 truncate">{conv.name}</div>
                                        <div className="text-xs text-mine-shaft-400 whitespace-nowrap">{conv.time}</div>
                                    </div>
                                    <div className="text-xs text-bright-sun-400 truncate mb-1">{conv.role}</div>
                                    <div className={`text-sm truncate ${conv.unread > 0 ? 'text-mine-shaft-100 font-medium' : 'text-mine-shaft-400'}`}>
                                        {conv.lastMessage}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </div>

                {/* Right Side - Active Chat */}
                <div className="flex-1 flex flex-col bg-mine-shaft-900 rounded-xl border border-mine-shaft-800 overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 border-b border-mine-shaft-800 flex justify-between items-center bg-mine-shaft-900/80 backdrop-blur-sm z-10">
                        <div className="flex gap-3 items-center">
                            <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}&background=random`} size="md" radius="xl" />
                            <div>
                                <div className="font-semibold text-mine-shaft-100">{activeChat.name}</div>
                                <div className="text-xs text-mine-shaft-400">{activeChat.role}</div>
                            </div>
                        </div>
                        <div className="flex gap-2 text-mine-shaft-300">
                            <ActionIcon variant="subtle" color="gray"><IconPhone size={20} /></ActionIcon>
                            <ActionIcon variant="subtle" color="gray"><IconVideo size={20} /></ActionIcon>
                            <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={20} /></ActionIcon>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <ScrollArea className="flex-1 p-4 bg-mine-shaft-950/30">
                        <div className="flex flex-col gap-4">
                            <div className="text-center text-xs text-mine-shaft-500 my-4">Conversation started on Aug 15</div>
                            
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex max-w-[75%] ${msg.sender === 'me' ? 'self-end' : 'self-start'}`}>
                                    {msg.sender === 'them' && (
                                        <Avatar src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeChat.name)}&background=random`} size="sm" radius="xl" className="mr-2 mt-1 shrink-0" />
                                    )}
                                    <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                        <div className={`px-4 py-2 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-bright-sun-500 text-mine-shaft-950 rounded-tr-sm' : 'bg-mine-shaft-800 text-mine-shaft-100 rounded-tl-sm'}`}>
                                            {msg.text}
                                        </div>
                                        <div className="text-[10px] text-mine-shaft-500 mt-1 mx-1">{msg.time}</div>
                                    </div>
                                </div>
                            ))}
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
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;
