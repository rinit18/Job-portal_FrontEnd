import { Button, Collapse, Divider, RangeSlider } from "@mantine/core";

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
        <div className="flex flex-col px-5 sm-mx:px-2 py-5 gap-5 sm-mx:gap-3">
            {/* LinkedIn-Style AI Natural Language Search Bar */}
            <div className="w-full flex flex-col items-center mt-2">
                <div className="w-full max-w-3xl flex items-center bg-mine-shaft-900 border border-mine-shaft-800 rounded-full px-2 py-1 shadow-md focus-within:border-bright-sun-400 focus-within:ring-1 focus-within:ring-bright-sun-400 transition-all">
                    <div className="pl-3 pr-2 text-bright-sun-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                    </div>
                    <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                        placeholder="Ask AI to find a job... (e.g. Remote entry level react jobs paying over 15LPA)" 
                        className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 placeholder:text-mine-shaft-400 py-2 px-2"
                    />
                    <Button 
                        onClick={() => handleAISearch()}
                        loading={loading}
                        color="brightSun.4" 
                        radius="xl" 
                        variant="filled"
                        className="ml-2 !text-mine-shaft-950 font-semibold"
                    >
                        Search
                    </Button>
                </div>
                
                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mt-4 max-w-3xl justify-center">
                    <span className="text-sm text-mine-shaft-400 flex items-center mr-2">Suggestions:</span>
                    {suggestions.map((suggestion, index) => (
                        <div 
                            key={index} 
                            onClick={() => handleAISearch(suggestion)}
                            className="px-3 py-1 bg-mine-shaft-800 hover:bg-mine-shaft-700 hover:text-bright-sun-400 text-mine-shaft-300 text-xs rounded-full cursor-pointer transition-colors border border-mine-shaft-700"
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                {matches && <Button onClick={toggle} m="sm" radius="lg" className="align" variant="outline" color="brightSun.4" autoContrast >{opened ? "Close Filters" : "Manual Filters"}</Button>}
            </div>
            
            <Collapse in={(opened || !matches)}>
                <div className="lg-mx:!flex-wrap items-center !text-mine-shaft-100 flex ">
                    {
                        dropdownData.map((item, index) => {
                            return <React.Fragment key={index}><div className="w-1/5 lg-mx:w-1/4 bs-mx:w-[30%] sm-mx:w-[48%] xs-mx:w-full xs-mx:mb-1" ><MultiInput title={item.title} icon={item.icon} options={item.options} />
                            </div>
                                <Divider className="sm-mx:hidden" mr="xs" size="xs" orientation="vertical" /></React.Fragment>

                        })
                    }
                    <div className="w-1/5 lg-mx:w-1/4 lg-mx:mt-7 bs-mx:w-[30%] xs-mx:mb-1 sm-mx:w-[48%] text-sm text-mine-shaft-300 [&_.mantine-Slider-label]:!translate-y-10 xs-mx:w-full">
                        <div className="flex mb-1 justify-between">
                            <div>Salary</div>
                            <div>&#8377;{value[0]} LPA - &#8377;{value[1]} LPA</div>
                        </div>
                        <RangeSlider color="brightSun.4" size="xs" value={value} onChange={setValue} onChangeEnd={handleChange} />
                    </div>
                </div>
            </Collapse>
        </div>
    )
}
export default SearchBar;