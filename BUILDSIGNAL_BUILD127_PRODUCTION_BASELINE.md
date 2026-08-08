# BuildSignal — Production Baseline

**Product:** BuildSignal  
**Version:** v1.5.0  
**Build:** 127  
**Environment:** Production  
**Launch Status:** GO  
**Customer Onboarding:** Authorized  
**Date:** 2026-08-09  

---

## Deployment Identifiers

### Cloudflare Pages (Frontend)
| Property | Value |
|----------|-------|
| Project Name | `buildsignal-v2` |
| Canonical Deployment ID | `f7036f0c-082a-46fc-95dc-58aa8e82a4ec` |
| Production Branch | `main` |
| Custom Domain | `buildsignal.net` |
| API Proxy | `functions/api/_middleware.js` |

### Cloudflare Worker (Backend)
| Property | Value |
|----------|-------|
| Script Name | `buildsignal-worker` |
| API Endpoint | `api.buildsignal.net` |
| Build | 127 |

### D1 Database
| Property | Value |
|----------|-------|
| Name | `buildsignal-db` |
| UUID | `a8ecb143-6aa6-4741-b4e8-fe3e16695452` |
| Version | `production` |
| Tables | 59 |
| Size | 0.54 MB |
| Created | 2026-07-17 |

### Rate Limiting
| Property | Value |
|----------|-------|
| Type | Durable Object (`RateLimiterDO`) |
| Per-IP Limit | 10 requests / 60 seconds |
| Per-Email Limit | 5 requests / 60 seconds |

---

## Rollback Reference

If critical issues are discovered post-launch:

1. **Worker rollback:** Activate previous Worker version via Cloudflare dashboard.
2. **Database:** D1 schema is additive only. Rollback to Build 126 is safe.
3. **Frontend:** Pages deployments are atomic. Previous build can be restored instantly.
4. **Health Signals:**
   - `https://api.buildsignal.net/health`
   - `https://api.buildsignal.net/ready`

---

## Security Baseline

| Control | Implementation |
|---------|----------------|
| Password Hashing | PBKDF2-SHA256, 100,000 iterations, 32-byte salt |
| Auth Rate Limiting | Per-IP (10/min) + per-email (5/min) sliding window |
| JWT | HMAC-SHA256, 7-day expiry |
| Tenant Isolation | Enforced at DB query layer (`userId` filtering) |
| Security Headers | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| CORS | Restricted to `https://buildsignal.net` |

---

## Production State

- **Test accounts:** Purged (16 test accounts removed from `users` table)
- **Database:** Clean — 0 test users, all shared intelligence records preserved
- **API Proxy:** Active — `/api/*` routing via Pages Functions
- **SPA Routing:** Verified for all deep links
- **End-to-End Auth:** Verified (register → login → token → protected routes)

---

*Baseline recorded: 2026-08-09*  
*BuildSignal Engineering*
