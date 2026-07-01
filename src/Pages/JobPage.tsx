import { Button, Divider } from "@mantine/core";
import { Helmet } from "react-helmet-async";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Job from "../Components/JobDesc/Job";
import RecommendedJob from "../Components/JobDesc/RecommendedJob";
import { useEffect, useState } from "react";
import { getJob } from "../Services/JobService";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";
import { errorNotification } from "../Services/NotificationService";

const JobPage = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [job, setJob] = useState<any>(null);
    useEffect(()=>{
        let isMounted = true;
        window.scrollTo(0,0);
        dispatch(showOverlay());
        getJob(id).then((res)=>{
            if(!isMounted) return;
            if(!res) {
                errorNotification("Not Found", "This job listing could not be found.");
                navigate("/find-jobs");
                return;
            }
            setJob(res);
            // BUG-14 FIX: Inform user before silently redirecting away from a closed job
            if(res.jobStatus==="CLOSED") {
                errorNotification("Job Closed", `The position "${res.jobTitle}" is no longer accepting applications.`);
                navigate(-1);
            }
        }).catch((err)=> {
            if(!isMounted) return;
            console.log(err);
            errorNotification("Error", "Could not load this job.");
            navigate("/find-jobs");
        })
        .finally(()=> {
            if(isMounted) dispatch(hideOverlay());
        });
        
        return () => { isMounted = false; };
    }, [id, dispatch, navigate])
    return (
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins'] p-4">
        {job && (
            <Helmet>
                <title>{job.jobTitle} at {job.company} | CareerConnect</title>
                <meta name="description" content={job.about || `Apply for the ${job.jobTitle} role at ${job.company} on CareerConnect.`} />
            </Helmet>
        )}
        <Divider size="xs" />
        <Link className="my-5 inline-block" to="/find-jobs">
            <Button color="brightSun.4" leftSection={<IconArrowLeft size={20} />} variant="light">Back</Button>
        </Link>
        <div className="flex gap-5 justify-around bs-mx:flex-wrap">
            <Job {...job} />
            <RecommendedJob />
        </div>
        </div>
    );
}
export default JobPage;