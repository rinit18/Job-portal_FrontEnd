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
        <div className="bg-mine-shaft-900 rounded-xl overflow-hidden border border-mine-shaft-800 flex flex-col">
            {/* Banner */}
            <div className="h-20 w-full bg-gradient-to-r from-bright-sun-400/80 to-bright-sun-400/40" />

            {/* Avatar */}
            <div className="flex flex-col items-center px-4 pb-4 -mt-10">
                {isLoading ? (
                    <Skeleton circle height={72} width={72} className="border-4 border-mine-shaft-900" />
                ) : (
                    <Avatar
                        src={profile?.picture ? `data:image/jpeg;base64,${profile.picture}` : ""}
                        size={72}
                        className="border-4 border-mine-shaft-900 cursor-pointer"
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
                                className="text-lg font-semibold hover:underline cursor-pointer truncate"
                                onClick={() => navigate("/profile")}
                            >
                                {user?.name || "User"}
                            </div>
                            {(profile?.jobTitle || profile?.company) && (
                                <div className="text-sm text-mine-shaft-300 flex items-center justify-center gap-1 mt-0.5">
                                    <IconBriefcase size={13} stroke={1.5} />
                                    <span className="truncate">
                                        {profile.jobTitle || ""}
                                        {profile.jobTitle && profile.company ? " at " : ""}
                                        {profile.company || ""}
                                    </span>
                                </div>
                            )}
                            {profile?.location && (
                                <div className="text-xs text-mine-shaft-400 flex items-center justify-center gap-1 mt-0.5">
                                    <IconMapPin size={12} stroke={1.5} />
                                    {profile.location}
                                </div>
                            )}
                            {!profile?.jobTitle && !profile?.company && (
                                <div
                                    className="text-sm text-bright-sun-400/70 hover:text-bright-sun-400 cursor-pointer mt-1 transition-colors"
                                    onClick={() => navigate("/profile")}
                                >
                                    Add your headline →
                                </div>
                            )}
                        </>
                    )}
                </div>

                <Divider className="w-full my-3 border-mine-shaft-800" />

                {/* Stats Row */}
                <div className="w-full flex flex-col gap-1">
                    <div
                        className="w-full flex justify-between text-sm hover:bg-mine-shaft-800 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                        onClick={() => navigate("/network")}
                    >
                        <span className="text-mine-shaft-300">Connections</span>
                        {isLoading ? (
                            <Skeleton height={14} width={20} />
                        ) : (
                            <span className="text-bright-sun-400 font-semibold">{profile?.connections?.length || 0}</span>
                        )}
                    </div>
                    <div
                        className="w-full flex justify-between text-sm hover:bg-mine-shaft-800 px-2 py-1.5 rounded-lg cursor-pointer transition-colors"
                        onClick={() => navigate("/profile")}
                    >
                        <span className="text-mine-shaft-300">Profile Views</span>
                        <span className="text-bright-sun-400 font-semibold text-xs italic">Coming soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSidebar;
