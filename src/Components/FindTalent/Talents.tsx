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
        
        if(filter.name)filtered=filtered.filter((talent:any)=>talent.name.toLowerCase().includes(filter.name.toLowerCase()));
        if(filter["Job Title"] && filter["Job Title"].length>0)filtered=filtered.filter((talent:any)=>filter["Job Title"]?.some((x:any)=>talent.jobTitle?.toLowerCase().includes(x.toLowerCase())));
        if(filter.Location && filter.Location.length>0)filtered=filtered.filter((talent:any)=>filter.Location?.some((x:any)=>talent.location?.toLowerCase().includes(x.toLowerCase())));
          if(filter.Skills && filter.Skills.length>0)filtered=filtered.filter((talent:any)=>filter.Skills?.some((x:any)=>talent.skills?.some((y:any)=>y.toLowerCase().includes(x.toLowerCase()))));
          if(filter.exp && filter.exp.length>0)filtered=filtered.filter((talent:any)=>filter.exp[0]<=talent.totalExp && talent.totalExp<=filter.exp[1]);
        setFilteredTalents(filtered);
    },[filter,talents])
    return <div className="px-5 py-5">
    <div className="flex justify-between mt-5">
        <div className="text-2xl font-semibold">Talents</div>
        <Sort />
    </div>
    <div className="flex mt-10 flex-wrap gap-5 justify-between">
        {isLoading ? (
            Array(8).fill(0).map((_, i) => <Skeleton key={i} height={200} className="w-full sm-mx:w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-13px)] rounded-xl" />)
        ) : filteredTalents.length > 0 ? (
            filteredTalents.map((talent:any, index:any) => <TalentCard key={index} {...talent}  />)
        ) : (
            <div className="w-full flex flex-col items-center justify-center h-full opacity-70 p-4 mt-10">
                <img src={WEBSITE_CONFIG.assets.workingGirl || "/Working/Girl.png"} className="w-48 h-48 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300" alt="No talents found" />
                <div className="text-center font-medium text-lg text-mine-shaft-300">No talents found matching your filters.</div>
                <div className="text-center text-sm text-mine-shaft-400 mt-2">Try adjusting your search criteria or clear filters to see more profiles.</div>
                <Button mt="md" onClick={() => dispatch(resetFilter())} variant="light" color="brightSun.4">Clear Filters</Button>
            </div>
        )}
    </div>
</div>
}
export default Talents;