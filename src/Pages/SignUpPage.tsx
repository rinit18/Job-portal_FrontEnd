import { IconAnchor, IconArrowLeft } from "@tabler/icons-react"
import SignUp from "../Components/SignUpLogin/SignUp"
import Login from "../Components/SignUpLogin/Login";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import { WEBSITE_CONFIG } from "../config";

const SignUpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isSignup = location.pathname === '/signup';

    return (
        <div className="min-h-[100dvh] w-screen overflow-hidden relative bg-mine-shaft-950 flex">
            {/* Ambient background glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-bright-sun-400/5 blur-[120px]" />
            </div>

            <Button
                size="sm"
                className="!absolute left-5 top-4 z-20"
                onClick={() => navigate("/")}
                my="lg"
                color="brightSun.4"
                leftSection={<IconArrowLeft size={20} />}
                variant="light"
            >
                Home
            </Button>

            {/* Left: Auth Form Panel */}
            <div className="w-1/2 sm-mx:w-full flex items-center justify-center z-10 min-h-[100dvh]">
                {isSignup ? <SignUp /> : <Login />}
            </div>

            {/* Right: Branding Panel — hidden on mobile */}
            <div className={`w-1/2 sm-mx:hidden min-h-[100dvh] flex items-center gap-5 justify-center flex-col
                ${isSignup ? 'rounded-l-[150px]' : 'rounded-l-[150px]'}
                bg-mine-shaft-900/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border-l border-mine-shaft-800/60`}>
                <div className="flex gap-2 items-center text-bright-sun-400 drop-shadow-lg">
                    <IconAnchor className="h-16 w-16" stroke={2.5} />
                    <div className="text-6xl bs-mx:text-5xl md-mx:text-4xl font-bold tracking-tight">{WEBSITE_CONFIG.name}</div>
                </div>
                <div className="text-2xl bs-mx:text-xl md-mx:text-lg text-mine-shaft-200 font-medium tracking-wide text-center px-8">
                    {isSignup ? "Join thousands of professionals" : "Find the job made for you"}
                </div>
            </div>
        </div>
    );
}
export default SignUpPage;