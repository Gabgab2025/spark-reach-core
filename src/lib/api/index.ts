/**
 * api/index.ts — Single re-export point for all API domain modules.
 *
 * Usage:
 *   import { authApi, pagesApi, settingsApi } from "@/lib/api";
 */
export { authApi } from "./auth";
export type { LoginRequest, SignupRequest, AuthUser, SessionResponse } from "./auth";

export { pagesApi } from "./pages";
export type { Page, PageCreate, PageUpdate } from "./pages";

export { settingsApi } from "./settings";
export type { Setting, SettingsBulkUpdate } from "./settings";

export { contentBlocksApi } from "./content-blocks";
export type { ContentBlock, ContentBlockCreate, ContentBlockUpdate, BlockType, BlockStatus } from "./content-blocks";

export { teamApi } from "./team";
export type { TeamMember, TeamMemberCreate, TeamMemberUpdate } from "./team";
