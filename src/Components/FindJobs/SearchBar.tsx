import { Button } from "@mantine/core";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { IconSparkles } from "@tabler/icons-react";

const suggestions = [
    "Backend Developer",
    "Remote React jobs",
    "Entry level design roles",
    "High paying iOS jobs",
    "Part time content writing"
];

const SearchBar = () => {
    const dispatch = useDispatch();
    const [aiQuery, setAiQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAISearch = async (queryToSearch = aiQuery) => {
        if (!queryToSearch.trim()) return;
        setAiQuery(queryToSearch);
        setLoading(true);
        try {
            const { parseSearchQuery } = await import("../../Services/AiService");
            const parsedFilters = await parseSearchQuery(queryToSearch);
            dispatch(updateFilter({ "Job Title": parsedFilters["Job Title"]?.length > 0 ? parsedFilters["Job Title"] : null }));
            dispatch(updateFilter({ "Location": parsedFilters["Location"]?.length > 0 ? parsedFilters["Location"] : null }));
            dispatch(updateFilter({ "Experience": parsedFilters["Experience"]?.length > 0 ? parsedFilters["Experience"] : null }));
            dispatch(updateFilter({ "Job Type": parsedFilters["Job Type"]?.length > 0 ? parsedFilters["Job Type"] : null }));
            if (parsedFilters["salary"]) dispatch(updateFilter({ "salary": parsedFilters["salary"] }));
        } catch (error) {
            console.error("AI Search Failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-5 py-4 flex flex-col gap-3 relative overflow-hidden bg-transparent">
            {/* AI sparkle glow */}
            <div className="absolute top-0 right-1/4 w-64 h-32 bg-bright-sun-400/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Search input row */}
            <div className="flex items-center gap-3 bg-mine-shaft-900/80 border border-mine-shaft-800 rounded-xl px-4 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] focus-within:border-bright-sun-400/70 focus-within:shadow-[0_0_18px_rgba(255,189,32,0.15)] transition-all duration-300">
                <div className="text-bright-sun-400 shrink-0 animate-pulse">
                    <IconSparkles size={22} stroke={2} />
                </div>
                <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                    placeholder="Ask AI to find a job… e.g. Remote entry level react jobs paying over 15 LPA"
                    className="flex-1 bg-transparent border-none outline-none text-mine-shaft-100 placeholder:text-mine-shaft-500 text-sm font-medium py-1"
                />
                <Button
                    onClick={() => handleAISearch()}
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

            {/* Suggestion pills */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold tracking-widest uppercase text-mine-shaft-600">Try:</span>
                {suggestions.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => handleAISearch(s)}
                        className="px-3 py-1 bg-mine-shaft-900/60 hover:bg-mine-shaft-800 hover:text-bright-sun-400 text-mine-shaft-400 text-xs font-semibold rounded-full border border-mine-shaft-800 hover:border-bright-sun-400/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;