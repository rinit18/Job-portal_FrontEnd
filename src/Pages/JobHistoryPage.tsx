import {Divider } from "@mantine/core";
import JobHistory from "../Components/JobHistory/JobHistory";

const JobHistoryPage = () => {
    return (
        <div className="min-h-[calc(100dvh-80px)] sm-mx:min-h-[calc(100dvh-140px)] bg-mine-shaft-950 font-['poppins'] relative overflow-hidden flex flex-col">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>
            <Divider className="border-mine-shaft-800/60 z-10" />
            
            <div className="flex-1 flex w-full max-w-7xl mx-auto p-4 sm-mx:p-2 z-10 overflow-hidden">
                <div className="w-full my-5 overflow-y-auto custom-scrollbar sm-mx:pr-0 pr-2">
                    <JobHistory/>
                </div>
            </div>
        </div>
    )
}
export default JobHistoryPage;