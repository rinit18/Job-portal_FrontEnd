import { Button, TextInput } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";

const Subscribe = () => {
    return <section className="mt-20 flex items-center justify-center bg-mine-shaft-950 pb-20 px-4">
        <div data-aos="zoom-in" className="relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Stunning Radial Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-mine-shaft-900 to-mine-shaft-950 z-0"></div>
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-bright-sun-400/20 rounded-full blur-[100px] z-0"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-teal-400/10 rounded-full blur-[120px] z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex md-mx:flex-col items-center justify-between p-12 sm-mx:p-8 gap-8 backdrop-blur-xl border border-white/5 rounded-3xl">
                <div className="text-left md-mx:text-center w-3/5 md-mx:w-full">
                    <h2 className="text-4xl sm-mx:text-3xl font-extrabold text-mine-shaft-100 leading-tight mb-4 tracking-tight drop-shadow-md">
                        Never Miss a <span className="text-transparent bg-clip-text bg-gradient-to-r from-bright-sun-400 to-yellow-300">Great Opportunity</span>
                    </h2>
                    <p className="text-lg sm-mx:text-base text-mine-shaft-300 font-light leading-relaxed max-w-lg md-mx:mx-auto">
                        Subscribe to our newsletter and be the first to know about the latest jobs, industry insights, and career tips directly in your inbox.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-2/5 md-mx:w-full max-w-md">
                    <div className="flex sm-mx:flex-col gap-3 p-2 bg-mine-shaft-950/50 rounded-2xl border border-mine-shaft-800 shadow-inner focus-within:border-bright-sun-400/40 transition-colors">
                        <TextInput
                            placeholder="Enter your email address"
                            variant="unstyled"
                            className="flex-1"
                            classNames={{ input: 'px-4 py-2 font-medium text-mine-shaft-100 placeholder:text-mine-shaft-500' }}
                        />
                        <Button 
                            className="bg-gradient-to-r from-bright-sun-400 to-yellow-500 hover:from-bright-sun-500 hover:to-yellow-600 text-mine-shaft-950 font-bold rounded-xl px-6 h-12 shadow-[0_5px_15px_rgba(250,204,21,0.25)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                            rightSection={<IconArrowRight size={18} stroke={2.5}/>}
                        >
                            Subscribe
                        </Button>
                    </div>
                    <p className="text-xs text-mine-shaft-500 text-center font-medium tracking-wide">
                        Join 10,000+ professionals. No spam, ever.
                    </p>
                </div>
            </div>
        </div>
    </section>
}
export default Subscribe;