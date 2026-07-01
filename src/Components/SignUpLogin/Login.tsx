import { Button, LoadingOverlay, PasswordInput, TextInput } from "@mantine/core";
import { IconAt, IconLock } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginValidation } from "../../Services/FormValidation";
import { useDisclosure } from "@mantine/hooks";
import ResetPassword from "./ResetPassword";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { useDispatch } from "react-redux";
import { setUser } from "../../Slices/UserSlice";
import { setJwt } from "../../Slices/JwtSlice";
import { loginUser } from "../../Services/AuthService";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    const dispatch = useDispatch();
    const form = { email: "", password: "" };
    const [opened, { open, close }] = useDisclosure(false);
    const [data, setData] = useState<{ [key: string]: string }>(form);
    const [formError, setFormError] = useState<{ [key: string]: string }>(form);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event: any) => {
        setFormError({ ...formError, [event.target.name]: "" });
        setData({ ...data, [event.target.name]: event.target.value });
    }

    const handleSubmit = () => {
        let valid = true;
        let newFormError: { [key: string]: string } = {};
        for (let key in data) {
            newFormError[key] = loginValidation(key, data[key]);
            if (newFormError[key]) valid = false;
        }
        setFormError(newFormError);
        if (valid) {
            setLoading(true);
            loginUser(data).then((res) => {
                successNotification("Login Successful", "Redirecting to home page...");
                dispatch(setJwt(res.jwt));
                const decoded = jwtDecode(res.jwt);
                dispatch(setUser({ ...decoded, email: decoded.sub }));
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
                const errorMessage = err.response?.data?.errorMessage || "Could not connect to the server. Please try again later.";
                errorNotification("Login Failed", errorMessage);
            });
        }
    }

    return (
        <div className="w-full max-w-md px-10 sm-mx:px-6 flex flex-col gap-4">
            <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} loaderProps={{ color: 'brightSun.4', type: 'bars' }} />
            <div className="text-3xl font-bold tracking-tight mb-2">Welcome Back</div>
            <TextInput
                value={data.email}
                error={formError.email}
                name="email"
                onChange={handleChange}
                leftSection={<IconAt size={16} />}
                label="Email"
                withAsterisk
                placeholder="Your email"
                size="md"
            />
            <PasswordInput
                value={data.password}
                error={formError.password}
                name="password"
                onChange={handleChange}
                leftSection={<IconLock size={16} />}
                label="Password"
                withAsterisk
                placeholder="Password"
                size="md"
            />
            <Button
                loading={loading}
                onClick={handleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoContrast
                variant="filled"
                size="md"
                className="mt-2"
            >
                Login
            </Button>
            <div className="text-center sm-mx:text-sm">
                Don't have an account?{" "}
                <span
                    className="text-bright-sun-400 hover:underline cursor-pointer"
                    onClick={() => { navigate("/signup"); setFormError(form); setData(form); }}
                >
                    SignUp
                </span>
            </div>
            <div
                className="text-bright-sun-400 sm-mx:text-sm hover:underline cursor-pointer text-center"
                onClick={open}
            >
                Forget Password?
            </div>
            <ResetPassword opened={opened} close={close} />
        </div>
    );
}
export default Login;