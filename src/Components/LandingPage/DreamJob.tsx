import { Avatar, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFilter } from "../../Slices/FilterSlice";
import { useNavigate } from "react-router-dom";
import { WEBSITE_CONFIG } from "../../config";
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';

const DreamJob = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user = useSelector((state: any) => state.user);
    const [jobTitle, setJobTitle]=useState("");
    const [type, setType]=useState("");
    const searchType = user?.accountType === "EMPLOYER" ? "talents" : "jobs";

    const handleClick=()=>{
        if (searchType === "jobs") {
            dispatch(updateFilter({"Job Title":jobTitle?[jobTitle]:null, "Job Type":type?[type]:null, "page":1}));
            navigate("/find-jobs");
        } else {
            dispatch(updateFilter({"name":jobTitle || null, "Location":type?[type]:null, "page":1}));
            navigate("/find-talent");
        }
    }
    
    const { hero } = WEBSITE_CONFIG.landing;
    const { assets } = WEBSITE_CONFIG;

    return (
        <div className="flex sm-mx:flex-col-reverse items-center px-16 bs-mx:px-10 md-mx:px-5 py-12 relative overflow-hidden">
            {/* Background glowing decorations */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-bright-sun-400/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-bright-sun-400/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div data-aos="zoom-out-right" className="flex flex-col w-[45%] sm-mx:w-full gap-5 z-10">
                <div className="text-6xl bs-mx:text-5xl md-mx:text-4xl sm-mx:text-3xl font-extrabold leading-tight text-mine-shaft-100 [&>span]:text-bright-sun-400">
                    {hero.titlePart1}{" "}
                    <TypeAnimation
                        sequence={[
                            'Developer', 2000,
                            'Designer', 2000,
                            'Manager', 2000,
                            'Analyst', 2000,
                        ]}
                        wrapper="span"
                        speed={50}
                        className="text-bright-sun-400"
                        repeat={Infinity}
                    />{" "}
                    {hero.titlePart2}
                </div>
                <div className="text-lg md-mx:text-base sm-mx:text-sm text-mine-shaft-300 leading-relaxed max-w-lg">
                    {hero.subtitle}
                </div>
                

                {/* Hero Search Bar (Indeed-style): High contrast, large inputs, prominent button */}
                <div className="flex sm-mx:flex-col gap-3 mt-4 p-3 bg-mine-shaft-900 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-mine-shaft-800 focus-within:border-bright-sun-400/50 transition-all duration-300">
                    <div className="flex-1 flex sm-mx:flex-col gap-2">
                        <TextInput 
                            value={jobTitle} 
                            onChange={(e)=>setJobTitle(e.currentTarget.value)} 
                            className="flex-1 rounded-lg bg-mine-shaft-950 p-1 text-mine-shaft-100" 
                            variant="unstyled" 
                            size="lg"
                            label={<span className="text-xs text-mine-shaft-400 font-bold px-2 uppercase tracking-wider">{searchType === "jobs" ? "What" : "Who"}</span>}
                            placeholder={searchType === "jobs" ? "Job title, keywords, or company" : "React Developer"} 
                            classNames={{ input: 'px-2 font-bold text-lg placeholder:text-mine-shaft-500 placeholder:font-medium' }}
                        />
                        <div className="w-[1px] bg-mine-shaft-800 my-3 sm-mx:hidden"></div>
                        <div className="h-[1px] bg-mine-shaft-800 mx-3 hidden sm-mx:block"></div>
                        <TextInput 
                            value={type} 
                            onChange={(e)=>setType(e.currentTarget.value)} 
                            className="flex-1 rounded-lg bg-mine-shaft-950 p-1 text-mine-shaft-100" 
                            variant="unstyled"
                            size="lg" 
                            label={<span className="text-xs text-mine-shaft-400 font-bold px-2 uppercase tracking-wider">Where</span>}
                            placeholder={searchType === "jobs" ? "City, state, or remote" : "Location"} 
                            classNames={{ input: 'px-2 font-bold text-lg placeholder:text-mine-shaft-500 placeholder:font-medium' }}
                        />
                    </div>
                    <button 
                        onClick={handleClick}
                        className="flex items-center justify-center gap-2 sm-mx:w-full h-auto px-8 bg-bright-sun-400 text-mine-shaft-950 font-extrabold text-lg rounded-lg hover:bg-bright-sun-500 shadow-lg shadow-bright-sun-400/20 active:scale-95 transition-all duration-200"
                    >
                        <IconSearch className="h-6 w-6 stroke-[2.5]" />
                        <span className="hidden lg:block">Search Jobs</span>
                    </button>
                </div>
            </div>
            
            <div data-aos="zoom-out-left" className="w-[55%] sm-mx:w-full flex items-center justify-center z-10">
                <div className="w-[30rem] sm-mx:w-[24rem] relative">
                    <img className="hover:scale-[1.02] transition-transform duration-500" src={assets.heroImage} alt="boy" />
                    
                    {/* Glass card floating badges */}
                    <div className="absolute -right-6 bs-mx:right-0 w-fit xs-mx:top-[10%] top-[50%] border-mine-shaft-800 bg-mine-shaft-900/60 rounded-2xl p-3 border backdrop-blur-md shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="text-center mb-1 text-xs font-semibold text-bright-sun-400">{hero.statsText}</div>
                        <Avatar.Group>
                            <Avatar src={assets.heroAvatars[0]} />
                            <Avatar src={assets.heroAvatars[1]} />
                            <Avatar src={assets.heroAvatars[2]} />
                            <Avatar color="brightSun.4" className="text-xs font-semibold">
                                <CountUp start={0} end={9} duration={3} prefix="+" suffix="K" />
                            </Avatar>
                        </Avatar.Group>
                    </div>
                    
                    <div className="absolute -left-6 w-fit bs-mx:top-[35%] xs-mx:top-[60%] top-[28%] border-mine-shaft-800 bg-mine-shaft-900/60 rounded-2xl p-4 border backdrop-blur-md gap-3 flex flex-col shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex gap-3 items-center ">
                            <div className="w-10 h-10 p-1 bg-mine-shaft-900 rounded-xl flex items-center justify-center">
                                <img src={assets.heroCompanyLogo} alt="" className="w-6 h-6 object-contain" />
                            </div>
                            <div className="text-sm text-mine-shaft-100">
                                <div className="font-bold">{hero.cardTitle}</div>
                                <div className="text-mine-shaft-400 text-xs">{hero.cardLocation}</div>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-between border-t border-mine-shaft-800/50 pt-2 text-mine-shaft-300 text-xs">
                            <span>{hero.cardTime}</span>
                            <span className="text-bright-sun-400 font-semibold">{hero.cardApplicants}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DreamJob;