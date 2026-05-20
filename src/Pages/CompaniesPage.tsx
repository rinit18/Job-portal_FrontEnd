import { Divider, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllJobs } from "../Services/JobService";
import { useDispatch } from "react-redux";
import { hideOverlay, showOverlay } from "../Slices/OverlaySlice";
import { Link } from "react-router-dom";
import { IconMapPin, IconUsers } from "@tabler/icons-react";

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
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md"/>
            <div className="px-5 py-5 max-w-7xl mx-auto">
                <div className="text-2xl font-semibold mb-8">Discover Companies</div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.length > 0 ? companies.map((company, index) => (
                        <div key={index} data-aos="fade-up" className="p-5 rounded-xl glass-card hover:shadow-[0_0_5px_1px_yellow] !shadow-bright-sun-400 transition duration-300 flex flex-col gap-4">
                            <div className="flex gap-4 items-center">
                                <div className="p-2 bg-mine-shaft-800 rounded-lg shrink-0">
                                    <img 
                                        className="h-12 w-12 object-contain" 
                                        src={`/Icons/${company.name}.png`} 
                                        alt={company.name} 
                                        onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&color=fab005&background=2a2a2a`} 
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="font-semibold text-lg">{company.name}</div>
                                    <div className="text-xs text-mine-shaft-300 flex items-center gap-1 mt-1">
                                        <IconMapPin size={14} /> {company.location}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center bg-mine-shaft-900/50 p-3 rounded-lg mt-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-bright-sun-400 font-bold">{company.jobsCount}</span>
                                    <span className="text-xs text-mine-shaft-400">Open Jobs</span>
                                </div>
                                <Divider orientation="vertical" />
                                <div className="flex flex-col items-center">
                                    <span className="text-mine-shaft-200 font-bold flex items-center gap-1">
                                        <IconUsers size={14}/> {company.employees}+
                                    </span>
                                    <span className="text-xs text-mine-shaft-400">Employees</span>
                                </div>
                            </div>
                            
                            <Link to={`/company/${company.name}`} className="mt-2">
                                <Button fullWidth color="brightSun.4" variant="light">View Company</Button>
                            </Link>
                        </div>
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
