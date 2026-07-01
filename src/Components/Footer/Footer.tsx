import { IconAnchor, IconBrandInstagram, IconBrandTelegram, IconBrandYoutube } from "@tabler/icons-react";
import { footerLinks } from "../../Data/Data";
import { useLocation, Link } from "react-router-dom";
import { Divider } from "@mantine/core";
import { WEBSITE_CONFIG } from "../../config";

const Footer = () => {
    const location = useLocation();
    
    // Hide footer on full-height app-like pages or auth pages
    const hiddenPaths = ['/signup', '/login', '/messages', '/find-jobs', '/network', '/posted-jobs'];
    const shouldHide = hiddenPaths.some(path => location.pathname.startsWith(path));

    if (shouldHide) return <></>;

    return (
        <div className="flex flex-col mt-auto bg-mine-shaft-950/80 backdrop-blur-xl border-t border-mine-shaft-800/60 shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
            <div className="py-12 sm-mx:py-8 flex gap-8 sm-mx:gap-6 justify-between px-16 sm-mx:px-6 flex-wrap w-full max-w-[1600px] mx-auto">
                <div data-aos="fade-up" data-aos-offset="0" className="w-1/4 sm-mx:w-1/3 xs-mx:w-1/2 xsm-mx:w-full flex flex-col gap-5">
                    <div className="flex gap-2 items-center text-bright-sun-400">
                        <IconAnchor className="h-7 w-7 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" stroke={2.5} />
                        <div className="text-2xl font-bold tracking-tight">{WEBSITE_CONFIG.name}</div>
                    </div>
                    <div className="text-sm text-mine-shaft-400 leading-relaxed pr-4 font-medium">{WEBSITE_CONFIG.aboutParagraph}</div>
                    <div className="flex gap-3 text-bright-sun-400 [&>a]:bg-mine-shaft-900/50 [&>a]:p-2.5 [&>a]:rounded-xl [&>a]:border [&>a]:border-white/5 [&>a]:cursor-pointer hover:[&>a]:bg-bright-sun-400/10 hover:[&>a]:text-bright-sun-400 hover:[&>a]:border-bright-sun-400/50 hover:[&>a]:shadow-[0_0_15px_rgba(250,204,21,0.2)] transition-all duration-300">
                        <a href={WEBSITE_CONFIG.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><IconBrandInstagram size={20} /></a>
                        <a href={WEBSITE_CONFIG.socialLinks.telegram} target="_blank" rel="noopener noreferrer"><IconBrandTelegram size={20} /></a>
                        <a href={WEBSITE_CONFIG.socialLinks.youtube} target="_blank" rel="noopener noreferrer"><IconBrandYoutube size={20} /></a>
                    </div>
                </div>
                {
                    footerLinks.map((item, index) => <div data-aos-offset="0" data-aos="fade-up" key={index} className="flex flex-col gap-2">
                        <div className="text-lg font-bold mb-2 text-mine-shaft-100">{item.title}</div>
                        {
                            item.links.map((link, index) => <Link to={link.url} key={index} className="text-mine-shaft-400 text-sm font-medium hover:text-bright-sun-400 hover:translate-x-1 cursor-pointer mb-1.5 transition-all duration-200 block">{link.name}</Link>)
                        }
                    </div>)
                }
            </div>
            
            <div className="w-full border-t border-mine-shaft-800/60">
                <div data-aos="flip-left" data-aos-offset="0" className="text-sm font-medium text-mine-shaft-500 text-center py-6 sm-mx:pb-24">
                    {WEBSITE_CONFIG.footerDeveloperText.split("By")[0]} By <a className="text-bright-sun-400/80 hover:text-bright-sun-400 transition-colors font-bold" href={WEBSITE_CONFIG.developerGithub} target="_blank" rel="noopener noreferrer">{WEBSITE_CONFIG.footerDeveloperText.split("By")[1].trim()}</a>
                </div>
            </div>
        </div>
    );
}
export default Footer;