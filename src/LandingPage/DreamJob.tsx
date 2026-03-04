import { TextInput, Avatar } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const DreamJob = () => {
    return (
        <div className="flex flex-col md:flex-row items-center px-4 md:px-16 gap-8 md:gap-0">
            {/* Left Content Section - Mobile First */}
            <div className="flex flex-col w-full md:w-[45%] gap-3 order-2 md:order-1">
                <h1 className="text-4xl md:text-6xl font-bold leading-snug md:leading-tight text-mine-shaft-100">
                    Find your <span className="text-bright-sun-400">Dream</span>{' '}
                    <span className="text-bright-sun-400">job</span> with us
                </h1>
                
                <p className="text-base md:text-lg text-mine-shaft-200">
                    Good life begins with a good company. Start exploring thousands of jobs in one place.
                </p>

                {/* Search Inputs - Stack vertically on mobile */}
                <div className="flex flex-col md:flex-row gap-3 mt-5">
                    <TextInput
                        className="bg-mine-shaft-900 rounded-lg p-1 px-2 text-mine-shaft-100 [&_input]:text-mine-shaft-100"
                        variant="unstyled"
                        label="Job Title"
                        placeholder="Software Engineer"
                    />
                    <TextInput
                        className="bg-mine-shaft-900 rounded-lg p-1 px-2 text-mine-shaft-100 [&_input]:text-mine-shaft-100"
                        variant="unstyled"
                        label="Job Type"
                        placeholder="Full Time"
                    />
                    <div className="flex items-center justify-center w-full md:w-20 h-12 md:h-auto bg-bright-sun-400 rounded-lg p-2 hover:bg-bright-sun-500 cursor-pointer">
                        <IconSearch className="h-6 w-6 md:h-[85%] md:w-[85%] text-white" />
                    </div>
                </div>
            </div>

            {/* Right Image Section - Full width on mobile */}
            <div className="w-full md:w-[55%] flex justify-center items-center order-1 md:order-2">
                <div className="w-full md:w-[30rem] relative">
                    <img 
                        src="/boy.png" 
                        alt="Career illustration" 
                        className="w-full h-auto"
                    />

                    {/* Mobile-adjusted badges */}
                    <div className="absolute right-0 md:-right-10 top-[40%] md:top-[50%] border-bright-sun-400 border rounded-lg p-2 backdrop-blur-md bg-black/30 max-w-[45%] md:max-w-none">
                        <div className="text-center mb-1 text-xs md:text-sm text-mine-shaft-100">10k+ Got Job</div>
                        <Avatar.Group spacing="sm">
                            <Avatar src="/avatar.png" alt="User 1" radius="xl" size="sm" />
                            <Avatar src="/avatar1.png" alt="User 2" radius="xl" size="sm" />
                            <Avatar src="/avatar2.png" alt="User 3" radius="xl" size="sm" />
                            <Avatar radius="xl" size="sm">+9K</Avatar>
                        </Avatar.Group>
                    </div>

                    <div className="absolute left-0 md:-left-5 top-[15%] md:top-[27%] border-bright-sun-400 border rounded-lg p-2 backdrop-blur-md bg-black/30 max-w-[90%] md:max-w-none">
                        <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 md:w-10 md:h-10 p-1 bg-mine-shaft-900 rounded-lg flex items-center justify-center">
                                <img 
                                    src="Google.png" 
                                    alt="Google logo" 
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="text-xs md:text-sm">
                                <div>Software Engineer</div>
                                <div className="text-mine-shaft-200 text-[0.6rem] md:text-xs">Kolkata</div>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-around text-mine-shaft-200 text-[0.6rem] md:text-xs mt-1 md:mt-2">
                            <span>1 day ago</span>
                            <span>120 Apps</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DreamJob;