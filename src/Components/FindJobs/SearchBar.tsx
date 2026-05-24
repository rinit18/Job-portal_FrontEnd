import { Button, Collapse, Divider, RangeSlider } from "@mantine/core";
import { Link } from "react-router-dom";

import MultiInput from "./MultiInput";
import React, { useEffect, useState } from "react";
import { dropdownData } from "../../Data/JobsData";
import { useDispatch, useSelector } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

const SearchBar = () => {
    const matches = useMediaQuery('(max-width: 475px)');
    const filter=useSelector((state:any)=>state.filter);
    const [opened, { toggle }] = useDisclosure(false);
    const dispatch = useDispatch();
    const [value, setValue] = useState<[number, number]>([0, 300]);
    const handleChange = (event: any) => {
        dispatch(updateFilter({ salary: event }));
    }
    useEffect(()=>{
        if(!filter.salary)setValue([0, 300]);
    }, [filter])




    const [aiQuery, setAiQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const suggestions = [
        "Backend Developer",
        "Remote React jobs",
        "Entry level design roles",
        "High paying iOS jobs",
        "Part time content writing"
    ];

    const handleAISearch = async (queryToSearch = aiQuery) => {
        if (!queryToSearch.trim()) return;
        setAiQuery(queryToSearch);
        setLoading(true);
        try {
            const { parseSearchQuery } = await import("../../Services/AiService");
            const parsedFilters = await parseSearchQuery(queryToSearch);
            
            // Dispatch the extracted filters to Redux
            dispatch(updateFilter({ "Job Title": parsedFilters["Job Title"] && parsedFilters["Job Title"].length > 0 ? parsedFilters["Job Title"] : null }));
            dispatch(updateFilter({ "Location": parsedFilters["Location"] && parsedFilters["Location"].length > 0 ? parsedFilters["Location"] : null }));
            dispatch(updateFilter({ "Experience": parsedFilters["Experience"] && parsedFilters["Experience"].length > 0 ? parsedFilters["Experience"] : null }));
            dispatch(updateFilter({ "Job Type": parsedFilters["Job Type"] && parsedFilters["Job Type"].length > 0 ? parsedFilters["Job Type"] : null }));
            if (parsedFilters["salary"]) dispatch(updateFilter({ "salary": parsedFilters["salary"] }));
            
        } catch (error) {
            console.error("AI Search Failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col px-6 py-8 gap-8 bg-mine-shaft-950/40 rounded-3xl border border-mine-shaft-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Ambient background glows for Search section */}
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-bright-sun-400/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-bright-sun-400/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* LinkedIn-Style AI Natural Language Search Bar - Premium Overhaul */}
            <div className="w-full flex flex-col items-center relative z-10">
                <div className="w-full max-w-3xl flex items-center bg-mine-shaft-900/70 border border-mine-shaft-800 rounded-2xl px-3 py-2 shadow-lg focus-within:border-bright-sun-400 focus-within:shadow-[0_0_20px_rgba(255,189,32,0.2)] focus-within:bg-mine-shaft-900/90 transition-all duration-300">
                    <div className="pl-3 pr-2 text-bright-sun-400 animate-pulse shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                    </div>
                    <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                        placeholder="Ask AI to find a job... (e.g. Remote entry level react jobs paying over 15LPA)" 
                        className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 placeholder:text-mine-shaft-500 py-2 px-3 text-base"
                    />
                    <Button 
                        onClick={() => handleAISearch()}
                        loading={loading}
                        color="brightSun.4" 
                        radius="md" 
                        variant="filled"
                        className="ml-2 !text-mine-shaft-950 font-bold px-6 shadow-md shadow-bright-sun-400/20 hover:bg-bright-sun-500"
                    >
                        Search
                    </Button>
                </div>
                
                {/* Modern Pill Suggestions with hover states */}
                <div className="flex flex-wrap gap-2.5 mt-5 max-w-3xl justify-center items-center">
                    <span className="text-xs font-semibold tracking-wider uppercase text-mine-shaft-400 mr-1">Suggestions:</span>
                    {suggestions.map((suggestion, index) => (
                        <button 
                            key={index} 
                            onClick={() => handleAISearch(suggestion)}
                            className="px-4 py-1.5 bg-mine-shaft-900/50 hover:bg-mine-shaft-800 hover:text-bright-sun-400 text-mine-shaft-300 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 border border-mine-shaft-800 hover:border-bright-sun-400/30 hover:scale-[1.03] active:scale-[0.98]"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center xs-mx:flex-col xs-mx:items-start xs-mx:gap-3 z-10 border-t border-mine-shaft-900 pt-5 mt-2">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-mine-shaft-300">Refine Search Details</span>
                    <span className="text-xs text-mine-shaft-500 xs-mx:hidden">|</span>
                    <Link to="/find-talent" className="text-xs text-bright-sun-400 hover:text-bright-sun-300 hover:underline font-medium transition-colors">
                        Looking for Talents? Search Talents instead &rarr;
                    </Link>
                </div>
                {matches && (
                    <Button 
                        onClick={toggle} 
                        radius="md" 
                        variant="light" 
                        color="brightSun.4" 
                        autoContrast
                        className="font-semibold"
                    >
                        {opened ? "Hide Filters" : "Show Filters"}
                    </Button>
                )}
            </div>
            
            <Collapse in={(opened || !matches)}>
                {/* Glassmorphic modular filter panel */}
                <div className="w-full grid grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-6 p-6 bg-mine-shaft-900/30 border border-mine-shaft-900/60 rounded-2xl backdrop-blur-md">
                    {
                        dropdownData.map((item, index) => {
                            return (
                                <div key={index} className="flex flex-col gap-1 border-r border-mine-shaft-900/40 last:border-0 pr-2 md-mx:border-0">
                                    <MultiInput title={item.title} icon={item.icon} options={item.options} />
                                </div>
                            );
                        })
                    }
                    {/* Premium Range Slider styling */}
                    <div className="flex flex-col gap-3 justify-center text-sm text-mine-shaft-300 col-span-1 xs:col-span-full bg-mine-shaft-900/20 p-3 rounded-xl border border-mine-shaft-900/40">
                        <div className="flex justify-between font-semibold text-xs text-mine-shaft-200">
                            <span>Salary Package</span>
                            <span className="text-bright-sun-400">&#8377;{value[0]}L - &#8377;{value[1]}L</span>
                        </div>
                        <RangeSlider 
                            color="brightSun.4" 
                            size="sm" 
                            value={value} 
                            onChange={setValue} 
                            onChangeEnd={handleChange}
                            classNames={{
                                track: 'bg-mine-shaft-800',
                                bar: 'bg-bright-sun-400',
                                thumb: 'border-2 border-bright-sun-400 bg-mine-shaft-900 shadow-md',
                                label: 'bg-mine-shaft-900 text-mine-shaft-100 !translate-y-10'
                            }}
                        />
                    </div>
                </div>
            </Collapse>
        </div>
    )
}
export default SearchBar;