import { Divider } from "@mantine/core";
import SearchBar from "../Components/FindTalent/SearchBar";
import Talents from "../Components/FindTalent/Talents";

import { Helmet } from "react-helmet-async";

const FindTalentPage=()=>{
    return (
        <div className="min-h-[calc(100vh-80px)] bg-mine-shaft-950 font-['poppins'] relative overflow-hidden flex flex-col">
            <Helmet><title>Find Talent | CareerConnect</title></Helmet>
            
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>
            
            <Divider className="border-mine-shaft-800/60 z-10" />
            
            <div className="relative z-10 flex flex-col h-full overflow-hidden w-full max-w-screen-2xl mx-auto">
                <div className="shrink-0 z-20 relative">
                    <SearchBar/>
                </div>
                <div className="flex-1 min-h-0">
                    <Talents/>
                </div>
            </div>
        </div>
    );
}
export default FindTalentPage;