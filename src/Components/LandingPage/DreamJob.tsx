import { Avatar, Autocomplete, SegmentedControl } from "@mantine/core";
import { IconSearch, IconMapPin, IconBriefcase, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WEBSITE_CONFIG } from "../../config";
import { TypeAnimation } from 'react-type-animation';
import CountUp from 'react-countup';
import { motion } from "framer-motion";
import { Meteors } from "../Animations/Meteors";

const popularSearchTerms = [
    "Software Engineer", "React Developer", "Product Designer", 
    "Data Scientist", "Java Developer", "Remote Jobs", 
    "Google", "Microsoft", "Project Manager", "Sales"
];

const popularLocations = [
    "New York, NY", "San Francisco, CA", "London, UK", 
    "Berlin, Germany", "Remote", "Bangalore, India", 
    "Toronto, Canada", "Austin, TX", "Singapore"
];

const DreamJob = () => {
    const navigate=useNavigate();
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");
    const [searchType, setSearchType] = useState("Jobs");

    const handleClick = () => {
        const searchQuery = location ? `${query} ${location}`.trim() : query.trim();
        if (searchType === "Jobs") {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/professionals?query=${encodeURIComponent(searchQuery)}`);
        }
    }
    
    const { hero } = WEBSITE_CONFIG.landing;
    const { assets } = WEBSITE_CONFIG;

    return (
        <section className="flex md-mx:flex-col items-center px-16 bs-mx:px-10 md-mx:px-5 sm-mx:px-4 py-16 sm-mx:py-8 relative overflow-hidden min-h-[85vh]">
            {/* Background glowing decorations and Aceternity Meteors */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
                <Meteors number={15} />
            </div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 sm-mx:w-48 sm-mx:h-48 bg-bright-sun-400/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] sm-mx:w-64 sm-mx:h-64 bg-teal-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
                className="flex flex-col w-[50%] md-mx:w-full gap-6 sm-mx:gap-4 z-10"
            >
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-6xl bs-mx:text-5xl md-mx:text-4xl sm-mx:text-3xl sm-mx:text-center font-extrabold leading-[1.15] text-mine-shaft-100 drop-shadow-sm mt-10 sm-mx:mt-4"
                >
                    {hero.titlePart1}{" "}
                    <TypeAnimation
                        sequence={[
                            'Connection', 2500,
                            'Colleague', 2500,
                            'Mentor', 2500,
                            'Job', 2500,
                        ]}
                        wrapper="span"
                        speed={50}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-bright-sun-400 to-yellow-300"
                        repeat={Infinity}
                    />{" "}
                    <br className="hidden md:block"/>
                    {hero.titlePart2}
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-xl md-mx:text-lg sm-mx:text-base sm-mx:text-center text-mine-shaft-300 leading-relaxed max-w-xl font-light"
                >
                    {hero.subtitle}
                </motion.div>
                
                {/* Advanced Hero Search Bar */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: "backOut" }}
                    className="flex flex-col gap-3 mt-6 p-4 sm-mx:p-3 bg-mine-shaft-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-mine-shaft-800 focus-within:border-bright-sun-400/50 focus-within:shadow-[0_0_20px_rgba(250,204,21,0.15)] transition-all duration-500 w-full max-w-2xl"
                >
                    
                    {/* Search Type Toggle */}
                    <div className="flex sm-mx:w-full">
                        <SegmentedControl
                            value={searchType}
                            onChange={setSearchType}
                            data={[
                                { label: <div className="flex items-center justify-center gap-2"><IconBriefcase size={16}/><span className="sm-mx:text-xs">Jobs</span></div>, value: 'Jobs' },
                                { label: <div className="flex items-center justify-center gap-2"><IconUsers size={16}/><span className="sm-mx:text-xs">Connections</span></div>, value: 'Talent' },
                            ]}
                            color="brightSun.4"
                            radius="xl"
                            fullWidth
                            className="bg-mine-shaft-950 sm-mx:w-full w-fit"
                            classNames={{ label: 'font-semibold' }}
                        />
                    </div>

                    <div className="flex md-mx:flex-col gap-3 md-mx:gap-2 w-full items-stretch">
                        <div className={`flex-1 flex items-center px-2 min-w-0 ${searchType === "Jobs" ? "border-r border-mine-shaft-800 md-mx:border-r-0 md-mx:border-b md-mx:pb-3 md-mx:mb-1" : ""}`}>
                            <IconSearch className="text-mine-shaft-400 ml-2 h-5 w-5 shrink-0" />
                            <Autocomplete 
                                value={query} 
                                onChange={setQuery} 
                                data={popularSearchTerms}
                                className="w-full flex-1" 
                                variant="unstyled" 
                                size="md"
                                placeholder={searchType === "Jobs" ? "Job title, keyword, or company" : "Name"}
                                classNames={{ input: 'px-3 font-medium text-mine-shaft-100 placeholder:text-mine-shaft-500 w-full', dropdown: 'bg-mine-shaft-900 border-mine-shaft-800 rounded-xl' }}
                                onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                                style={{ width: '100%' }}
                            />
                        </div>
                        
                        {searchType === "Jobs" && (
                            <div className="flex-1 flex items-center px-2 min-w-0 md-mx:pt-1">
                                <IconMapPin className="text-mine-shaft-400 ml-2 h-5 w-5 shrink-0" />
                                <Autocomplete 
                                    value={location} 
                                    onChange={setLocation} 
                                    data={popularLocations}
                                    className="w-full flex-1" 
                                    variant="unstyled" 
                                    size="md"
                                    placeholder="City, state, or 'Remote'" 
                                    classNames={{ input: 'px-3 font-medium text-mine-shaft-100 placeholder:text-mine-shaft-500 w-full', dropdown: 'bg-mine-shaft-900 border-mine-shaft-800 rounded-xl' }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleClick()}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        )}

                        <button 
                            onClick={handleClick}
                            aria-label="Search"
                            className="shrink-0 w-auto md-mx:w-full flex items-center justify-center gap-2 py-3 px-8 bg-gradient-to-r from-bright-sun-400 to-yellow-400 text-mine-shaft-950 font-bold text-lg rounded-xl hover:from-bright-sun-500 hover:to-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.3)] active:scale-95 transition-all duration-300 mt-2 md-mx:mt-3"
                        >
                            Search
                        </button>
                    </div>
                </motion.div>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-[50%] md-mx:w-full flex items-center justify-center z-10 mt-5 md-mx:mt-10"
            >
                <div className="w-[32rem] md-mx:w-full md-mx:max-w-[28rem] sm-mx:max-w-[20rem] relative">
                    <motion.img 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" 
                        src={assets.heroImage} 
                        alt="Professional presenting ideas" 
                    />
                    
                    {/* Glass card floating badges */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                        transition={{ opacity: { duration: 0.5, delay: 0.8 }, x: { duration: 0.5, delay: 0.8 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                        className="absolute -right-8 bs-mx:right-0 sm-mx:hidden w-fit top-[40%] border-white/10 bg-mine-shaft-900/40 rounded-2xl p-4 border backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-mine-shaft-900/60 transition-colors duration-300 group"
                    >
                        <div className="text-center mb-2 text-sm font-semibold text-bright-sun-400 group-hover:text-yellow-300 transition-colors">{hero.statsText}</div>
                        <Avatar.Group spacing="sm">
                            <Avatar src={assets.heroAvatars[0]} size="md" className="border-mine-shaft-900" />
                            <Avatar src={assets.heroAvatars[1]} size="md" className="border-mine-shaft-900" />
                            <Avatar src={assets.heroAvatars[2]} size="md" className="border-mine-shaft-900" />
                            <Avatar color="brightSun.4" size="md" className="text-xs font-bold border-mine-shaft-900 bg-bright-sun-400 text-mine-shaft-950">
                                <CountUp start={0} end={10} duration={3} prefix="+" suffix="K" />
                            </Avatar>
                        </Avatar.Group>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
                        transition={{ opacity: { duration: 0.5, delay: 1 }, x: { duration: 0.5, delay: 1 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
                        className="absolute -left-10 w-fit sm-mx:hidden bs-mx:top-[30%] top-[20%] border-white/10 bg-mine-shaft-900/40 rounded-2xl p-5 border backdrop-blur-xl gap-4 flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-mine-shaft-900/60 transition-colors duration-300"
                    >
                        <div className="flex gap-4 items-center ">
                            <div className="w-12 h-12 p-2 bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                                <img src={assets.heroCompanyLogo} alt="Company Logo" className="w-7 h-7 object-contain drop-shadow-md" />
                            </div>
                            <div className="text-base text-white">
                                <div className="font-extrabold tracking-wide">{hero.cardTitle}</div>
                                <div className="text-mine-shaft-300 text-sm font-medium">{hero.cardLocation}</div>
                            </div>
                        </div>
                        <div className="flex gap-6 justify-between border-t border-white/10 pt-3 text-mine-shaft-300 text-sm">
                            <span className="font-medium">{hero.cardTime}</span>
                            <span className="text-bright-sun-400 font-bold">{hero.cardApplicants}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
export default DreamJob;