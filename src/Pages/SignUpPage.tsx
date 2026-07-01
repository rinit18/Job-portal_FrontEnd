import { IconAnchor, IconArrowLeft } from "@tabler/icons-react"
import SignUp from "../Components/SignUpLogin/SignUp"
import Login from "../Components/SignUpLogin/Login";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";

const SignUpPage = () => {
    const location=useLocation();
    const navigate=useNavigate();
    const isSignup = location.pathname === '/signup';
    return <div data-aos="zoom-out" className={`min-h-[100dvh] w-screen overflow-hidden relative bg-mine-shaft-950`}>
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
        </div>

        <Button size="sm" className="!absolute left-5 top-4 z-20" onClick={() => navigate("/")} my="lg" color="brightSun.4" leftSection={<IconArrowLeft size={20} />} variant="light">Home</Button>

        {/* 
          Slider: 3 panels each w-1/2 on desktop (total = 150vw)
          Login at 0%, Branding at 50%, SignUp at 100%
          On /login → show Login (translateX = 0)
          On /signup → shift by -66.666% (2/3 of container) to show SignUp
          On mobile: each panel is w-full (100vw total 300%), shift -200% for signup
        */}
        <div className={`flex [&>*]:flex-shrink-0 transition-all relative ease-in-out duration-1000 z-10 h-[100dvh]
            ${isSignup ? 'sm-mx:-translate-x-[200%] -translate-x-[66.666%]' : 'translate-x-0'}`}>
            <Login/>
            <div className={`w-1/2 sm-mx:w-full h-full sm-mx:hidden transition-all duration-1000 flex items-center gap-5 justify-center flex-col 
                ${isSignup ? 'rounded-r-[150px]' : 'rounded-l-[150px]'} 
                bg-mine-shaft-900/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-x border-mine-shaft-800/60`}>
                <div className="flex gap-2 items-center text-bright-sun-400 drop-shadow-lg">
                    <IconAnchor className="h-16 w-16" stroke={2.5} />
                    <div className="text-6xl bs-mx:text-5xl md-mx:text-4xl sm-mx:text-3xl font-bold tracking-tight">{WEBSITE_CONFIG.name}</div>
                </div>
                <div className="text-2xl bs-mx:text-xl md-mx:text-lg text-mine-shaft-200 font-medium tracking-wide">Find the job made for you</div>
            </div>
        <SignUp  />
        </div>
    </div>
}
export default SignUpPage