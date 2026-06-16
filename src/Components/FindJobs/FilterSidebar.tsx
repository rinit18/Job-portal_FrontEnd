import { Checkbox, RangeSlider } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { dropdownData } from "../../Data/JobsData";
import { useEffect, useState } from "react";
import { IconAdjustments } from "@tabler/icons-react";

const FilterSidebar = () => {
    const filter = useSelector((state: any) => state.filter);
    const dispatch = useDispatch();
    const [value, setValue] = useState<[number, number]>([0, 100]);

    useEffect(() => {
        if (!filter.salary) setValue([0, 100]);
        else setValue(filter.salary);
    }, [filter]);

    const handleSalaryChange = (val: any) => dispatch(updateFilter({ salary: val }));

    const handleCheckbox = (title: string, option: string, checked: boolean) => {
        let cur = filter[title] ? [...filter[title]] : [];
        if (checked) cur.push(option);
        else cur = cur.filter((v: string) => v !== option);
        dispatch(updateFilter({ [title]: cur.length > 0 ? cur : null }));
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.05]">
                <IconAdjustments size={13} className="text-bright-sun-400" stroke={2} />
                <span className="text-xs font-bold text-mine-shaft-400 uppercase tracking-wider">Filters</span>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 flex flex-col gap-4">

                {/* Salary range */}
                <div className="flex flex-col gap-2.5">
                    <p className="text-[11px] font-bold text-mine-shaft-300 uppercase tracking-wider">Salary (LPA)</p>
                    <div className="flex justify-between text-xs font-semibold text-mine-shaft-400">
                        <span>₹{value[0]}L</span>
                        <span>₹{value[1]}L</span>
                    </div>
                    <RangeSlider
                        color="brightSun.4"
                        size="xs"
                        value={value}
                        onChange={setValue}
                        onChangeEnd={handleSalaryChange}
                        min={0} max={100} step={1}
                        label={null}
                        classNames={{
                            track: "bg-mine-shaft-800",
                            bar:   "bg-bright-sun-400",
                            thumb: "border-2 border-bright-sun-400 bg-mine-shaft-950 w-5 h-5 sm-mx:w-6 sm-mx:h-6",
                        }}
                    />
                </div>

                {/* Category checkboxes */}
                <div className="flex flex-col gap-5 pt-2">
                    {dropdownData.map((cat, i) => (
                        <div key={i} className="flex flex-col gap-1.5 border-t border-white/[0.04] pt-4">
                            {/* Category Header */}
                            <div className="flex items-center gap-1.5 px-1.5 mb-1">
                                <cat.icon size={14} className="text-bright-sun-400" stroke={1.5} />
                                <p className="text-[11px] font-bold text-mine-shaft-300 uppercase tracking-wider">{cat.title}</p>
                            </div>

                            {/* Options List */}
                            <div className="flex flex-col gap-0.5">
                            {cat.options.map((opt, j) => {
                                const isChecked = filter[cat.title]?.includes(opt) || false;
                                return (
                                    <div
                                        key={j}
                                        onClick={() => handleCheckbox(cat.title, opt, !isChecked)}
                                        className={`group flex items-center gap-2.5 px-2 py-2.5 sm-mx:min-h-[44px] rounded-lg cursor-pointer transition-all duration-200 ${
                                            isChecked 
                                            ? "bg-bright-sun-400/[0.08]" 
                                            : "hover:bg-mine-shaft-900/60"
                                        }`}
                                    >
                                        <Checkbox
                                            checked={isChecked}
                                            readOnly
                                            color="brightSun.4"
                                            size="xs"
                                            classNames={{
                                                input: "bg-mine-shaft-950 border-mine-shaft-700 cursor-pointer pointer-events-none group-hover:border-mine-shaft-500 transition-colors",
                                            }}
                                        />
                                        <span className={`text-xs font-medium transition-colors cursor-pointer pointer-events-none ${
                                            isChecked 
                                            ? "text-bright-sun-400" 
                                            : "text-mine-shaft-300 group-hover:text-mine-shaft-100"
                                        }`}>
                                            {opt}
                                        </span>
                                    </div>
                                );
                            })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
