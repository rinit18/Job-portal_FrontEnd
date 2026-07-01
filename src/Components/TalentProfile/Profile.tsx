import { Avatar, Button, Divider, Badge } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconUserCheck, IconUserPlus, IconMessageCircle, IconBuilding } from "@tabler/icons-react";
import ExpCard from "./ExpCard";
import CertiCard from "./CertiCard";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../../Services/ProfileService";
import { useMediaQuery } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { hideOverlay, showOverlay } from "../../Slices/OverlaySlice";
import { getOrCreateRoom } from "../../Services/ChatService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { WEBSITE_CONFIG } from "../../config";
import { sendConnectionRequest, withdrawConnectionRequest, removeConnection, getConnectionStatus } from "../../Services/ConnectionService";

const Profile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const matches = useMediaQuery('(max-width: 475px)');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentProfile = useSelector((state: any) => state.profile);
    const currentProfileId = currentProfile?.id;
    // "CONNECTED" | "PENDING_SENT" | "PENDING_RECEIVED" | "NONE" | "SELF"
    const [connStatus, setConnStatus] = useState<string>("NONE");

    // We don't have the explicit role in ProfileDTO, but we can infer Employer vs Applicant
    // Employers typically won't have totalExp, skills, experiences, or certifications
    // Alternatively, if there's a role field in the future, it can be used directly.
    const isEmployer = profile?.skills?.length === 0 && profile?.experiences?.length === 0 && profile?.certifications?.length === 0;

    useEffect(() => {
        if (!profile || !currentProfileId || profile.id === currentProfileId) {
            setConnStatus("SELF");
            return;
        }
        getConnectionStatus(currentProfileId, profile.id)
            .then((status) => setConnStatus(status))
            .catch(() => setConnStatus("NONE"));
    }, [profile, currentProfileId]);

    const handleConnect = async () => {
        if (!currentProfileId) {
            errorNotification("Authentication Required", "Please set up your profile to connect.");
            return;
        }
        try {
            await sendConnectionRequest(currentProfileId, profile.id);
            setConnStatus("PENDING_SENT");
            successNotification("Request Sent", `Connection request sent to ${profile.name}`);
        } catch (error: any) {
            const msg = error?.response?.data?.errorMessage || "";
            if (msg.includes("already sent") || msg.includes("already connected")) {
                setConnStatus("PENDING_SENT");
            } else {
                errorNotification("Error", "Could not send connection request.");
            }
        }
    };

    const handleWithdraw = async () => {
        try {
            await withdrawConnectionRequest(currentProfileId, profile.id);
            setConnStatus("NONE");
            successNotification("Withdrawn", "Connection request withdrawn");
        } catch (error) {
            errorNotification("Error", "Could not withdraw request.");
        }
    };

    const handleAcceptIncoming = async () => {
        try {
            await sendConnectionRequest(currentProfileId, profile.id);
            setConnStatus("CONNECTED");
            successNotification("Connected!", `You are now connected with ${profile.name}`);
        } catch (error) {
            errorNotification("Error", "Could not accept connection.");
        }
    };

    const handleDisconnect = async () => {
        try {
            await removeConnection(currentProfileId, profile.id);
            setConnStatus("NONE");
            successNotification("Disconnected", "Connection removed");
        } catch (error) {
            errorNotification("Error", "Could not remove connection.");
        }
    };

    const handleStartChat = () => {
        if (!currentProfileId) {
            errorNotification("Authentication Required", "Please set up your profile to chat.");
            return;
        }
        if (!profile?.id) return;
        getOrCreateRoom(currentProfileId, profile.id)
            .then((room) => {
                navigate(`/messages?roomId=${room.id}`);
            })
            .catch(() => errorNotification("Error", "Could not start chat."));
    };

    useEffect(() => {
        dispatch(showOverlay());
        window.scrollTo(0, 0);
        getProfile(id).then((res) => {
            setProfile(res);
        }).catch((err) => console.log(err))
        .finally(() => dispatch(hideOverlay()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    
    return <div data-aos="zoom-out" className="w-[65%] lg-mx:w-full">
        <div className="bg-mine-shaft-950 rounded-2xl pb-10">
            {/* Hero Banner with Cover Photo */}
            <div className="relative group rounded-t-2xl overflow-hidden shadow-xl mb-16 md-mx:mb-12">
                <div className="relative h-64 xs-mx:h-40 w-full bg-mine-shaft-900 overflow-hidden">
                    <img 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                        src={profile?.coverPhoto ? `data:image/jpeg;base64,${profile?.coverPhoto}` : WEBSITE_CONFIG.assets.profileBanner} 
                        alt="Cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-mine-shaft-950 via-mine-shaft-950/20 to-transparent opacity-90" />
                </div>

                <div className="absolute flex items-center justify-center !rounded-full -bottom-16 md-mx:-bottom-12 sm-mx:-bottom-10 left-10 sm-mx:left-6 z-40">
                    <Avatar 
                        className="!w-40 !h-40 md-mx:!w-32 md-mx:!h-32 sm-mx:!w-28 sm-mx:!h-28 border-mine-shaft-950 border-[6px] rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] bg-mine-shaft-900" 
                        src={profile?.picture ? `data:image/jpeg;base64,${profile?.picture}` : WEBSITE_CONFIG.assets.defaultAvatar} 
                        alt="" 
                    />
                </div>
            </div>

            <div className="px-8 sm-mx:px-4">
                <div className="flex flex-col gap-5">
                    {/* Header Info */}
                    <div className="flex justify-between items-start md-mx:flex-col md-mx:gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="text-3xl sm-mx:text-2xl font-extrabold text-mine-shaft-100 flex items-center gap-3">
                                {profile?.name}
                                {connStatus === "CONNECTED" && (
                                    <Badge color="teal" variant="light" size="sm" radius="sm" className="font-bold tracking-wider">Connected</Badge>
                                )}
                            </div>
                            <div className="text-xl sm-mx:text-lg font-medium text-bright-sun-400 mt-1 flex items-center gap-2">
                                {isEmployer ? <IconBuilding size={20} /> : <IconBriefcase size={20} />}
                                {profile?.jobTitle} {profile?.company ? `at ${profile.company}` : ""}
                            </div>
                            <div className="text-base flex gap-1 items-center text-mine-shaft-300 mt-1">
                                <IconMapPin size={18} stroke={2} /> {profile?.location}
                            </div>
                            {!isEmployer && profile?.totalExp != null && (
                                <div className="text-sm flex gap-1 items-center text-mine-shaft-400 mt-1 font-medium">
                                    Experience: {profile?.totalExp} Years
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {connStatus !== "SELF" && (
                                connStatus === "CONNECTED" ? (
                                    <>
                                        <Button size={matches ? "xs" : "sm"} color="brightSun.4" variant="filled" className="font-bold shadow-md shadow-bright-sun-400/20" leftSection={<IconMessageCircle size={18}/>} onClick={handleStartChat}>Message</Button>
                                        <Button size={matches ? "xs" : "sm"} color="red.5" variant="subtle" className="font-semibold hover:bg-red-500/10" onClick={handleDisconnect}>Remove</Button>
                                    </>
                                ) : connStatus === "PENDING_SENT" ? (
                                    <Button size={matches ? "xs" : "sm"} color="gray" variant="light" className="font-semibold" leftSection={<IconUserCheck size={18}/>} onClick={handleWithdraw}>Pending · Withdraw</Button>
                                ) : connStatus === "PENDING_RECEIVED" ? (
                                    <Button size={matches ? "xs" : "sm"} color="brightSun.4" variant="filled" className="font-bold shadow-md shadow-bright-sun-400/20" leftSection={<IconUserPlus size={18}/>} onClick={handleAcceptIncoming}>Accept Request</Button>
                                ) : (
                                    <Button size={matches ? "xs" : "sm"} color="brightSun.4" variant="outline" className="font-bold border-2" leftSection={<IconUserPlus size={18}/>} onClick={handleConnect}>Connect</Button>
                                )
                            )}
                        </div>
                    </div>

                    <Divider className="border-mine-shaft-800/60 my-2" />

                    {/* About Section */}
                    {profile?.about && (
                        <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl p-6 border border-mine-shaft-800/50 shadow-sm">
                            <div className="text-xl font-bold text-mine-shaft-100 mb-3">About</div>
                            <div className="text-base text-mine-shaft-300 leading-relaxed font-light whitespace-pre-wrap">{profile?.about}</div>
                        </div>
                    )}

                    {/* Conditionally hide these sections if the profile belongs to an employer */}
                    {!isEmployer && (
                        <>
                            {/* Skills Section */}
                            {profile?.skills && profile.skills.length > 0 && (
                                <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl p-6 border border-mine-shaft-800/50 shadow-sm">
                                    <div className="text-xl font-bold text-mine-shaft-100 mb-4">Skills</div>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill: any, index: any) => (
                                            <div key={index} className="bg-bright-sun-400/10 border border-bright-sun-400/20 rounded-xl px-4 py-1.5 text-sm font-semibold text-bright-sun-400 shadow-sm">
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience Section */}
                            {profile?.experiences && profile.experiences.length > 0 && (
                                <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl p-6 border border-mine-shaft-800/50 shadow-sm">
                                    <div className="text-xl font-bold text-mine-shaft-100 mb-6">Experience</div>
                                    <div className="flex flex-col gap-6">
                                        {profile.experiences.map((exp: any, index: any) => (
                                            <div key={index}>
                                                <ExpCard {...exp} />
                                                {index !== profile.experiences.length - 1 && <Divider className="border-mine-shaft-800/40 mt-6" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications Section */}
                            {profile?.certifications && profile.certifications.length > 0 && (
                                <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl p-6 border border-mine-shaft-800/50 shadow-sm">
                                    <div className="text-xl font-bold text-mine-shaft-100 mb-6">Certifications</div>
                                    <div className="flex flex-col gap-6">
                                        {profile.certifications.map((certi: any, index: any) => (
                                            <div key={index}>
                                                <CertiCard {...certi} />
                                                {index !== profile.certifications.length - 1 && <Divider className="border-mine-shaft-800/40 mt-6" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
}
export default Profile;