import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAllJobs } from "../../Services/JobService";
import { getAllProfiles } from "../../Services/ProfileService";
import { Tabs, Loader, Button, Divider } from "@mantine/core";
import { IconBriefcase, IconUsers, IconBuildingSkyscraper, IconSearch, IconSparkles } from "@tabler/icons-react";
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

    const [aiQuery, setAiQuery] = useState(query);
    const [aiFilters, setAiFilters] = useState<any>(null);

    const handleAISearch = async () => {
        if (!aiQuery.trim()) return;
        navigate(`/search?query=${encodeURIComponent(aiQuery)}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // If it's a multi-word query, try to parse it with AI first
                let parsedFilters: any = null;
                if (query.split(" ").length > 1) {
                    try {
                        const { parseSearchQuery } = await import("../../Services/AiService");
                        parsedFilters = await parseSearchQuery(query);
                        setAiFilters(parsedFilters);
                    } catch (e) {
                        console.error("AI parse failed", e);
                    }
                } else {
                    setAiFilters(null);
                }

                let jobsRes, profilesRes;
                if (parsedFilters) {
                    [jobsRes, profilesRes] = await Promise.all([
                        getAllJobs(),
                        getAllProfiles()
                    ]);
                } else {
                    const { searchJobs } = await import("../../Services/JobService");
                    const { searchProfiles } = await import("../../Services/ProfileService");
                    [jobsRes, profilesRes] = await Promise.all([
                        searchJobs(query),
                        searchProfiles(query)
                    ]);
                }

                // Filter Jobs
                const matchedJobs = jobsRes.filter((job: any) => {
                    if (job.jobStatus !== "ACTIVE") return false;
                    
                    if (parsedFilters) {
                        // AI-driven filtering
                        let isMatch = false;
                        const t = parsedFilters["Job Title"] || [];
                        const l = parsedFilters["Location"] || [];
                        if (t.length > 0 && t.some((title: string) => job.jobTitle?.toLowerCase().includes(title.toLowerCase()))) isMatch = true;
                        if (l.length > 0 && l.some((loc: string) => job.location?.toLowerCase().includes(loc.toLowerCase()))) isMatch = true;
                        if (t.length === 0 && l.length === 0) isMatch = true; // Fallback
                        return isMatch;
                    } else {
                        // Backend fuzzy search already filtered the jobs
                        return true;
                    }
                });
                setJobs(matchedJobs);

                // Filter Profiles
                const matchedProfiles = profilesRes.filter((profile: any) => {
                    if (parsedFilters) {
                        let isMatch = false;
                        const t = parsedFilters["Job Title"] || [];
                        const l = parsedFilters["Location"] || [];
                        if (t.length > 0 && t.some((title: string) => profile.jobTitle?.toLowerCase().includes(title.toLowerCase()))) isMatch = true;
                        if (l.length > 0 && l.some((loc: string) => profile.location?.toLowerCase().includes(loc.toLowerCase()))) isMatch = true;
                        if (t.length === 0 && l.length === 0) isMatch = true;
                        return isMatch;
                    } else {
                        // Backend fuzzy search already filtered the profiles
                        return true;
                    }
                });
                setProfiles(matchedProfiles);

                // Filter Companies from active jobs
                const companyMap = new Map();
                jobsRes.filter((job: any) => job.jobStatus === "ACTIVE").forEach((job: any) => {
                    if (job.company?.toLowerCase().includes(query) || (parsedFilters && parsedFilters["Job Title"]?.some((t: string) => job.company?.toLowerCase().includes(t.toLowerCase())))) {
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
            setAiQuery(query);
            fetchData();
        } else {
            setLoading(false);
            setJobs([]);
            setProfiles([]);
            setCompanies([]);
            setAiFilters(null);
        }
    }, [query]);

    return (
        <div className="w-full h-full flex flex-col px-5 py-6 gap-6 text-mine-shaft-100">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Search Results for "{query}"</h1>
                    <p className="text-mine-shaft-400">Found {jobs.length} jobs, {profiles.length} professionals, and {companies.length} companies.</p>
                </div>
                
                {/* AI Search input row */}
                <div className="flex items-center gap-3 bg-mine-shaft-900/80 border border-mine-shaft-800 rounded-xl px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] focus-within:border-bright-sun-400/70 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute top-0 right-1/4 w-64 h-32 bg-bright-sun-400/5 rounded-full blur-[80px] pointer-events-none" />
                    
                    <div className="text-bright-sun-400 shrink-0 animate-pulse">
                        <IconSparkles size={22} stroke={2} />
                    </div>
                    <input
                        type="text"
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                        placeholder="Ask AI to find anything… e.g. Remote entry level react developers"
                        className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 placeholder:text-mine-shaft-500 text-sm font-medium py-1"
                    />
                    <Button
                        onClick={handleAISearch}
                        loading={loading}
                        color="brightSun.4"
                        size="sm"
                        radius="md"
                        variant="filled"
                        className="!text-mine-shaft-950 font-bold shrink-0"
                    >
                        Search
                    </Button>
                </div>
                {aiFilters && (
                    <div className="text-xs text-bright-sun-400 font-medium">
                        ✨ AI Filter Applied: {aiFilters["Job Title"]?.join(", ")} {aiFilters["Location"]?.length > 0 ? `in ${aiFilters["Location"].join(", ")}` : ""}
                    </div>
                )}
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                                {jobs.map((job, idx) => <JobCard key={idx} {...job} />)}
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="professionals" className="pb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                                {profiles.map((profile, idx) => <TalentCard key={idx} {...profile} />)}
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="companies" className="pb-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
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
