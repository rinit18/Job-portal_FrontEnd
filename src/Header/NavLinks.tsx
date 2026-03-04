import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ComponentProps, FC } from "react";

interface NavLinksProps extends ComponentProps<"div"> {
  // Add any additional props here if needed
}

const NavLinks: FC<NavLinksProps> = ({ className, ...props }) => {
    const links = [
        { name: "Find Jobs", url: "/find-jobs" },
        { name: "Find Talent", url: "/find-talent" },
        { name: "Upload Job", url: "/upload-job" },
        { name: "About Us", url: "/about" },
    ];
    
    const location = useLocation();

    return (
        <div 
            className={`flex gap-3 md:gap-5 h-full text-mine-shaft-300 items-center ${className || ""}`}
            {...props}
        >
            {links.map((link, index) => (
                <div 
                    key={index} 
                    className={`${
                        location.pathname === link.url 
                            ? "border-bright-sun-400 text-bright-sun-400" 
                            : "border-transparent"
                    } border-t-[3px] h-full flex items-center px-2 hover:text-bright-sun-300 transition-colors`}
                >
                    <Link to={link.url} className="text-sm md:text-base">
                        {link.name}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NavLinks;