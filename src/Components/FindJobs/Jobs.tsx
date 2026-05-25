
import Sort from "./Sort";
import JobCard from "./JobCard";
import Job from "../JobDesc/Job";
import FilterSidebar from "./FilterSidebar";
import { useEffect, useState } from "react";
import { getAllJobs } from "../../Services/JobService";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { resetFilter } from "../../Slices/FilterSlice";
import { resetSort } from "../../Slices/SortSlice";
import { Button, Skeleton } from "@mantine/core";
import { IconX, IconSparkles } from "@tabler/icons-react";
import { WEBSITE_CONFIG } from "../../config";

const Jobs = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [jobList, setJobList] = useState([]);
    const filter=useSelector((state:any)=>state.filter);
    const sort=useSelector((state:any)=>state.sort);
    const [filteredJobs, setFilteredJobs] = useState<any>([]);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(()=>{
        // dispatch(resetFilter());
        dispatch(resetSort());
        setIsLoading(true);
        getAllJobs().then((res)=>{
            setJobList(res.filter((job:any)=>job.jobStatus==="ACTIVE"));
        }).catch((err)=>console.log(err))
        .finally(()=>setIsLoading(false));
        return ()=>{
            if(!filter.page)dispatch(resetFilter());
          }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(()=>{
        if(sort==="Most Recent"){
            setJobList([...jobList].sort((a: any, b: any) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()));
        }
        else if(sort==="Salary: Low to High"){
            setJobList([...jobList].sort((a: any, b: any) => a.packageOffered - b.packageOffered));
        }
        else if(sort==="Salary: High to Low"){
            setJobList([...jobList].sort((a: any, b: any) => b.packageOffered - a.packageOffered));
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort])
    useEffect(()=>{
        let filtered = jobList;
        if(filter["Job Title"] && filter["Job Title"].length>0)filtered=filtered.filter((job:any)=>filter["Job Title"]?.some((x:any)=>job.jobTitle?.toLowerCase().includes(x.toLowerCase())));
        if(filter.Location && filter.Location.length>0)filtered=filtered.filter((job:any)=>filter.Location?.some((x:any)=>job.location?.toLowerCase().includes(x.toLowerCase())));
          if(filter.Experience && filter.Experience.length>0)filtered=filtered.filter((job:any)=>filter.Experience?.some((x:any)=>job.experience?.toLowerCase().includes(x.toLowerCase())));
          if(filter["Job Type"] && filter["Job Type"].length>0)filtered=filtered.filter((job:any)=>filter["Job Type"]?.some((x:any)=>job.jobType?.toLowerCase().includes(x.toLowerCase())));
          if(filter.salary && filter.salary.length>0)filtered=filtered.filter((jobs:any)=>filter.salary[0]<=jobs.packageOffered && jobs.packageOffered<=filter.salary[1]);
        setFilteredJobs(filtered);
    },[filter,jobList]);

    useEffect(() => {
        if (filteredJobs.length > 0) {
            // Auto-select the first job if none is selected, or if the selected job was filtered out
            if (!selectedJob || !filteredJobs.find((j:any) => j.id === selectedJob.id)) {
                setSelectedJob(filteredJobs[0]);
            }
        } else {
            setSelectedJob(null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredJobs]);

    return <div className="p-5 sm-mx:p-2">
        <div className="flex justify-between flex-wrap mt-2">
            <div className="text-2xl xs-mx:text-xl flex gap-3 items-center font-semibold">Recommended jobs   {Object.keys(filter).length>0&&<Button onClick={()=>dispatch(resetFilter())} className="font-body transition duration-300 " size="compact-sm" leftSection={<IconX stroke={1.5} size={20}/>} variant="filled" color="brightSun.4" autoContrast >Clear Filters</Button>}</div>
            <Sort sort="job" />
        </div>
        
        {/* Three-Pane Layout: Window Scrolling */}
        <div className="flex mt-6 gap-6 items-start pb-10">
            {/* Left Pane: Filters Sidebar */}
            <div className="w-[20%] lg-mx:w-1/4 md-mx:hidden sticky top-24 h-[calc(100vh-8rem)]">
                <FilterSidebar />
            </div>

            {/* Middle Pane: Natural Window Scrolling Job List */}
            <div className="w-[30%] lg-mx:w-[40%] md-mx:w-full pr-2 flex flex-col gap-4">
                {isLoading ? (
                    Array(5).fill(0).map((_, i) => <Skeleton key={i} height={180} className="w-full rounded-2xl" />)
                ) : filteredJobs.length > 0 ? (
                    filteredJobs.map((job: any, index: any) => (
                        <JobCard 
                            key={index} 
                            {...job} 
                            fullWidth 
                            hideViewButton={!isMobile} 
                            selected={selectedJob?.id === job.id && !isMobile}
                            onSelect={(selected: any) => isMobile ? navigate(`/jobs/${selected.id}`) : setSelectedJob(selected)}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] opacity-70 p-4">
                        <img src={WEBSITE_CONFIG.assets.workingGirl || "/Working/Girl.png"} className="w-48 h-48 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300" alt="No jobs found" />
                        <div className="text-center font-medium text-lg text-mine-shaft-300">No jobs found matching your filters.</div>
                        <div className="text-center text-sm text-mine-shaft-400 mt-2">Try adjusting your search criteria or clear filters to see more jobs.</div>
                        <Button mt="md" onClick={() => dispatch(resetFilter())} variant="light" color="brightSun.4">Clear Filters</Button>
                    </div>
                )}
            </div>

            {/* Right Pane: Sticky Job Details */}
            <div className="w-[50%] lg-mx:w-[60%] md-mx:hidden sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto pl-6 border-l border-mine-shaft-800/50 custom-scrollbar relative">
                {selectedJob ? (
                    <div className="w-full min-h-full">
                        <Job {...selectedJob} />
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-mine-shaft-400 bg-mine-shaft-900/20 backdrop-blur-md rounded-3xl border border-mine-shaft-800/60 border-dashed shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
                        <div className="p-4 bg-mine-shaft-900/50 rounded-full mb-4 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                            <IconSparkles size={40} className="text-mine-shaft-600" />
                        </div>
                        <div className="text-2xl font-bold mb-2 text-mine-shaft-300">Select a Job</div>
                        <div className="text-sm font-medium text-mine-shaft-500">Click on any job from the list to view its details.</div>
                    </div>
                )}
            </div>
        </div>
    </div>
}
export default Jobs;