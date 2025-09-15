# Lib services

- subscriptionService: fetches entitlements for current user based on Supabase `subscriptions` table and 30-day trial from `auth.users.created_at`.
- billingService: maps plan ids to limits and resolves entitlements.
- actions:
  - pageActions: now enforces dashboard limits on create.
  - haInstanceActions: CRUD for multiple HA instances with plan limit checks.


