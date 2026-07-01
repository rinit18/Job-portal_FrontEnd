
import TalentCard from "../FindTalent/TalentCard";
import { useParams } from "react-router-dom";

const RecommendTalent = (props:any) => {
    const {id}=useParams();
    return <div data-aos="zoom-out" className="w-[30%] lg-mx:w-full">
        <div className="bg-mine-shaft-900/40 backdrop-blur-md rounded-2xl p-6 border border-mine-shaft-800/50 shadow-lg sticky top-24">
            <div className="text-xl font-bold text-mine-shaft-100 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-bright-sun-400 rounded-full"></span>
                Similar Profiles
            </div>
            <div className="flex flex-col gap-4">
            {
                props.talents?.map((talent:any, index:any) =>index<4 && String(id)!==String(talent.id) && <TalentCard key={index} {...talent}  />)
            }
            </div>
        </div>
    </div>
}
export default RecommendTalent;