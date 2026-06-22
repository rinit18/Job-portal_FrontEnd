import SearchBar from "../Components/FindJobs/SearchBar";
import Jobs from "../Components/FindJobs/Jobs";
import { Helmet } from "react-helmet-async";

const FindJobsPage = () => {
    return (
        <div className="h-[calc(100vh-80px)] sm-mx:h-[calc(100dvh-140px)] flex flex-col bg-mine-shaft-950 font-['poppins'] overflow-hidden relative">
            <Helmet><title>Find Jobs | CareerConnect</title></Helmet>

            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-15%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full overflow-hidden w-full max-w-[1600px] mx-auto">
                {/* Search bar — fixed height top strip */}
                <div className="shrink-0 z-20 relative">
                    <SearchBar />
                </div>

                {/* Jobs section — takes remaining height */}
                <div className="flex-1 min-h-0">
                    <Jobs />
                </div>
            </div>
        </div>
    );
};

export default FindJobsPage;