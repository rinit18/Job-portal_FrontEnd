import { Button, PasswordInput, Switch, Modal, Divider, useMantineColorScheme } from "@mantine/core";
import { IconCheck, IconLock, IconMoon, IconSun, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassword, deleteAccount } from "../../Services/UserService";
import { errorNotification, successNotification } from "../../Services/NotificationService";
import { removeUser } from "../../Slices/UserSlice";
import { removeJwt } from "../../Slices/JwtSlice";

const Settings = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Password State
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [passLoading, setPassLoading] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handlePasswordChange = (e: any) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const submitPasswordUpdate = () => {
        if (passwords.newPassword !== passwords.confirmPassword) {
            errorNotification("Error", "New passwords do not match.");
            return;
        }
        setPassLoading(true);
        updatePassword({
            email: user.email,
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        }).then((res) => {
            successNotification("Success", "Password updated successfully.");
            setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
            setPassLoading(false);
        }).catch((err) => {
            errorNotification("Failed", err.response?.data?.errorMessage || "Could not update password.");
            setPassLoading(false);
        });
    };

    const confirmDeleteAccount = () => {
        setDeleteLoading(true);
        deleteAccount(user.email).then((res) => {
            successNotification("Account Deleted", "Your account and data have been permanently removed.");
            setDeleteLoading(false);
            dispatch(removeUser());
            dispatch(removeJwt());
            navigate("/login");
        }).catch((err) => {
            errorNotification("Failed", err.response?.data?.errorMessage || "Could not delete account.");
            setDeleteLoading(false);
            setDeleteModalOpen(false);
        });
    };

    return (
        <div className="w-full min-h-screen p-10 sm-mx:p-5 flex flex-col gap-8 text-mine-shaft-100">
            <h1 className="text-4xl font-bold mb-4">Account Settings</h1>

            {/* Appearance Section */}
            <section className="bg-mine-shaft-900/50 p-8 rounded-xl border border-mine-shaft-800">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <IconSun size={24} className="text-bright-sun-400" />
                    Appearance & Preferences
                </h2>
                <div className="flex justify-between items-center bg-mine-shaft-900 p-4 rounded-lg border border-mine-shaft-800">
                    <div>
                        <h3 className="font-medium text-lg">Theme</h3>
                        <p className="text-mine-shaft-300 text-sm">Toggle between light and dark mode</p>
                    </div>
                    <Switch 
                        size="lg" 
                        color="brightSun.4"
                        onLabel={<IconSun size={18} />} 
                        offLabel={<IconMoon size={18} />} 
                        checked={colorScheme === 'dark'}
                        onChange={() => toggleColorScheme()}
                    />
                </div>
            </section>

            {/* Security Section */}
            <section className="bg-mine-shaft-900/50 p-8 rounded-xl border border-mine-shaft-800">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <IconLock size={24} className="text-bright-sun-400" />
                    Security
                </h2>
                <div className="flex flex-col gap-4 max-w-md">
                    <h3 className="font-medium text-lg mb-2">Change Password</h3>
                    <PasswordInput 
                        label="Current Password" 
                        name="oldPassword"
                        value={passwords.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter current password" 
                    />
                    <PasswordInput 
                        label="New Password" 
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter new password" 
                    />
                    <PasswordInput 
                        label="Confirm New Password" 
                        name="confirmPassword"
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm new password" 
                    />
                    <Button 
                        loading={passLoading} 
                        onClick={submitPasswordUpdate} 
                        className="mt-2 w-fit" 
                        color="brightSun.4" 
                        variant="light"
                        disabled={!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword}
                    >
                        Update Password
                    </Button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-900/10 p-8 rounded-xl border border-red-900/30 mt-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-red-500">
                    <IconTrash size={24} />
                    Danger Zone
                </h2>
                <div className="flex justify-between items-center sm-mx:flex-col sm-mx:items-start sm-mx:gap-4">
                    <div>
                        <h3 className="font-medium text-lg">Delete Account</h3>
                        <p className="text-mine-shaft-300 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <Button 
                        color="red.6" 
                        variant="outline" 
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        Delete Account
                    </Button>
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            <Modal 
                opened={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)} 
                title={<div className="font-bold text-red-500 text-xl flex items-center gap-2"><IconTrash /> Delete Account</div>}
                centered
                overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
            >
                <div className="flex flex-col gap-6">
                    <p>Are you absolutely sure you want to permanently delete your account? All your profile data, applications, and saved jobs will be wiped instantly.</p>
                    <div className="flex gap-4">
                        <Button fullWidth variant="default" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                        <Button fullWidth color="red.6" loading={deleteLoading} onClick={confirmDeleteAccount}>Yes, Delete Everything</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Settings;
