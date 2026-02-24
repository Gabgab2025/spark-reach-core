/**
 * api/content-blocks.ts — Content blocks API calls
 */
import { api } from "../api-client";

export type BlockStatus = "draft" | "published" | "archived";
export type BlockType = "hero" | "text" | "gallery" | "cta" | "form" | "stats" | "custom";

export interface ContentBlock {
    id: string;
    name: string;
    label: string;
    block_type: BlockType;
    content?: Record<string, unknown>;
    status: BlockStatus;
    sort_order: number;
    page_assignments?: string[];
    created_at: string;
    updated_at?: string;
}

export interface ContentBlockCreate {
    name: string;
    label: string;
    block_type?: BlockType;
    content?: Record<string, unknown>;
    status?: BlockStatus;
    sort_order?: number;
    page_assignments?: string[];
}

export type ContentBlockUpdate = Partial<ContentBlockCreate>;

export const contentBlocksApi = {
    list: (params?: { block_type?: string; status?: string; page_slug?: string }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return api.get<ContentBlock[]>(`/api/content_blocks${qs ? `?${qs}` : ""}`);
    },

    get: (id: string) =>
        api.get<ContentBlock>(`/api/content_blocks/${id}`),

    create: (data: ContentBlockCreate) =>
        api.post<ContentBlock>("/api/content_blocks", data),

    update: (id: string, data: ContentBlockUpdate) =>
        api.put<ContentBlock>(`/api/content_blocks/${id}`, data),

    delete: (id: string) =>
        api.delete<{ ok: boolean }>(`/api/content_blocks/${id}`),
};
