import Sort from "../FindJobs/Sort";
import TalentCard from "./TalentCard";
import { talents } from "../Data/TalentData"; 


const Talents= () => {
 return( <div className="p-5">
    
    <div className="flex justify-between">
        <div className="text-2xl font-semibold">Talents</div>
        <Sort />
    </div>
    <div className="mt-10 flex flex-wrap gap-5 justify-evenly">
        {
             talents.map((talent, index)=> <TalentCard key={index} {...talent} />)
        }
     <TalentCard/>
    </div>
   
 </div>
 );
}
export default Talents;