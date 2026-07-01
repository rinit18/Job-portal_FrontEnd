import { Avatar, Tabs } from "@mantine/core";
import { work, employerWork } from "../../Data/Data";
import { WEBSITE_CONFIG } from "../../config";
import { IconBriefcase, IconUserCircle } from "@tabler/icons-react";

const Working = () => {
    const { working } = WEBSITE_CONFIG.landing;
    const { assets } = WEBSITE_CONFIG;

    return <section className="mt-20 pb-16 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-bright-sun-400/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <h2 data-aos="zoom-out" className="text-5xl md-mx:text-4xl sm-mx:text-3xl xs-mx:text-2xl text-center font-bold mb-4 text-mine-shaft-100">
            How it <span className="text-transparent bg-clip-text bg-gradient-to-r from-bright-sun-400 to-yellow-300">Works</span>
        </h2>
        <div data-aos="zoom-out" className="text-xl md-mx:text-lg sm-mx:text-base xs-mx:text-sm mx-auto text-mine-shaft-300 text-center w-2/3 md-mx:w-4/5 sm-mx:w-11/12 font-light mb-12">
            {working.subtitle}
        </div>
        
        <div className="max-w-6xl mx-auto px-6">
            <Tabs defaultValue="candidates" variant="pills" radius="xl" className="flex flex-col items-center">
                <Tabs.List className="bg-mine-shaft-900/60 p-2 rounded-full border border-mine-shaft-800 backdrop-blur-md mb-12 shadow-lg">
                    <Tabs.Tab 
                        value="candidates" 
                        leftSection={<IconUserCircle size={20} />}
                        className="text-lg font-semibold px-8 py-3 data-[active]:bg-bright-sun-400 data-[active]:text-mine-shaft-950 transition-all duration-300"
                    >
                        For Candidates
                    </Tabs.Tab>
                    <Tabs.Tab 
                        value="employers" 
                        leftSection={<IconBriefcase size={20} />}
                        className="text-lg font-semibold px-8 py-3 data-[active]:bg-bright-sun-400 data-[active]:text-mine-shaft-950 transition-all duration-300"
                    >
                        For Employers
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="candidates" className="w-full">
                    <div className="flex md-mx:flex-col gap-16 justify-center items-center">
                        <div data-aos="fade-right" className="relative group">
                            <div className="absolute inset-0 bg-bright-sun-400/20 rounded-full blur-3xl group-hover:bg-bright-sun-400/30 transition-all duration-500"></div>
                            <img className="w-[28rem] relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" src={assets.workingGirl || "/Working/Girl.png"} alt="Candidate working" loading="lazy" />
                            <div className="w-40 flex top-[15%] right-[-10%] absolute flex-col items-center gap-2 border border-white/10 rounded-2xl py-4 px-2 backdrop-blur-xl bg-mine-shaft-900/60 shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-20 hover:-translate-y-2 transition-transform duration-300">
                                <Avatar className="!h-14 !w-14 border-2 border-bright-sun-400 shadow-lg" src={assets.heroAvatars[1]} alt="Profile completed" />
                                <div className="text-sm font-bold text-white text-center">Profile Completed</div>
                                <div className="text-xs font-medium text-bright-sun-400 bg-bright-sun-400/10 px-3 py-1 rounded-full">100%</div>
                            </div>
                        </div>
                        <div data-aos="fade-left" className="flex flex-col gap-8 flex-1 max-w-md">
                            {work.map((item, index) => (
                                <div key={index} className="flex items-start gap-5 p-4 rounded-2xl hover:bg-mine-shaft-900/40 border border-transparent hover:border-mine-shaft-800 transition-all duration-300">
                                    <div className="p-3 bg-gradient-to-br from-bright-sun-400 to-yellow-500 rounded-xl shadow-lg shrink-0 mt-1">
                                        <img className="h-8 w-8 object-contain drop-shadow-md invert" src={`/Working/${item.name}.png`} alt={item.name} loading="lazy" />
                                    </div>
                                    <div>
                                        <div className="text-mine-shaft-100 text-2xl font-bold tracking-tight mb-2">{item.name}</div>
                                        <div className="text-mine-shaft-300 text-base leading-relaxed">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Tabs.Panel>

                <Tabs.Panel value="employers" className="w-full">
                    <div className="flex md-mx:flex-col-reverse gap-16 justify-center items-center">
                        <div data-aos="fade-right" className="flex flex-col gap-8 flex-1 max-w-md">
                            {employerWork.map((item, index) => (
                                <div key={index} className="flex items-start gap-5 p-4 rounded-2xl hover:bg-mine-shaft-900/40 border border-transparent hover:border-mine-shaft-800 transition-all duration-300">
                                    <div className="p-3 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl shadow-lg shrink-0 mt-1 flex items-center justify-center h-14 w-14">
                                        <span className="text-2xl font-extrabold text-mine-shaft-950">{index + 1}</span>
                                    </div>
                                    <div>
                                        <div className="text-mine-shaft-100 text-2xl font-bold tracking-tight mb-2">{item.name}</div>
                                        <div className="text-mine-shaft-300 text-base leading-relaxed">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div data-aos="fade-left" className="relative group">
                            <div className="absolute inset-0 bg-teal-400/20 rounded-full blur-3xl group-hover:bg-teal-400/30 transition-all duration-500"></div>
                            {/* Placeholder for employer image - using a generic professional image for now */}
                            <img className="w-[28rem] relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] rounded-2xl" src={assets.heroImage} alt="Employer reviewing" loading="lazy" />
                            <div className="w-48 flex bottom-[10%] left-[-15%] absolute flex-col items-center gap-2 border border-white/10 rounded-2xl py-4 px-3 backdrop-blur-xl bg-mine-shaft-900/80 shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-20 hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex gap-2 mb-1">
                                    <Avatar className="!h-10 !w-10 border border-mine-shaft-800" src={assets.heroAvatars[0]} />
                                    <Avatar className="!h-10 !w-10 border border-mine-shaft-800" src={assets.heroAvatars[2]} />
                                </div>
                                <div className="text-sm font-bold text-white text-center">Top Candidates Found</div>
                                <div className="text-xs font-bold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">Hire Now</div>
                            </div>
                        </div>
                    </div>
                </Tabs.Panel>
            </Tabs>
        </div>
    </section>
}
export default Working;