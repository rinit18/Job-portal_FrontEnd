import { Divider, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllJobs } from "../Services/JobService";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";
import { Link } from "react-router-dom";
import { IconMapPin, IconUsers, IconBriefcase, IconBuildingSkyscraper } from "@tabler/icons-react";

const CompaniesPage = () => {
    const dispatch = useDispatch();
    const [companies, setCompanies] = useState<any[]>([]);

    useEffect(() => {
        dispatch(showOverlay());
        getAllJobs().then((res) => {
            // Group jobs by company
            const companyMap = new Map();
            res.filter((job: any) => job.jobStatus === "ACTIVE").forEach((job: any) => {
                if (!companyMap.has(job.company)) {
                    companyMap.set(job.company, {
                        name: job.company,
                        location: job.location,
                        jobsCount: 1,
                        employees: Math.floor(Math.random() * 500) + 50 // Mock employee count for UI
                    });
                } else {
                    const comp = companyMap.get(job.company);
                    comp.jobsCount += 1;
                    companyMap.set(job.company, comp);
                }
            });
            setCompanies(Array.from(companyMap.values()));
        }).catch((err) => console.log(err))
        .finally(() => dispatch(hideOverlay()));
    }, [dispatch]);

    return (
        <div className="min-h-[calc(100vh-80px)] bg-mine-shaft-950 font-['poppins'] relative overflow-hidden flex flex-col">
            
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>

            <Divider className="border-mine-shaft-800/60 z-10" />
            
            <div className="px-5 py-10 max-w-7xl mx-auto w-full z-10 flex-1">
                {/* Hero Header */}
                <div className="mb-10 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-bright-sun-400/10 border border-bright-sun-400/20 rounded-xl">
                            <IconBuildingSkyscraper size={24} className="text-bright-sun-400" stroke={1.5} />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">Top Companies</h1>
                    </div>
                    <p className="text-mine-shaft-300 text-sm">Discover and connect with industry-leading organizations actively hiring.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {companies.length > 0 ? companies.map((company, index) => (
                        <Link 
                            to={`/company/${company.name}`} 
                            key={index} 
                            data-aos="fade-up" 
                            data-aos-delay={index * 50}
                            className="group flex flex-col gap-4 p-5 rounded-2xl bg-mine-shaft-900/40 border border-mine-shaft-800/60 hover:bg-mine-shaft-900/60 hover:border-bright-sun-400/30 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,189,32,0.05)] transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                        >
                            {/* Card glow effect on hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-bright-sun-400/5 to-transparent pointer-events-none" />

                            <div className="flex gap-3.5 items-start relative z-10">
                                <div className="p-2.5 bg-mine-shaft-950/80 border border-mine-shaft-800/80 rounded-xl shrink-0 shadow-inner">
                                    <img 
                                        className="h-10 w-10 object-contain" 
                                        src={`/Icons/${company.name}.png`} 
                                        alt={company.name} 
                                        onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&color=fab005&background=2a2a2a`} 
                                    />
                                </div>
                                <div className="flex flex-col pt-0.5">
                                    <div className="font-semibold text-base text-mine-shaft-100 group-hover:text-bright-sun-400 transition-colors line-clamp-1">{company.name}</div>
                                    <div className="text-[11px] font-medium text-mine-shaft-500 flex items-center gap-1 mt-0.5">
                                        <IconMapPin size={12} stroke={2} /> {company.location}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center bg-mine-shaft-950/50 border border-mine-shaft-800/40 p-3 rounded-xl mt-1 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-bright-sun-400/10 rounded-md text-bright-sun-400">
                                        <IconBriefcase size={14} stroke={2} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-mine-shaft-100 leading-none">{company.jobsCount}</span>
                                        <span className="text-[9px] font-bold text-mine-shaft-500 uppercase tracking-widest mt-1">Open Jobs</span>
                                    </div>
                                </div>
                                
                                <div className="h-8 w-px bg-mine-shaft-800/60" />

                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-400">
                                        <IconUsers size={14} stroke={2} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold text-mine-shaft-100 leading-none">{company.employees}+</span>
                                        <span className="text-[9px] font-bold text-mine-shaft-500 uppercase tracking-widest mt-1">Employees</span>
                                    </div>
                                </div>
                            </div>
                            
                            <Button 
                                fullWidth 
                                color="brightSun.4" 
                                variant="light" 
                                className="mt-1 relative z-10 transition-colors group-hover:bg-bright-sun-400 group-hover:text-[#111]"
                            >
                                View Company
                            </Button>
                        </Link>
                    )) : (
                        <div className="font-medium text-lg col-span-full text-center text-mine-shaft-400 mt-10">
                            No companies found with active jobs.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompaniesPage;
