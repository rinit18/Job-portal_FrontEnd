import { Divider } from "@mantine/core";
import PostJob from "../Components/PostJob/PostJob";

const PostJobPage=()=>{
    return (
        <div className="min-h-[calc(100vh-80px)] bg-mine-shaft-950 font-['poppins'] relative overflow-hidden flex flex-col">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>
            <Divider className="border-mine-shaft-800/60 z-10" />
            
            <div className="flex-1 relative z-10 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar p-5">
                <PostJob/>
            </div>
        </div>
    );
}
export default PostJobPage;