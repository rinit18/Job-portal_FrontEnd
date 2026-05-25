import { Button, Divider, Text, Badge } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconClockHour3, IconMapPin, IconBriefcase } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../../Slices/ProfileSlice";
import { getOrCreateRoomByUser } from "../../Services/ChatService";
import { errorNotification, successNotification } from "../../Services/NotificationService";

const JobCard = (props: any) => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const profile=useSelector((state:any)=>state.profile);
    const currentProfileId = profile?.id;
    const handleSaveJob = (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering card selection
        let savedJobs:any=profile.savedJobs?[...profile.savedJobs]:[];
        if(savedJobs.includes(props.id)){
            savedJobs=savedJobs.filter((job:any)=>job!==props.id);
            successNotification("Success", "Job removed from bookmarks");
        }else{ 
            savedJobs.push(props.id);
            successNotification("Success", "Job saved to bookmarks");
        }
        let updatedProfile={...profile,savedJobs:savedJobs};
        dispatch(changeProfile(updatedProfile));
    }
    
    const handleMessageRecruiter = () => {
        if (!currentProfileId) {
            errorNotification("Authentication Required", "Please set up your profile to chat.");
            return;
        }
        if (!props.postedBy) return;

        getOrCreateRoomByUser(currentProfileId, props.postedBy)
            .then((room) => {
                navigate(`/messages?roomId=${room.id}`);
            })
            .catch((err) => {
                console.error("Failed to start chat with recruiter", err);
                errorNotification("Error", "Could not connect to recruiter.");
            });
    };
    
    return <div onClick={() => props.onSelect && props.onSelect(props)} data-aos="fade-up" className={`p-5 rounded-2xl transition-all duration-300 ease-in-out sm-mx:w-full flex flex-col gap-4 relative overflow-hidden backdrop-blur-md ${props.onSelect ? 'cursor-pointer' : ''} ${props.selected ? 'border border-bright-sun-400 shadow-[0_0_25px_rgba(255,189,32,0.15)] bg-mine-shaft-900/70' : 'border border-mine-shaft-800/60 bg-mine-shaft-900/40 hover:bg-mine-shaft-900/60 hover:border-bright-sun-400/40 hover:shadow-[0_0_20px_rgba(255,189,32,0.08)] hover:-translate-y-1'} ${props.fullWidth ? 'w-full' : 'w-72'} group`}>
        {/* Subtle premium accent line on top */}
        {props.selected && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-bright-sun-400 to-bright-sun-600"></div>}
        
        <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
                <div className="p-2 bg-mine-shaft-900/50 border border-mine-shaft-800/50 rounded-xl shadow-[inset_0_0_10px_rgba(0,0,0,0.2)] group-hover:scale-105 transition-transform duration-300">
                    <img className="h-10 w-10 object-contain drop-shadow-md" src={`/Icons/${props.company}.png`} alt="" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&color=fab005&background=2a2a2a`} />
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="text-lg font-bold text-mine-shaft-100 group-hover:text-bright-sun-400 transition-colors flex items-center gap-2 group-hover:translate-x-1 duration-300">
                        {props.jobTitle} 
                        {new Date().getTime() - new Date(props.postTime).getTime() < 24 * 60 * 60 * 1000 && <Badge color="red" size="xs" variant="filled" className="animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.5)]">NEW</Badge>}
                    </div>
                    <div className="text-sm font-medium text-mine-shaft-300">
                        <Link className="hover:text-bright-sun-400 transition-colors" to={`/company/${props.company}`} onClick={(e) => e.stopPropagation()}>{props.company}</Link> &bull; <span className="text-mine-shaft-400">{props.applicants?props.applicants.length:0} Applicants</span>
                    </div>
                </div>
            </div>
            {profile.savedJobs?.includes(props.id) ?<IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-bright-sun-400 mt-1 shrink-0 drop-shadow-[0_0_5px_rgba(255,189,32,0.4)]" stroke={1.5} />:<IconBookmark onClick={handleSaveJob} className="cursor-pointer hover:text-bright-sun-400 text-mine-shaft-400 mt-1 shrink-0 transition-colors" stroke={1.5} />
            }
        </div>
        <div className="flex gap-2 flex-wrap">
            <Badge size="md" radius="sm" variant="transparent" leftSection={<IconBriefcase size={14}/>} className="font-medium tracking-wide !text-mine-shaft-200 bg-mine-shaft-800/40 border border-mine-shaft-700/50">{props.experience}</Badge>
            <Badge size="md" radius="sm" variant="transparent" leftSection={<IconMapPin size={14}/>} className="font-medium tracking-wide !text-mine-shaft-200 bg-mine-shaft-800/40 border border-mine-shaft-700/50">{props.location}</Badge>
            <Badge size="md" radius="sm" variant="transparent" className="font-semibold tracking-wide bg-bright-sun-400/10 !text-bright-sun-400 border border-bright-sun-400/20 shadow-[inset_0_0_8px_rgba(255,189,32,0.05)]">
                {props.jobType}
            </Badge>
        </div>
        <div>
            <Text className="!text-sm text-justify !text-mine-shaft-300 !leading-relaxed" lineClamp={3}>{props.about}</Text>
        </div>
        <Divider color="mineShaft.8" size="xs" />
        <div className="flex justify-between items-center">
            <div className="text-base font-bold text-mine-shaft-100">&#8377;{props.packageOffered} <span className="text-xs font-medium text-mine-shaft-400">LPA</span></div>
            <div className="text-xs font-medium flex gap-1.5 items-center text-mine-shaft-400">
                <IconClockHour3 className="h-4 w-4" stroke={1.5} />{timeAgo(props.postTime)}
            </div>
        </div>
        {!props.hideViewButton && <div className="flex gap-3 mt-1">
            <Link className="w-[60%]" to={`/jobs/${props.id}`} onClick={(e) => e.stopPropagation()}>
                <Button fullWidth color="brightSun.4" variant="filled" radius="md" className="font-bold shadow-md shadow-bright-sun-400/20 hover:bg-bright-sun-500">View Details</Button>
            </Link>
            <Button className="w-[40%]" color="mineShaft.3" variant="outline" radius="md" onClick={(e) => {e.stopPropagation(); handleMessageRecruiter();}}>Message</Button>
        </div>}
    </div>
}
export default JobCard;