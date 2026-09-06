import ky, { type KyInstance, type ResponsePromise, type Options, type NormalizedOptions, isHTTPError } from "ky";

import type { IHttpClient } from "../../../interfaces/http/clients";
import { StandardErrorResponseSchema, type ErrorPayloadSchema, type ErrorResponseType } from "../../../schemas/output/responses.schemas";
import { queryClient } from "@lib/reactQuery.lib";
import { Toast } from "@lib/utils/notifications";
import { AUTH_ENDPOINTS } from "@auth/constants";

interface PendingRequest {
    request: () => ResponsePromise<Response>;
    resolve: (value: Response) => void;
    reject: (error: unknown) => void;
}

const API_URL = import.meta.env.VITE_API_URL
const RETRY_FLAG = "x-auth-retried";
let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

const buildErrorResponse = (data: ErrorResponseType): StandardErrorResponseSchema => {
    const errorPayload: ErrorPayloadSchema = {
        code: data.error?.code || "UNKNOWN_ERROR",
        message: data.error?.message || "An unexpected error occurred",
        details: data.error?.details || [],
    };
    return new StandardErrorResponseSchema(data?.success ?? false, errorPayload, data?.timestamp ?? new Date().toISOString());
};

const handleResponseError = async (response: Response) => {
    let error: StandardErrorResponseSchema;
    try {
        const data = await response.json() as ErrorResponseType;
        error = buildErrorResponse(data);
    } catch {
        // if (error instanceof StandardErrorResponseSchema) {
        //     throw error;
        // }
        error = buildErrorResponse({
            success: false,
            error: {
                code: "UNKNOWN_ERROR",
                message: `Estamos teniendo problemas, por favor intenta de nuevo más tarde.`,
                details: [],
            },
            timestamp: new Date().toISOString(),
        });
    }
    throw error
};
const refreshSession = async () => {
    await ky.post(`${API_URL}${AUTH_ENDPOINTS.refreshToken}`, {
        credentials: "include",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        },
    });
};

const retryRequest = (client: KyInstance, url: string, options: NormalizedOptions) => {
    return client(url, { ...options, headers: { ...options.headers, [RETRY_FLAG]: "true" } });
};

const handleExpiredSession = async (client: KyInstance, originalRequest: Request, response: Response, options: NormalizedOptions) => {
    try {
        await refreshSession();
        const requests = pendingRequests.slice();
        pendingRequests = [];
        await Promise.all(
            requests.map(async ({ request, resolve, reject }) => {
                try {
                    resolve(await request());
                } catch (error) {
                    reject(error);
                }
            }),
        );
        return retryRequest(client, originalRequest.url, options);
    } catch (error) {
        const requests = pendingRequests.slice();
        pendingRequests = [];
        for (const { reject } of requests) {
            reject(error);
        }
        queryClient.clear();
        Toast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
        setTimeout(() => {
            window.location.href = "/login";
        }, 2000);
        throw buildErrorResponse({
            success: false,
            error: {
                code: "EXPIRED_SESSION",
                message: "Sesión expirada. Por favor, inicie sesión nuevamente.",
                details: [],
            },
            timestamp: new Date().toISOString(),
        });
    }
};

class KyHttpClient implements IHttpClient {
    readonly client: KyInstance;

    constructor() {
        this.client = ky.create({
            baseUrl: API_URL,
            credentials: "include",
            hooks: {
                beforeRequest: [
                    async ({ request }) => {
                        request.headers.set("X-Requested-With", "XMLHttpRequest");
                    },
                ],
                afterResponse: [
                    async ({ request, response, options }) => {
                        if (!response.ok) {
                            const url = new URL(request.url);
                            const alreadyRetried = request.headers.get(RETRY_FLAG) === "true";
                            if (
                                response.status === 401 &&
                                !alreadyRetried &&
                                !["/auth/users/me", "/auth/users/me/tenant", AUTH_ENDPOINTS.refreshToken].includes(url.pathname)
                            ) {
                                if (isRefreshing) {
                                    return new Promise<Response>((resolve, reject) => {
                                        pendingRequests.push({
                                            request: () => retryRequest(this.client, url.toString(), options),
                                            resolve,
                                            reject,
                                        });
                                    });
                                }
                                isRefreshing = true;
                                return handleExpiredSession(this.client, request, response, options).finally(() => {
                                    isRefreshing = false;
                                });
                            }
                            await handleResponseError(response);
                        }
                        return response;
                    },
                ],
            },
        });
    }

    get<T>(url: string, queryParams: Record<string, any> = {}): Promise<T> {
        return this.client.get(url, { searchParams: queryParams }).json()
    }
    post<T>(url: string, body: Record<string, any>): Promise<T> {
        return this.client.post(url, { json: body }).json()
    }
    put<T>(url: string, body: Record<string, any>): Promise<T> {
        return this.client.put(url, { json: body }).json()
    }
    async delete<T>(url: string): Promise<T> {
        const response = await this.client.delete(url)
        if (response.ok) {
            return undefined as T
        }
        return response.json()
    }
}

export default new KyHttpClient();
