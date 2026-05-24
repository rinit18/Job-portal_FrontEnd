import { Indicator, Menu, Notification, rem, Stack } from "@mantine/core";
import { IconBell, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getNotifications, readNotification } from "../../Services/NotiService";
import { successNotification } from "../../Services/NotificationService";

const NotiMenu = () => {
    const navigate=useNavigate();
    const user = useSelector((state: any) => state.user);
    const [notifications, setNotifications] = useState<any>([]);

    useEffect(() => {
        let prevCount = 0;

        const fetchNotis = () => {
            getNotifications(user.id).then((res: any[]) => {
                if (res.length > prevCount && prevCount > 0) {
                    // New notifications arrived! Show toasts for the newest ones.
                    const newCount = res.length - prevCount;
                    for (let i = 0; i < newCount; i++) {
                        successNotification(res[i].action, res[i].message);
                    }
                }
                prevCount = res.length;
                setNotifications(res);
            }).catch((err) => console.log(err));
        };

        fetchNotis();
        const interval = setInterval(fetchNotis, 3000); // Poll every 3 seconds for real-time feel
        return () => clearInterval(interval);
    }, [user]);

    const unread=(index:number)=>{
        let notis=[...notifications];
        notis=notis.filter((noti:any, i:number)=>i!=index);
        setNotifications(notis);
        readNotification(notifications[index].id).then((_res)=>{}).catch((err)=>console.log(err));
    }
    const [opened, setOpened] = useState(false);
    return <Menu shadow="md" width={400} opened={opened} onChange={setOpened}>
        <Menu.Target>
            <div className=" bg-mine-shaft-900 p-1.5 rounded-full">
                <Indicator disabled={notifications.length<=0} color="brightSun.4" offset={6} size={8} processing>
                    <IconBell stroke={1.5} />
                </Indicator>
            </div>
        </Menu.Target>

        <Menu.Dropdown onChange={() => setOpened(true)}>
            <div className="flex flex-col gap-1">
                {
                    notifications.map((noti: any, index:number) => <Notification onClick={()=>{
                        navigate(noti.route);
                        setOpened(false);
                        unread(index);
                    }}
                     key={index} className="hover:bg-mine-shaft-900 cursor-pointer" onClose={()=>unread(index)} icon={<IconCheck  style={{ width: rem(20), height: rem(20) }} />} color="teal" title={noti.action} mt="md">
                        {noti.message}
                    </Notification>
)}
{
    notifications.length==0 && <div className="text-center text-mine-shaft-300">No Notifications</div>
}
            </div>

        </Menu.Dropdown>
    </Menu>
}
export default NotiMenu;