import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconBriefcase, IconMessage, IconSearch, IconUser, IconFileText, IconHome, IconBuilding, IconLogin } from "@tabler/icons-react";

const BottomNav = () => {
    const location = useLocation();
    const user = useSelector((state: any) => state.user);

    // Hide bottom nav on specific pages
    if (location.pathname === "/login" || location.pathname === "/signup") return null;

    let links = [];

    if (user?.accountType === "APPLICANT") {
        links = [
            { name: "Home", url: "/", icon: IconHome },
            { name: "Jobs", url: "/find-jobs", icon: IconBriefcase },
            { name: "Connect", url: "/network", icon: IconSearch },
            { name: "Messages", url: "/messages", icon: IconMessage },
            { name: "Profile", url: "/profile", icon: IconUser },
        ];
    } else if (user?.accountType === "EMPLOYER") {
        links = [
            { name: "Home", url: "/", icon: IconHome },
            { name: "Connect", url: "/network", icon: IconSearch },
            { name: "Posted", url: "/posted-jobs/0", icon: IconBriefcase },
            { name: "Messages", url: "/messages", icon: IconMessage },
            { name: "Profile", url: "/profile", icon: IconUser },
        ];
    } else if (user?.accountType === "ADMIN") {
        links = [
            { name: "Home", url: "/", icon: IconHome },
            { name: "Dashboard", url: "/admin/dashboard", icon: IconFileText },
            { name: "Profile", url: "/profile", icon: IconUser },
        ];
    } else {
        // Public mobile navigation
        links = [
            { name: "Home", url: "/", icon: IconHome },
            { name: "Jobs", url: "/find-jobs", icon: IconBriefcase },
            { name: "Companies", url: "/companies", icon: IconBuilding },
            { name: "Login", url: "/login", icon: IconLogin },
        ];
    }

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] hidden sm-mx:block transition-all duration-300">
            <div className="bg-mine-shaft-950/90 backdrop-blur-xl border-t border-white/5 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] px-2 py-2 pb-safe">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    {links.map((link, index) => {
                        const isActive = location.pathname === link.url || (location.pathname.startsWith('/posted-jobs') && link.url.includes('posted-jobs'));
                        const Icon = link.icon;
                        return (
                            <Link 
                                key={index} 
                                to={link.url}
                                className="relative flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 active:scale-90"
                            >
                                {isActive && (
                                    <div className="absolute -top-2 w-1.5 h-1.5 rounded-full bg-bright-sun-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                )}
                                <div className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-bright-sun-400/10 text-bright-sun-400 shadow-[0_0_15px_rgba(250,204,21,0.1)]' : 'text-mine-shaft-400 hover:text-mine-shaft-200'}`}>
                                    <Icon size={22} stroke={isActive ? 2.5 : 1.5} className="mb-0.5" />
                                    <span className={`text-[9px] font-semibold tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>{link.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Safe area padding for newer iPhones */}
            <style>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 16px);
                }
            `}</style>
        </div>
    );
};

export default BottomNav;
