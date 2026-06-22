import { Anchor, Button, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core";
import { IconAt, IconLock, IconShieldLock } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginValidation } from "../Services/FormValidation";
import { errorNotification, successNotification } from "../Services/NotificationService";
import { useDispatch } from "react-redux";
import { setUser } from "../Slices/UserSlice";
import { setJwt } from "../Slices/JwtSlice";
import { loginUser } from "../Services/AuthService";
import { jwtDecode } from "jwt-decode";

const AdminLoginPage = () => {
    const dispatch = useDispatch();
    const form = {
        email: "",
        password: "",
    };
    const [data, setData] = useState<{ [key: string]: string }>(form);
    const [formError, setFormError] = useState<{ [key: string]: string }>(form);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event: any) => {
        setFormError({ ...formError, [event.target.name]: "" });
        setData({ ...data, [event.target.name]: event.target.value });
    };

    const handleSubmit = () => {
        let valid = true, newFormError: { [key: string]: string } = {};
        for (let key in data) {
            newFormError[key] = loginValidation(key, data[key]);
            if (newFormError[key]) valid = false;
        }
        setFormError(newFormError);

        if (valid) {
            setLoading(true);
            loginUser(data).then((res) => {
                const decoded: any = jwtDecode(res.jwt);
                
                // Strict Admin Verification
                if (decoded.accountType !== 'ADMIN') {
                    errorNotification("Access Denied", "This portal is strictly for administrators.");
                    setLoading(false);
                    return;
                }

                successNotification("Admin Verified", "Entering secure portal...");
                dispatch(setJwt(res.jwt));
                dispatch(setUser({ ...decoded, email: decoded.sub }));
                
                setTimeout(() => {
                    navigate("/admin/dashboard");
                }, 2000);
            }).catch((err) => {
                console.log(err);
                errorNotification("Authentication Failed", err.response?.data?.errorMessage || "Invalid credentials");
                setLoading(false);
            });
        }
    };

    return (
        <div className="min-h-screen bg-mine-shaft-950 flex items-center justify-center p-5 font-['poppins'] relative">
            <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
                loaderProps={{ color: 'brightSun.4', type: 'bars' }}
            />
            
            <div data-aos="fade-up" className="max-w-md w-full glass-card p-10 sm-mx:p-5 rounded-2xl flex flex-col gap-6 shadow-[0_0_20px_2px_rgba(255,212,59,0.1)] border border-mine-shaft-800">
                <div className="flex flex-col items-center mb-4 text-bright-sun-400">
                    <IconShieldLock size={56} stroke={1.5} className="mb-2" />
                    <div className="text-3xl font-bold text-mine-shaft-100">Admin Portal</div>
                    <div className="text-sm text-mine-shaft-400 mt-1">Restricted Access Only</div>
                </div>

                <TextInput 
                    value={data.email} 
                    error={formError.email} 
                    name="email" 
                    onChange={handleChange} 
                    leftSection={<IconAt size={16} />} 
                    label="Admin Email" 
                    withAsterisk 
                    placeholder="admin@jobhook.com" 
                    styles={{ input: { backgroundColor: 'var(--mantine-color-mine-shaft-900)' } }}
                />
                
                <PasswordInput 
                    value={data.password} 
                    error={formError.password} 
                    name="password" 
                    onChange={handleChange} 
                    leftSection={<IconLock size={16} />} 
                    label="Master Password" 
                    withAsterisk 
                    placeholder="Enter secure password" 
                    styles={{ input: { backgroundColor: 'var(--mantine-color-mine-shaft-900)' } }}
                />
                
                <Button 
                    loading={loading} 
                    onClick={handleSubmit} 
                    color="brightSun.4"
                    size="md"
                    className="mt-4 hover:shadow-[0_0_10px_1px_rgba(255,212,59,0.4)] transition-shadow"
                >
                    Authenticate
                </Button>
                
                <Anchor 
                    component="button"
                    type="button"
                    className="text-center text-mine-shaft-500 hover:text-bright-sun-400 text-sm mt-2 transition-colors"
                    onClick={() => navigate("/")}
                >
                    &larr; Return to Public Site
                </Anchor>
            </div>
        </div>
    );
};

export default AdminLoginPage;
