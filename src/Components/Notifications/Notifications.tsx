import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNotifications, readNotification } from "../../Services/NotiService";
import { Skeleton } from "@mantine/core";
import { IconCheck, IconBriefcase, IconMessageCircle, IconUserPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        setLoading(true);
        getNotifications(user.id).then((res) => {
            setNotifications(res);
        }).catch((err) => console.log(err))
          .finally(() => setLoading(false));
    }, [user]);

    const handleRead = (index: number) => {
        const noti = notifications[index];
        if (noti.status === 'UNREAD') {
            let notis = [...notifications];
            notis[index].status = 'READ';
            setNotifications(notis);
            readNotification(noti.id).catch(console.log);
        }
        if (noti.route) {
            navigate(noti.route);
        }
    };

    const getIcon = (action: string) => {
        const a = action.toLowerCase();
        if (a.includes("application") || a.includes("job")) return <IconBriefcase size={20} className="text-bright-sun-400" />;
        if (a.includes("message") || a.includes("chat")) return <IconMessageCircle size={20} className="text-blue-400" />;
        if (a.includes("connection") || a.includes("network")) return <IconUserPlus size={20} className="text-teal-400" />;
        return <IconCheck size={20} className="text-green-400" />;
    };

    return (
        <div className="w-2/3 lg-mx:w-full flex flex-col gap-4">
            <div className="text-2xl font-semibold text-mine-shaft-100 mb-2">Notifications</div>
            
            <div className="flex flex-col bg-mine-shaft-900 rounded-xl border border-mine-shaft-800 overflow-hidden shadow-lg">
                {loading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="p-4 border-b border-mine-shaft-800">
                            <Skeleton height={20} width="60%" mb="sm" />
                            <Skeleton height={12} width="80%" />
                        </div>
                    ))
                ) : notifications.length > 0 ? (
                    notifications.map((noti: any, index: number) => (
                        <div 
                            key={noti.id} 
                            onClick={() => handleRead(index)}
                            className={`p-4 flex gap-4 items-start cursor-pointer transition-colors hover:bg-mine-shaft-800 border-b border-mine-shaft-800 last:border-b-0 ${noti.status === 'UNREAD' ? 'bg-mine-shaft-900/60' : 'bg-mine-shaft-900/30'}`}
                        >
                            <div className="mt-1 p-2 bg-mine-shaft-800 rounded-full shrink-0">
                                {getIcon(noti.action)}
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex justify-between items-start gap-4">
                                    <div className={`text-base ${noti.status === 'UNREAD' ? 'font-semibold text-mine-shaft-100' : 'text-mine-shaft-200'}`}>
                                        {noti.action}
                                    </div>
                                    <div className="text-xs text-mine-shaft-400 whitespace-nowrap">
                                        {new Date(noti.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className={`text-sm ${noti.status === 'UNREAD' ? 'text-mine-shaft-200' : 'text-mine-shaft-400'}`}>
                                    {noti.message}
                                </div>
                            </div>
                            {noti.status === 'UNREAD' && (
                                <div className="w-2 h-2 rounded-full bg-bright-sun-400 self-center shrink-0"></div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="p-10 sm-mx:p-5 flex flex-col items-center justify-center text-mine-shaft-300">
                        <IconCheck size={48} className="text-mine-shaft-500 mb-4 opacity-50" />
                        <div className="text-lg font-medium mb-1">You're all caught up!</div>
                        <div className="text-sm text-mine-shaft-400">There are no new notifications right now.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
