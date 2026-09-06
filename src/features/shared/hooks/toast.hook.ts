import { Toast } from "@lib/utils/notifications";

const useToast = () => {

    return {
        success: Toast.success,
        error: Toast.error,
        warning: Toast.warning,
    }
}

export default useToast;
