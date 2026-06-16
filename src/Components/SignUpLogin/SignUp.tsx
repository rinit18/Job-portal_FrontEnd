
import { Button, LoadingOverlay, PasswordInput, Radio, TextInput, PinInput, Group } from "@mantine/core";
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
    const form = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "APPLICANT"
    }
    const [data, setData] = useState<{[key:string]:string}>(form);
    const [formError, setFormError] = useState<{[key:string]:string}>(form);
    const [loading, setLoading] = useState(false);
    
    // OTP States
    const [otpSent, setOtpSent] = useState(false);
    const [time, setTime] = useState(60);
    const [resendLoader, setResendLoader] = useState(false);
    
    const interval = useInterval(() => {
        if (time === 0) {
            setResendLoader(false);
            setTime(60);
            interval.stop();
        } else {
            setTime((s) => s - 1);
        }
    }, 1000);

    const navigate=useNavigate();
    const handleChange = (event: any) => {
        if (typeof (event) == "string") {
            setData({ ...data, accountType: event });
            return;
        }
        let name = event.target.name, value = event.target.value;
        setData({ ...data, [name]: value });
        setFormError({ ...formError, [name]: signupValidation(name, value) });
        if (name === "password" && data.confirmPassword !== "") {
            let err="";
            if (data.confirmPassword !== value) err= "Passwords do not match." ;
            setFormError({ ...formError, [name]: signupValidation(name, value) , confirmPassword:err });
        }
        if (name === "confirmPassword") {
            if (data.password !== value) setFormError({ ...formError, [name]: "Passwords do not match." });
            else setFormError({ ...formError, confirmPassword: "" });
        }
    }
    const handleSubmit = () => {
        setLoading(true);
        let valid=true, newFormError:{[key:string]:string}={};
        for(let key in data){
            if(key==="accountType")continue;
            if(key!=="confirmPassword")newFormError[key]=signupValidation(key, data[key]);
            else if(data[key]!==data["password"])newFormError[key]="Passwords do not match.";
            if(newFormError[key])valid=false;
        }
        setFormError(newFormError);
        if(valid===true){
            setLoading(true);
            sendRegistrationOtp(data.email).then((res) => {
                successNotification("OTP Sent", "Check your email for the verification code.");
                setOtpSent(true);
                setLoading(false);
                setResendLoader(true);
                interval.start();
            }).catch((err) => {
                console.log(err);
                setLoading(false);
                const errorMessage = err.response?.data?.errorMessage || "Could not connect to the server.";
                errorNotification("Failed to send OTP", errorMessage);
            });
        } else {
            setLoading(false);
        }
    }

    const resendOtp = () => {
        if (resendLoader) return;
        setLoading(true);
        sendRegistrationOtp(data.email).then((res) => {
            successNotification("OTP Sent", "Check your email for the verification code.");
            setLoading(false);
            setResendLoader(true);
            interval.start();
        }).catch((err) => {
            setLoading(false);
            errorNotification("Failed to resend OTP", err.response?.data?.errorMessage || "Server error.");
        });
    }

    const handleVerifyAndRegister = (otp: string) => {
        setLoading(true);
        verifyOtp(data.email, otp).then((res) => {
            // OTP verified, now register
            registerUser(data).then((regRes) => {
                // Registered successfully, auto-login
                loginUser({email: data.email, password: data.password}).then((loginRes) => {
                    successNotification("Account Created!", "You are now logged in.");
                    dispatch(setJwt(loginRes.jwt));
                    const decoded = jwtDecode(loginRes.jwt);
                    dispatch(setUser({...decoded, email: decoded.sub}));
                    setTimeout(() => {
                        navigate("/");
                        setLoading(false);
                    }, 2000);
                }).catch((loginErr) => {
                    // Fallback to manual login if auto-login fails
                    successNotification("Registered Successfully", "Please log in.");
                    navigate("/login");
                    setLoading(false);
                });
            }).catch((regErr) => {
                setLoading(false);
                errorNotification("Registration Failed", regErr.response?.data?.errorMessage || "Server error.");
            });
        }).catch((err) => {
            setLoading(false);
            errorNotification("OTP Verification Failed", err.response?.data?.errorMessage || "Invalid OTP");
        });
    }

    if (otpSent) {
        return (
            <div className="w-1/2 sm-mx:py-10 sm-mx:w-full px-20 bs-mx:px-10 md-mx:px-5 flex flex-col gap-6 justify-center">
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'brightSun.4', type: 'bars' }} />
                
                <Button size="sm" onClick={() => {setOtpSent(false); interval.stop(); setTime(60);}} my="sm" color="mineShaft.3" leftSection={<IconArrowLeft size={16} />} variant="transparent" className="self-start px-0 hover:bg-transparent hover:text-bright-sun-400">Back</Button>

                <div className="text-3xl sm-mx:text-2xl xs-mx:text-xl font-bold tracking-tight mb-2">Verify your email</div>
                <div className="text-sm text-mine-shaft-200">We've sent a 6-digit code to <span className="font-semibold text-bright-sun-400">{data.email}</span>. Please enter it below to complete registration.</div>
                
                <PinInput onComplete={handleVerifyAndRegister} className="mx-auto" gap="sm" size="md" length={6} type="number" />
                
                <div className="flex gap-2 mt-4">
                    <Button loading={loading} onClick={resendOtp} fullWidth color="brightSun.4" variant="light">{resendLoader ? `Resend in ${time}s` : "Resend Code"}</Button>
                </div>
            </div>
        );
    }
    return <><LoadingOverlay
    visible={loading}
    zIndex={1000}
    />
  <div className="w-1/2 sm-mx:py-10 sm-mx:w-full px-20 bs-mx:px-10 md-mx:px-5 flex flex-col gap-4 justify-center">
        <div className="text-3xl sm-mx:text-2xl xs-mx:text-xl font-bold tracking-tight mb-2">Create Account</div>
        <TextInput value={data.name} error={formError.name} name="name" onChange={handleChange} label="Full Name" withAsterisk placeholder="Your name" size="md" />
        <TextInput error={formError.email} value={data.email} name="email" onChange={handleChange} leftSection={<IconAt size={16} />} label="Email" withAsterisk placeholder="Your email" size="md" />
        <PasswordInput value={data.password} error={formError.password} name="password" onChange={handleChange} leftSection={<IconLock size={16} />} label="Password" withAsterisk placeholder="Password" size="md" />

        <PasswordInput value={data.confirmPassword} error={formError.confirmPassword} name="confirmPassword" onChange={handleChange} leftSection={<IconLock size={16} />} label="Confirm Password" withAsterisk placeholder="Confirm password" size="md" />
        <Radio.Group
            value={data.accountType}
            onChange={handleChange}
            label="You are?"
            withAsterisk
        >
            <div className="flex gap-4 xs-mx:gap-3 pt-2">
                <Radio name="accountType" className="py-3 px-6 sm-mx:px-4 sm-mx:py-3 hover:bg-mine-shaft-900/50 border-mine-shaft-800 border rounded-xl has-[:checked]:!border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 transition-all" value="APPLICANT" label="Applicant" />
                <Radio name="accountType" className="py-3 px-6 sm-mx:px-4 sm-mx:py-3 hover:bg-mine-shaft-900/50 border-mine-shaft-800 border rounded-xl has-[:checked]:!border-bright-sun-400 has-[:checked]:bg-bright-sun-400/5 transition-all" value="EMPLOYER" label="Employer" />
            </div>
        </Radio.Group>
        <Button loading={loading} onClick={handleSubmit} autoContrast variant="filled" size="md" className="mt-2">Sign up</Button>
        <div className="text-center sm-mx:text-sm xs-mx:text-sm">Have an account?  <span className="text-bright-sun-400 hover:underline cursor-pointer sm-mx:text-sm xs-mx:text-sm" onClick={()=>{navigate("/login");setFormError(form) ;setData(form)}}>Login</span> </div>

    </div></>
}
export default SignUp;