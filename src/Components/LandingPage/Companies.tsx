import Marquee from "react-fast-marquee";
import { companies } from "../../Data/Data";

const Companies = () => {
    return <section className="mt-8 pb-10 relative">
        <h2 className="text-center text-xl font-medium text-mine-shaft-400 mb-8 uppercase tracking-widest">
            Trusted by Industry Leaders
        </h2>
        
        {/* Marquee with fading edges for a seamless look */}
        <div className="relative max-w-7xl mx-auto">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-mine-shaft-950 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-mine-shaft-950 to-transparent z-10"></div>
            
            <Marquee pauseOnHover={true} gradient={false} speed={40}>
                {companies.map((company, index) => (
                    <div 
                        key={index} 
                        className="mx-12 sm-mx:mx-6 px-4 py-3 rounded-xl hover:bg-mine-shaft-900/50 transition-colors duration-300 cursor-pointer grayscale opacity-60 hover:grayscale-0 hover:opacity-100 flex items-center justify-center"
                    >
                        <img 
                            className="h-14 sm-mx:h-10 object-contain" 
                            src={`/Companies/${company}.png`} 
                            alt={`${company} Logo`} 
                        />
                    </div>
                ))}
            </Marquee>
        </div>
    </section>
}
export default Companies;