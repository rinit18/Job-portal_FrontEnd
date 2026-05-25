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

const JobPage = () => {
    const {id}=useParams();
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [job, setJob] = useState<any>(null);
    useEffect(()=>{
        window.scrollTo(0,0);
        dispatch(showOverlay());
        getJob(id).then((res)=>{
            if(!res) {
                navigate("/not-found");
                return;
            }
            setJob(res);
            if(res.jobStatus==="CLOSED")navigate(-1);
        }).catch((err)=> {
            console.log(err);
            navigate("/not-found");
        })
        .finally(()=>dispatch(hideOverlay()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
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