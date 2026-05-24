import { Button, Divider, Text } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconClockHour3 } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";
import { useDispatch, useSelector } from "react-redux";
import { changeProfile } from "../../Slices/ProfileSlice";
import { getOrCreateRoomByUser } from "../../Services/ChatService";
import { errorNotification } from "../../Services/NotificationService";

const JobCard = (props: any) => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const profile=useSelector((state:any)=>state.profile);
    const currentProfileId = profile?.id;
    const handleSaveJob = () => {
        let savedJobs:any=profile.savedJobs?[...profile.savedJobs]:[];
        if(savedJobs.includes(props.id)){
            savedJobs=savedJobs.filter((job:any)=>job!=props.id);
        }else{ 
            savedJobs.push(props.id);
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
    
    return <div data-aos="fade-up"  className="p-4 rounded-xl glass-card hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400  transition duration-300 ease-in-out w-72 sm-mx:w-full flex flex-col gap-3">
        <div className="flex justify-between">
            <div className="flex gap-2 items-center">
                <div className="p-2 bg-mine-shaft-800 rounded-md">
                    <img className="h-7" src={`/Icons/${props.company}.png`} alt="" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(props.company)}&color=fab005&background=2a2a2a`} />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-semibold ">{props.jobTitle}</div>
                    <div className="text-xs text-mine-shaft-300"><Link className="hover:text-mine-shaft-200" to="/company">{props.company}</Link> &bull; {props.applicants?props.applicants.length:0} Applicants</div>
                </div>
            </div>
            {profile.savedJobs?.includes(props.id) ?<IconBookmarkFilled onClick={handleSaveJob} className="cursor-pointer text-bright-sun-400 " stroke={1.5} />:<IconBookmark onClick={handleSaveJob} className="cursor-pointer hover:text-bright-sun-400 text-mine-shaft-300" stroke={1.5} />
            }
        </div>
        <div className="flex gap-2 flex-wrap">
            <div className="p-2 py-1 bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-xs">{props.experience}</div>
            <div className="p-2 py-1  bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-xs">{props.jobType}</div>
            <div className="p-2 py-1  bg-mine-shaft-800 text-bright-sun-400 rounded-lg text-xs">{props.location}</div>
        </div>
        <div>
            <Text className="!text-xs text-justify !text-mine-shaft-300" lineClamp={3}>{props.about}
            </Text>
        </div>
        <Divider color="mineShaft.7" size="xs" />
        <div className="flex justify-between">
            <div className="font-semibold text-mine-shaft-200">&#8377;{props.packageOffered} LPA</div>
            <div className="text-xs flex gap-1 items-center text-mine-shaft-400">
                <IconClockHour3 className="h-5 w-5" stroke={1.5} />Posted {timeAgo(props.postTime)}
            </div>
        </div>
        <div className="flex gap-2">
            <Link className="w-1/2" to={`/jobs/${props.id}`}>
                <Button fullWidth color="brightSun.4" variant="light">View Job</Button>
            </Link>
            <Button className="w-1/2" color="brightSun.4" variant="outline" onClick={handleMessageRecruiter}>Message</Button>
        </div>
    </div>
}
export default JobCard;