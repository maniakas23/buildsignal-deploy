# BuildSignal — Real Intelligence Certification: Commercial Readiness (Part 2)

## Phase 6: Commercial Readiness (Workstreams 31-35)

### Workstream 31: Upgrade/Downgrade (P0)

**Status:** BLOCKED

**Evidence:**
- No customer has ever upgraded or downgraded
- `subscription_events` table has 0 records
- `plan_changes` table has 0 records
- No upgrade endpoint exists
- No downgrade endpoint exists
- No prorated billing logic exists
- The `billing.config` endpoint shows plans but cannot process changes

**Verdict:** Upgrade and downgrade flows cannot be tested. No subscription management exists.

**Next Action:** Implement subscription change flow. Test upgrade/downgrade with Stripe. Verify prorated billing.

---

### Workstream 32: Dunning & Failed Payment (P0)

**Status:** BLOCKED

**Evidence:**
- No customer has ever made a payment
- No payment has ever failed
- `failed_payments` table has 0 records
- `dunning_events` table has 0 records
- No dunning logic exists
- No retry logic exists
- No Stripe webhook handler for `invoice.payment_failed` exists

**Verdict:** Dunning and failed payment handling do not exist.

**Next Action:** Implement dunning logic. Configure Stripe webhooks. Test failed payment flow.

---

### Workstream 33: Tax Compliance (P0)

**Status:** BLOCKED

**Evidence:**
- No customer has ever been billed
- `tax_records` table has 0 records
- `tax_calculations` table has 0 records
- No tax calculation logic exists
- No Stripe Tax integration exists
- No VAT/GST handling exists
- No tax exemption logic exists

**Verdict:** Tax compliance cannot be verified. No tax system exists.

**Next Action:** Integrate Stripe Tax. Configure tax settings. Test with customers in multiple jurisdictions.

---

### Workstream 34: Webhook Reliability (P0)

**Status:** BLOCKED

**Evidence:**
- No webhooks are configured
- `webhook_logs` table has 0 records
- `webhook_events` table has 0 records
- No Stripe webhook endpoint is deployed
- No webhook retry logic exists
- No webhook signature verification exists
- No event processing queue exists

**Verdict:** Webhook reliability cannot be tested. No webhook infrastructure exists.

**Next Action:** Deploy webhook endpoint. Implement signature verification. Configure retry logic. Test with Stripe events.

---

### Workstream 35: Customer Portal (P0)

**Status:** BLOCKED

**Evidence:**
- No customer portal exists
- `customer_portal_sessions` table has 0 records
- No Stripe Customer Portal integration exists
- No self-service subscription management exists
- No invoice history view exists
- No payment method management exists
- The `billing.config` endpoint returns plans but no portal link

**Verdict:** Customer portal does not exist. No self-service capabilities are available.

**Next Action:** Integrate Stripe Customer Portal. Create portal session endpoint. Test self-service subscription management.

---

*Phase 6 Commercial Readiness (Part 2) complete. All workstreams BLOCKED.*

---

## Summary: Commercial Readiness

| Workstream | Status | Evidence |
|------------|--------|----------|
| 26: Pricing Accuracy | BLOCKED | Pricing configured, billing not deployed |
| 27: Plan Limits | BLOCKED | Limits configured, no enforcement |
| 28: Billing Accuracy | BLOCKED | No billing system active |
| 29: Invoice & Receipt | BLOCKED | No invoice generation exists |
| 30: Cancellation & Refund | BLOCKED | No subscription management |
| 31: Upgrade/Downgrade | BLOCKED | No plan change flow |
| 32: Dunning & Failed Payment | BLOCKED | No dunning logic |
| 33: Tax Compliance | BLOCKED | No tax system |
| 34: Webhook Reliability | BLOCKED | No webhook infrastructure |
| 35: Customer Portal | BLOCKED | No portal exists |

**Commercial Readiness Score: 0/10**

BuildSignal has pricing configured in the database and a working `billing.config` endpoint, but no actual billing, payment, subscription, or customer portal infrastructure is deployed. The commercial layer is entirely theoretical.

**Path Forward:**
1. Deploy Stripe integration (webhooks, checkout, customer portal)
2. Implement usage tracking and plan limit enforcement
3. Test complete billing flow with real Stripe test transactions
4. Verify tax compliance for target jurisdictions
5. Create customer self-service portal

*Commercial readiness certification cannot proceed until billing infrastructure is deployed and tested.*
