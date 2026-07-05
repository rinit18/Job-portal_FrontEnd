
import { Button, LoadingOverlay, PasswordInput, Radio, TextInput, PinInput } from "@mantine/core";
import { IconAt, IconLock, IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, sendRegistrationOtp, verifyOtp } from "../../Services/UserService";
import { signupValidation } from "../../Services/FormValidation";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useDispatch } from "react-redux";
import { setJwt } from "../../Slices/JwtSlice";
import { setUser } from "../../Slices/UserSlice";
import { jwtDecode } from "jwt-decode";
import { useInterval } from "@mantine/hooks";

const SignUp = () => {
    const dispatch = useDispatch();
    const form = { name: "", email: "", password: "", confirmPassword: "", accountType: "APPLICANT" };
    const [data, setData] = useState<{ [key: string]: string }>(form);
    const [formError, setFormError] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [time, setTime] = useState(60);
    const [resendLoader, setResendLoader] = useState(false);

    const interval = useInterval(() => {
        setTime((s) => {
            if (s <= 1) { setResendLoader(false); interval.stop(); return 60; }
            return s - 1;
        });
    }, 1000);

    const navigate = useNavigate();

    const handleChange = (event: any) => {
        if (typeof event === "string") {
            setData(prev => ({ ...prev, accountType: event }));
            return;
        }
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
        setFormError(prev => ({ ...prev, [name]: signupValidation(name, value) }));
        if (name === "password" && data.confirmPassword) {
            setFormError(prev => ({ ...prev, confirmPassword: data.confirmPassword !== value ? "Passwords do not match." : "" }));
        }
        if (name === "confirmPassword") {
            setFormError(prev => ({ ...prev, confirmPassword: data.password !== value ? "Passwords do not match." : "" }));
        }
    };

    // Step 1: Validate form and send OTP
    const handleSendOtp = () => {
        let valid = true;
        const newFormError: { [key: string]: string } = {};
        for (const key in data) {
            if (key === "accountType") continue;
            if (key !== "confirmPassword") newFormError[key] = signupValidation(key, data[key]);
            else if (data[key] !== data["password"]) newFormError[key] = "Passwords do not match.";
            if (newFormError[key]) valid = false;
        }
        setFormError(newFormError);
        if (!valid) return;

        setLoading(true);
        sendRegistrationOtp(data.email).then(() => {
            successNotification("OTP Sent", `Check your email ${data.email} for the code.`);
            setOtpSent(true);
            setResendLoader(true);
            interval.start();
        }).catch((err) => {
            errorNotification("Failed to Send OTP", err.response?.data?.errorMessage || "Server error. Please try again.");
        }).finally(() => setLoading(false));
    };

    // Step 2: Verify OTP and register
    const handleVerifyAndRegister = (otp: string) => {
        setLoading(true);
        verifyOtp(data.email, otp).then(() => {
            const signupData = { ...data };
            delete signupData.confirmPassword;
            return registerUser(signupData);
        }).then(() => {
            return loginUser({ email: data.email, password: data.password });
        }).then((loginRes) => {
            successNotification("Account Created!", "Welcome to CareerConnect!");
            dispatch(setJwt(loginRes.jwt));
            const decoded: any = jwtDecode(loginRes.jwt);
            dispatch(setUser({ ...decoded, email: decoded.sub }));
            setTimeout(() => navigate("/"), 1500);
        }).catch((err) => {
            setLoading(false);
            const msg = err.response?.data?.errorMessage || "Something went wrong. Please try again.";
            if (err.config?.url?.includes('verifyOtp')) {
                errorNotification("Invalid OTP", msg);
            } else if (err.config?.url?.includes('register')) {
                errorNotification("Registration Failed", msg);
                setOtpSent(false);
            } else {
                // login failed after registration - redirect to login
                successNotification("Registered!", "Please log in with your credentials.");
                navigate("/login");
            }
        });
    };

    const resendOtp = () => {
        if (resendLoader) return;
        setLoading(true);
        sendRegistrationOtp(data.email).then(() => {
            successNotification("OTP Resent", "Check your email for the new code.");
            setResendLoader(true);
            setTime(60);
            interval.start();
        }).catch((err) => {
            errorNotification("Failed to Resend", err.response?.data?.errorMessage || "Server error.");
        }).finally(() => setLoading(false));
    };

    // OTP Verification Screen
    if (otpSent) {
        return (
            <div className="w-full max-w-md px-10 sm-mx:px-6 flex flex-col gap-6 relative">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'brightSun.4', type: 'bars' }} />
                <Button size="sm" onClick={() => { setOtpSent(false); interval.stop(); setTime(60); }} my="sm" color="mineShaft.3" leftSection={<IconArrowLeft size={16} />} variant="transparent" className="self-start px-0 hover:bg-transparent hover:text-bright-sun-400">Back</Button>
                <div className="text-3xl sm-mx:text-2xl font-bold tracking-tight">Verify your email</div>
                <div className="text-sm text-mine-shaft-300 leading-relaxed">
                    We sent a 6-digit code to <span className="font-semibold text-bright-sun-400">{data.email}</span>. Enter it below to complete registration.
                </div>
                <PinInput onComplete={handleVerifyAndRegister} className="mx-auto" gap="sm" size="md" length={6} type="number" />
                <Button loading={loading} onClick={resendOtp} disabled={resendLoader} fullWidth color="brightSun.4" variant="light">
                    {resendLoader ? `Resend in ${time}s` : "Resend Code"}
                </Button>
            </div>
        );
    }

    // Registration Form
    return (
        <div className="w-full max-w-md px-10 sm-mx:px-6 flex flex-col gap-4 relative">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'brightSun.4', type: 'bars' }} />
            <div className="text-3xl sm-mx:text-2xl font-bold tracking-tight mb-2">Create Account</div>
            <TextInput value={data.name} error={formError.name} name="name" onChange={handleChange} label="Full Name" withAsterisk placeholder="Your name" size="md" />
            <TextInput error={formError.email} value={data.email} name="email" onChange={handleChange} leftSection={<IconAt size={16} />} label="Email" withAsterisk placeholder="Your email" size="md" />
            <PasswordInput value={data.password} error={formError.password} name="password" onChange={handleChange} leftSection={<IconLock size={16} />} label="Password" withAsterisk placeholder="Password" size="md" />
            <PasswordInput value={data.confirmPassword} error={formError.confirmPassword} name="confirmPassword" onChange={handleChange} leftSection={<IconLock size={16} />} label="Confirm Password" withAsterisk placeholder="Confirm password" size="md" />
            <Radio.Group value={data.accountType} onChange={handleChange} label="You are?" withAsterisk>
                <div className="flex gap-4 pt-2">
                    <Radio name="accountType" className="py-3 px-6 sm-mx:px-4 hover:bg-mine-shaft-900/50 border-mine-shaft-800 border rounded-xl has-[:checked]:!border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 transition-all" value="APPLICANT" label="Applicant" />
                    <Radio name="accountType" className="py-3 px-6 sm-mx:px-4 hover:bg-mine-shaft-900/50 border-mine-shaft-800 border rounded-xl has-[:checked]:!border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 transition-all" value="EMPLOYER" label="Employer" />
                </div>
            </Radio.Group>
            <Button loading={loading} onClick={handleSendOtp} autoContrast variant="filled" size="md" className="mt-2">Sign up</Button>
            <div className="text-center sm-mx:text-sm">
                Have an account?{" "}
                <span className="text-bright-sun-400 hover:underline cursor-pointer" onClick={() => { navigate("/login"); setFormError({}); setData(form); }}>Login</span>
            </div>
        </div>
    );
};
export default SignUp;