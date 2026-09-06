export const AUTH_ENDPOINTS = {
    logIn: "/auth/login",
    logOut: "/auth/logout",
    registerTenant: "/auth/register",
    inviteToTenant: "/auth/invite",
    refreshToken: "/auth/refresh",
    getWebSocketToken: "/auth/ws-token",
}

export const USER_ENDPOINTS = {
    getProfile: "/auth/users/me",
    editProfile: "/auth/users/me",
    updateRole: "/auth/users/{userId}/role",
    changePassword: "/auth/password-change",
    getUsersList: "/auth/users",
    getUser: "/auth/users/{userId}",
    deleteUser: "/auth/users/{userId}",
    exportData: "/auth/users/me/export",
    deleteUserData: "/auth/users/me/data",
    getMyTenant: "/auth/users/me/tenant",
}



export const PUBLIC_AUTH_ROLES = {
    VIEWER: "viewer",
    EDITOR: "editor",
    ADMIN: "admin",
    OWNER: "owner",
}

export const AUTH_ROLES = {
    ...PUBLIC_AUTH_ROLES,
    SUPERADMIN: "super_admin",
}

export const SELECT_ROLE_OPTIONS = {
    Todos: "",
    Visualizador: PUBLIC_AUTH_ROLES.VIEWER,
    Editor: PUBLIC_AUTH_ROLES.EDITOR,
    Administrar: PUBLIC_AUTH_ROLES.ADMIN,
    Dueño: PUBLIC_AUTH_ROLES.OWNER,
};
