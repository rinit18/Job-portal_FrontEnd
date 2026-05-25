import {Button, Divider, Drawer } from "@mantine/core";
import PostedJob from "../Components/PostedJob/PostedJob";
import PostedJobDesc from "../Components/PostedJob/PostedJobDesc";
import { useEffect, useState } from "react";
import { getJobsPostedBy } from "../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";

const PostedJobPage = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {id}=useParams();
    const user=useSelector((state:any)=>state.user);
    const [opened, { open, close }] = useDisclosure(false);
    const [jobList, setJobList] = useState<any>([]);
    const [job, setJob] = useState<any>(null);
    const matches = useMediaQuery('(max-width: 767px)');

    useEffect(()=>{
        window.scrollTo(0,0);
        dispatch(showOverlay());
        getJobsPostedBy(user.id).then((res)=>{
            setJobList(res);
            if(res && res.length>0 && Number(id) === 0){
                res.forEach((x:any)=>{
                    if(x.jobStatus==="ACTIVE"){
                        navigate(`/posted-jobs/${x.id}`);
                    }

                }, [])
            }
            res.forEach((item:any)=>{
                if(String(id)===String(item.id))setJob(item);
            })
            window.scrollTo(0,0);
        }).catch((err)=>console.log(err))
        .finally(()=>dispatch(hideOverlay()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    return (
        <div className="min-h-[calc(100vh-80px)] bg-mine-shaft-950 font-['poppins'] flex flex-col relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>
            <Divider className="border-mine-shaft-800/60 z-10" />
            
            {matches&&<Button my="xs" mx="md" size="sm" color="brightSun.4" className="z-10 relative" onClick={open}>All Jobs</Button>}
            
            <Drawer opened={opened} size={230} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }} onClose={close} title="All Jobs">
                <PostedJob job={job} jobList={jobList}/>   
            </Drawer>
            
            <div className="flex-1 flex w-full max-w-7xl mx-auto p-4 sm-mx:p-2 gap-5 h-[calc(100vh-80px)] z-10">
                {!matches && (
                    <div className="w-1/3 sm-mx:w-[80px] flex flex-col bg-mine-shaft-900/40 border border-mine-shaft-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                        <PostedJob job={job} jobList={jobList}/>
                    </div>
                )}              
                
                <div className="flex-1 flex flex-col bg-mine-shaft-900/40 border border-mine-shaft-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                    <PostedJobDesc {...job} />
                </div>
            </div>
        </div>
    )
}
export default PostedJobPage;