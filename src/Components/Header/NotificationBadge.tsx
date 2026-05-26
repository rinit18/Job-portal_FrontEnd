import { Indicator } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../../Services/NotiService";
import { successNotification } from "../../Services/NotificationService";

const NotificationBadge = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.user);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let prevCount = 0;

        const fetchNotis = () => {
            if (!user?.id) return;
            getNotifications(user.id).then((res: any[]) => {
                const unreadNotis = res.filter(n => n.status === 'UNREAD');
                if (unreadNotis.length > prevCount && prevCount > 0) {
                    // New notifications arrived! Show toasts for the newest ones.
                    const newCount = unreadNotis.length - prevCount;
                    for (let i = 0; i < newCount && i < unreadNotis.length; i++) {
                        successNotification(unreadNotis[i].action, unreadNotis[i].message);
                    }
                }
                prevCount = unreadNotis.length;
                setUnreadCount(unreadNotis.length);
            }).catch((err) => console.log(err));
        };

        fetchNotis();
        const interval = setInterval(fetchNotis, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div 
            className="bg-mine-shaft-900 p-1.5 rounded-full cursor-pointer hover:bg-mine-shaft-800 transition-colors"
            onClick={() => navigate('/notifications')}
        >
            <Indicator 
                disabled={unreadCount <= 0} 
                color="brightSun.4" 
                offset={6} 
                size={8} 
                processing
            >
                <IconBell stroke={1.5} />
            </Indicator>
        </div>
    );
};

export default NotificationBadge;
