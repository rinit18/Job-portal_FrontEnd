import { useEffect, useState } from "react";
import Sort from "../FindJobs/Sort";
import TalentCard from "./TalentCard";
import { getAllProfiles } from "../../Services/ProfileService";
import { useDispatch, useSelector } from "react-redux";
import { resetFilter } from "../../Slices/FilterSlice";
import { Button, Skeleton } from "@mantine/core";
import { WEBSITE_CONFIG } from "../../config";

const Talents=()=>{
    const dispatch=useDispatch();
    const [talents, setTalents] = useState<any>([]);
    const filter=useSelector((state:any)=>state.filter);
    const sort=useSelector((state:any)=>state.sort);
    const [filteredTalents, setFilteredTalents] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setIsLoading(true);
        getAllProfiles().then((res) => {
            setTalents(res);
        }).catch((err) => console.log(err))
        .finally(()=>setIsLoading(false))
        return ()=>{
            if(!filter.page)dispatch(resetFilter());
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(()=>{
        if(sort==="Experience: Low to High"){
            setTalents([...talents].sort((a: any, b: any) => a.totalExp - b.totalExp));
        }
        else if(sort==="Experience: High to Low"){
            setTalents([...talents].sort((a: any, b: any) => b.totalExp - a.totalExp));
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort])
    useEffect(()=>{
        let filtered = talents;
        
        if (filter.globalSearch) {
            const query = filter.globalSearch.toLowerCase();
            filtered = filtered.filter((talent: any) => 
                talent.name?.toLowerCase().includes(query) ||
                talent.jobTitle?.toLowerCase().includes(query) ||
                talent.company?.toLowerCase().includes(query) ||
                talent.skills?.some((x: any) => x.toLowerCase().includes(query)) ||
                talent.location?.toLowerCase().includes(query)
            );
        }
        
        setFilteredTalents(filtered);
    },[filter,talents])
    return <div className="px-5 py-5">
    <div className="flex justify-between mt-5">
        <div className="text-2xl font-semibold">Professionals</div>
        <Sort />
    </div>
    <div className="flex mt-10 flex-wrap gap-5 justify-between">
        {isLoading ? (
            Array(8).fill(0).map((_, i) => <Skeleton key={i} height={200} className="w-full sm-mx:w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13px)] rounded-xl" />)
        ) : filteredTalents.length > 0 ? (
            filteredTalents.map((talent:any, index:any) => <TalentCard key={index} {...talent}  />)
        ) : (
            <div className="w-full flex flex-col items-center justify-center h-full opacity-70 p-4 mt-10">
                <img src={WEBSITE_CONFIG.assets.workingGirl || "/Working/Girl.png"} className="w-48 h-48 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300" alt="No professionals found" />
                <div className="text-center font-medium text-lg text-mine-shaft-300">No professionals found matching your search.</div>
                <div className="text-center text-sm text-mine-shaft-400 mt-2">Try adjusting your search query.</div>
                <Button mt="md" onClick={() => dispatch(resetFilter())} variant="light" color="brightSun.4">Clear Filters</Button>
            </div>
        )}
    </div>
</div>
}
export default Talents;