import { Menu, rem, Avatar, Switch, useMantineColorScheme } from '@mantine/core';
import {
    IconMessageCircle,
    IconLogout2,
    IconUserCircle,
    IconFileText,
    IconSun,
    IconMoonStars,
    IconMoon,
    IconLayoutDashboard,
    IconSettings
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeUser } from '../../Slices/UserSlice';
import { removeJwt } from '../../Slices/JwtSlice';
import axiosInstance from '../../Interceptor/AxiosInterceptor';
import { WEBSITE_CONFIG } from '../../config';

const ProfileMenu = () => {
    const user=useSelector((state:any)=>state.user);
    const profile=useSelector((state:any)=>state.profile);
    const [opened, setOpened] = useState(false);
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const checked = colorScheme === 'dark';
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (err) {
            console.error("Logout failed on backend", err);
        }
        dispatch(removeUser());
        dispatch(removeJwt());
    }
    return (
        <Menu 
            shadow="lg" 
            width={220} 
            opened={opened} 
            onChange={setOpened}
            classNames={{
                dropdown: "bg-mine-shaft-950/90 backdrop-blur-xl border border-white/5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
                item: "text-mine-shaft-200 hover:bg-mine-shaft-800/60 hover:text-bright-sun-400 font-medium transition-colors rounded-lg mx-1 my-0.5",
                divider: "border-mine-shaft-800/60 my-2"
            }}
            transitionProps={{ transition: 'pop-top-right', duration: 200 }}
        >
            <Menu.Target>
                <div className="flex items-center gap-3 cursor-pointer p-1.5 rounded-full hover:bg-mine-shaft-900/50 transition-colors border border-transparent hover:border-white/5">
                    <div className='xs-mx:hidden flex flex-col items-end leading-tight'>
                        <span className="font-semibold text-sm text-mine-shaft-100">{user.name}</span>
                        <span className="text-[10px] text-bright-sun-400 uppercase tracking-wider">{user.accountType?.toLowerCase()}</span>
                    </div>
                    <Avatar 
                        src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : WEBSITE_CONFIG.assets.defaultAvatar} 
                        alt="Profile avatar" 
                        size="md"
                        radius="xl"
                        className="border border-mine-shaft-800 shadow-sm"
                    />
                </div>
            </Menu.Target>

            <Menu.Dropdown onChange={()=>setOpened(true)}>
                <div className="px-4 py-3 mb-1 border-b border-white/5">
                    <div className="font-semibold text-mine-shaft-100 truncate">{user.name}</div>
                    <div className="text-xs text-mine-shaft-400 truncate">{user.email || user.sub}</div>
                </div>

                <Menu.Item component={Link} to="/profile" leftSection={<IconUserCircle size={16} />}>
                    Profile
                </Menu.Item>
                
                <Menu.Item component={Link} to="/messages" leftSection={<IconMessageCircle size={16} />}>
                    Messages
                </Menu.Item>
                
                {user?.accountType === 'ADMIN' && (
                    <Menu.Item component={Link} to="/admin/dashboard" leftSection={<IconLayoutDashboard size={16} />}>
                        Admin Dashboard
                    </Menu.Item>
                )}
                
                <Menu.Item component={Link} to="/profile" leftSection={<IconFileText size={16} />}>
                    Resume
                </Menu.Item>
                
                <Menu.Item component={Link} to="/settings" leftSection={<IconSettings size={16} />}>
                    Settings
                </Menu.Item>
                
                <Menu.Item
                    leftSection={<IconMoon size={16} />}
                    rightSection={
                        <Switch size="xs" color="brightSun.4" className='cursor-pointer'
                            onLabel={<IconSun size={12} stroke={2.5} color="var(--mantine-color-yellow-4)" />} 
                            offLabel={<IconMoonStars size={12} stroke={2.5} color="var(--mantine-color-cyan-4)" />}
                            checked={checked}
                            onChange={(event) => setColorScheme(event.currentTarget.checked ? 'dark' : 'light')}
                        />
                    }
                >
                    Dark Mode
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item 
                    onClick={handleLogout}
                    color="red"
                    leftSection={<IconLogout2 size={16} />}
                    className="hover:bg-red-500/10 hover:text-red-400 text-red-400/80 transition-colors mx-1 mb-1"
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
}
export default ProfileMenu;