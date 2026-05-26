import Companies from "../Components/LandingPage/Companies";
import DreamJob from "../Components/LandingPage/DreamJob";
import JobCategory from "../Components/LandingPage/JobCategory";
import Subscribe from "../Components/LandingPage/Subscribe";
import Testimonials from "../Components/LandingPage/Testimonials";
import Working from "../Components/LandingPage/Working";

import { Helmet } from "react-helmet-async";

const HomePage=()=>{
    return (
        <main className="min-h-[90vh] bg-mine-shaft-950 font-['poppins']">
            <Helmet>
                <title>Home | CareerConnect</title>
                <meta name="description" content="Discover your dream job with CareerConnect. The best platform to find professionals, companies, and jobs tailored to your skills." />
            </Helmet>
            <DreamJob/>
            <Companies/>
            <JobCategory/>
            <Working/>
            <Testimonials/>
            <Subscribe/>
        </main>
    )
}
export default HomePage;