import { IconAnchor, IconArrowLeft } from "@tabler/icons-react"
import SignUp from "../Components/SignUpLogin/SignUp"
import Login from "../Components/SignUpLogin/Login";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";

const SignUpPage = () => {
    const location=useLocation();
    const navigate=useNavigate();
    return <div data-aos="zoom-out" className={`h-[100vh] w-[100vw] overflow-hidden sm-mx:overflow-y-auto relative bg-mine-shaft-950`}>
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
        </div>

        <Button size="sm" className="!absolute left-5 z-20" onClick={() => navigate("/")} my="lg" color="brightSun.4" leftSection={<IconArrowLeft size={20} />} variant="light">Home</Button>

        <div className={`flex [&>*]:flex-shrink-0 transition-all relative ease-in-out duration-1000 z-10 ${location.pathname==='/signup'?'-translate-x-1/2 sm-mx:-translate-x-full':'translate-x-0'}`}>
            <Login/>
            <div className={`w-1/2 h-[100vh] sm-mx:hidden sm-mx:min-h-full transition-all duration-1000 flex items-center gap-5 justify-center flex-col ${location.pathname==='/signup'?'rounded-r-[150px]':'rounded-l-[150px]'} bg-mine-shaft-900/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-x border-mine-shaft-800/60`}>
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