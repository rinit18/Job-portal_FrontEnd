import { Avatar, Divider, Skeleton } from "@mantine/core";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconBriefcase, IconMapPin } from "@tabler/icons-react";

const ProfileSidebar = () => {
    const user = useSelector((state: any) => state.user);
    const profile = useSelector((state: any) => state.profile);
    const navigate = useNavigate();

    const isLoading = !profile?.id;

    return (
        <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-mine-shaft-800/50 shadow-lg flex flex-col hover:border-mine-shaft-700/50 transition-colors">
            {/* Banner */}
            <div className="h-24 w-full bg-gradient-to-r from-bright-sun-400 to-yellow-500 opacity-80" />

            {/* Avatar */}
            <div className="flex flex-col items-center px-5 pb-5 -mt-12">
                {isLoading ? (
                    <Skeleton circle height={84} width={84} className="border-[6px] border-mine-shaft-950" />
                ) : (
                    <Avatar
                        src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : ""}
                        size={84}
                        className="border-[6px] border-mine-shaft-950 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-105"
                        onClick={() => navigate("/profile")}
                    />
                )}

                <div className="mt-3 w-full text-center">
                    {isLoading ? (
                        <>
                            <Skeleton height={18} width="70%" mx="auto" mb={6} />
                            <Skeleton height={14} width="90%" mx="auto" />
                        </>
                    ) : (
                        <>
                            <div
                                className="text-xl font-bold text-mine-shaft-100 hover:text-bright-sun-400 cursor-pointer truncate transition-colors"
                                onClick={() => navigate("/profile")}
                            >
                                {user?.name || "User"}
                            </div>
                            {(profile?.jobTitle || profile?.company) && (
                                <div className="text-sm font-medium text-mine-shaft-300 flex items-center justify-center gap-1 mt-1">
                                    <IconBriefcase size={14} className="text-mine-shaft-400" />
                                    <span className="truncate">
                                        {profile.jobTitle || ""}
                                        {profile.jobTitle && profile.company ? " at " : ""}
                                        {profile.company || ""}
                                    </span>
                                </div>
                            )}
                            {profile?.location && (
                                <div className="text-xs font-medium text-mine-shaft-400 flex items-center justify-center gap-1 mt-1">
                                    <IconMapPin size={14} className="text-mine-shaft-400" />
                                    {profile.location}
                                </div>
                            )}
                            {!profile?.jobTitle && !profile?.company && (
                                <div
                                    className="text-sm font-semibold text-bright-sun-400/80 hover:text-bright-sun-400 cursor-pointer mt-2 bg-bright-sun-400/10 px-4 py-1.5 rounded-full inline-block transition-colors"
                                    onClick={() => navigate("/profile")}
                                >
                                    + Add Headline
                                </div>
                            )}
                        </>
                    )}
                </div>

                <Divider className="w-full my-4 border-mine-shaft-800/60" />

                {/* Stats Row */}
                <div className="w-full flex flex-col gap-1">
                    <div
                        className="w-full flex justify-between items-center text-sm hover:bg-mine-shaft-800/60 px-3 py-2 rounded-xl cursor-pointer transition-colors group"
                        onClick={() => navigate("/network")}
                    >
                        <span className="text-mine-shaft-300 font-medium group-hover:text-mine-shaft-100 transition-colors">Connections</span>
                        {isLoading ? (
                            <Skeleton height={14} width={20} />
                        ) : (
                            <span className="text-mine-shaft-100 font-bold group-hover:text-bright-sun-400 transition-colors">{profile?.connections?.length || 0}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
