import { ActionIcon, Avatar, Button, ScrollArea, TextInput } from "@mantine/core";
import { IconMessageCircle, IconSend, IconX, IconRobot } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { chatBot } from "../../Services/AiService";
// @ts-ignore
import DOMPurify from 'dompurify';

const Chatbot = () => {
    const [opened, setOpened] = useState(false);
    const [message, setMessage] = useState("");
    const [history, setHistory] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Hi! I am the CareerConnect Assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: any) => state.user);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSend = () => {
        if (!message.trim()) return;

        const userText = message;
        setMessage("");
        const updatedHistory = [...history, { role: 'user' as const, text: userText }];
        setHistory(updatedHistory);
        setLoading(true);

        chatBot(updatedHistory)
            .then(responseText => {
                setHistory(prev => [...prev, { role: 'bot', text: responseText || "I'm sorry, I encountered an error." }]);
            })
            .catch(err => {
                console.error(err);
                setHistory(prev => [...prev, { role: 'bot', text: "Error: Could not connect to AI service." }]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-5 right-5 z-[1000] sm-mx:!bottom-[80px]">
            {/* Toggle Button */}
            {!opened && (
                <ActionIcon
                    onClick={() => setOpened(true)}
                    size={60}
                    radius="xl"
                    color="brightSun.4"
                    variant="filled"
                    className="shadow-[0_8px_30px_rgba(255,189,32,0.4)] transition-transform hover:scale-110"
                >
                    <IconMessageCircle size={32} className="text-[#111]" />
                </ActionIcon>
            )}

            {/* Chat Window */}
            {opened && (
                <div className="w-[350px] sm-mx:w-[300px] h-[500px] sm-mx:h-[400px] bg-mine-shaft-900/90 backdrop-blur-xl border border-white/[0.05] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-fade-in-up">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-bright-sun-400 to-bright-sun-600 p-4 flex justify-between items-center shadow-md z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-[#111]/20 p-1.5 rounded-full">
                                <IconRobot size={24} className="text-[#111]" />
                            </div>
                            <div>
                                <div className="text-[#111] font-bold leading-tight">CareerConnect Bot</div>
                                <div className="text-[#111]/80 text-xs font-medium">Online 24/7</div>
                            </div>
                        </div>
                        <ActionIcon onClick={() => setOpened(false)} variant="transparent" className="hover:bg-[#111]/10 text-[#111]">
                            <IconX size={20} />
                        </ActionIcon>
                    </div>

                    {/* Chat Area */}
                    <ScrollArea className="flex-1 p-4 bg-mine-shaft-950/40">
                        <div className="flex flex-col gap-4">
                            {history.map((msg, index) => (
                                <div key={index} className={`flex max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                                    {msg.role === 'bot' && (
                                        <Avatar radius="xl" size="sm" className="mr-2 mt-1 shrink-0 bg-mine-shaft-800 border border-bright-sun-400/30">
                                            <IconRobot size={14} className="text-bright-sun-400" />
                                        </Avatar>
                                    )}
                                    <div className={`px-4 py-2.5 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
                                        msg.role === 'user' 
                                            ? 'bg-bright-sun-400 text-mine-shaft-950 rounded-tr-sm font-medium' 
                                            : 'bg-mine-shaft-800/80 backdrop-blur-sm text-mine-shaft-100 rounded-tl-sm border border-white/[0.05] [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1 [&_b]:text-bright-sun-400 [&_p]:mb-1'
                                    }`}>
                                        {msg.role === 'bot' ? (
                                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.text) }} />
                                        ) : (
                                            msg.text
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex max-w-[85%] self-start">
                                    <Avatar radius="xl" size="sm" className="mr-2 mt-1 shrink-0 bg-mine-shaft-800 border border-bright-sun-400/30">
                                        <IconRobot size={14} className="text-bright-sun-400" />
                                    </Avatar>
                                    <div className="px-4 py-2.5 rounded-2xl text-[13px] bg-mine-shaft-800/80 rounded-tl-sm border border-mine-shaft-700/50 flex gap-1 items-center h-[38px]">
                                        <div className="w-1.5 h-1.5 bg-mine-shaft-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1.5 h-1.5 bg-mine-shaft-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1.5 h-1.5 bg-mine-shaft-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-3 bg-mine-shaft-900 border-t border-mine-shaft-800">
                        <div className="flex gap-2 items-center bg-mine-shaft-950 p-1.5 rounded-xl border border-mine-shaft-800 focus-within:border-bright-sun-400/50 transition-colors">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 text-sm px-2"
                                disabled={loading}
                            />
                            <ActionIcon
                                onClick={handleSend}
                                color="brightSun.4"
                                variant="filled"
                                radius="xl"
                                size="md"
                                disabled={!message.trim() || loading}
                                className="shrink-0"
                            >
                                <IconSend size={16} className="text-[#111]" />
                            </ActionIcon>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Chatbot;
