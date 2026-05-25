import Companies from "../Components/LandingPage/Companies";
import DreamJob from "../Components/LandingPage/DreamJob";
import JobCategory from "../Components/LandingPage/JobCategory";
import Subscribe from "../Components/LandingPage/Subscribe";
import Testimonials from "../Components/LandingPage/Testimonials";
import Working from "../Components/LandingPage/Working";

import { Helmet } from "react-helmet-async";

const HomePage=()=>{
    return (
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins']">
            <Helmet><title>Home | CareerConnect</title></Helmet>
            <DreamJob/>
            <Companies/>
            <JobCategory/>
            <Working/>
            <Testimonials/>
            <Subscribe/>
        </div>
    )
}
export default HomePage;