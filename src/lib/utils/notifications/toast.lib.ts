import { toast } from "sonner";


class Toast {
    static success(message: string) {
        toast.success(message);
    }

    static error(message: string) {
        toast.error(message);
    }

    static warning(message: string) {
        toast.warning(message);
    }
}

export default Toast;
