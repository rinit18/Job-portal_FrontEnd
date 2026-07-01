import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { updateFilter } from "../../Slices/FilterSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const location = useLocation();

    useEffect(() => {
        const queryParam = new URLSearchParams(location.search).get("query");
        if (queryParam) {
            setQuery(queryParam);
            dispatch(updateFilter({ globalSearch: queryParam }));
        }
    }, [location.search, dispatch]);

    const handleChange = (event: any) => {
        const val = event.target.value;
        setQuery(val);
        dispatch(updateFilter({ globalSearch: val }));
    }

    return (
        <div className="flex px-6 py-6 items-center justify-center mb-6">
            <div className="w-full max-w-3xl">
                <Input 
                    size="xl"
                    radius="xl"
                    value={query} 
                    onChange={handleChange} 
                    leftSection={<IconSearch size={24} className="text-bright-sun-400" />}
                    placeholder="Search for professionals by name, job title, company, or skills..." 
                    classNames={{
                        input: "bg-mine-shaft-900/50 border-mine-shaft-800 text-mine-shaft-100 placeholder-mine-shaft-400 backdrop-blur-md shadow-2xl focus:border-bright-sun-400/50 text-lg transition-all"
                    }}
                />
            </div>
        </div>
    )
}
export default SearchBar;