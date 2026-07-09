
import { Button, LoadingOverlay, PasswordInput, Radio, TextInput } from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../Services/UserService";
import { signupValidation } from "../../Services/FormValidation";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useDispatch } from "react-redux";
import { setJwt } from "../../Slices/JwtSlice";
import { setUser } from "../../Slices/UserSlice";
import { jwtDecode } from "jwt-decode";

const SignUp = () => {
    const dispatch = useDispatch();
    const form = { name: "", email: "", password: "", confirmPassword: "", accountType: "APPLICANT" };
    const [data, setData] = useState<{ [key: string]: string }>(form);
    const [formError, setFormError] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

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

    // Directly validate form and register
    const handleRegister = () => {
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
        const signupData = { ...data };
        delete signupData.confirmPassword;
        
        registerUser(signupData).then(() => {
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
            if (err.config?.url?.includes('register')) {
                errorNotification("Registration Failed", msg);
            } else {
                // login failed after registration - redirect to login
                successNotification("Registered!", "Please log in with your credentials.");
                navigate("/login");
            }
        });
    };



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
            <Button loading={loading} onClick={handleRegister} autoContrast variant="filled" size="md" className="mt-2">Sign up</Button>
            <div className="text-center sm-mx:text-sm">
                Have an account?{" "}
                <span className="text-bright-sun-400 hover:underline cursor-pointer" onClick={() => { navigate("/login"); setFormError({}); setData(form); }}>Login</span>
            </div>
        </div>
    );
};
export default SignUp;