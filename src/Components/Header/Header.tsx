import { Burger, Button, Drawer, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconAnchor, IconX, IconSun, IconMoon } from "@tabler/icons-react";
import NavLinks from "./NavLinks";
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

const allLinks = [
    { name: "Find Jobs",    url: "find-jobs",     roles: ["APPLICANT", "ADMIN"] },
    { name: "Companies",    url: "companies",     roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Messages",     url: "messages",      roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Job History",  url: "job-history",   roles: ["APPLICANT", "ADMIN"] },
    { name: "Connect",      url: "network",       roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Post Job",     url: "post-job/0",    roles: ["EMPLOYER",  "ADMIN"] },
    { name: "Posted Jobs",  url: "posted-jobs/0", roles: ["EMPLOYER",  "ADMIN"] },
];

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
    return (location.pathname !== "/signup" && location.pathname !== "/login") ? <div data-aos="zoom-out" className="w-full glass-header px-6 sm-mx:px-2 text-mine-shaft-100 h-20 flex justify-between items-center font-['poppins']">
        <div onClick={() => navigate("/")} className="flex gap-1 cursor-pointer items-center text-bright-sun-400">
            <IconAnchor className="h-8 w-8 sm-mx:h-6 sm-mx:w-6" stroke={2.5} />
            <div className=" xs-mx:hidden text-3xl font-semibold">{WEBSITE_CONFIG.name}</div>
        </div>
        <NavLinks />
        <div className="flex gap-3 items-center">

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
            <Burger className="bs:hidden sm-mx:hidden" opened={opened} onClick={open} aria-label="Toggle navigation" />
            <Drawer className="sm-mx:hidden" size="xs" overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} position="right" opened={opened} onClose={close} closeButtonProps={{
                icon: <IconX size={30} />,
            }} >
                <div className="flex flex-col gap-6 items-center">
                    {
                        drawerLinks.map((link, index) => <div key={index} className=" h-full flex items-center">
                            <div className="hover:text-bright-sun-400 text-xl " key={index} onClick={() => handleClick(link.url)} >{link.name}</div>
                        </div>)
                    }
                </div>
            </Drawer>
        </div>
    </div> : <></>
}
export default Header;