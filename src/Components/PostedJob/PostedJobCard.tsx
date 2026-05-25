import { Link, useParams } from "react-router-dom";
import { timeAgo } from "../../Services/Utilities";
import { Badge } from "@mantine/core";

const PostedJobCard=(props:any)=>{
    const {id}=useParams();
    return <Link data-aos="fade-up" to={`/posted-jobs/${props.id}`} className={` rounded-xl p-2 w-52 lg-mx:w-48 bs-mx:w-44 border-l-2 hover:bg-opacity-80 cursor-pointer border-l-bright-sun-400 ${String(props.id)===String(id)?"bg-bright-sun-400 text-mine-shaft-950":"bg-mine-shaft-900 text-mine-shaft-300"}`}>
        <div className={`text-sm font-semibold flex items-center gap-2`}>{props.jobTitle} {new Date().getTime() - new Date(props.postTime).getTime() < 24 * 60 * 60 * 1000 && <Badge color="red" size="xs" variant="light" className="animate-pulse">🔥 Hot</Badge>}</div>
        <div className="text-xs  font-medium">{props.location}</div>
        <div className="text-xs">{props.jobStatus==="DRAFT"?"Drafted":props.jobStatus==="CLOSED"?"Closed":"Posted"} {timeAgo(props.postTime)}</div>
    </Link>
}
export default PostedJobCard;