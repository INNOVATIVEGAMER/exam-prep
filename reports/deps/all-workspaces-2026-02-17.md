# Dependency Analysis: all-workspaces

Generated: 2026-02-17 00:00
Scope: All workspaces — `package.json` (root) + `.opencode/package.json`

---

## Summary

| Metric            | Count |
| ----------------- | ----- |
| Packages analyzed | 24    |
| Up to date        | 17    |
| Updates available | 6     |
| Deprecated        | 0     |
| Security issues   | 1 (indirect, dev-only) |

## Risk Overview

| Risk      | Count | Action                          |
| --------- | ----- | ------------------------------- |
| 🔴 High   | 0     | —                               |
| 🟡 Medium | 3     | Review changelog before upgrade |
| 🟢 Low    | 3     | Safe to upgrade                 |

---

## Updates Available

| Package           | Current  | Latest   | Type  | Deprecated | Risk      |
| ----------------- | -------- | -------- | ----- | ---------- | --------- |
| `eslint`          | 9.39.2   | 10.0.0   | major | No         | 🟡 Medium |
| `@types/node`     | 20.19.33 | 25.2.3   | major | No         | 🟡 Medium |
| `react`           | 19.2.3   | 19.2.4   | patch | No         | 🟢 Low    |
| `react-dom`       | 19.2.3   | 19.2.4   | patch | No         | 🟢 Low    |
| `@types/react-dom`| 19.2.3   | 19.2.3   | —     | No         | ✅ Up to date |
| `@opencode-ai/plugin` | 1.1.65 | 1.2.6 | minor | No         | 🟢 Low    |

> **Note:** `@types/node` is pinned to `^20` in `package.json`; installed is `20.19.33` which satisfies the range. Latest `25.x` requires a deliberate major-version bump.

---

## Up to Date

| Package                    | Installed |
| -------------------------- | --------- |
| `@supabase/ssr`            | 0.8.0     |
| `@supabase/supabase-js`    | 2.96.0    |
| `class-variance-authority` | 0.7.1     |
| `clsx`                     | 2.1.1     |
| `katex`                    | 0.16.28   |
| `lucide-react`             | 0.574.0   |
| `next`                     | 16.1.6    |
| `radix-ui`                 | 1.4.3     |
| `react-katex`              | 3.1.0     |
| `tailwind-merge`           | 3.4.1     |
| `@tailwindcss/postcss`     | 4.1.18    |
| `@types/katex`             | 0.16.8    |
| `@types/react`             | 19.2.14   |
| `eslint-config-next`       | 16.1.6    |
| `shadcn`                   | 3.8.5     |
| `tailwindcss`              | 4.1.18    |
| `tsx`                      | 4.21.0    |
| `tw-animate-css`           | 1.4.0     |
| `typescript`               | 5.9.3     |

---

## Security

⚠️ 1 indirect package has a known vulnerability (dev toolchain only)

| Package | Vulnerable Range | Patched In | Severity | Via (Direct Dep) | Advisory |
| ------- | ---------------- | ---------- | -------- | ---------------- | -------- |
| `ajv`   | < 8.18.0         | 8.18.0     | 🟡 Moderate (CVSS 5.5) | `eslint` → `@eslint/eslintrc` | [GHSA-2g4f-4pwh-qvx6](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6) |

**CVE-2025-69873 — ajv ReDoS via `$data` option**

- **Affected scope:** Dev-only. `ajv` is a transitive dependency of `eslint`, used only during linting (CI / local dev). Not bundled into production output.
- **Impact:** Denial of service via malicious regex in JSON schema `$data` references. Requires crafted schema input; not exploitable via normal lint workflows.
- **Fix path:** `eslint` → upgrade to `10.0.0` which pulls updated `ajv ≥ 8.18.0`. Alternatively, force-override via `npm overrides`.
- **Recommendation:** Low urgency — dev-only, not user-facing. Upgrade `eslint` to v10 during your next planned dev-toolchain update.

**Legend:**
- 🔴 High/Critical — immediate action required
- 🟡 Medium — plan remediation
- 🟢 Low — address when convenient

---

## Detailed Analysis

### eslint: 9.39.2 → 10.0.0 (major) 🟡

**Security:**
- Current version (via `ajv` transitive dep): 🟡 CVE-2025-69873 — ReDoS (Moderate, dev-only)
  - Advisory: https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
  - Fixed in: `ajv` 8.18.0 (pulled by `eslint` 10.0.0)
- Target version: ✅ No known vulnerabilities

**Breaking changes (v10.0.0 — released Feb 06, 2026):**
- `eslintrc` support **fully removed** (legacy `.eslintrc.*` config files no longer work)
  - This project uses `next` ≥ 15 which already uses flat config — likely fine
- `eslint-env` inline comments now **error** (not ignored)
- Deprecated `SourceCode` methods removed
- Deprecated rule context methods (`context.getSourceCode()`, etc.) removed
- `node_modules` no longer auto-ignored — may need explicit `ignores` in `eslint.config.js`
- Minimum Node.js: `^20.19.0 || ^22.13.0 || >=24` (**already satisfied** — project runs Node 20+)
- Updated `eslint:recommended` rule set (new rules may trigger errors)
- `eslint-env` comments now treated as errors

**Codebase impact scan:**

No `.eslintrc.*` legacy config files found in the project. The project uses Next.js 16 which ships with flat config (`eslint.config.mjs` / `eslint-config-next`). `eslint-config-next@16.1.6` (the installed version) is compatible with ESLint 9 but **may not be fully compatible with ESLint 10** until Next.js explicitly supports it — monitor the Next.js changelog.

**Migration guide:** https://eslint.org/docs/latest/use/migrate-to-10.0.0

**Migration steps:**
1. Ensure `eslint.config.mjs` (flat config) is in use — if not, migrate from `.eslintrc.*` first
2. Remove any `/* eslint-env ... */` comments from source files
3. Run `npx eslint --inspect-config` to verify config loads
4. Upgrade: `npm install eslint@^10.0.0 --save-dev`
5. Run `npm run lint` and fix any new rule violations from updated `eslint:recommended`
6. Monitor `eslint-config-next` for an explicit Next.js 16 + ESLint 10 compatibility release

> ⚠️ **Caution:** Do NOT upgrade `eslint` independently without verifying `eslint-config-next` compatibility. The `npm audit` fix suggestion (`eslint@4.1.1`) is a red herring — that is an outdated audit entry pointing to a very old ESLint. Stay on ESLint 9 until Next.js confirms ESLint 10 compatibility or upgrade both together.

---

### @types/node: 20.19.33 → 25.2.3 (major) 🟡

**Breaking changes:**
- Types for newer Node.js APIs added in Node 21–25 are now present
- Some deprecated Node.js API types may be removed
- Node 20 types are still available via `@types/node@20.x` (your current pin `^20` protects you)

**Impact:** None — your `package.json` pins `^20` which resolves to `20.x`. The `25.x` types would only apply if you deliberately bump the range and your CI environment also runs Node 20+.

**Recommendation:** **Hold** — upgrade to `@types/node@^22` or `@types/node@^24` only when you upgrade your runtime Node.js version. No action needed now.

---

### react + react-dom: 19.2.3 → 19.2.4 (patch) 🟢

**Changes (19.2.4 — January 26, 2026):**
- **Security hardening for React Server Components / Server Actions**: More DoS mitigations added, Server Components hardened ([#35632](https://github.com/facebook/react/pull/35632))
- No breaking changes; no API changes

**Impact:** None — pure security hardening and bug fixes.

**Migration steps:**

```bash
npm install react@^19.2.4 react-dom@^19.2.4
```

> ✅ The `^19` range in `package.json` already allows this update. Running `npm update` will pull it in automatically.

---

### @opencode-ai/plugin: 1.1.65 → 1.2.6 (minor) 🟢

**Breaking changes:** None expected (minor version bump).

**Note:** This package is in `.opencode/package.json` — it's a dev/editor tooling plugin, not part of the application bundle.

**Migration steps:**

```bash
cd .opencode && npm update @opencode-ai/plugin
```

---

## Recommendations

### 🟡 Address When Convenient

1. **react + react-dom** — Upgrade to 19.2.4 (patch, includes security hardening for RSC/Server Actions)
   ```bash
   npm update react react-dom
   ```
   Effort: **Trivial** (0 code changes needed). Do this soon.

2. **eslint** — Plan upgrade to v10 in a coordinated dev-toolchain PR
   - First verify `eslint-config-next` compatibility
   - Resolves the `ajv` ReDoS transitive vulnerability (dev-only)
   - Effort: **Low–Medium** (flat config migration check + new rule cleanup)

3. **@opencode-ai/plugin** — Update to 1.2.6 (editor plugin, minor features)
   - Effort: **Trivial**

### 🟡 Hold / Monitor

4. **@types/node** — Stay on `^20` until Node.js runtime is upgraded
   - No risk at current pinned range

5. **ajv (transitive via eslint)** — Dev-only DoS vulnerability, no production exposure
   - Resolved by upgrading `eslint` to v10
   - If needed urgently: add npm overrides to force `ajv@>=8.18.0`

---

## Next Steps

- [ ] Run `npm update react react-dom` (safe, patch, security hardening)
- [ ] Open a dedicated PR: "chore: upgrade eslint to v10" — plan with Next.js compat check
- [ ] Update `.opencode` plugin: `cd .opencode && npm update`
- [ ] Monitor `eslint-config-next` release notes for ESLint v10 support announcement
- [ ] Pin `@types/node` range intentionally when you upgrade Node runtime

---

_Report generated by analyze-deps skill | 2026-02-17_
