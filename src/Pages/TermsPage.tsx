import { Divider } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";

const TermsPage = () => {
    return (
        <div className="min-h-[85vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="max-w-4xl mx-auto px-5 py-10">
                <div data-aos="fade-up" className="text-3xl font-bold text-mine-shaft-100 mb-6 text-center">Terms & Conditions</div>
                <div data-aos="fade-up" data-aos-delay="100" className="glass-card p-8 rounded-xl text-mine-shaft-300 leading-relaxed text-justify space-y-6">
                    <p>
                        Welcome to {WEBSITE_CONFIG.name}. By accessing or using our platform, you agree to be bound by these Terms and Conditions and our Privacy Policy.
                    </p>
                    
                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">1. User Accounts</div>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your profile.</p>
                    </div>

                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">2. Acceptable Use</div>
                        <p>You agree not to use the platform for any unlawful purpose or to post any false, misleading, or fraudulent information. Employers agree to post legitimate job opportunities and not to use applicant data for unauthorized marketing purposes.</p>
                    </div>

                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">3. Intellectual Property</div>
                        <p>The platform and its original content, features, and functionality are owned by {WEBSITE_CONFIG.name} and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                    </div>

                    <div>
                        <div className="text-mine-shaft-100 font-semibold text-lg mb-1">4. Disclaimer of Warranties</div>
                        <p>We do not guarantee that you will receive job offers or that employers will find suitable candidates. Our AI match scores are indicative guidelines and should not be solely relied upon for hiring decisions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
