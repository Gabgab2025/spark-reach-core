/**
 * api-client.ts
 *
 * A strongly-typed fetch wrapper that:
 *  - Injects the Authorization Bearer token automatically
 *  - Converts non-2xx responses into typed ApiError exceptions
 *  - Reads the base URL from the VITE_API_URL env variable
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string) ?? "";

// ── Error type ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }

    get isUnauthorized(): boolean {
        return this.status === 401;
    }

    get isForbidden(): boolean {
        return this.status === 403;
    }

    get isNotFound(): boolean {
        return this.status === 404;
    }

    get isServerError(): boolean {
        return this.status >= 500;
    }
}

// ── Token helpers ─────────────────────────────────────────────────────────────

function getToken(): string | null {
    try {
        return localStorage.getItem("auth_token");
    } catch {
        return null;
    }
}

// ── Core request function ─────────────────────────────────────────────────────

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let message = response.statusText;
        try {
            const body = await response.json();
            message = body?.detail ?? body?.message ?? message;
        } catch {
            // Response body wasn't JSON — use statusText
        }
        throw new ApiError(response.status, message);
    }

    // 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const api = {
    get: <T>(path: string, init?: RequestInit) =>
        apiRequest<T>(path, { ...init, method: "GET" }),

    post: <T>(path: string, body: unknown, init?: RequestInit) =>
        apiRequest<T>(path, {
            ...init,
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: <T>(path: string, body: unknown, init?: RequestInit) =>
        apiRequest<T>(path, {
            ...init,
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: <T>(path: string, init?: RequestInit) =>
        apiRequest<T>(path, { ...init, method: "DELETE" }),
};
