import { Toaster } from "sonner"


const NotificationToaster = () => {
    return <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
            classNames: {
                toast: "rounded-xl border border-border shadow-md",
                title: "font-semibold",
            },
        }}
    />
}

export default NotificationToaster;
