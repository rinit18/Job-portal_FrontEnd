import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export const allLinks = [
    { name: "Find Jobs",    url: "find-jobs",     roles: ["APPLICANT", "ADMIN"] },
    { name: "Companies",    url: "companies",     roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Messages",     url: "messages",      roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Job History",  url: "job-history",   roles: ["APPLICANT", "ADMIN"] },
    { name: "Connect",      url: "network",       roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Post Job",     url: "post-job/0",    roles: ["EMPLOYER",  "ADMIN"] },
    { name: "Posted Jobs",  url: "posted-jobs/0", roles: ["EMPLOYER",  "ADMIN"] },
];

const NavLinks = () => {
    const user = useSelector((state: any) => state.user);
    const location = useLocation();

    const links = user?.accountType
        ? allLinks.filter(link => link.roles.includes(user.accountType))
        : [];

    return <div className="flex bs-mx:!hidden gap-2 text-mine-shaft-300 h-full items-center">
        {
            links.map((link, index) => {
                const isActive = location.pathname === "/" + link.url;
                return (
                    <div key={index} className="h-full flex items-center">
                        <Link 
                            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${isActive ? "bg-bright-sun-400/10 text-bright-sun-400 shadow-[0_0_10px_rgba(250,204,21,0.15)]" : "hover:text-mine-shaft-100 hover:bg-mine-shaft-800/50"}`} 
                            to={link.url}
                        >
                            {link.name}
                        </Link>
                    </div>
                )
            })
        }
    </div>
}
export default NavLinks;