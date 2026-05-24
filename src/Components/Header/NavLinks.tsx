import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const allLinks = [
    { name: "Find Jobs",    url: "find-jobs",     roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Companies",    url: "companies",     roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Messages",     url: "messages",      roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Job History",  url: "job-history",   roles: ["APPLICANT", "ADMIN"] },
    { name: "Find Talent",  url: "find-talent",   roles: ["APPLICANT", "EMPLOYER", "ADMIN"] },
    { name: "Post Job",     url: "post-job/0",    roles: ["EMPLOYER",  "ADMIN"] },
    { name: "Posted Jobs",  url: "posted-jobs/0", roles: ["EMPLOYER",  "ADMIN"] },
];

const NavLinks = () => {
    const user = useSelector((state: any) => state.user);
    const location = useLocation();

    const links = user?.accountType
        ? allLinks.filter(link => link.roles.includes(user.accountType))
        : [];

    return <div className="flex bs-mx:!hidden gap-5 text-mine-shaft-300 h-full items-center">
        {
            links.map((link, index) => <div key={index} className={`${location.pathname === "/" + link.url ? "border-bright-sun-400 text-bright-sun-400" : "border-transparent"} border-t-[3px] h-full flex items-center`}>
                <Link className="hover:text-mine-shaft-200 " key={index} to={link.url}>{link.name}</Link>
            </div>)
        }
    </div>
}
export default NavLinks;