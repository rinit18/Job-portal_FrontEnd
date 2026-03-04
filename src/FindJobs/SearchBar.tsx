import { Divider, RangeSlider } from "@mantine/core";
import { dropdownData } from "../Data/JobsData";
import MultiInput from "./MultiInput";
import { useState } from "react";

const SearchBar = () =>{
    const [value, setValue] = useState<[number, number]>([1, 100]);
return (
    <div className="px-5 py-8 items-center !text-mine-shaft-100 flex">
        {
            dropdownData.map((item, index)=><> <div key={index} className="w-1/5">
                <MultiInput {... item}/>
        
        </div>
         <Divider mr="xs" size="xs" orientation="vertical" />
        </>)
        }
        <div className="w-1/5 [&_.mantine-Slider-label]:!translate-y-10">
            <div className="flex text-sm justify-between">
                <div>Salary</div>
                <div>&#8377;{value[0]} LPA - &#8377;{value[1]} LPA</div>
            </div>
            <RangeSlider color="brightsun.4" size="xs" value={value}  labelTransitionProps={{
          transition: 'skew-down',
          duration: 150,
          timingFunction: 'linear',
        }}  onChange={setValue} />
        </div>

    </div>
)
}
export default SearchBar;
