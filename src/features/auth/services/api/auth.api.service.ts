import { AUTH_ENDPOINTS } from "../../constants";
import type { IHttpClient } from "../../../shared/interfaces/http/clients";
import type {
    LoginResponseSchema,
    RegisterInviteResponseSchema,
    RegisterResponseSchema,
    WebSocketTokenResponseSchema,
} from "../../schemas/output/authentication";
import type {
    LoginType,
    RegisterInviteType,
    RegisterType,
} from "../../schemas/input/authentication.schemas";


class AuthAPI {
    private httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    logIn(data: LoginType): Promise<LoginResponseSchema> {
        return this.httpClient.post(AUTH_ENDPOINTS.logIn, { ...data });
    }

    logOut(): Promise<void> {
        return this.httpClient.post(AUTH_ENDPOINTS.logOut, {});
    }

    registerTenant(data: RegisterType): Promise<RegisterResponseSchema> {
        return this.httpClient.post(AUTH_ENDPOINTS.registerTenant, { ...data });
    }

    inviteToTenant(data: RegisterInviteType): Promise<RegisterInviteResponseSchema> {
        return this.httpClient.post(AUTH_ENDPOINTS.inviteToTenant, { ...data });
    }

    // refreshToken(data: any): Promise<Result<RefreshTokenResponseSchema, StandardErrorResponseSchema>> {
    //     const response = await this.httpClient.post(AUTH_ENDPOINTS.refreshToken, { ...data });
    //     if (!response.ok) {
    //         return Result.fail(response.error);
    //     }
    //     return Result.ok(response.data);
    // }

    getWebSocketToken(): Promise<WebSocketTokenResponseSchema> {
        return this.httpClient.get(AUTH_ENDPOINTS.getWebSocketToken);
    }
}

export default AuthAPI;
