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
import { Button, Skeleton, Drawer, ActionIcon } from "@mantine/core";
import { IconBriefcase, IconSparkles, IconX, IconAdjustments } from "@tabler/icons-react";
import { WEBSITE_CONFIG } from "../../config";

const Jobs = () => {
    const dispatch   = useDispatch();
    const navigate   = useNavigate();
    const isMobile   = useMediaQuery("(max-width: 768px)");
    const [jobList, setJobList]         = useState<any[]>([]);
    const filter                        = useSelector((state: any) => state.filter);
    const sort                          = useSelector((state: any) => state.sort);
    const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
    const [selectedJob, setSelectedJob]   = useState<any>(null);
    const [isLoading, setIsLoading]       = useState(true);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    /* ── Fetch ─────────────────────────────────────────── */
    useEffect(() => {
        dispatch(resetSort());
        setIsLoading(true);
        getAllJobs()
            .then((res) => setJobList(res.filter((j: any) => j.jobStatus === "ACTIVE")))
            .catch(console.error)
            .finally(() => setIsLoading(false));
        return () => { if (!filter.page) dispatch(resetFilter()); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Sort ──────────────────────────────────────────── */
    useEffect(() => {
        if (sort === "Most Recent")
            setJobList(p => [...p].sort((a, b) => new Date(b.postTime).getTime() - new Date(a.postTime).getTime()));
        else if (sort === "Salary: Low to High")
            setJobList(p => [...p].sort((a, b) => a.packageOffered - b.packageOffered));
        else if (sort === "Salary: High to Low")
            setJobList(p => [...p].sort((a, b) => b.packageOffered - a.packageOffered));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort]);

    /* ── Filter ────────────────────────────────────────── */
    useEffect(() => {
        let f = [...jobList];
        if (filter["Job Title"]?.length > 0)
            f = f.filter(j => filter["Job Title"].some((x: string) => j.jobTitle?.toLowerCase().includes(x.toLowerCase())));
        if (filter.Location?.length > 0)
            f = f.filter(j => filter.Location.some((x: string) => j.location?.toLowerCase().includes(x.toLowerCase())));
        if (filter.Experience?.length > 0)
            f = f.filter(j => filter.Experience.some((x: string) => j.experience?.toLowerCase().includes(x.toLowerCase())));
        if (filter["Job Type"]?.length > 0)
            f = f.filter(j => filter["Job Type"].some((x: string) => j.jobType?.toLowerCase().includes(x.toLowerCase())));
        if (filter.salary?.length > 0)
            f = f.filter(j => { const lpa = (j.packageOffered || 0) / 100000; return filter.salary[0] <= lpa && lpa <= filter.salary[1]; });
        setFilteredJobs(f);
    }, [filter, jobList]);

    /* ── Auto-select first ─────────────────────────────── */
    useEffect(() => {
        if (filteredJobs.length > 0) {
            if (!selectedJob || !filteredJobs.find(j => j.id === selectedJob.id))
                setSelectedJob(filteredJobs[0]);
        } else {
            setSelectedJob(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredJobs]);

    const hasFilters = Object.keys(filter).some(
        k => filter[k] !== null && filter[k] !== undefined && !(Array.isArray(filter[k]) && filter[k].length === 0)
    );

    return (
        <div className="h-full flex flex-col overflow-hidden">

            {/* Mobile Filter Drawer */}
            <Drawer
                opened={filterDrawerOpen}
                onClose={() => setFilterDrawerOpen(false)}
                title="Filter Jobs"
                size="80%"
                overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                position="left"
            >
                <FilterSidebar />
            </Drawer>

            {/* ══ Top bar ══════════════════════════════════════════════════ */}
            <div className="shrink-0 flex items-center justify-between px-5 sm-mx:px-3 py-3.5 border-b border-white/[0.06] bg-mine-shaft-950/60 backdrop-blur-sm flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Mobile filter button */}
                    {isMobile && (
                        <ActionIcon
                            onClick={() => setFilterDrawerOpen(true)}
                            variant="light"
                            color="brightSun.4"
                            size="md"
                            className="relative"
                        >
                            <IconAdjustments size={16} />
                            {hasFilters && (
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-bright-sun-400 rounded-full" />
                            )}
                        </ActionIcon>
                    )}
                    <IconBriefcase size={18} className="text-bright-sun-400" stroke={1.5} />
                    <span className="text-sm font-bold text-mine-shaft-100 tracking-tight">Recommended Jobs</span>
                    {!isLoading && (
                        <span className="px-2.5 py-0.5 rounded-full bg-bright-sun-400/10 border border-bright-sun-400/25 text-xs font-bold text-bright-sun-400">
                            {filteredJobs.length}
                        </span>
                    )}
                    {hasFilters && (
                        <Button
                            onClick={() => dispatch(resetFilter())}
                            size="xs"
                            leftSection={<IconX size={11} stroke={2.5} />}
                            variant="light"
                            color="brightSun.4"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
                <Sort sort="job" />
            </div>

            {/* ══ Three-pane body ══════════════════════════════════ */}
            <div className="flex flex-1 min-h-0 overflow-hidden">

                {/* LEFT ─ Filter sidebar: 13% */}
                <div className="w-[13%] min-w-[130px] shrink-0 md-mx:hidden border-r border-white/[0.05] overflow-y-auto custom-scrollbar">
                    <FilterSidebar />
                </div>

                {/* MIDDLE ─ Job list: 37% */}
                <div className="w-[37%] min-w-[260px] md-mx:min-w-0 shrink-0 md-mx:flex-1 border-r border-white/[0.05] overflow-y-auto custom-scrollbar flex flex-col gap-0">
                    {isLoading ? (
                        <div className="flex flex-col gap-2 p-3">
                            {Array(6).fill(0).map((_, i) => <Skeleton key={i} height={110} radius="lg" />)}
                        </div>
                    ) : filteredJobs.length > 0 ? (
                        filteredJobs.map((job: any, index: number) => (
                            <JobCard
                                key={job.id ?? index}
                                {...job}
                                fullWidth
                                hideViewButton={!isMobile}
                                selected={selectedJob?.id === job.id && !isMobile}
                                onSelect={(sel: any) => isMobile ? navigate(`/jobs/${sel.id}`) : setSelectedJob(sel)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3 opacity-60">
                            <img
                                src={WEBSITE_CONFIG.assets.workingGirl || "/Working/Girl.png"}
                                className="w-28 h-28 opacity-40 grayscale"
                                alt="No jobs"
                            />
                            <div className="text-sm font-semibold text-mine-shaft-300">No jobs match your filters</div>
                            <div className="text-xs text-mine-shaft-500">Try adjusting your criteria</div>
                            <Button size="xs" onClick={() => dispatch(resetFilter())} variant="light" color="brightSun.4">
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* RIGHT ─ Job detail: flex-1 (remaining ~48%) */}
                <div className="flex-1 min-w-0 md-mx:hidden overflow-y-auto custom-scrollbar p-4">
                    {selectedJob ? (
                        <Job {...selectedJob} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-mine-shaft-500 border border-white/[0.05] border-dashed rounded-2xl">
                            <div className="w-14 h-14 rounded-full bg-mine-shaft-900/80 flex items-center justify-center">
                                <IconSparkles size={28} className="text-mine-shaft-600" />
                            </div>
                            <div className="text-center">
                                <div className="text-base font-bold text-mine-shaft-300 mb-1">Select a Job</div>
                                <div className="text-xs text-mine-shaft-600">Click any card to preview details here</div>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Jobs;