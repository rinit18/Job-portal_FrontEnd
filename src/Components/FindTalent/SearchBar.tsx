import { Button, Collapse, Divider, Input, RangeSlider } from "@mantine/core";
import React, { useState } from "react";
import MultiInput from "../FindJobs/MultiInput";
import { searchFields } from "../../Data/TalentData";
import { IconUserCircle } from "@tabler/icons-react";
import { updateFilter } from "../../Slices/FilterSlice";
import { useDispatch } from "react-redux";
import { useDebouncedState, useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";

const SearchBar = () => {
    const dispatch = useDispatch();
    const matches = useMediaQuery('(max-width: 475px)');
    const [opened, { toggle }] = useDisclosure(false);
    const [value, setValue] = useState<[number, number]>([0, 50]);
    const [name, setName] =  useState('');;
    const handleChange = (name:any, event:any) => {
        if(name=="exp"){
            dispatch(updateFilter({exp:event}));
        }
        else{
            dispatch(updateFilter({name:event.target.value}));
            setName(event.target.value);
        }
    }

    return (
        <div className="flex flex-col px-6 py-6 gap-6 bg-mine-shaft-950/40 rounded-3xl border border-mine-shaft-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-6">
            <div className="flex justify-between items-center xs-mx:flex-col xs-mx:items-start xs-mx:gap-3 z-10">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-mine-shaft-300">Filter Talents</span>
                    <span className="text-xs text-mine-shaft-500 xs-mx:hidden">|</span>
                    <Link to="/find-jobs" className="text-xs text-bright-sun-400 hover:text-bright-sun-300 hover:underline font-medium transition-colors">
                        Looking for Jobs? Search Jobs instead &rarr;
                    </Link>
                </div>
                {matches && (
                    <Button 
                        onClick={toggle} 
                        radius="md" 
                        variant="light" 
                        color="brightSun.4" 
                        autoContrast
                        className="font-semibold"
                    >
                        {opened ? "Hide Filters" : "Show Filters"}
                    </Button>
                )}
            </div>

            <Collapse in={(opened || !matches)}>
                <div className="w-full grid grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-6 p-6 bg-mine-shaft-900/30 border border-mine-shaft-900/60 rounded-2xl backdrop-blur-md">
                    {/* Name Filter Field */}
                    <div className="flex items-center gap-2 bg-mine-shaft-900/40 p-2.5 rounded-xl border border-mine-shaft-900/60 focus-within:border-bright-sun-400/40 transition-colors">
                        <div className="text-bright-sun-400 shrink-0">
                            <IconUserCircle size={22} />
                        </div>
                        <Input 
                            defaultValue={name} 
                            onChange={(e) => handleChange("name", e)} 
                            className="w-full [&_input]:!placeholder-mine-shaft-500 [&_input]:!text-mine-shaft-100" 
                            variant="unstyled" 
                            placeholder="Talent Name" 
                        />
                    </div>

                    {/* Dropdown Filters */}
                    {searchFields.map((item, index) => {
                        return (
                            <div key={index} className="flex flex-col gap-1 border-r border-mine-shaft-900/40 last:border-0 pr-2 md-mx:border-0">
                                <MultiInput title={item.title} icon={item.icon} options={item.options} />
                            </div>
                        );
                    })}

                    {/* Experience Range Filter */}
                    <div className="flex flex-col gap-3 justify-center text-sm text-mine-shaft-300 col-span-1 xs:col-span-full bg-mine-shaft-900/20 p-3 rounded-xl border border-mine-shaft-900/40">
                        <div className="flex justify-between font-semibold text-xs text-mine-shaft-200">
                            <span>Experience</span>
                            <span className="text-bright-sun-400">{value[0]} - {value[1]} Yrs</span>
                        </div>
                        <RangeSlider 
                            color="brightSun.4" 
                            size="sm" 
                            value={value} 
                            onChange={setValue} 
                            onChangeEnd={(e) => handleChange("exp", e)} 
                            classNames={{
                                track: 'bg-mine-shaft-800',
                                bar: 'bg-bright-sun-400',
                                thumb: 'border-2 border-bright-sun-400 bg-mine-shaft-900 shadow-md',
                                label: 'bg-mine-shaft-900 text-mine-shaft-100 !translate-y-10'
                            }}
                        />
                    </div>
                </div>
            </Collapse>
        </div>
    )
}
export default SearchBar;