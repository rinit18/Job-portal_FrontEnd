import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllJobs } from "../../Services/JobService";
import { getAllProfiles } from "../../Services/ProfileService";
import { Tabs, Loader, Button, Divider } from "@mantine/core";
import { IconBriefcase, IconUsers, IconBuildingSkyscraper, IconSearch } from "@tabler/icons-react";
import JobCard from "../FindJobs/JobCard";
import TalentCard from "../FindTalent/TalentCard";

const GlobalSearch = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query")?.toLowerCase() || "";
    const navigate = useNavigate();

    const [jobs, setJobs] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [jobsRes, profilesRes] = await Promise.all([
                    getAllJobs(),
                    getAllProfiles()
                ]);

                // Filter Jobs
                const matchedJobs = jobsRes.filter((job: any) => 
                    job.jobStatus === "ACTIVE" &&
                    (job.jobTitle?.toLowerCase().includes(query) || 
                     job.company?.toLowerCase().includes(query) ||
                     job.skillsRequired?.some((s: string) => s.toLowerCase().includes(query)))
                );
                setJobs(matchedJobs);

                // Filter Profiles
                const matchedProfiles = profilesRes.filter((profile: any) => 
                    profile.name?.toLowerCase().includes(query) || 
                    profile.jobTitle?.toLowerCase().includes(query) ||
                    profile.skills?.some((s: string) => s.toLowerCase().includes(query))
                );
                setProfiles(matchedProfiles);

                // Filter Companies from active jobs
                const companyMap = new Map();
                jobsRes.filter((job: any) => job.jobStatus === "ACTIVE").forEach((job: any) => {
                    if (job.company?.toLowerCase().includes(query)) {
                        companyMap.set(job.company, { name: job.company, location: job.location });
                    }
                });
                setCompanies(Array.from(companyMap.values()));

            } catch (error) {
                console.error("Error fetching global search data", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchData();
        } else {
            setLoading(false);
            setJobs([]);
            setProfiles([]);
            setCompanies([]);
        }
    }, [query]);

    return (
        <div className="w-full h-full flex flex-col px-5 py-6 gap-6 text-mine-shaft-100">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Search Results for "{query}"</h1>
                <p className="text-mine-shaft-400">Found {jobs.length} jobs, {profiles.length} professionals, and {companies.length} companies.</p>
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loader color="brightSun.4" size="lg" type="dots" />
                </div>
            ) : (
                <Tabs defaultValue="all" color="brightSun.4" className="flex-1 flex flex-col">
                    <Tabs.List className="border-mine-shaft-800">
                        <Tabs.Tab value="all" leftSection={<IconSearch size={16} />}>All Results</Tabs.Tab>
                        <Tabs.Tab value="jobs" leftSection={<IconBriefcase size={16} />}>Jobs ({jobs.length})</Tabs.Tab>
                        <Tabs.Tab value="professionals" leftSection={<IconUsers size={16} />}>Professionals ({profiles.length})</Tabs.Tab>
                        <Tabs.Tab value="companies" leftSection={<IconBuildingSkyscraper size={16} />}>Companies ({companies.length})</Tabs.Tab>
                    </Tabs.List>

                    <div className="flex-1 overflow-auto mt-6">
                        <Tabs.Panel value="all" className="flex flex-col gap-10 pb-10">
                            {/* JOBS SECTION */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><IconBriefcase className="text-bright-sun-400"/> Jobs</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {jobs.slice(0, 3).map((job, idx) => <JobCard key={idx} {...job} />)}
                                    {jobs.length === 0 && <div className="text-mine-shaft-500">No jobs found matching "{query}"</div>}
                                </div>
                            </section>

                            <Divider className="border-mine-shaft-800" />

                            {/* PROFESSIONALS SECTION */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><IconUsers className="text-bright-sun-400"/> Professionals</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {profiles.slice(0, 3).map((profile, idx) => <TalentCard key={idx} {...profile} />)}
                                    {profiles.length === 0 && <div className="text-mine-shaft-500">No professionals found matching "{query}"</div>}
                                </div>
                            </section>

                            <Divider className="border-mine-shaft-800" />

                            {/* COMPANIES SECTION */}
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2"><IconBuildingSkyscraper className="text-bright-sun-400"/> Companies</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {companies.slice(0, 4).map((company, idx) => (
                                        <div key={idx} onClick={() => navigate(`/company/${company.name}`)} className="cursor-pointer flex items-center gap-3 p-4 bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl hover:border-bright-sun-400/50 transition-colors">
                                            <div className="w-12 h-12 bg-mine-shaft-950 rounded-lg p-2 border border-mine-shaft-800">
                                                <img src={`/Icons/${company.name}.png`} alt={company.name} className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&color=fab005&background=2a2a2a`} />
                                            </div>
                                            <div className="font-semibold">{company.name}</div>
                                        </div>
                                    ))}
                                    {companies.length === 0 && <div className="text-mine-shaft-500">No companies found matching "{query}"</div>}
                                </div>
                            </section>
                        </Tabs.Panel>

                        <Tabs.Panel value="jobs" className="pb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {jobs.map((job, idx) => <JobCard key={idx} {...job} />)}
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="professionals" className="pb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {profiles.map((profile, idx) => <TalentCard key={idx} {...profile} />)}
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="companies" className="pb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                {companies.map((company, idx) => (
                                    <div key={idx} onClick={() => navigate(`/company/${company.name}`)} className="cursor-pointer flex items-center gap-3 p-4 bg-mine-shaft-900 border border-mine-shaft-800 rounded-xl hover:border-bright-sun-400/50 transition-colors">
                                        <div className="w-12 h-12 bg-mine-shaft-950 rounded-lg p-2 border border-mine-shaft-800">
                                            <img src={`/Icons/${company.name}.png`} alt={company.name} className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&color=fab005&background=2a2a2a`} />
                                        </div>
                                        <div className="font-semibold">{company.name}</div>
                                    </div>
                                ))}
                            </div>
                        </Tabs.Panel>
                    </div>
                </Tabs>
            )}
        </div>
    );
};

export default GlobalSearch;
