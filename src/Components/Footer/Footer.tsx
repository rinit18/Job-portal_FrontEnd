import { IconAnchor, IconBrandInstagram, IconBrandTelegram, IconBrandYoutube } from "@tabler/icons-react";
import { footerLinks } from "../../Data/Data";
import { useLocation, Link } from "react-router-dom";
import { Divider } from "@mantine/core";
import { WEBSITE_CONFIG } from "../../config";

const Footer = () => {
    const location = useLocation();
    
    // Hide footer on full-height app-like pages or auth pages
    const hiddenPaths = ['/signup', '/login', '/messages', '/find-jobs', '/network'];
    const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

    if (shouldHide) return <></>;

    return (
        <div className="flex flex-col gap-2">
            <div className="pt-10 pb-5 bg-mine-shaft-950 p-4 flex gap-8 justify-between px-10 flex-wrap">
        <div data-aos="fade-up" data-aos-offset="0" className="w-1/4 sm-mx:w-1/3 xs-mx:w-1/2 xsm-mx:w-full flex flex-col gap-4">
            <div className="flex gap-2 items-center text-bright-sun-400">
                <IconAnchor className="h-5 w-5" stroke={2.5} />
                <div className="text-xl font-bold tracking-tight">{WEBSITE_CONFIG.name}</div>
            </div>
            <div className="text-sm text-mine-shaft-400 leading-relaxed pr-4">{WEBSITE_CONFIG.aboutParagraph}</div>
            <div className="flex gap-2.5 text-bright-sun-400 [&>a]:bg-mine-shaft-900/50 [&>a]:p-2.5 [&>a]:rounded-xl [&>a]:border [&>a]:border-white/[0.05] [&>a]:cursor-pointer hover:[&>a]:bg-mine-shaft-800 hover:[&>a]:border-mine-shaft-700 transition-colors">
                <a href={WEBSITE_CONFIG.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><IconBrandInstagram size={20} /></a>
                <a href={WEBSITE_CONFIG.socialLinks.telegram} target="_blank" rel="noopener noreferrer"><IconBrandTelegram size={20} /></a>
                <a href={WEBSITE_CONFIG.socialLinks.youtube} target="_blank" rel="noopener noreferrer"><IconBrandYoutube size={20} /></a>
            </div>
        </div>
        {
            footerLinks.map((item, index) => <div data-aos-offset="0" data-aos="fade-up" key={index} className="flex flex-col gap-1">
                <div className="text-base font-bold mb-2 text-bright-sun-400">{item.title}</div>
                {
                    item.links.map((link, index) => <Link to={link.url} key={index} className="text-mine-shaft-400 text-sm font-medium hover:text-bright-sun-400 cursor-pointer mb-1.5 transition-colors duration-200 ease-in-out block">{link.name}</Link>)
                }
            </div>)
        }
    </div>
    <Divider className="border-mine-shaft-800" />
    <div data-aos="flip-left" data-aos-offset="0" className="text-sm font-medium text-mine-shaft-500 text-center p-4 sm-mx:pb-20">
        {WEBSITE_CONFIG.footerDeveloperText.split("By")[0]} By <a className="text-bright-sun-400 hover:text-bright-sun-300 transition-colors font-bold" href={WEBSITE_CONFIG.developerGithub} target="_blank" rel="noopener noreferrer">{WEBSITE_CONFIG.footerDeveloperText.split("By")[1].trim()}</a>
    </div>
        </div>
    );
}
export default Footer;