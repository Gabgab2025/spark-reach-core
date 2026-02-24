/**
 * api/pages.ts — CMS Pages API calls
 */
import { api } from "../api-client";

export interface Page {
    id: string;
    title: string;
    slug: string;
    content?: Record<string, unknown>;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
    og_image?: string;
    featured_image?: string;
    status: "draft" | "published" | "archived";
    page_type: "system" | "custom";
    created_at: string;
    updated_at?: string;
}

export interface PageCreate {
    title: string;
    slug: string;
    content?: Record<string, unknown>;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
    og_image?: string;
    featured_image?: string;
    status?: "draft" | "published" | "archived";
    page_type?: "system" | "custom";
}

export type PageUpdate = Partial<PageCreate>;

export const pagesApi = {
    list: (params?: { slug?: string; status?: string }) => {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return api.get<Page[]>(`/api/pages${qs ? `?${qs}` : ""}`);
    },

    create: (data: PageCreate) =>
        api.post<Page>("/api/pages", data),

    update: (id: string, data: PageUpdate) =>
        api.put<Page>(`/api/pages/${id}`, data),

    delete: (id: string) =>
        api.delete<{ ok: boolean }>(`/api/pages/${id}`),
};
