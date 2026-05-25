import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { IconBriefcase, IconHistory, IconMessage, IconSearch, IconUser, IconFileText, IconHome } from "@tabler/icons-react";

const BottomNav = () => {
    const location = useLocation();
    const user = useSelector((state: any) => state.user);

    // Hide bottom nav on specific pages
    if (location.pathname === "/login" || location.pathname === "/signup") return null;

    let links = [];

    if (user?.accountType === "APPLICANT") {
        links = [
            { name: "Home", url: "/", icon: IconHome },
            { name: "Find Jobs", url: "/find-jobs", icon: IconSearch },
            { name: "History", url: "/job-history", icon: IconHistory },
            { name: "Messages", url: "/messages", icon: IconMessage },
            { name: "Profile", url: "/profile", icon: IconUser },
        ];
    } else if (user?.accountType === "EMPLOYER") {
        links = [
            { name: "Home", url: "/", icon: IconHome },
            { name: "Talents", url: "/find-talent", icon: IconSearch },
            { name: "Posted", url: "/posted-jobs/0", icon: IconBriefcase },
            { name: "Messages", url: "/messages", icon: IconMessage },
            { name: "Profile", url: "/profile", icon: IconUser },
        ];
    } else if (user?.accountType === "ADMIN") {
        links = [
            { name: "Home", url: "/", icon: IconHome },
            { name: "Dashboard", url: "/admin-dashboard", icon: IconFileText },
            { name: "Profile", url: "/profile", icon: IconUser },
        ];
    } else {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 w-full z-[100] hidden sm-mx:block">
            <div className="bg-mine-shaft-950/80 backdrop-blur-md border-t border-mine-shaft-800 px-4 py-3 pb-safe">
                <div className="flex justify-between items-center max-w-md mx-auto">
                    {links.map((link, index) => {
                        const isActive = location.pathname === link.url || (location.pathname.startsWith('/posted-jobs') && link.url.includes('posted-jobs'));
                        const Icon = link.icon;
                        return (
                            <Link 
                                key={index} 
                                to={link.url}
                                className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-bright-sun-400' : 'text-mine-shaft-400 hover:text-mine-shaft-200'}`}
                            >
                                <Icon size={24} stroke={isActive ? 2 : 1.5} />
                                <span className="text-[10px] font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
            {/* Safe area padding for newer iPhones */}
            <style>{`
                .pb-safe {
                    padding-bottom: env(safe-area-inset-bottom, 12px);
                }
            `}</style>
        </div>
    );
};

export default BottomNav;
