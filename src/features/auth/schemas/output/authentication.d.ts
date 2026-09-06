import type { SimpleMessageResponseSchema } from "../../../shared/schemas/output/responses.schemas";

export type LoginResponseSchema = SimpleMessageResponseSchema & {};

export type RegisterResponseSchema = {
  id: string
  created_at: string
  name: string
  dni: string
  email: string
  role: string
  is_active: boolean
  tenant_id: string
};

export type RegisterInviteResponseSchema = {
    id: string
    created_at: string
    name: string
    dni: string
    email: string
    role: string
    is_active: boolean
    tenant_id: string
};

export type RefreshTokenResponseSchema = {
    access_token: string
    refresh_token: string
};

export type WebSocketTokenResponseSchema = {
    ws_token: string
};
