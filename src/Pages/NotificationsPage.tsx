import { Divider } from "@mantine/core";
import Notifications from "../Components/Notifications/Notifications";

const NotificationsPage = () => {
    return (
        <div className="min-h-[90vh] bg-mine-shaft-950 font-['poppins'] pb-20">
            <Divider size="xs" mx="md" />
            <div className="flex gap-5 justify-around mt-4">
                <Notifications />
            </div>
        </div>
    );
}

export default NotificationsPage;
