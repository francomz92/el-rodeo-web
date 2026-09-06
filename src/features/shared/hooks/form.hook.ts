import { useForm, type UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const useFormHook = <T extends z.ZodObject<{ [key: string]: z.ZodType }>>(
    schema: T,
    options?: Omit<UseFormProps<z.infer<T>>, "resolver">,
) => {

    const {
        control,
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting, isValid, isDirty },
        watch,
        reset,
        setError,
    } = useForm({
        resolver: zodResolver(schema),
        ...options,
    });


    return {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        errors,
        isSubmitting,
        isValid,
        isDirty,
    };
};

export default useFormHook;
