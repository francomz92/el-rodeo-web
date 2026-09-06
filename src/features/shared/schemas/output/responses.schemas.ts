interface ErrorDetailSchema {
    field?: string
    message?: string
}


export interface ErrorPayloadSchema {
    code?: string
    message?: string
    details?: ErrorDetailSchema[]
}

export class StandardErrorResponseSchema extends Error {
    success: boolean
    error: ErrorPayloadSchema
    timestamp: string
    name: string

    constructor(success: boolean, error: ErrorPayloadSchema, timestamp: string) {
        super(error.message)
        this.name = "StandardErrorResponseSchema"
        this.success = success
        this.error = error
        this.timestamp = timestamp
        Object.setPrototypeOf(this, StandardErrorResponseSchema.prototype)
    }

    hasFieldError(field: string): boolean {
        return this.error.details?.some(detail => detail.field === field) ?? false
    }

    getFieldError(field: string): string | undefined {
        return this.error.details?.find(detail => detail.field === field)?.message
    }
}

export type ErrorResponseType = {
    success?: boolean
    error?: {
        code?: string
        message?: string
        details?: {
            field?: string
            message?: string
        }[]
    }
    timestamp?: string
}

export interface SimpleMessageResponseSchema {
    message: string;
}
