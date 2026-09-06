import { USER_ENDPOINTS } from "../../constants";
import type { IHttpClient } from "../../../shared/interfaces/http/clients";
import { formatString } from "../../../shared/utils/strings.utils";
import type {
    UserDeleteDataResponseSchema,
    UserExportDataResponseSchema,
    UserListResponseSchema,
    UserMeResponseSchema,
    UserMeTenantResponseSchema,
    UserRoleUpdateResponseSchema,
} from "../../schemas/output/user";
import type { PasswordChangeType, UserListQueryParams, UserMeType, UserRoleUpdateType } from "../../schemas/input/user.schemas";
import type { SimpleMessageResponseSchema } from "../../../shared/schemas/output/responses.schemas";

class UserAPI {
    private httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    getProfile(): Promise<UserMeResponseSchema> {
        return this.httpClient.get(USER_ENDPOINTS.getProfile);
    }

    editProfile(data: UserMeType): Promise<UserMeResponseSchema> {
        return this.httpClient.put(USER_ENDPOINTS.editProfile, { ...data });
    }

    changePassword(data: PasswordChangeType): Promise<SimpleMessageResponseSchema> {
        return this.httpClient.post(USER_ENDPOINTS.changePassword, { ...data });
    }

    updateRole(userId: string, data: UserRoleUpdateType): Promise<UserRoleUpdateResponseSchema> {
        return this.httpClient.put(formatString(USER_ENDPOINTS.updateRole, { userId }), { ...data });
    }

    getList(queryParams: UserListQueryParams): Promise<UserListResponseSchema> {
        const params = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value)
        )
        return this.httpClient.get(USER_ENDPOINTS.getUsersList, params);
    }

    getById(userId: string): Promise<UserMeResponseSchema> {
        return this.httpClient.get(formatString(USER_ENDPOINTS.getUser, { userId }));
    }

    delete(userId: string): Promise<string> {
        return this.httpClient.delete(formatString(USER_ENDPOINTS.deleteUser, { userId }));
    }

    exportData(): Promise<UserExportDataResponseSchema> {
        return this.httpClient.get(USER_ENDPOINTS.exportData);
    }

    deleteData(): Promise<UserDeleteDataResponseSchema> {
        return this.httpClient.delete(USER_ENDPOINTS.deleteUserData);
    }

    getMyTenant(): Promise<UserMeTenantResponseSchema> {
        return this.httpClient.get(USER_ENDPOINTS.getMyTenant);
    }
}

export default UserAPI;
