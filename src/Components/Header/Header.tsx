import { Burger, Button, Drawer, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconAnchor, IconX, IconSun, IconMoon } from "@tabler/icons-react";
import NavLinks, { allLinks } from "./NavLinks";
import ProfileMenu from "./ProfileMenu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "../../Services/ProfileService";
import { setProfile } from "../../Slices/ProfileSlice";
import NotificationBadge from "./NotificationBadge";
import { jwtDecode } from "jwt-decode";
import { setUser } from "../../Slices/UserSlice";
import { setupResponseInterceptor } from "../../Interceptor/AxiosInterceptor";
import { useDisclosure } from "@mantine/hooks";
import { WEBSITE_CONFIG } from "../../config";



const Header = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [opened, { open, close }] = useDisclosure(false);
    const dispatch = useDispatch();
    const user = useSelector((state: any) => state.user);
    const token = useSelector((state: any) => state.jwt);
    const location = useLocation();
    const navigate = useNavigate();
    const drawerLinks = user?.accountType
        ? allLinks.filter(link => link.roles.includes(user.accountType))
        : [];
    useEffect(() => {
        setupResponseInterceptor(navigate, dispatch);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate])
    const handleClick = (url: string) => {
        navigate(url)
        close();
    }
    useEffect(() => {
        if (token) {
            if (localStorage.getItem("token")) {
                const decoded = jwtDecode(localStorage.getItem("token") || "");
                dispatch(setUser({ ...decoded, email: decoded.sub }));
            }
        }
        if (user?.profileId) {
            // dispatch(showOverlay())
            getProfile(user?.profileId).then((res) => {
                dispatch(setProfile(res));
            }).catch((err) => console.log(err))
            // .finally(()=>dispatch(hideOverlay()));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, navigate]);
    return (location.pathname !== "/signup" && location.pathname !== "/login") ? <div data-aos="zoom-out" className="w-full bg-mine-shaft-950/80 backdrop-blur-xl border-b border-white/5 shadow-md text-mine-shaft-100 h-20 flex justify-center font-['poppins'] z-50 sticky top-0 transition-all duration-300">
        <div className="w-full max-w-[1600px] px-6 sm-mx:px-3 h-full flex justify-between items-center">
        <div onClick={() => navigate("/")} className="flex gap-2 cursor-pointer items-center text-bright-sun-400 group">
            <IconAnchor className="h-9 w-9 sm-mx:h-7 sm-mx:w-7 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" stroke={2.5} />
            <div className="xs-mx:hidden sm-mx:text-xl text-3xl font-bold tracking-tight group-hover:text-yellow-300 transition-colors">{WEBSITE_CONFIG.name}</div>
        </div>
        <NavLinks />
        <div className="flex gap-2 sm-mx:gap-1 items-center">

            {user ? <ProfileMenu /> : <Link to="/login" className="text-mine-shaft-200 hover:text-bright-sun-400 "><Button color="brightSun.4" variant="subtle">Login</Button></Link>}
            {/* <div className=" bg-mine-shaft-900 p-1.5 rounded-full">
                <IconSettings stroke={1.5} />
            </div> */}
            {user ? <NotificationBadge /> : <></>}
            <ActionIcon
                variant="subtle"
                color="brightSun.4"
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
            >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
            <Burger className="bs:hidden hover:text-bright-sun-400 transition-colors" opened={opened} onClick={open} aria-label="Toggle navigation" />
            <Drawer 
                size="sm" 
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} 
                position="right" 
                opened={opened} 
                onClose={close} 
                closeButtonProps={{ icon: <IconX size={30} className="hover:text-bright-sun-400 transition-colors" /> }} 
                classNames={{ content: 'bg-mine-shaft-950/90 backdrop-blur-2xl border-l border-white/5', header: 'bg-transparent' }}
            >
                <div className="flex flex-col gap-3 items-center mt-8">
                    {
                        drawerLinks.map((link, index) => {
                            const isActive = location.pathname === "/" + link.url;
                            return (
                                <div key={index} className="w-full px-6 flex items-center justify-center">
                                    <div 
                                        className={`w-full text-center py-3 rounded-xl text-lg font-medium cursor-pointer transition-all duration-300 ${isActive ? "bg-bright-sun-400/10 text-bright-sun-400 shadow-[0_0_15px_rgba(250,204,21,0.15)] scale-105" : "text-mine-shaft-200 hover:text-bright-sun-400 hover:bg-mine-shaft-800/50"}`} 
                                        onClick={() => handleClick(link.url)} 
                                    >
                                        {link.name}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Drawer>
        </div>
        </div>
    </div> : <></>
}
export default Header;