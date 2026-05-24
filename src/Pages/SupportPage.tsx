import { Button, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconMessageCircle, IconQuestionMark, IconMessages } from "@tabler/icons-react";
import { WEBSITE_CONFIG } from "../config";

const SupportPage = () => {
    const { support } = WEBSITE_CONFIG;
    
    // Map of icons corresponding to card titles/types
    const getIcon = (title: string) => {
        if (title.toLowerCase().includes("faq")) return <IconQuestionMark size={40} />;
        if (title.toLowerCase().includes("contact")) return <IconMessageCircle size={40} />;
        return <IconMessages size={40} />;
    };

    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-5xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-2 text-center">{support.title}</div>
                <div data-aos="fade-up" className="text-mine-shaft-400 mb-10 text-center">{support.subtitle}</div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {support.cards.map((card, index) => (
                        <div 
                            key={index}
                            data-aos="fade-up" 
                            data-aos-delay={(index + 1) * 100} 
                            className="glass-card p-8 rounded-xl flex flex-col items-center text-center gap-4 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400 transition duration-300"
                        >
                            <div className="p-4 bg-mine-shaft-800 rounded-full text-bright-sun-400">
                                {getIcon(card.title)}
                            </div>
                            <div className="text-xl font-semibold text-mine-shaft-100">{card.title}</div>
                            <div className="text-mine-shaft-300 text-sm flex-1">{card.desc}</div>
                            <Link to={card.url} className="w-full">
                                <Button fullWidth variant="light" color="brightSun.4">{card.buttonText}</Button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
