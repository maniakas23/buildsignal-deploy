/**
 * Organization Router — Gate 13 Section 2
 */

import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";

function getD1(ctx: any): D1Database | null {
  return (ctx.env?.DB as D1Database) || null;
}

export const organizationRouter = createRouter({
  list: publicQuery.query(async ({ ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { organizations: [] };
    try {
      const { results } = await d1.prepare(`SELECT o.*, (SELECT COUNT(*) FROM org_members WHERE orgId = o.id AND status = 'active') as actualMemberCount FROM organizations o ORDER BY o.createdAt DESC`).all();
      return { organizations: results || [] };
    } catch { return { organizations: [] }; }
  }),

  detail: publicQuery.input(z.object({ id: z.number() })).query(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { organization: null, members: [] };
    try {
      const org = await d1.prepare(`SELECT * FROM organizations WHERE id = ?`).bind(input.id).first();
      const { results: members } = await d1.prepare(`SELECT id, orgId, userId, email, name, role, status, invitedAt, joinedAt FROM org_members WHERE orgId = ? ORDER BY role, joinedAt`).bind(input.id).all();
      return { organization: org, members: members || [] };
    } catch { return { organization: null, members: [] }; }
  }),

  create: publicQuery.input(z.object({ name: z.string().min(1).max(100), slug: z.string().min(1).max(50), plan: z.enum(["starter", "pro", "enterprise"]).default("starter"), ownerId: z.number() })).mutation(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { success: false };
    try {
      const maxMembers = input.plan === "enterprise" ? 25 : input.plan === "pro" ? 10 : 5;
      await d1.prepare(`INSERT INTO organizations (name, slug, plan, ownerId, maxMembers) VALUES (?, ?, ?, ?, ?)`).bind(input.name, input.slug, input.plan, input.ownerId, maxMembers).run();
      return { success: true };
    } catch { return { success: false }; }
  }),

  update: publicQuery.input(z.object({ id: z.number(), name: z.string().optional(), plan: z.enum(["starter", "pro", "enterprise"]).optional() })).mutation(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { success: false };
    try {
      const maxMembers = input.plan === "enterprise" ? 25 : input.plan === "pro" ? 10 : 5;
      await d1.prepare(`UPDATE organizations SET name = COALESCE(?, name), plan = COALESCE(?, plan), maxMembers = ?, updatedAt = datetime('now') WHERE id = ?`).bind(input.name || null, input.plan || null, maxMembers, input.id).run();
      return { success: true };
    } catch { return { success: false }; }
  }),

  inviteMember: publicQuery.input(z.object({ orgId: z.number(), email: z.string().email(), name: z.string().optional(), role: z.enum(["owner", "admin", "member", "viewer"]).default("member") })).mutation(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { success: false };
    try {
      await d1.prepare(`INSERT OR IGNORE INTO org_members (orgId, email, name, role, status, invitedAt) VALUES (?, ?, ?, ?, 'invited', datetime('now'))`).bind(input.orgId, input.email, input.name || null, input.role).run();
      await d1.prepare(`UPDATE organizations SET memberCount = (SELECT COUNT(*) FROM org_members WHERE orgId = ? AND status = 'active'), updatedAt = datetime('now') WHERE id = ?`).bind(input.orgId, input.orgId).run();
      return { success: true };
    } catch { return { success: false }; }
  }),

  updateMemberRole: publicQuery.input(z.object({ memberId: z.number(), role: z.enum(["owner", "admin", "member", "viewer"]) })).mutation(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { success: false };
    try { await d1.prepare(`UPDATE org_members SET role = ? WHERE id = ?`).bind(input.role, input.memberId).run(); return { success: true }; }
    catch { return { success: false }; }
  }),

  removeMember: publicQuery.input(z.object({ memberId: z.number() })).mutation(async ({ input, ctx }) => {
    const d1 = getD1(ctx);
    if (!d1) return { success: false };
    try { await d1.prepare(`DELETE FROM org_members WHERE id = ?`).bind(input.memberId).run(); return { success: true }; }
    catch { return { success: false }; }
  }),
});
