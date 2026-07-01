import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { getNotifications, readNotification, readAllNotifications } from "../../Services/NotiService";
import { Skeleton, Tabs, Button, Badge } from "@mantine/core";
import { IconCheck, IconBriefcase, IconMessageCircle, IconUserPlus, IconChecks, IconBellOff } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { successNotification, errorNotification } from "../../Services/NotificationService";

const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

const Notifications = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string | null>("all");
    const [markingAll, setMarkingAll] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchNotifications = () => {
        setLoading(true);
        getNotifications(user.id).then((res) => {
            setNotifications(res);
        }).catch((err) => console.log(err))
          .finally(() => setLoading(false));
    };

    const handleRead = (id: number, status: string, route: string) => {
        if (status === 'UNREAD') {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'READ' } : n));
            readNotification(id).catch(console.log);
        }
        if (route) {
            navigate(route);
        }
    };

    const handleMarkAllRead = () => {
        if(unreadCount === 0) return;
        setMarkingAll(true);
        readAllNotifications().then(() => {
            setNotifications(prev => prev.map(n => ({ ...n, status: 'READ' })));
            successNotification("All caught up!", "All notifications marked as read.");
        }).catch(() => {
            errorNotification("Error", "Could not mark notifications as read.");
        }).finally(() => {
            setMarkingAll(false);
        });
    };

    const getIcon = (action: string) => {
        const a = action.toLowerCase();
        if (a.includes("application") || a.includes("job")) {
            return (
                <div className="p-2.5 bg-bright-sun-400/10 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.2)]">
                    <IconBriefcase size={22} className="text-bright-sun-400" />
                </div>
            );
        }
        if (a.includes("message") || a.includes("chat")) {
            return (
                <div className="p-2.5 bg-blue-500/10 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <IconMessageCircle size={22} className="text-blue-500" />
                </div>
            );
        }
        if (a.includes("connection") || a.includes("network")) {
            return (
                <div className="p-2.5 bg-teal-500/10 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                    <IconUserPlus size={22} className="text-teal-500" />
                </div>
            );
        }
        return (
            <div className="p-2.5 bg-green-500/10 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <IconCheck size={22} className="text-green-500" />
            </div>
        );
    };

    const unreadCount = useMemo(() => notifications.filter(n => n.status === 'UNREAD').length, [notifications]);
    
    const filteredNotifications = useMemo(() => {
        if (activeTab === 'unread') return notifications.filter(n => n.status === 'UNREAD');
        return notifications;
    }, [notifications, activeTab]);

    return (
        <div className="w-2/3 lg-mx:w-full flex flex-col gap-5">
            <div className="flex justify-between items-center sm-mx:flex-col sm-mx:items-start sm-mx:gap-3">
                <div className="flex items-center gap-3">
                    <div className="text-3xl sm-mx:text-2xl font-bold text-mine-shaft-100 tracking-tight">Notifications</div>
                    {unreadCount > 0 && (
                        <Badge color="brightSun.4" variant="filled" size="lg" className="shadow-lg shadow-bright-sun-400/20">
                            {unreadCount} New
                        </Badge>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button 
                        variant="subtle" 
                        color="mineShaft.3" 
                        leftSection={<IconChecks size={18} />}
                        onClick={handleMarkAllRead}
                        loading={markingAll}
                        className="hover:bg-mine-shaft-800/50 hover:text-bright-sun-400 transition-colors"
                    >
                        Mark all as read
                    </Button>
                )}
            </div>
            
            <div className="flex flex-col bg-mine-shaft-900 rounded-2xl border border-mine-shaft-800 overflow-hidden shadow-2xl">
                <Tabs value={activeTab} onChange={setActiveTab} color="brightSun.4" variant="pills" className="p-4 border-b border-mine-shaft-800 bg-mine-shaft-900/50">
                    <Tabs.List>
                        <Tabs.Tab value="all" className="font-medium text-md px-6">All</Tabs.Tab>
                        <Tabs.Tab value="unread" className="font-medium text-md px-6">Unread</Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                <div className="flex flex-col">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="p-5 border-b border-mine-shaft-800/50 flex gap-4">
                                <Skeleton height={42} width={42} circle />
                                <div className="flex-1">
                                    <Skeleton height={16} width="40%" mb="xs" />
                                    <Skeleton height={12} width="70%" mb="xs" />
                                    <Skeleton height={10} width="20%" />
                                </div>
                            </div>
                        ))
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((noti: any) => (
                            <div 
                                key={noti.id} 
                                onClick={() => handleRead(noti.id, noti.status, noti.route)}
                                className={`p-5 flex gap-5 items-start cursor-pointer transition-all duration-300 border-b border-mine-shaft-800/50 last:border-b-0 hover:bg-mine-shaft-800/60
                                ${noti.status === 'UNREAD' 
                                    ? 'bg-mine-shaft-900/80 backdrop-blur-md relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-bright-sun-400' 
                                    : 'bg-transparent opacity-80 hover:opacity-100'}`}
                            >
                                <div className="mt-1 shrink-0">
                                    {getIcon(noti.action)}
                                </div>
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className={`text-lg sm-mx:text-base ${noti.status === 'UNREAD' ? 'font-bold text-mine-shaft-100' : 'font-semibold text-mine-shaft-200'}`}>
                                            {noti.action}
                                        </div>
                                    </div>
                                    <div className={`text-base sm-mx:text-sm leading-snug ${noti.status === 'UNREAD' ? 'text-mine-shaft-200' : 'text-mine-shaft-400'}`}>
                                        {noti.message}
                                    </div>
                                    <div className="text-xs font-medium text-mine-shaft-500 mt-1">
                                        {timeAgo(noti.timestamp)}
                                    </div>
                                </div>
                                {noti.status === 'UNREAD' && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-bright-sun-400 self-center shrink-0 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-20 px-5 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-mine-shaft-800/50 rounded-full flex items-center justify-center mb-5 border border-mine-shaft-800">
                                <IconBellOff size={40} className="text-mine-shaft-500" stroke={1.5} />
                            </div>
                            <div className="text-xl font-bold text-mine-shaft-200 mb-2 tracking-tight">
                                {activeTab === 'unread' ? "No unread notifications" : "You're all caught up!"}
                            </div>
                            <div className="text-base text-mine-shaft-400 max-w-sm">
                                {activeTab === 'unread' 
                                    ? "You have read all your notifications. Great job staying on top of things!"
                                    : "When you get new connections, messages, or job updates, they will show up here."}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
