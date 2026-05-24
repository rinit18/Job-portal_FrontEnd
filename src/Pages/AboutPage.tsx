import { Divider } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";

const AboutPage = () => {
    const { about } = WEBSITE_CONFIG;

    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-6 text-center">{about.title}</div>
                <div data-aos="fade-up" data-aos-delay="100" className="glass-card p-8 rounded-xl text-mine-shaft-300 leading-relaxed text-justify space-y-6">
                    <p className="text-lg">
                        {about.paragraph1}
                    </p>
                    
                    <div>
                        <div className="text-bright-sun-400 font-semibold text-xl mb-2">{about.missionTitle}</div>
                        <p>
                            {about.missionDesc}
                        </p>
                    </div>

                    <div>
                        <div className="text-bright-sun-400 font-semibold text-xl mb-2">{about.differentTitle}</div>
                        <ul className="list-disc pl-5 space-y-2">
                            {about.differentPoints.map((pt, idx) => (
                                <li key={idx}><strong>{pt.bold}</strong> {pt.text}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-mine-shaft-800">
                        <p className="text-center font-medium">
                            {about.footerText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
