import { Button, Divider } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconMessageCircle, IconQuestionMark, IconMessages } from "@tabler/icons-react";

const SupportPage = () => {
    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-5xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-2 text-center">Help & Support</div>
                <div data-aos="fade-up" className="text-mine-shaft-400 mb-10 text-center">How can we help you today?</div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div data-aos="fade-up" data-aos-delay="100" className="glass-card p-8 rounded-xl flex flex-col items-center text-center gap-4 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400 transition duration-300">
                        <div className="p-4 bg-mine-shaft-800 rounded-full text-bright-sun-400">
                            <IconQuestionMark size={40} />
                        </div>
                        <div className="text-xl font-semibold text-mine-shaft-100">FAQs</div>
                        <div className="text-mine-shaft-300 text-sm flex-1">Find answers to the most commonly asked questions about profiles, AI scoring, and applications.</div>
                        <Link to="/faqs" className="w-full">
                            <Button fullWidth variant="light" color="brightSun.4">View FAQs</Button>
                        </Link>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="200" className="glass-card p-8 rounded-xl flex flex-col items-center text-center gap-4 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400 transition duration-300">
                        <div className="p-4 bg-mine-shaft-800 rounded-full text-bright-sun-400">
                            <IconMessageCircle size={40} />
                        </div>
                        <div className="text-xl font-semibold text-mine-shaft-100">Contact Us</div>
                        <div className="text-mine-shaft-300 text-sm flex-1">Need specific help? Reach out to our support team and we'll get back to you within 24 hours.</div>
                        <Link to="/contact" className="w-full">
                            <Button fullWidth variant="light" color="brightSun.4">Get in Touch</Button>
                        </Link>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="300" className="glass-card p-8 rounded-xl flex flex-col items-center text-center gap-4 hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400 transition duration-300">
                        <div className="p-4 bg-mine-shaft-800 rounded-full text-bright-sun-400">
                            <IconMessages size={40} />
                        </div>
                        <div className="text-xl font-semibold text-mine-shaft-100">Feedback</div>
                        <div className="text-mine-shaft-300 text-sm flex-1">Have a suggestion or found a bug? We'd love to hear your thoughts to improve the platform.</div>
                        <Link to="/feedback" className="w-full">
                            <Button fullWidth variant="light" color="brightSun.4">Share Feedback</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
