import { Avatar, Divider } from "@mantine/core";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const navigate = useNavigate();

    return (
        <div className="bg-mine-shaft-900 rounded-xl overflow-hidden border border-mine-shaft-800 flex flex-col items-center">
            <div className="h-20 w-full bg-bright-sun-400"></div>
            <Avatar 
                src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : ""} 
                size="xl" 
                className="mt-[-40px] border-4 border-mine-shaft-900" 
            />
            <div className="p-4 flex flex-col items-center w-full">
                <div 
                    className="text-lg font-semibold hover:underline cursor-pointer" 
                    onClick={() => navigate("/profile")}
                >
                    {user?.name || "User"}
                </div>
                <div className="text-sm text-mine-shaft-300 text-center mt-1">
                    {profile?.jobTitle || "Add your headline"} {profile?.company ? `at ${profile.company}` : ""}
                </div>
                
                <Divider className="w-full my-4 border-mine-shaft-800" />
                
                <div className="w-full flex justify-between text-sm hover:bg-mine-shaft-800 p-2 rounded cursor-pointer transition-colors" onClick={() => navigate("/network")}>
                    <span className="text-mine-shaft-300">Connections</span>
                    <span className="text-bright-sun-400 font-semibold">{profile?.connections?.length || 0}</span>
                </div>
            </div>
        </div>
    );
}

export default ProfileSidebar;
