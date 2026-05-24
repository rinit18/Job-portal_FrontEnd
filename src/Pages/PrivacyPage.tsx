import { Divider } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";

const PrivacyPage = () => {
    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-6 text-center">Privacy Policy</div>
                <div data-aos="fade-up" data-aos-delay="100" className="glass-card p-8 rounded-xl text-mine-shaft-300 leading-relaxed text-justify space-y-6">
                    <p>Last updated: August 2024</p>
                    <p>
                        At {WEBSITE_CONFIG.name}, we are committed to protecting your personal information and your right to privacy. This policy outlines how we collect, use, and safeguard your data when you use our platform.
                    </p>
                    
                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">1. Information We Collect</div>
                        <p>We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products, or when you participate in activities on the platform (such as applying for jobs or uploading resumes). This includes Names, Email Addresses, Resumes, and Professional Histories.</p>
                    </div>

                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">2. AI Processing and Parsing</div>
                        <p>When you upload a resume, our systems and third-party AI partners process the text to extract skills and experiences. Your data is used strictly for generating your profile and matching you with jobs. We do not sell your personal data to training models.</p>
                    </div>

                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">3. How We Share Your Information</div>
                        <p>Your profile information is strictly private until you explicitly apply for a job posting. Once you apply, the employer who posted the job will be granted access to view your profile and resume details.</p>
                    </div>

                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">4. Security</div>
                        <p>We implement a variety of security measures to maintain the safety of your personal information, including industry-standard JWT authentication and secure database architectures.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPage;
