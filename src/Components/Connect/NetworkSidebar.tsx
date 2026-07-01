import { Avatar, Button, Divider, Skeleton } from "@mantine/core";
import { IconUserPlus, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSuggestions, getPendingRequests, acceptConnectionRequest, rejectConnectionRequest, sendConnectionRequest } from "../../Services/ConnectionService";
import axiosInstance from "../../Interceptor/AxiosInterceptor";
import { useNavigate } from "react-router-dom";
import { setProfile } from "../../Slices/ProfileSlice";
import { errorNotification, successNotification } from "../../Services/NotificationService";

const NetworkSidebar = () => {
    const profile = useSelector((state: any) => state.profile);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [sentRequests, setSentRequests] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sugRes, reqRes] = await Promise.all([
                getSuggestions(profile?.id),
                getPendingRequests(profile?.id)
            ]);
            setSuggestions(sugRes);
            setRequests(reqRes);
        } catch (error) {
            console.error("Error fetching network data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (profile?.id) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile?.id]);

    const handleAccept = async (req: any) => {
        try {
            await acceptConnectionRequest(req.id);
            setRequests(prev => prev.filter(r => r.id !== req.id));
            // BUG-13 FIX: Sync connections count in Redux so ProfileSidebar updates immediately
            const newConnections = [...(profile.connections || []), req.sender?.id].filter(Boolean);
            dispatch(setProfile({ ...profile, connections: newConnections }));
            successNotification("Request Accepted", "You are now connected.");
        } catch (error) {
            console.error("Accept failed", error);
            errorNotification("Error", "Could not accept request.");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await rejectConnectionRequest(id);
            setRequests(requests.filter(r => r.id !== id));
            successNotification("Request Declined", "Connection request removed.");
        } catch (error) {
            console.error("Reject failed", error);
            errorNotification("Error", "Could not decline request.");
        }
    };

    const handleConnect = async (receiverId: number) => {
        try {
            await sendConnectionRequest(profile?.id, receiverId);
            setSentRequests([...sentRequests, receiverId]);
            successNotification("Request Sent", "Connection request has been sent.");
        } catch (error) {
            console.error("Connect failed", error);
            errorNotification("Error", "Could not send connection request.");
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Pending Requests */}
            {requests.length > 0 && (
                <div className="bg-mine-shaft-900/60 backdrop-blur-md rounded-2xl border border-mine-shaft-800/60 p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="font-bold text-lg text-mine-shaft-100">Pending Requests</div>
                        <div className="bg-bright-sun-400 text-mine-shaft-950 text-xs font-bold px-2 py-0.5 rounded-full">{requests.length}</div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        {requests.map((req) => (
                            <div key={req.id} className="flex flex-col gap-3 p-3 bg-mine-shaft-950/40 rounded-xl border border-mine-shaft-800/40 hover:border-bright-sun-400/30 transition-all duration-300">
                                <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/user/${req.sender?.id}`)}>
                                    <Avatar 
                                        src={req.sender?.picture ? `data:image/jpeg;base64,${req.sender.picture}` : ""} 
                                        radius="xl" 
                                        size="lg" 
                                        className="border-2 border-transparent group-hover:border-bright-sun-400 transition-colors"
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-bold text-sm text-mine-shaft-100 truncate group-hover:text-bright-sun-400 transition-colors">{req.sender?.name}</div>
                                        <div className="text-xs text-mine-shaft-400 truncate mt-0.5">{req.sender?.jobTitle}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-1">
                                    <Button size="sm" radius="md" variant="filled" color="brightSun.4" className="flex-1 font-semibold text-mine-shaft-950 shadow-[0_4px_10px_rgba(250,204,21,0.2)]" onClick={() => handleAccept(req)}>Accept</Button>
                                    <Button size="sm" radius="md" variant="light" color="gray" className="flex-1 font-medium hover:bg-red-500/10 hover:text-red-400" onClick={() => handleReject(req.id)}>Decline</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggestions */}
            <div className="bg-mine-shaft-900/60 backdrop-blur-md rounded-2xl border border-mine-shaft-800/60 p-5 shadow-lg">
                <div className="font-bold text-lg text-mine-shaft-100 mb-4">People you may know</div>
                <div className="flex flex-col gap-4">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <Skeleton circle height={48} width={48} />
                                <div className="flex flex-col gap-2 flex-1">
                                    <Skeleton height={14} width="70%" radius="xl"/>
                                    <Skeleton height={10} width="50%" radius="xl"/>
                                    <Skeleton height={28} width={90} mt={4} radius="xl" />
                                </div>
                            </div>
                        ))
                    ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion) => (
                            <div key={suggestion.id} className="flex gap-3 items-start p-2 hover:bg-mine-shaft-800/30 rounded-xl transition-colors">
                                <Avatar 
                                    src={suggestion.picture ? `data:image/jpeg;base64,${suggestion.picture}` : ""} 
                                    radius="xl" 
                                    size="md" 
                                    className="cursor-pointer border border-mine-shaft-700"
                                    onClick={() => navigate(`/user/${suggestion.id}`)}
                                />
                                <div className="flex-1 overflow-hidden">
                                    <div 
                                        className="font-semibold text-sm text-mine-shaft-100 truncate hover:text-bright-sun-400 cursor-pointer transition-colors"
                                        onClick={() => navigate(`/user/${suggestion.id}`)}
                                    >
                                        {suggestion.name}
                                    </div>
                                    <div className="text-xs text-mine-shaft-400 truncate mb-2">{suggestion.jobTitle}</div>
                                    {sentRequests.includes(suggestion.id) ? (
                                        <Button 
                                            size="xs" 
                                            variant="light" 
                                            color="gray" 
                                            radius="xl" 
                                            leftSection={<IconCheck size={14} />}
                                            className="font-medium"
                                            disabled
                                        >
                                            Sent
                                        </Button>
                                    ) : (
                                        <Button 
                                            size="xs" 
                                            variant="outline" 
                                            color="mineShaft.3" 
                                            radius="xl" 
                                            className="hover:border-bright-sun-400 hover:text-bright-sun-400 hover:bg-bright-sun-400/10 font-medium transition-colors"
                                            leftSection={<IconUserPlus size={14} />}
                                            onClick={() => handleConnect(suggestion.id)}
                                        >
                                            Connect
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                            <div className="text-sm text-mine-shaft-400 text-center mb-3">
                                No suggestions at the moment.
                            </div>
                            <Button 
                                size="xs" 
                                color="brightSun.4" 
                                variant="light" 
                                onClick={async () => {
                                    if (!profile?.id) return;
                                    try {
                                        await axiosInstance.post(`/connections/mock/${profile.id}`);
                                        successNotification("Mock Data Generated", "Refresh to see new posts and requests.");
                                        window.location.reload();
                                    } catch(e) {
                                        console.error(e);
                                        errorNotification("Error", "Could not generate mock data.");
                                    }
                                }}
                            >
                                Generate Mock Data
                            </Button>
                        </div>
                    )}
                </div>
                
                <Divider className="border-mine-shaft-800 my-3" />
                
                <div 
                    className="text-xs text-bright-sun-400 font-semibold text-center hover:underline cursor-pointer"
                    onClick={() => navigate("/professionals")}
                >
                    View all recommendations →
                </div>
            </div>
        </div>
    );
}

export default NetworkSidebar;
