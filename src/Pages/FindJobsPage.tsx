import { Divider } from "@mantine/core";
import SearchBar from "../Components/FindJobs/SearchBar";
import Jobs from "../Components/FindJobs/Jobs";

import { Helmet } from "react-helmet-async";

const FindJobsPage = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] flex flex-col bg-mine-shaft-950 font-['poppins'] relative overflow-hidden">
            {/* Ambient Premium Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-bright-sun-400/5 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-bright-sun-400/5 blur-[120px]"></div>
            </div>

            <div className="relative z-10 flex flex-col flex-1">
                <Helmet><title>Find Jobs | CareerConnect</title></Helmet>
                <Divider size="xs" mx="md" color="mineShaft.8"/>
                <SearchBar/>
                <Divider size="xs" mx="md" color="mineShaft.8"/>
                <div className="flex-1">
                    <Jobs/>
                </div>
            </div>
        </div>
    )
}
export default FindJobsPage;