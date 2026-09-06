import type { ErrorResponseType } from "../schemas/output/responses.schemas";


interface MapErrorsProps {
    form: any;
    error: ErrorResponseType | Error;
}

export const mapErrors = ({ form, error }: MapErrorsProps) => {
    if (!Object.hasOwn(error, "error")) return;

    const result = error as ErrorResponseType
    result?.error?.details?.forEach((e) => {
        const field = e.field?.split(".").at(-1);
        form.setError(field as keyof typeof form.errors, { message: e.message! });
    });
};
