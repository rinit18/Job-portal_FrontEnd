import { Checkbox, RangeSlider, ScrollArea } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { dropdownData } from "../../Data/JobsData";
import { useEffect, useState } from "react";
import { IconFilter } from "@tabler/icons-react";

const FilterSidebar = () => {
    const filter = useSelector((state: any) => state.filter);
    const dispatch = useDispatch();
    const [value, setValue] = useState<[number, number]>([0, 300]);

    useEffect(() => {
        if (!filter.salary) setValue([0, 300]);
        else setValue(filter.salary);
    }, [filter]);

    const handleSalaryChange = (event: any) => {
        dispatch(updateFilter({ salary: event }));
    };

    const handleCheckboxChange = (title: string, option: string, checked: boolean) => {
        let currentSelections = filter[title] ? [...filter[title]] : [];
        if (checked) {
            currentSelections.push(option);
        } else {
            currentSelections = currentSelections.filter((val) => val !== option);
        }
        
        dispatch(updateFilter({ [title]: currentSelections.length > 0 ? currentSelections : null }));
    };

    return (
        <div className="w-full bg-mine-shaft-900/40 backdrop-blur-md border border-mine-shaft-800/60 rounded-3xl p-6 flex flex-col gap-6 h-full shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-2 text-white font-bold text-xl pb-4 border-b border-mine-shaft-800/50">
                <IconFilter className="text-bright-sun-400 drop-shadow-[0_0_8px_rgba(255,189,32,0.4)]" size={26} stroke={2} />
                Filters
            </div>

            <ScrollArea className="flex-1 -mx-6 px-6 custom-scrollbar" offsetScrollbars>
                <div className="flex flex-col gap-6 pb-5">
                    {/* Salary Filter */}
                    <div className="flex flex-col gap-3">
                        <div className="font-semibold text-mine-shaft-100 mb-1">Salary Range (LPA)</div>
                        <div className="flex justify-between font-medium text-xs text-mine-shaft-300">
                            <span>&#8377;{value[0]}L</span>
                            <span>&#8377;{value[1]}L</span>
                        </div>
                        <RangeSlider 
                            color="brightSun.4" 
                            size="sm" 
                            value={value} 
                            onChange={setValue} 
                            onChangeEnd={handleSalaryChange}
                            min={0}
                            max={300}
                            step={1}
                            classNames={{
                                track: 'bg-mine-shaft-800',
                                bar: 'bg-bright-sun-400',
                                thumb: 'border-2 border-bright-sun-400 bg-mine-shaft-900 shadow-md',
                                label: 'bg-mine-shaft-900 text-mine-shaft-100'
                            }}
                        />
                    </div>

                    {/* Dynamic Dropdown Data Checkboxes */}
                    {dropdownData.map((category, index) => (
                        <div key={index} className="flex flex-col gap-3 pt-4 border-t border-mine-shaft-800/50">
                            <div className="font-semibold text-mine-shaft-100 flex items-center gap-2">
                                <category.icon size={18} className="text-bright-sun-400" stroke={1.5} />
                                {category.title}
                            </div>
                            <div className="flex flex-col gap-2.5">
                                {category.options.map((option, i) => (
                                    <Checkbox
                                        key={i}
                                        label={option}
                                        color="brightSun.4"
                                        size="sm"
                                        checked={filter[category.title]?.includes(option) || false}
                                        onChange={(event) => handleCheckboxChange(category.title, option, event.currentTarget.checked)}
                                        classNames={{
                                            label: 'text-mine-shaft-300 text-sm font-medium hover:text-mine-shaft-200 transition-colors',
                                            input: 'bg-mine-shaft-950 border-mine-shaft-700 cursor-pointer'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default FilterSidebar;
