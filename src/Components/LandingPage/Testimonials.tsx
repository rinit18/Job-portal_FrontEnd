import { Avatar, Rating } from "@mantine/core";
import { testimonials } from "../../Data/Data";

const Testimonials = () => {
    return <section className="mt-20 pb-16 overflow-hidden relative">
        <h2 data-aos="zoom-out" className="text-5xl md-mx:text-4xl sm-mx:text-3xl xs-mx:text-2xl text-center font-bold mb-4 text-mine-shaft-100">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-bright-sun-400 to-yellow-300">Users Say</span>
        </h2>
        <div data-aos="zoom-out" className="text-xl md-mx:text-lg sm-mx:text-base xs-mx:text-sm mx-auto text-mine-shaft-300 text-center w-2/3 md-mx:w-4/5 sm-mx:w-11/12 font-light mb-16">
            Discover how CareerConnect has helped professionals and companies find their perfect match.
        </div>
        
        <div className="flex flex-wrap gap-8 justify-center px-4 max-w-7xl mx-auto">
            {testimonials.map((data, index) => (
                <div 
                    key={index} 
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    className="flex flex-col gap-5 w-[30%] lg-mx:w-[45%] md-mx:w-full border border-mine-shaft-800/60 p-8 rounded-3xl 
                    bg-mine-shaft-900/40 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.2)] 
                    hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(250,204,21,0.1)] hover:border-bright-sun-400/30 transition-all duration-500 group"
                >
                    <div className="flex gap-4 items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-bright-sun-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <Avatar 
                                className="!h-16 !w-16 border-2 border-mine-shaft-800 group-hover:border-bright-sun-400 transition-colors duration-300" 
                                src={`avatar${index % 3}.png`} 
                                alt={data.name} 
                            />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-mine-shaft-100 tracking-wide">{data.name}</div>
                            <Rating value={data.rating} fractions={2} readOnly size="sm" color="brightSun.4" className="mt-1" />
                        </div>
                    </div>
                    <div className="text-mine-shaft-300 text-base leading-relaxed italic font-light relative">
                        <span className="text-4xl text-mine-shaft-800 absolute -top-4 -left-2 font-serif">"</span>
                        <span className="relative z-10 pl-4">{data.testimonial}</span>
                    </div>
                </div>
            ))}
        </div>
    </section>
}
export default Testimonials;