/**
 * api/settings.ts — Site settings API calls
 */
import { api } from "../api-client";

export interface Setting {
    key: string;
    value?: string;
    created_at: string;
    updated_at?: string;
}

export interface SettingsBulkUpdate {
    settings: Array<{ key: string; value?: string }>;
}

export const settingsApi = {
    /** Public settings (no auth needed, sensitive keys excluded) */
    getPublic: () =>
        api.get<Setting[]>("/api/settings/public"),

    /** All settings — admin only */
    getAll: () =>
        api.get<Setting[]>("/api/settings"),

    bulkUpdate: (data: SettingsBulkUpdate) =>
        api.post<Setting[]>("/api/settings/bulk_update", data),

    sendTestEmail: () =>
        api.post<{ message: string }>("/api/settings/test_email", {}),
};
