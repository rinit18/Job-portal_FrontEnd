import { IconAnchor, IconBrandInstagram, IconBrandTelegram, IconBrandYoutube } from "@tabler/icons-react";
import { footerLinks } from "../../Data/Data";
import { useLocation, Link } from "react-router-dom";
import { Divider } from "@mantine/core";
import { WEBSITE_CONFIG } from "../../config";

const Footer = () => {
    const location=useLocation();
    return location.pathname!='/signup' && location.pathname!='/login'?<div className="flex flex-col gap-2"><div className="pt-20 pb-5 bg-mine-shaft-950 p-4  flex gap-8 justify-around flex-wrap">
        <div data-aos="fade-up"  data-aos-offset="0"  className="w-1/4 sm-mx:w-1/3   xs-mx:w-1/2 xsm-mx:w-full flex flex-col gap-4">
            <div className="flex gap-1 items-center text-bright-sun-400">
                <IconAnchor className="h-6 w-6" stroke={2.5} />
                <div className="text-xl font-semibold">{WEBSITE_CONFIG.name}</div>
            </div>
            <div className="text-sm text-mine-shaft-300">{WEBSITE_CONFIG.aboutParagraph}</div>
            <div className="flex gap-3 text-bright-sun-400 [&>a]:bg-mine-shaft-900 [&>a]:p-2 [&>a]:rounded-full [&>a]:cursor-pointer hover:[&>a]:bg-mine-shaft-700">
                <a href={WEBSITE_CONFIG.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><IconBrandInstagram /></a>
                <a href={WEBSITE_CONFIG.socialLinks.telegram} target="_blank" rel="noopener noreferrer"><IconBrandTelegram /></a>
                <a href={WEBSITE_CONFIG.socialLinks.youtube} target="_blank" rel="noopener noreferrer"><IconBrandYoutube /></a>
            </div>
        </div>
        {
            footerLinks.map((item, index) => <div  data-aos-offset="0"  data-aos="fade-up" key={index}>
                <div className="text-lg font-semibold mb-4 text-bright-sun-400">{item.title}</div>
                {
                    item.links.map((link, index) => <Link to={link.url} key={index} className="text-mine-shaft-300 text-sm hover:text-bright-sun-400 cursor-pointer mb-1 hover:translate-x-2 transition duration-300 ease-in-out block">{link.name}</Link>)
                }
            </div>)
        }
    </div>
    <Divider/>
    <div data-aos="flip-left"  data-aos-offset="0" className="font-medium text-center p-5">
        {WEBSITE_CONFIG.footerDeveloperText.split("By")[0]} By <a className="text-bright-sun-400 hover:underline font-semibold " href={WEBSITE_CONFIG.developerGithub} target="_blank" rel="noopener noreferrer">{WEBSITE_CONFIG.footerDeveloperText.split("By")[1].trim()}</a>
    </div>
    </div>:<></>
}
export default Footer;