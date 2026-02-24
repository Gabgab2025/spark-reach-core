/**
 * api/team.ts — Team members API calls
 */
import { api } from "../api";

export interface TeamMember {
    id: string;
    name: string;
    slug?: string;
    role: string;
    title?: string;
    tagline?: string;
    bio?: string;
    quote?: string;
    expertise?: string[];
    achievements?: string[];
    avatar_url?: string;
    cover_image_url?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    website_url?: string;
    github_url?: string;
    twitter_url?: string;
    sort_order: number;
    is_leadership: boolean;
    created_at: string;
    updated_at?: string;
}

export interface TeamMemberCreate {
    name: string;
    slug?: string;
    role: string;
    title?: string;
    tagline?: string;
    bio?: string;
    quote?: string;
    expertise?: string[];
    achievements?: string[];
    avatar_url?: string;
    cover_image_url?: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    website_url?: string;
    github_url?: string;
    twitter_url?: string;
    sort_order?: number;
    is_leadership?: boolean;
}

export type TeamMemberUpdate = Partial<TeamMemberCreate>;

export const teamApi = {
    list: () =>
        api.get<TeamMember[]>("/team_members"),

    get: (idOrSlug: string) =>
        api.get<TeamMember>(`/team_members/${idOrSlug}`),

    create: (data: TeamMemberCreate) =>
        api.post<TeamMember>("/team_members", data),

    update: (id: string, data: TeamMemberUpdate) =>
        api.put<TeamMember>(`/team_members/${id}`, data),

    delete: (id: string) =>
        api.delete<{ ok: boolean }>(`/team_members/${id}`),
};
