import { Divider } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import ProfileSidebar from "../Components/Connect/ProfileSidebar";
import Feed from "../Components/Connect/Feed";
import NetworkSidebar from "../Components/Connect/NetworkSidebar";

const FindTalentPage = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-mine-shaft-950 font-['poppins'] relative overflow-hidden flex flex-col pb-10">
            <Helmet><title>Network & Feed | CareerConnect</title></Helmet>
            
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>
            
            <Divider className="border-mine-shaft-800/60 z-10" />
            
            <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column: Profile */}
                    <div className="w-full lg:w-1/4 hidden lg:block shrink-0">
                        <div className="sticky top-24">
                            <ProfileSidebar />
                        </div>
                    </div>

                    {/* Center Column: Feed */}
                    <div className="w-full lg:w-2/4 shrink-0">
                        <Feed />
                    </div>

                    {/* Right Column: Suggestions & Requests */}
                    <div className="w-full lg:w-1/4 hidden lg:block shrink-0">
                        <div className="sticky top-24">
                            <NetworkSidebar />
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default FindTalentPage;