
import { useEffect, useState } from "react";
import JobCard from "../FindJobs/JobCard";
import { getAllJobs } from "../../Services/JobService";
import { useParams } from "react-router-dom";

const RecommendedJob = () => {
    const [jobList, setJobList] = useState<any[]>([]);
    const { id } = useParams();

    useEffect(() => {
        getAllJobs()
            .then((res) => {
                setJobList(res || []);
            })
            .catch((err) => console.error("Failed to fetch recommended jobs", err));
    }, []);

    // Find the current job to match recommendations
    const currentJob = jobList.find((j: any) => String(j.id) === String(id));

    // Filter and score other active jobs based on similarity
    const recommendedJobs = jobList
        .filter((j: any) => j.jobStatus === "ACTIVE" && String(j.id) !== String(id))
        .map((j: any) => {
            let score = 0;
            if (currentJob) {
                // Title similarity (matching words)
                const currentWords = currentJob.jobTitle?.toLowerCase().split(/\s+/) || [];
                const otherWords = j.jobTitle?.toLowerCase().split(/\s+/) || [];
                const commonWords = currentWords.filter((w: string) => w.length > 2 && otherWords.includes(w));
                score += commonWords.length * 10;

                // Company match
                if (currentJob.company?.toLowerCase() === j.company?.toLowerCase()) {
                    score += 5;
                }
                // Location match
                if (currentJob.location?.toLowerCase() === j.location?.toLowerCase()) {
                    score += 3;
                }
                // Experience level match
                if (currentJob.experience?.toLowerCase() === j.experience?.toLowerCase()) {
                    score += 2;
                }
                // Job Type match
                if (currentJob.jobType?.toLowerCase() === j.jobType?.toLowerCase()) {
                    score += 1;
                }
            }
            return { job: j, score };
        })
        .sort((a: any, b: any) => b.score - a.score) // Sort by descending similarity score
        .map((item: any) => item.job)
        .slice(0, 4); // Limit to top 4 recommendations

    if (recommendedJobs.length === 0) {
        return null; // Don't render the section if there are no recommendations
    }

    return (
        <div className="w-80 md-mx:w-full shrink-0">
            <div className="text-xl font-bold text-mine-shaft-100 mb-5">
                Recommended Jobs
            </div>
            <div className="flex flex-col gap-5">
                {recommendedJobs.map((job: any, index: number) => (
                    <JobCard key={job.id || index} {...job} fullWidth />
                ))}
            </div>
        </div>
    );
};

export default RecommendedJob;