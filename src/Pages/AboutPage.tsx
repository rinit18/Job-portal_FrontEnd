import { Divider } from "@mantine/core";

const AboutPage = () => {
    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-6 text-center">About JobHook</div>
                <div data-aos="fade-up" data-aos-delay="100" className="glass-card p-8 rounded-xl text-mine-shaft-300 leading-relaxed text-justify space-y-6">
                    <p className="text-lg">
                        JobHook is a next-generation platform designed to revolutionize the way professionals and companies connect. We believe that finding the right job—or the perfect candidate—should not be a tedious, manual process.
                    </p>
                    
                    <div>
                        <div className="text-bright-sun-400 font-semibold text-xl mb-2">Our Mission</div>
                        <p>
                            To bridge the gap between world-class talent and industry-leading companies through intelligent, AI-driven matchmaking and a seamless user experience. We aim to empower applicants with automated resume parsing, skill matching, and tailored job recommendations, while providing employers with robust tools to discover and track the best candidates.
                        </p>
                    </div>

                    <div>
                        <div className="text-bright-sun-400 font-semibold text-xl mb-2">What Makes Us Different</div>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>AI Match Scoring:</strong> Our proprietary language models read and evaluate resumes directly against job descriptions, providing an instant compatibility score and identifying skill gaps.</li>
                            <li><strong>Streamlined Profiles:</strong> Just upload your resume. We handle parsing your skills, experience, and education directly into a beautiful profile.</li>
                            <li><strong>Direct Communication:</strong> Say goodbye to black-hole applications. Use our built-in messaging system to connect directly with recruiters.</li>
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-mine-shaft-800">
                        <p className="text-center font-medium">
                            Join us in reshaping the future of hiring.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
