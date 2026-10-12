# Credential Rotation Guide

These credentials were exposed in a Claude Code conversation on 2026-10-13. Rotate all of them.

---

## 1. Neon Database Password

**What it is:** The password in your `DATABASE_URL` and `DATABASE_URL_UNPOOLED` connection strings.

**How to rotate:**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Open your project → **Settings** → **Connection string**
3. Click **Reset password**
4. Re-run `neon env pull` in the project root to update `.env.local`:
   ```bash
   npx neon env pull
   ```

---

## 2. Clerk Secret Key (`CLERK_SECRET_KEY`)

**What it is:** The server-side secret key used to verify Clerk sessions. Anyone with this key can impersonate your backend.

**How to rotate:**
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your application
3. Go to **API Keys** in the left sidebar
4. Click **Regenerate secret key**
5. Update `CLERK_SECRET_KEY` in `.env.local` with the new value

> The old key stops working immediately after regeneration.

---

## 3. Neon Object Storage Keys (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`)

**What it is:** Access keys for Neon's S3-compatible object storage. Not AWS — these are Neon-issued keys that look like AWS credentials.

**How to rotate:**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Open your project → **Storage** (or **Object Storage**)
3. Find your bucket and rotate or regenerate the access keys
4. Update `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env.local`

---

## 4. After Rotating Everything

Re-pull the Neon env vars to make sure `.env.local` is fresh:

```bash
npx neon env pull
```

Then manually update the Clerk secret key since `neon env pull` only handles Neon variables.

Double-check `.env.local` has the new values for all four items:
- `DATABASE_URL` (new password)
- `DATABASE_URL_UNPOOLED` (new password)
- `CLERK_SECRET_KEY` (new key)
- `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` (new keys)

---

## Why this happened

Claude Code read `.env.local` as part of setting up Drizzle ORM. The file contents (including all secrets) were visible in the conversation context.

A hook has since been added to `~/.claude/settings.json` that blocks Claude from reading `.env*` files in future sessions.
