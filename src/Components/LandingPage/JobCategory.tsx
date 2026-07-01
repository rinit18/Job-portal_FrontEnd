import { Carousel } from "@mantine/carousel";
import { jobCategory } from "../../Data/Data";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

const JobCategory = () => {
    return <section className="mt-24 pb-10 overflow-hidden relative">
        <h2 data-aos="zoom-out" className="text-5xl md-mx:text-4xl sm-mx:text-3xl xs-mx:text-2xl text-center font-bold mb-4 text-mine-shaft-100">
            Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-bright-sun-400 to-yellow-300">Job Categories</span>
        </h2>
        <div data-aos="zoom-out" className="text-xl md-mx:text-lg sm-mx:text-base mb-14 mx-auto text-mine-shaft-300 text-center w-2/3 md-mx:w-4/5 sm-mx:w-11/12 font-light">
            Explore diverse job opportunities tailored to your skills. Start your career journey today!
        </div>
        
        <Carousel 
            slideSize="22%" 
            slideGap="xl" 
            loop 
            className="focus-visible:[&_button]:!outline-none
            [&_button]:!bg-bright-sun-400 [&_button]:!border-none [&_button]:hover:scale-110 [&_button]:transition-transform [&_button]:opacity-0 hover:[&_button]:opacity-100 
            px-4"
            nextControlIcon={<IconArrowRight className="h-6 w-6 text-mine-shaft-950 stroke-[3]" />}
            previousControlIcon={<IconArrowLeft className="h-6 w-6 text-mine-shaft-950 stroke-[3]" />}
        >
            {jobCategory.map((category, index) => (
                <Carousel.Slide key={index} className="py-4">
                    <div 
                        data-aos="zoom-out" 
                        className="group flex flex-col items-center w-full max-w-[280px] mx-auto gap-4 
                        bg-mine-shaft-900/50 backdrop-blur-sm border border-mine-shaft-800/60 
                        p-8 rounded-2xl cursor-pointer transition-all duration-500 ease-out
                        hover:-translate-y-2 hover:bg-mine-shaft-800/80 hover:border-bright-sun-400/30 hover:shadow-[0_15px_40px_rgba(250,204,21,0.1)]"
                    >
                        <div className="p-4 bg-gradient-to-br from-bright-sun-400/20 to-bright-sun-400/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                            <img 
                                className="h-10 w-10 sm-mx:h-8 sm-mx:w-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" 
                                src={`/Category/${category.name}.png`} 
                                alt={category.name} 
                                loading="lazy" 
                            />
                        </div>
                        <div className="text-mine-shaft-100 text-xl font-bold tracking-wide mt-2 text-center group-hover:text-bright-sun-400 transition-colors">
                            {category.name}
                        </div>
                        <div className="text-sm text-center text-mine-shaft-400 leading-relaxed font-light">
                            {category.desc}
                        </div>
                        <div className="mt-2 text-bright-sun-400 font-semibold px-4 py-1.5 bg-bright-sun-400/10 rounded-full text-sm group-hover:bg-bright-sun-400/20 transition-colors">
                            {category.jobs}+ jobs
                        </div>
                    </div>
                </Carousel.Slide>
            ))}
        </Carousel>
    </section>
}
export default JobCategory;