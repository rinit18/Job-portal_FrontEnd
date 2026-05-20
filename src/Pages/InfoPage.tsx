import { Divider } from "@mantine/core";

const InfoPage = ({ title, content }: { title: string, content?: React.ReactNode }) => {
    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-6">{title}</div>
                <div data-aos="fade-up" data-aos-delay="100" className="glass-card p-8 rounded-xl text-mine-shaft-300 leading-relaxed text-justify space-y-4">
                    {content ? content : (
                        <>
                            <p>
                                Welcome to our <strong>{title}</strong> page. We are currently updating this section to provide you with the most comprehensive and up-to-date information.
                            </p>
                            <p>
                                JobHook is dedicated to connecting top talent with industry-leading companies. Our platform streamlines the hiring process through AI-powered matching, making it easier than ever for candidates to find their dream roles and for employers to discover exceptional professionals.
                            </p>
                            <p>
                                Please check back soon as we finalize this content. In the meantime, feel free to explore our job listings or reach out to our support team if you have any immediate questions!
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
