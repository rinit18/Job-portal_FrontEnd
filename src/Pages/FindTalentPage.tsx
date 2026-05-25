import { Divider } from "@mantine/core";
import SearchBar from "../Components/FindTalent/SearchBar";
import Talents from "../Components/FindTalent/Talents";

import { Helmet } from "react-helmet-async";

const FindTalentPage=()=>{
    return <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins']">
        <Helmet><title>Find Talent | CareerConnect</title></Helmet>
         <Divider size="xs" mx="md"/>
            <SearchBar/>
            <Divider size="xs" mx="md"/>
            <Talents/>
    </div>
}
export default FindTalentPage;