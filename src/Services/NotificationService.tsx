import { notifications } from "@mantine/notifications"
import { IconCheck, IconX } from "@tabler/icons-react"

const successNotification = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        withCloseButton: true,
        icon: <IconCheck style={{ width: "90%", height: "90%" }} />,
        color: "teal",
        withBorder: true,
        className: "!border-teal-500 !bg-mine-shaft-900/90 !backdrop-blur-md !shadow-lg !shadow-teal-900/20 !rounded-xl"
    })
}
const errorNotification = (title: string, message: string) => {
    notifications.show({
        title: title,
        message: message,
        withCloseButton: true,
        icon: <IconX style={{ width: "90%", height: "90%" }} />,
        color: "red",
        withBorder: true,
        className: "!border-red-500 !bg-mine-shaft-900/90 !backdrop-blur-md !shadow-lg !shadow-red-900/20 !rounded-xl"
    })
}
export {successNotification, errorNotification};