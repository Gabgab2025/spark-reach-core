/**
 * api/auth.ts — Authentication API calls
 */
import { api } from "../api-client";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    full_name?: string;
}

export interface AuthUser {
    id: string;
    email: string;
    full_name?: string;
    role: string;
    created_at: string;
}

export interface TokenResponse {
    access_token: string;
    expires_in: number;
    user: AuthUser;
}

export interface SessionResponse {
    session: TokenResponse | null;
}

export const authApi = {
    login: (data: LoginRequest) =>
        api.post<SessionResponse>("/api/auth/login", data),

    signup: (data: SignupRequest) =>
        api.post<SessionResponse>("/api/auth/signup", data),

    logout: () =>
        api.post<{ message: string }>("/api/auth/logout", {}),

    getSession: () =>
        api.get<SessionResponse>("/api/auth/session"),

    getMyRole: () =>
        api.get<{ role: string; user_id: string }>("/api/user_roles/me"),
};
