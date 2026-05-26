import { Avatar, Button, Divider, Badge } from "@mantine/core";
import { IconBriefcase, IconMapPin, IconUserCheck, IconUserPlus, IconMessageCircle } from "@tabler/icons-react";
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

    // Fetch connection status from backend whenever profile or viewer changes
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
        // Find the request id — we need it to call acceptConnectionRequest
        // Simplest: just call send which will auto-accept the reverse request
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
    return <div data-aos="zoom-out" className="w-2/3 lg-mx:w-full">
        <div className="" >
            <div className="relative">

                <img className="rounded-t-2xl xl-mx:h-40 w-full xs-mx:h-32 " src={WEBSITE_CONFIG.assets.profileBanner} alt="" />
                <div className="absolute cursor-pointer flex items-center justify-center !rounded-full -bottom-1/3   md-mx:-bottom-10 sm-mx:-bottom-16  left-6">

                    <Avatar className="!w-48  !h-48 md-mx:!w-40 md-mx:!h-40 border-mine-shaft-950 border-8  rounded-full sm-mx:!w-36 sm-mx:!h-36 xs-mx:!h-32 xs-mx:!w-32" src={profile?.picture ? `data:image/jpeg;base64,${profile?.picture}` : WEBSITE_CONFIG.assets.defaultAvatar} alt="" />
                </div>

            </div>
            <div className="px-3 mt-16">
                <div className="text-3xl xs-mx:text-2xl font-semibold flex justify-between items-start">
                    <div>
                        {profile?.name}
                        {connStatus === "CONNECTED" && (
                            <Badge ml="sm" color="teal" variant="light" size="sm">Connected</Badge>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {connStatus !== "SELF" && (
                            connStatus === "CONNECTED" ? (
                                <>
                                    <Button size={matches ? "xs" : "sm"} color="brightSun.4" variant="filled" leftSection={<IconMessageCircle size={16}/>} onClick={handleStartChat}>Message</Button>
                                    <Button size={matches ? "xs" : "sm"} color="red" variant="subtle" onClick={handleDisconnect}>Remove</Button>
                                </>
                            ) : connStatus === "PENDING_SENT" ? (
                                <Button size={matches ? "xs" : "sm"} color="gray" variant="light" leftSection={<IconUserCheck size={16}/>} onClick={handleWithdraw}>Pending · Withdraw</Button>
                            ) : connStatus === "PENDING_RECEIVED" ? (
                                <Button size={matches ? "xs" : "sm"} color="brightSun.4" variant="filled" leftSection={<IconUserPlus size={16}/>} onClick={handleAcceptIncoming}>Accept Request</Button>
                            ) : (
                                <Button size={matches ? "xs" : "sm"} color="brightSun.4" variant="outline" leftSection={<IconUserPlus size={16}/>} onClick={handleConnect}>Connect</Button>
                            )
                        )}
                    </div>
                </div>
                <div className="text-xl xs-mx:text-base flex gap-1 items-center"> <IconBriefcase className="h-5 w-5" stroke={1.5} />{profile?.jobTitle}  &bull; {profile?.company}</div>
                <div className="text-lg flex xs-mx:text-base gap-1 items-center text-mine-shaft-300">
                    <IconMapPin className="h-5 w-5" stroke={1.5} /> {profile?.location}
                </div>
                <div className="text-lg xs-mx:text-base flex gap-1 items-center text-mine-shaft-300">
                    <IconBriefcase className="h-5 w-5" stroke={1.5} /> Experience: {profile?.totalExp} Years
                </div>
                <Divider my="xl" />
                <div>
                    <div className="text-2xl font-semibold mb-3">About</div>
                    <div className="text-sm text-mine-shaft-300 text-justify">{profile?.about}</div>
                </div>
                <Divider my="xl" />
                <div>
                    <div className="text-2xl font-semibold mb-3">Skills</div>
                    <div className="flex flex-wrap gap-2">
                        {
                            profile?.skills?.map((skill: any, index: any) => <div key={index} className="bg-bright-sun-300 rounded-3xl px-3 py-1 text-sm font-medium bg-opacity-15 text-bright-sun-400">{skill}</div>)
                        }

                    </div>
                </div>
                <Divider my="xl" />
                <div>
                    <div className="text-2xl font-semibold mb-4">Experience</div>
                    <div className="flex flex-col gap-8">
                        {
                            profile?.experiences?.map((exp: any, index: any) => <ExpCard key={index} {...exp} />)
                        }
                    </div>
                </div>
                <Divider my="xl" />
                <div>
                    <div className="text-2xl font-semibold mb-4">Certifications</div>
                    <div className="flex flex-col gap-8">
                        {
                            profile?.certifications?.map((certi: any, index: any) => <CertiCard key={index} {...certi} />)
                        }
                    </div>
                </div>
            </div>

        </div>
    </div>
}
export default Profile;