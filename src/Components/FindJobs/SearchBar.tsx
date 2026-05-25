import { Button } from "@mantine/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";

const SearchBar = () => {
    const dispatch = useDispatch();
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
        <div className="flex flex-col px-6 py-10 gap-8 bg-mine-shaft-950/40 rounded-3xl border border-mine-shaft-900/60 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Ambient background glows for Search section */}
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-bright-sun-400/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-bright-sun-400/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* AI Natural Language Search Bar - Premium Overhaul */}
            <div className="w-full flex flex-col items-center relative z-10">
                <div className="w-full max-w-4xl flex items-center bg-mine-shaft-900/80 border border-mine-shaft-800 rounded-xl px-4 py-3 shadow-[0_5px_20px_rgba(0,0,0,0.3)] focus-within:border-bright-sun-400 focus-within:shadow-[0_0_20px_rgba(255,189,32,0.2)] focus-within:bg-mine-shaft-900 transition-all duration-300">
                    <div className="pl-3 pr-4 text-bright-sun-400 animate-pulse shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                    </div>
                    <input 
                        type="text" 
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                        placeholder="Ask AI to find a job... (e.g. Remote entry level react jobs paying over 15LPA)" 
                        className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 font-medium placeholder:text-mine-shaft-500 placeholder:font-normal py-2 px-3 text-lg"
                    />
                    <Button 
                        onClick={() => handleAISearch()}
                        loading={loading}
                        color="brightSun.4" 
                        size="md"
                        radius="md" 
                        variant="filled"
                        className="ml-3 !text-mine-shaft-950 font-extrabold px-8 text-base shadow-md shadow-bright-sun-400/20 hover:bg-bright-sun-500"
                    >
                        Search
                    </Button>
                </div>
                
                {/* Modern Pill Suggestions with hover states */}
                <div className="flex flex-wrap gap-3 mt-6 max-w-4xl justify-center items-center">
                    <span className="text-sm font-bold tracking-widest uppercase text-mine-shaft-500 mr-2">Try:</span>
                    {suggestions.map((suggestion, index) => (
                        <button 
                            key={index} 
                            onClick={() => handleAISearch(suggestion)}
                            className="px-5 py-2 bg-mine-shaft-900/60 hover:bg-mine-shaft-800 hover:text-bright-sun-400 text-mine-shaft-300 text-sm font-semibold rounded-full cursor-pointer transition-all duration-200 border border-mine-shaft-800 hover:border-bright-sun-400/30 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default SearchBar;