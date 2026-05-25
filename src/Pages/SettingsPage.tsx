import { Divider } from "@mantine/core";
import Settings from "../Components/Settings/Settings";

const SettingsPage = () => {
    return (
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins']">
            <Divider size="xs" mx="md" />
            <Settings />
        </div>
    );
};

export default SettingsPage;
