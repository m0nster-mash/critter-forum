# Project Requirements

*Status: Draft · Owner: \[name\] · Last updated: \[date\]*

## Project Summary

**Project name:** \[name\]

**One-line description:** \[What is this, in a single sentence?\]

**Problem statement:** \[What problem are we solving, and for whom? Why now?\]

**Goals:**

- &#91;Goal 1\]
- &#91;Goal 2\]

**Non-goals (out of scope):**

- &#91;Explicitly excluded item 1\]
- &#91;Explicitly excluded item 2\]

**Target users / personas:**

| Persona | Description | Primary needs |
| --- | --- | --- |
| \[Persona 1\] | \[Who they are\] | \[What they need\] |
| \[Persona 2\] | \[Who they are\] | \[What they need\] |

**Success metrics:**

- &#91;Metric 1, with target\]
- &#91;Metric 2, with target\]

**Constraints and assumptions:** Authentication is built on BetterAuth (default user, session, etc. tables), extended with additional tables that bridge the default ones. Budget, timeline, integrations, and compliance are still to be defined.

**Feature overview:**

| # | Feature | Short description | Priority | Status |
| --- | --- | --- | --- | --- |
| 1 | Authentication | Login, logout, registration, email confirmation, account pages, and role-based access, built on BetterAuth | TBD | Partially implemented |
| 2 | Activity Tracker | An /activity page and a Who's Online sidebar widget, with user privacy controls | TBD | Notes captured |
| 3 | Avatars | Per-actor layered SVG avatars, with optional static images for character/hub actors | TBD | Notes captured |
| 4 | Shoutbox | A header-activated dropdown chat for guests and users, updated live | TBD | Notes captured |
| 5 | Notifications | A navbar icon, dropdown, and page for reports, pings, quotes, replies, and DMs | TBD | Notes captured |
| 6 | Forum | Forum > Category > Board > Thread > Post, updated in real time | TBD | Notes captured |
| 7 | Direct Messages | A simple DM system between users, respecting blocks | TBD | Notes captured |
| 8 | Admin | An admin panel for users, permissions, forum, shoutbox, site, reports, and audit log | TBD | Notes captured |
| 9 | Creatures | Space reserved; to be defined later | TBD | Not started |
| 10 | User Interactions | Friending and blocking between users | TBD | Notes captured |
| 11 | User Profiles | Profile pages with a bio, activity feed, counts, avatar, creature, blog, and comments | TBD | Notes captured |
| 12 | Blogs | A simple per-user blog with tags, visibility controls, and comments | TBD | Notes captured |
| 13 | Comments | Comments on blogs and profiles, with owner controls | TBD | Notes captured |
| 14 | Reactions | Likes on shoutbox messages, posts, comments, and DMs | TBD | Notes captured |
| 15 | Taxonomy & Discovery | Shared taxonomy/tagging, tag administration, aliases, and permission-aware global search/browse | TBD | Notes captured |
| 16 | Actors | OOC player and IC character/hub identities, handles, ownership, lifecycle, and authorship | TBD | Notes captured |
| 17 | Content System | Lore library, shared editor drafts, data exports, and central media/gallery assets | TBD | Notes captured |

## Feature 1: Authentication

### 1.1 Overview

Authentication uses Better Auth for core account credentials and sessions, with RPC-specific profile, permission, registration, and lifecycle data held in separate tables.

### 1.2 Use Cases

As a user, I should be able to:

| ID | Flow | Use case |
| --- | --- | --- |
| UC-1.1 | Login | Log in using the login form |
| UC-1.2 | Login | Log in using my email or my username |
| UC-1.3 | Login | Be redirected to the "dashboard" page once I have logged in |
| UC-1.4 | Logout | Log out by clicking the logout button |
| UC-1.5 | Logout | Be redirected to the root page when I am logged out |
| UC-1.6 | Registration | Register using the registration form |
| UC-1.7 | Registration | Define a username, email, and password |
| UC-1.8 | Registration | Receive a confirmation and validation email once I have registered |
| UC-1.9 | Registration | Not log in until I have confirmed my email |
| UC-1.10 | Registration | Be assigned the 'user' role on successful registration |
| UC-1.11 | Registration | Create an avatar when I register an account (avatar creation might occur after account validation) |
| UC-1.12 | Registration | Create a creature when I register an account (creature creation might occur after account validation) |
| UC-1.13 | Account | Update my account information and settings via the `/settings` page |
| UC-1.14 | Account | View my profile via the `/profile/[userId]` page |
| UC-1.15 | Permissions | Not access the 'dashboard' page or any of the `admin` pages if I am not logged in |
| UC-1.16 | Permissions | Be redirected to a 404 page if I attempt to access a page I do not have the permissions to view |
| UC-1.17 | Administration | Access the 'admin' pages if I have been given the `admin` role |
| UC-1.18 | Administration | Manage user accounts, including editing, deleting, banning, and changing account permissions |

### 1.3 Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| F1-FR-01 | Use Better Auth for core account credentials, sessions, linked accounts, and verification records. Keep RPC-specific profile, trust-tier, privacy, and lifecycle state in separate RPC tables; do not add RPC fields to vanilla Better Auth tables. (R-001) | TBD |
| F1-FR-02 | Guests may read public content but may not post, comment, react, or send direct messages. Access must be checked server-side for each protected page and operation. (R-002) | TBD |
| F1-FR-03 | Session cookies must be `HttpOnly`, `Secure`, and `SameSite=Lax`, with a 30-day sliding expiry. (R-003) | TBD |
| F1-FR-04 | A ban or password reset must revoke all active sessions. (R-005) | TBD |
| F1-FR-05 | Users may view and revoke their own sessions, including the current session. (R-006) | TBD |
| F1-FR-06 | Login and password-reset attempts must be limited to five failures per 15-minute window, followed by exponential lockout. (R-007) | TBD |
| F1-FR-07 | Registration and password reset must be protected by Turnstile. (R-008) | TBD |
| F1-FR-08 | Each account owns exactly one player actor and may own multiple character actors; a character actor represents either a character or a hub. Player provisioning occurs during registration. (R-009) | TBD |
| F1-FR-09 | All content is authored by an actor. Every content write must verify server-side that the actor belongs to the authenticated session user; a client-supplied actor ID is not proof of ownership. (R-010) | TBD |
| F1-FR-10 | Core authentication configuration belongs on the Better Auth `user` record; RPC profile, age-certification, date-of-birth, terms, privacy, social, notification, and trust-tier data belongs on `rpc.player`. (R-011) | TBD |
| F1-FR-11 | Admins have all known permissions. Delegated staff receive permissions individually or through permission groups, optionally scoped to an entity; there is no moderator role. Permission definitions and grants are owned by Admin. (R-012, D-072) | TBD |
| F1-FR-12 | The login name (`user.name`) is distinct from the public display name (`player.display_name`). (R-041) | TBD |
| F1-FR-13 | Account deletion is initially a reversible soft delete: hide all owned actors, revoke sessions, and mask authorship on retained content. There is no automatic hard delete or mass purge; staff process hard-delete requests. (R-052, R-061) | TBD |
| F1-FR-14 | Registration mode is enforced server-side and supports `open`, `gated`, and `closed`. Gated registration records applications with `pending`, `approved`, or `rejected` status; pending applicants cannot sign in. (D-057, D-063, P-047) | TBD |
| F1-FR-15 | Registration screening supports blacklist entries for IP, IP range, email domain, and email hash, with `block` or `gate` outcomes. Screening must not be bypassable through direct API calls. (D-063) | TBD |
| F1-FR-16 | Staff review of registration applications is limited to applicants whose email is verified. Rejected application history is retained after account deletion and permits same-email reapplication. (P-047) | TBD |
| F1-FR-17 | A soft-deleted account cannot create a session. Restoring an account unmasks only actors marked as deleted due to account deletion and does not clear independent bans or sanctions. (D-043, D-067, D-138) | TBD |
| F1-FR-18 | Hard deletion, when implemented, must retain the `rpc.user` row, anonymize sensitive Better Auth user fields according to the approved P-048 contract, preserve required audit and deletion history, and retain masked actor attribution. | TBD |
| F1-FR-19 | Formal bans and shadow-bans must remain enforceable after hard deletion through a privacy-preserving keyed email hash; mutes do not trigger email retention. Implementation and retention duration remain deferred pending P-043. | TBD |
| F1-FR-20 | Authorization must be derived server-side from the session and database. Client-side permission checks are for presentation only and never replace server-side guards. Unknown permissions fail closed. (R-012) | TBD |

### 1.4 Data Layer

- Better Auth core tables in the `rpc` schema: `rpc.user`, `rpc.session`, `rpc.account`, and `rpc.verification`. The admin plugin adds `user.role`, `user.banned`, `user.ban_reason`, `user.ban_expires`, and `session.impersonated_by`.
- `rpc.user_deletion` stores the latest account-deletion lifecycle state (one row per user); its user reference uses `ON DELETE RESTRICT`.
- `rpc.player` is the one-to-one OOC profile extension; `rpc.actor` represents the player and character/hub identities. The Actors module owns these tables and provisions the player actor during registration.
- Registration and screening entities: `rpc.registration_application` (application status, applicant and reviewer references) and `rpc.security_blacklist` (IP, IP range, email-domain, and email-hash entries with `block` / `gate` action).
- Admin-owned related entities include `rpc.site_config` (including `registration_mode`), `rpc.audit_log`, `rpc.staff_permission`, `rpc.permission_group`, `rpc.permission_group_item`, and `rpc.user_permission_group`.
- `rpc.user_ip_log` is the separate intended store for durable per-user IP history; it is not yet implemented.
- The trust-tier table is not yet implemented; `player.trust_tier_id` is currently a UUID without a foreign key.
- Keep account credentials and session data in Better Auth tables; keep profile and community-specific data in RPC tables.

*The `project.puml` is the source of truth for RPC entities and relationships. Reconcile the documented auth schema with Better Auth CLI output and `project.puml` when either changes.*

### 1.5 Security and Privacy

- Session cookies use `HttpOnly`, `Secure`, and `SameSite=Lax`; `Secure` is currently configured only in production. Sessions have a 30-day expiry refreshed at most once per day.
- A ban, password reset, soft deletion, or staff password change revokes all sessions. A signed-in password change requires the current password and revokes the user's other sessions.
- Never expose password values or hashes. Password hashing uses Better Auth's default scrypt hasher; code that writes `account.password` directly must use Better Auth's `hashPassword`.
- Do not expose session IP address or user-agent metadata to anyone other than the owning user.
- Enforce registration mode, application status, and blacklist outcomes on the server. Pending or soft-deleted accounts must not create sessions.
- Derive authorization from the server-side session and database. Do not trust caller-supplied roles, staff flags, or actor IDs.
- Every content write must validate actor ownership. Guest write, reaction, and DM operations are disallowed.
- Account authentication data belongs in Better Auth records; private profile and personal information belongs in `rpc.player` and must not leak into public payloads.
- Database credentials and Better Auth secrets must be supplied through environment configuration and must not be committed to version control. Development seed credentials are local-only.

### 1.6 Implementation Status and Verification

The Auth README describes the system as partially implemented, not production-ready. Code presence does not establish that a requirement has passed runtime verification.

- Implemented: Better Auth configuration and API handler; core auth schema; login, registration, sign-out, settings, and session-review UI; server-side guards; unified permission evaluation (unit-tested); registration-mode and blacklist screening hooks; player-actor provisioning on registration; account soft-delete and restore paths.
- Implemented but requiring runtime verification: login and registration flows; session cookie attributes and expiry; session listing and revocation; ban sign-in rejection; registration application approval/rejection and blacklist outcomes; account lifecycle actions.
- Deferred/not implemented: email verification and delivery; self-service password reset; Turnstile; login/reset rate limiting and exponential lockout; staff hard deletion; retained-ban integration after hard deletion; durable user IP history; a trust-tier table; shared actor-ownership validation across every content-writing operation.
- Authorization is enforced per page and operation. There is no global middleware/proxy layer; every protected page, API route, server action, and content write must call the appropriate server-side guard.
- `routes.ts` access metadata is not enforcement unless a route explicitly calls a guard. The `/profile/[id]` placeholder is noted as lacking a guard.
- The current `/settings` privacy panel reads `stealthMode` and `hideLocation` from the Better Auth session user, although those fields belong to `rpc.player`; the panel therefore initializes incorrectly and must be corrected by the Actors settings work.
- The Auth module owns session and identity guards (`getSession`, `requireAuth`, `can`, `requirePermission`, `requirePagePermission`, `requireAdmin`, `checkUserData`) and client-side policy evaluation (`hasPermission`). Admin owns permission definitions, grants, groups, and effective-permission resolution. `requireAdmin()` delegates to `can("admin.dashboard")`; client-side `hasPermission()` is never an enforcement boundary.

### 1.7 Open Questions and Deferred Work

- **P-042:** Where should rate-limit counters be stored (Redis, memory, or Better Auth's built-in limiter)? Preserve the five-failures-per-15-minutes rule and exponential lockout.
- **P-052:** Verify through tests that Better Auth rejects sign-in when native ban fields are set and that Admin's delegated server-action ban/session-revocation contract remains effective.
- **P-022, P-023, P-024:** Trust-tier seed values, promotion criteria, T0/T5 behaviour, and interactions with mutes and admin-role changes remain open in the Trust Tier work.
- **P-036:** Warning levels and their relationship to sanctions and trust tiers remain open across Auth, Admin, Security, and Shoutbox.
- Email verification/delivery and email-change verification must be designed and tested before deployment. Staff review remains unavailable for unverified applicants until email verification is implemented.
- Turnstile and rate limiting must be completed before authentication and registration are considered production-ready.
- Hard deletion and retained-ban enforcement remain deferred until blacklist integration, cross-module referential handling, and P-043 retention policy are ready. The approved P-048 anonymization contract is settled; its execution is not.
- Reconcile the small schema discrepancies between `auth-schema.ts` and `project.puml` (including `user.role` type and verification timestamp nullability) during schema verification.
- Decide whether a separate append-only lifecycle-event table is needed; `rpc.user_deletion` stores only the latest lifecycle state, while audit records remain the default history for staff actions.
- Player provisioning is implemented through `provisionPlayerActor` on registration; confirm the workflow at runtime. Avatar and creature creation timing remains a separate feature-level question.

## Feature 2: Activity Tracker

### 2.1 Overview

Two elements: a `/online` page and a `<WhosOnline/>` sidebar widget. Presence is updated through API heartbeats and page transitions, using the site-configured inactivity threshold (default 30 minutes).

### 2.2 Use Cases

As a user, I should:

| ID | Element | Use case |
| --- | --- | --- |
| UC-2.1 | Widget | See a simple widget in the sidebar that reads "n User Online" |
| UC-2.2 | Widget | Only see the count of active registered users who are not in stealth mode, not a count of guests viewing the website |
| UC-2.3 | Widget | Be able to click the widget to be directed to the `/online` page |
| UC-2.4 | Activity page | See a table of all currently online users, excluding members in stealth mode from the public view |
| UC-2.5 | Activity page | Be able to click the "View Profile" / eye-icon button to view any visible user's profile |
| UC-2.6 | Activity page | See a 'location' column showing the last page a user was on |
| UC-2.7 | Activity page | See a 'timestamp' column showing the last time the user made an action on the site |
| UC-2.8 | Activity page | See guest presence separately from member rows |
| UC-2.9 | Activity page | As a staff member with permission to view users, see members in stealth mode with a stealth indicator |
| UC-2.10 | Activity page | Not see an entry in the table for any user who is hiding their online status / appearing offline |
| UC-2.11 | Activity page | See the generic route label "Exploring the Site" in the public directory; staff with permission to view users can see the actual route and a location-masked indicator |
| UC-2.12 | Settings and privacy | Be able to enable stealth mode, hiding me from public Who's Online displays and active-user counts |
| UC-2.13 | Settings and privacy | Be able to hide my location, masking the route shown publicly |

As an admin, I should:

| ID | Element | Use case |
| --- | --- | --- |
| UC-2.14 | Admin controls | Be able to set the activity threshold in the admin panel. It defaults to 30 minutes. Any user who has not been active within the threshold is removed from the activity list and displayed as offline |
| UC-2.15 | Admin controls | Be able to see all online users, regardless of their privacy settings, on the `/online` page, if I have permission to view users |

### 2.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F2-FR-01 | Presence is updated through API heartbeats and page transitions | TBD |
| F2-FR-02 | Active presence is determined by `rpc.site_config.inactivity_threshold_minutes`, defaulting to 30 minutes | TBD |
| F2-FR-03 | Authenticated members are tracked by user ID; guests are tracked by an anonymous persistent browser token | TBD |
| F2-FR-04 | The Who's Online widget displays active members and omits guests and members in stealth mode | TBD |
| F2-FR-05 | The `/online` page shows guest presence separately from member rows | TBD |
| F2-FR-06 | `stealth_mode` hides members from public presence displays and counts; authorized staff can see them with a stealth indicator | TBD |
| F2-FR-07 | `hide_location` masks the public route with the generic label "Exploring the Site"; authorized staff can see the actual route with a masking indicator | TBD |
| F2-FR-08 | Presence rows older than the configured inactivity threshold are purged | TBD |
| F2-FR-09 | The activity tracker does not collect IP addresses or user-agent values; durable IP history is stored separately in `rpc.user_ip_log` | TBD |

### 2.4 Data Layer

Candidate data from the notes:

- `rpc.activity_tracker` presence data: optional user ID, guest token, route path, and last-seen timestamp
- Per-user privacy settings on `rpc.player`: `stealth_mode` (default `false`) and `hide_location`
- Site setting: `rpc.site_config.inactivity_threshold_minutes` (default 30 minutes)
- Guest tokens persisted in browser `localStorage`
- Guest presence shown separately on `/online` and omitted from the widget
- The activity tracker does not collect IP addresses or user-agent values; durable IP history belongs in `rpc.user_ip_log`

*Entities, fields, and relationships to be mapped.*

### 2.5 Open Questions

- How are guest tokens authenticated, rotated, and protected against client-side abuse?
- What are the exact heartbeat interval and stale-row cleanup execution mechanism?
- Should future online visibility support global or friend-only visibility?

## Feature 3: Avatars

### 3.1 Overview

Each actor has an independent avatar configuration. Vector avatars are created from approved, layered `.svg` assets and
pre-rendered to WebP/PNG. Character and hub actors may additionally use a static image from the owner's central media
gallery; player/OOC actors use vector avatars only.

### 3.2 Use Cases

As a user, I should be able to:

| ID | Use case |
| --- | --- |
| UC-3.1 | Create an avatar when I register an account or when my account is activated |
| UC-3.2 | Edit my avatar on my `/settings` page |
| UC-3.3 | See my avatar next to any posts that I make on the site |

### 3.3 Requirements

- **R-013:** Every actor has its own independent avatar. Character actors may have both a vector avatar and a static
  upload; player actors use vector avatars only. Static uploads use a 1:1 crop and have a 5 MB maximum input size.
- **R-014:** Vector avatars are stacked SVG layers saved as JSON and pre-rendered to WebP/PNG on save. Palette mapping
  and colour swapping are v2 and are excluded from the baseline.
- **R-015:** Admins can reset non-compliant avatars.
- Avatar configuration belongs to the selected actor. Changing one actor's avatar must not overwrite another actor's
  configuration.
- Vector configurations select approved SVG assets; arbitrary client-supplied SVG markup must not be trusted.
- Static avatar binaries are managed by the central Media system. Avatar records reference media items rather than
  unmanaged public URLs.
- Avatar changes must validate that the actor belongs to the authenticated session user (**R-010**).
- Administrative reset permissions and audit requirements are owned by Admin / Permissions.

### 3.4 Data Layer

The current schema (`project.puml`) is the source of truth:

- `rpc.avatar` — one-to-one actor vector-avatar configuration, with `actor_id` and `avatar` JSONB (default `{}`).
- `rpc.actor` — identity to which the avatar configuration belongs; ownership resolves through `actor.user_id`.
- `rpc.character` — nullable `static_avatar_media_id` for a character's static image.
- `rpc.user_media` — central media item referenced by `static_avatar_media_id`.
- `rpc.avatar.actor_id` is a unique FK to `rpc.actor.id`.
- `rpc.character.static_avatar_media_id` is a nullable FK to `rpc.user_media.id`.

Vector configuration is the source for rebuilding the rendered WebP/PNG output. The schema does not yet standardize the
JSON payload, permitted layer IDs, output dimensions, cache keys, or cache invalidation. Static avatar upload,
validation, ownership, binary storage, and moderation belong to Media. Player actors do not have a static-avatar field;
the static-media FK is character-only. Hubs use the shared character representation (`profile_type = 'hub'`).

The legacy schema description of `avatar_type`, `avatar_url`, and `vector_config` fields on `rpc.actor` is superseded
by the current `rpc.avatar` and `rpc.character.static_avatar_media_id` model.

### 3.5 Open Questions

- What layer categories, permitted asset IDs, ordering, required layers, and default configuration make up the formal
  JSON schema for `rpc.avatar.avatar`?
- What output dimensions, cache keys, and cache invalidation rules apply to pre-rendered WebP/PNG files?
- What happens to `character.static_avatar_media_id` when the referenced media row and object are hard-purged
  (**P-071**)? Define FK deletion behaviour or an application-level clear/invalidation flow.
- What default avatar is applied after an admin reset, and what notification or appeal behaviour applies?
- What exact SVG asset validation/sanitization policy applies?
- Is avatar creation required, or can it be skipped?

## Feature 4: Shoutbox

### 4.1 Overview

A floating chat box, opened from a button in the header, where guests and registered users post short messages. Messages appear live for everyone viewing it.

### 4.2 Use Cases

| ID | Actor | Use case |
| --- | --- | --- |
| UC-4.1 | User | I should be able to post short messages in the shoutbox |
| UC-4.2 | User | I should have a cooldown period between posts; this cooldown is shorter for registered users |
| UC-4.3 | User | I should be able to see my avatar beside my message when I post |
| UC-4.4 | User | I should be able to edit my posts if I am a registered user |
| UC-4.5 | User | I should be able to delete my posts if I am a registered user |
| UC-4.6 | User | I should be able to report any post via a report button beneath the post |
| UC-4.7 | User | I should be able to ping users and quote other messages in my posts |
| UC-4.8 | Guest | I should be able to post short messages in the shoutbox |
| UC-4.9 | Guest | I should have a cooldown period between posts; this cooldown is longer for guests |
| UC-4.10 | Guest | I should be given a placeholder avatar when I post, visible beside my post |
| UC-4.11 | Guest | I should not be able to edit or remove my posts |
| UC-4.12 | Guest | I should not be able to ping users or quote posts in my post |
| UC-4.13 | Admin | I should be able to post short messages in the shoutbox |
| UC-4.14 | Admin | I should not have a cooldown between posts |
| UC-4.15 | Admin | I should be able to see my avatar beside my message when I post |
| UC-4.16 | Admin | I should be able to edit and delete my posts |
| UC-4.17 | Admin | I should be able to edit and delete any other user's or guest's post |
| UC-4.18 | Admin | I should receive a notification when a report is made |

### 4.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F4-FR-01 | A floating box appears when a button in the header is clicked | TBD |
| F4-FR-02 | The box appears as a dropdown drawer beneath the activation button, and stays open until the user closes it by clicking the button again | TBD |
| F4-FR-03 | Guests and users may post in the shoutbox | TBD |
| F4-FR-04 | Posts are ordered from oldest to newest | TBD |
| F4-FR-05 | The shoutbox is always scrolled to the bottom, so the newest messages are displayed | TBD |
| F4-FR-06 | When a user posts a message, it appears automatically for anyone viewing the shoutbox | TBD |
| F4-FR-07 | There is a limit to how many shoutbox messages appear | TBD |
| F4-FR-08 | All shoutbox messages are displayed on a special thread on the forum | TBD |
| F4-FR-09 | Shoutbox posts are counted, and the number is displayed on the user's profile | TBD |
| F4-FR-10 | The user's most recent shoutbox post is also displayed on their profile | TBD |

### 4.4 Data Layer

Candidate data from the notes:

- Shoutbox message (author or guest, body, timestamp)
- Placeholder avatar for guests
- Pings and quotes referencing users and other messages
- Reports on messages
- Per-user shoutbox post count and latest post
- Link between shoutbox messages and the special forum thread
- Cooldown settings per role (guest, user, admin)

*Entities, fields, and relationships to be mapped.*

### 4.5 Open Questions

- How many messages does the shoutbox display?
- How long are the cooldowns for guests and registered users?
- What is the maximum length of a "short" message?
- How are guests identified for cooldowns?

## Feature 5: Notifications

### 5.1 Overview

A notification icon in the top navigation bar opens a dropdown of unread notifications, with a link to a full notifications page.

### 5.2 Use Cases

*To be written.*

### 5.3 Requirements

Draft requirements from the notes:

| ID | Area | Requirement | Priority |
| --- | --- | --- | --- |
| F5-FR-01 | Navigation bar | A notification icon exists in the top navigation bar | TBD |
| F5-FR-02 | Navigation bar | When a user has a notification, a red dot or a small counter appears on the icon | TBD |
| F5-FR-03 | Navigation bar | A notification drawer opens beneath the button when it is clicked | TBD |
| F5-FR-04 | Navigation bar | A button on the drawer directs the user to the 'notification' page | TBD |
| F5-FR-05 | Dropdown | The dropdown is a simple list of unreviewed notifications | TBD |
| F5-FR-06 | Dropdown | A user can click a notification to be taken to its source | TBD |
| F5-FR-07 | Dropdown | If a notification has no source, the user is directed to the 'notifications' page instead | TBD |
| F5-FR-08 | Dropdown | Clicking a notification marks it as read; it no longer displays in the dropdown the next time the user opens it | TBD |
| F5-FR-09 | Page | The page displays a table of all of the user's notifications, indicating whether each has been read | TBD |
| F5-FR-10 | Page | A notification is only 'read' once the user clicks it (in the table or the dropdown); viewing the page does not mark notifications as read | TBD |
| F5-FR-11 | Page | A button on the table marks all notifications as read | TBD |
| F5-FR-12 | Page | Table columns can be sorted | TBD |
| F5-FR-13 | Page | A search and filter function lets the user find notifications by type, status, etc. | TBD |
| F5-FR-14 | Types | Any user report appears in the notification queue of any admin account with permission to view reports | TBD |
| F5-FR-15 | Types | A notification is created any time a user is pinged | TBD |
| F5-FR-16 | Types | A notification is created any time a user is quoted | TBD |
| F5-FR-17 | Types | A notification is created any time a user's thread is replied to | TBD |
| F5-FR-18 | Types | A notification is created any time a user's subscribed thread is replied to | TBD |
| F5-FR-19 | Types | A notification is created any time a user receives a direct message | TBD |

### 5.4 Data Layer

Candidate data from the notes:

- Notification (recipient, type, read status, optional source reference)
- Notification types: report, ping, quote, thread reply, subscribed-thread reply, direct message
- Permission to view reports

*Entities, fields, and relationships to be mapped.*

### 5.5 Open Questions

- Which sources can a notification link to (post, shoutbox message, DM, report)?
- Which notifications, if any, can a user turn off?

## Feature 6: Forum

### 6.1 Overview

The forum is organized as Forum > Category > Board > (optional sub-boards) > Thread > Post. Content updates live, without page refreshes.

### 6.2 Use Cases

*To be written.*

### 6.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F6-FR-01 | Structure: Forum > Category > Board > (optional sub-boards) > Thread > Post | TBD |
| F6-FR-02 | Threads are flat | TBD |
| F6-FR-03 | Avatars appear next to posts | TBD |
| F6-FR-04 | Posts contain a basic WYSIWYG control panel | TBD |
| F6-FR-05 | Post counts are recorded on the user's profile page | TBD |
| F6-FR-06 | Latest posts are recorded on the user's profile page | TBD |
| F6-FR-07 | A user can edit their own post | TBD |
| F6-FR-08 | A user can delete their own post | TBD |
| F6-FR-09 | A user can follow/subscribe to threads | TBD |
| F6-FR-10 | Admins can close/lock threads | TBD |
| F6-FR-11 | Admins can pin threads | TBD |
| F6-FR-12 | Forum content is live-updated: new messages and threads appear automatically, in real time, without a page refresh | TBD |

### 6.4 Data Layer

Candidate data from the notes:

- Hierarchy: forum, category, board, sub-board (optional), thread, post
- Thread state: closed/locked, pinned
- Thread subscriptions (user follows thread)
- Per-user post count and latest posts
- Real-time update mechanism

*Entities, fields, and relationships to be mapped.*

### 6.5 Open Questions

- Which formatting options does the basic WYSIWYG panel include?
- How deep can sub-boards nest?
- Which technology delivers the real-time updates?

## Feature 7: Direct Messages

### 7.1 Overview

A simple direct message (DM) system between users.

### 7.2 Use Cases

*To be written.*

### 7.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F7-FR-01 | The system provides a simple DM system | TBD |
| F7-FR-02 | Users can DM other users | TBD |
| F7-FR-03 | Users cannot DM another user if either user has blocked the other | TBD |

### 7.4 Data Layer

Candidate data from the notes:

- Direct message (sender, recipient, body, timestamp)
- Block relationship between users (see Feature 10)

*Entities, fields, and relationships to be mapped.*

### 7.5 Open Questions

- Are messages grouped into conversations?
- Can DMs be deleted, and by whom?

## Feature 8: Admin

### 8.1 Overview

The admin panel provides staff governance and moderation workflows for users, permissions, reports, sanctions, registration controls, site configuration, and audit history. Admins have full access; delegated staff receive specific permissions, optionally scoped to an entity. There is no moderator role.

### 8.2 Use Cases

As an administrator or authorized staff member, I should be able to:

| ID | Use case |
| --- | --- |
| UC-8.1 | Manage users and their account status through permission-checked staff actions |
| UC-8.2 | Assign existing permissions directly or through permission groups, with supported entity scopes |
| UC-8.3 | View and manage moderation reports, including filtering, assignment, and resolution notes |
| UC-8.4 | Issue and reverse supported account sanctions, subject to the applicable staff permissions |
| UC-8.5 | Review and decide registration applications when registration is gated |
| UC-8.6 | Manage registration blacklist entries for IPs, IP ranges, email domains, and email hashes |
| UC-8.7 | Hide and unhide supported content and have each transition recorded in the audit log |
| UC-8.8 | Soft-delete content as staff, with the action recorded in the audit log |
| UC-8.9 | View audit history when authorized |
| UC-8.10 | Manage typed site configuration, including the activity inactivity threshold |
| UC-8.11 | Access administrative panels only when holding the required permission |

### 8.3 Requirements

Draft requirements from the notes:

| ID | Admin panel section | Requirement | Priority |
| --- | --- | --- | --- |
| F8-FR-01 | User Management | The admin panel has a User Management section | TBD |
| F8-FR-02 | Permission Management | The admin panel has a Permission Management section | TBD |
| F8-FR-03 | Forum | The admin panel has a Forum section (contents to be defined) | TBD |
| F8-FR-04 | Shoutbox | The admin panel has a Shoutbox section (contents to be defined) | TBD |
| F8-FR-05 | Site | The admin panel has a Site section (contents to be defined) | TBD |
| F8-FR-06 | Report Queue | The admin panel has a Report Queue section | TBD |
| F8-FR-07 | Audit Log | The admin panel has an Audit Log section | TBD |
| F8-FR-08 | Staff Permissions | Admins have full access. Delegated staff receive permissions individually or through permission groups, optionally scoped to a supported entity. There is no moderator role; permission names are defined in code and cannot be redefined by admins. (R-012, D-072) | TBD |
| F8-FR-09 | Global Administrator | The system enforces a single global administrator; a second administrator cannot be promoted and the only administrator cannot be demoted. (D-072) | TBD |
| F8-FR-10 | Moderation Reports | Reports support `pending`, `in_review`, `resolved`, and `dismissed` statuses, filtering, assignment, and resolution notes. Report targets use the defined `target_type` enum. (D-046) | TBD |
| F8-FR-11 | Account Sanctions | Mutes and shadow-bans apply at user level and cascade to linked actors. Issuing a sanction creates an audit entry and immediately alerts admins. Permanent-ban override or reversal is restricted to admins. | TBD |
| F8-FR-12 | Registration | Registration supports `open`, `gated`, and `closed` modes. In gated mode, applications support `pending`, `approved`, and `rejected` states; pending applicants cannot sign in, approval enables sign-in, and rejection retains the application while deleting the account and allowing same-email reapplication. | TBD |
| F8-FR-13 | Registration Blacklist | Blacklist entries support `ip`, `ip_range`, `email_domain`, and `email_hash` types, with `block` or `gate` actions. | TBD |
| F8-FR-14 | Content Hiding | Supported content types use `is_hidden`; every hide/unhide transition records previous state, new state, and reason in an audit event in the same transaction. (R-110, D-115) | TBD |
| F8-FR-15 | Content Deletion | Staff-initiated content soft-deletes write an audit event identifying the acting staff user and deleted item; user self-deletions are not audit logged. Content rows do not require a `deleted_by` column. (R-119, D-141) | TBD |
| F8-FR-16 | Audit Log | The audit log is append-only and readable by admins and staff with the appropriate permission. Before-and-after state is recorded in metadata. (R-054) | TBD |
| F8-FR-17 | Site Configuration | Site configuration is stored as keyed JSON configuration and validated against a code-defined registry. Typed settings include registration mode, media upload settings, storage quotas, export cooldowns, retention windows, and the activity inactivity threshold. | TBD |
| F8-FR-18 | Trust Tiers | Trust-tier IDs referenced in site configuration are validated in application code, and a tier referenced by configuration cannot be deleted. (P-053) | TBD |
| F8-FR-19 | Staff Authorization | Every staff action and protected administrative route checks the applicable server-side permission; delegated account-control actions must not rely on BetterAuth admin endpoints. | TBD |

Related admin capabilities are noted in Feature 1 (account management), Feature 2 (activity threshold), Feature 4 (shoutbox moderation), and Feature 6 (locking and pinning threads).

### 8.4 Data Layer

Candidate data from the notes:

- `rpc.staff_permission`, `rpc.permission_group`, `rpc.permission_group_item`, and `rpc.user_permission_group`
- `rpc.moderation_report` (nullable reporter, assigned staff member, status, target type, and resolution notes)
- `rpc.audit_log` (acting user, action, optional target, metadata, optional IP address, and timestamp)
- `rpc.site_config` (keyed JSON configuration, updater, and update timestamp)
- `rpc.security_blacklist` (type, value, action, reason, issuer, expiry, and timestamps)
- `rpc.user_sanction` (sanction types `mute` and `shadow_ban`)
- `rpc.user_deletion`, `rpc.registration_application`, and related user/account records
- BetterAuth user ban fields (`banned`, `ban_reason`, `ban_expires`); bans are not a `user_sanction` type
- Related entities managed through admin workflows, including users, actors, characters, forums, guilds, media, avatars, and content

*Entities, fields, and relationships to be mapped.*

### 8.5 Security and Privacy

- Admins have full access; delegated staff are limited to assigned permissions and supported scopes. No `moderator` role exists; `user.role` values are `admin` and `user`.
- Permission vocabulary is code-defined. Admins may assign existing delegable permissions but cannot redefine them; admin-only permissions cannot be granted to delegated staff, including through permission groups.
- Permission groups are global; direct staff grants may be global or scoped. Scoped grants require a supported scope type and scope ID.
- The system enforces one global administrator.
- Report target types must be validated against the enum, and the referenced row must match the stated target type. Reporter identity must not be disclosed to the reported user; exact notification behaviour remains to be confirmed with Notifications.
- Hide/unhide state changes and audit writes are atomic. Do not add `hidden_by` or `hidden_reason` columns to every content table by default; reconcile existing fields and entity eligibility separately.
- Staff-initiated soft-deletes are audit logged; routine user self-deletes are not. The central audit log is used instead of per-row deletion-attribution columns.
- Blacklist values may contain network and email-derived identifiers and require access controls and configured retention rules.
- Trust-tier references in site configuration must be validated; referenced tiers cannot be deleted.

### 8.6 Open Questions

- What belongs in the Forum, Shoutbox, and other content-specific admin panels?
- Which exact notification types and messages are sent to reporters when reports are resolved, and how is report confidentiality maintained?
- Are warnings first-class records, sanction types, or a separate concept, and how do they relate to trust tiers? (P-036)
- Is additional hidden-content review metadata needed, or is the audit log sufficient? (P-037)
- What are the retention windows and purge/anonymization rules for IP logs, sanctions, reports, audit records, private data, tokens, and media? (P-043)
- Which entities support hiding, how do existing `hidden_reason` fields reconcile with `is_hidden`, and what is the precedence among hiding, soft deletion, and other restrictions? (P-050)
- What cross-surface visibility rules apply to hidden, shadow-banned, and soft-deleted content, including feeds, search, notifications, counters, and unread markers? (P-075)
- Confirm the audit target-type schema against the enum-based decision; the current schema reference shows `varchar(32)`.
- Registration email verification and delivery, and runtime integration verification of application review, remain outstanding.

## Feature 9: Creatures

### 9.1 Overview

*Space reserved. To be defined later.*

Creatures are referenced elsewhere in the notes: a user can create a creature at registration (Feature 1), and a user's creature appears on their profile (Feature 11).

### 9.2 Use Cases

*To be written.*

### 9.3 Requirements

*To be defined.*

### 9.4 Data Layer

*To be mapped.*

### 9.5 Open Questions

- What is a creature, and what can a user do with it?

## Feature 10: User Interactions

### 10.1 Overview

Users can friend and block each other.

### 10.2 Use Cases

*To be written.*

### 10.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F10-FR-01 | Users can friend each other | TBD |
| F10-FR-02 | Users can block each other | TBD |

Related behavior is noted in Feature 7 (blocked users cannot DM) and Feature 11 (users can display or hide their friend list).

### 10.4 Data Layer

Candidate data from the notes:

- Friendship between two users
- Block between two users

*Entities, fields, and relationships to be mapped.*

### 10.5 Open Questions

- Does friending require acceptance from the other user?
- What else does a block affect besides DMs (comments, profile visibility, shoutbox pings)?

## Feature 11: User Profiles

### 11.1 Overview

Each user has a profile page, viewed at `/profile/[userId]`. Users control what information appears on it.

### 11.2 Use Cases

*To be written.*

### 11.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F11-FR-01 | Users have their own profile pages | TBD |
| F11-FR-02 | Users can choose what information they want to display on their profile page | TBD |
| F11-FR-03 | Users can display a simple bio on their profile page | TBD |
| F11-FR-04 | A user's latest activity (forum posts, shoutbox posts, comments, etc.) appears in their profile feed | TBD |
| F11-FR-05 | Users can display or hide their friend list | TBD |
| F11-FR-06 | A user's post count, comment count, and shoutbox count appear on their profile | TBD |
| F11-FR-07 | A user's avatar appears on their profile | TBD |
| F11-FR-08 | A user's creature appears on their profile | TBD |
| F11-FR-09 | A user's blog appears on their profile | TBD |
| F11-FR-10 | Profiles have comment sections | TBD |
| F11-FR-11 | A user can disable comments on their profile | TBD |

### 11.4 Data Layer

Candidate data from the notes:

- Profile (bio, display preferences for each profile element)
- Activity feed items (forum posts, shoutbox posts, comments)
- Post, comment, and shoutbox counts
- Friend list visibility setting
- Comments enabled/disabled setting

*Entities, fields, and relationships to be mapped.*

### 11.5 Open Questions

- Which profile elements can a user hide, and which are always shown?
- Are counts and the feed computed on demand or stored?

## Feature 12: Blogs

### 12.1 Overview

A per-user blog and journal system. Blog posts may represent player blogs, character journals, or admin news, authored through an actor.

### 12.2 Use Cases

*To be written.*

### 12.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F12-FR-01 | A user can have a simple blog | TBD |
| F12-FR-02 | A user can tag their blogs | TBD |
| F12-FR-03 | A user can control who sees each blog post | TBD |
| F12-FR-04 | Blog posts have a title and a body area | TBD |
| F12-FR-05 | Users can comment on blog posts | TBD |
| F12-FR-06 | A user can disable comments on their blog post | TBD |
| F12-FR-07 | Blog posts support `draft`, `published`, and `archived` publication states; soft deletion is separate | TBD |
| F12-FR-08 | Blog post visibility supports `everyone`, `friends_only`, and `private` | TBD |
| F12-FR-09 | Blog posts support custom styling and optional cover media | TBD |
| F12-FR-10 | Blog posts support moderation hiding separately from publication and deletion state | TBD |

### 12.4 Data Layer

Candidate data from the notes:

- `rpc.blog_post`: represents `player_blog`, `character_journal`, and `admin_news`; authored through `author_actor_id`
- Blog post fields include title, slug, Markdown content, status, visibility, comments setting, style configuration, optional cover media, moderation-hiding fields, and timestamps
- `rpc.blog_post.cover_media_id` references `rpc.user_media`
- Tags on blog posts (see Feature 15)
- Comments on blog posts (see Feature 13)
- Supported polymorphic relationships may include tagging, comments, reactions, mentions, media links, and lore links

*Entities, fields, and relationships to be mapped.*

### 12.5 Open Questions

- Blog visibility currently remains `everyone`, `friends_only`, and `private`; exact access semantics remain under review.
- Does a user have one blog, or can they have several?

## Feature 13: Comments

### 13.1 Overview

Users can comment on other users' blogs and profiles. Owners control who can see and use the comment section.

### 13.2 Use Cases

*To be written.*

### 13.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F13-FR-01 | Users can comment on other users' blogs | TBD |
| F13-FR-02 | Users can comment on other users' profiles | TBD |
| F13-FR-03 | Users can disable or enable comments on their own blogs or profiles | TBD |
| F13-FR-04 | Users can control who can see the comment section on their own blogs or profiles | TBD |
| F13-FR-05 | Users can control who can comment on their blog or profile | TBD |
| F13-FR-06 | Comments on supported targets are flat chronological feeds, not nested reply trees | TBD |
| F13-FR-07 | Content owners can toggle comments through `allow_comments` on supported content | TBD |

### 13.4 Data Layer

Candidate data from the notes:

- Comment (author, target, body, timestamp)
- Supported targets include blogs and profiles; other supported content targets follow the relevant interaction contracts
- `allow_comments` on supported content controls whether comments are enabled
- Comments are flat and chronological, not nested

*Entities, fields, and relationships to be mapped.*

### 13.5 Open Questions

- Can comments be edited or deleted, and by whom?

## Feature 14: Reactions

### 14.1 Overview

A standard reaction system.

### 14.2 Use Cases

*To be written.*

### 14.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F14-FR-01 | The system provides a standard reaction system | TBD |
| F14-FR-02 | Users can like shoutbox messages, posts, comments, and DMs | TBD |

### 14.4 Data Layer

Candidate data from the notes:

- Reaction (user, target, reaction type)
- Targets: shoutbox messages, posts, comments, DMs

*Entities, fields, and relationships to be mapped.*

### 14.5 Open Questions

- Is "like" the only reaction, or are there others?

## Feature 15: Taxonomy & Discovery

### 15.1 Overview

The Discovery system provides shared taxonomy/tagging, tag administration and moderation, aliases, and global
search/browse across forum threads/posts, blogs, lore, characters, guilds, and media. Search and tag-result surfaces
must respect the current viewer's permissions. Search-index design and several browse/tag edge cases remain open.

### 15.2 Use Cases

As a user, I should be able to:

| ID | Use case |
| --- | --- |
| UC-15.1 | Add tags to supported content using shared typeahead with usage counts and fuzzy matches |
| UC-15.2 | Find and select canonical tags when entering an alias |
| UC-15.3 | Submit a new tag where group policy permits, with approval where required |
| UC-15.4 | Search across supported content types using text, tags, filters, and sorting |
| UC-15.5 | Browse discovery content when the search query is empty |
| UC-15.6 | Open a tag page showing uses I am authorized to access and report a tag |
| UC-15.7 | Manage tags, aliases, taxonomy groups, and applicable content types when authorized staff |

### 15.3 Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| F15-FR-01 | Taxonomy groups are admin-defined and scoped to supported content types, including forum threads, blog posts, actors, lore articles, guilds, gallery media, and albums | TBD |
| F15-FR-02 | Each taxonomy group defines selection mode (`single` or `multi`), whether selection is required, creation policy, and sort order | TBD |
| F15-FR-03 | Tag creation policy is `open`, `moderated`, or `staff_only`; creation and approval behavior follows the selected policy | TBD |
| F15-FR-04 | “Create anyway” never bypasses group policy, duplicate handling, or approval requirements | TBD |
| F15-FR-05 | Search and tag entry resolve aliases to canonical tags and visibly clarify the canonical term | TBD |
| F15-FR-06 | Duplicate merges move associations to the surviving tag and preserve the old tag as an alias | TBD |
| F15-FR-07 | User-facing typeahead and filters show only approved, enabled tags, with usage counts and fuzzy matches | TBD |
| F15-FR-08 | The shared tag component is used on thread, blog, character, player, lore, and guild forms; tag pages show accessible uses and provide “Report tag” | TBD |
| F15-FR-09 | Tag reports enter the existing moderation queue; disabling a tag preserves existing associations | TBD |
| F15-FR-10 | Global search covers forum threads/posts, blogs, lore, characters, guilds, and media, enforcing viewer permissions before returning results | TBD |
| F15-FR-11 | Search supports filters for content type, tags, date, author, and rating, and sorting by relevance, newest, oldest, or popular | TBD |
| F15-FR-12 | Relevance prioritizes exact title matches, then partial title matches, then body/tag matches; popular search counts matching content visible to the current viewer | TBD |
| F15-FR-13 | An empty search query displays a browse view with filters and popular tags/content | TBD |
| F15-FR-14 | Ordinary search excludes hidden and deleted content; authorized staff access is governed by staff/moderation permissions | TBD |
| F15-FR-15 | Restricted content must not leak through search snippets, counts, facets, titles, URLs, or other result metadata | TBD |

### 15.4 Data Layer

- `rpc.taxonomy_group` stores group name, selection mode (`single`/`multi`), `is_required`, `creation_policy`, and sort order
- `rpc.taxonomy_group_scope` maps groups to supported target types; `thread_context` is nullable and, when set, applies only to `forum_thread`
- `rpc.tag` stores display name, slug, normalized key, official/disabled flags, approval status, creator, similarity reference where applicable, and usage count
- Tag approval states are `pending_review`, `approved`, and `rejected`; schema default is `approved`
- `rpc.tag_alias` maps aliases to canonical tags
- `rpc.entity_tag` bridges tags to polymorphic targets
- Slug and normalized key are unique within a taxonomy group; alias slug is unique; entity-tag uses the composite key `tag_id`, `target_type`, `target_id`
- `pg_trgm` indexes support typeahead matching; alias/canonical collisions and normalized resolution require application-level checks
- Searchable targets include Forum, Blog & Journal, Lore Library, Actors, Guilds, and Media entities

### 15.5 Security and Privacy

- Enforce the current viewer's permissions before returning search results.
- Public content may be discoverable; friend-only content appears only to viewers authorized to access it.
- Hidden and deleted content is excluded from ordinary search; staff access is permission-gated.
- Do not reveal restricted content through snippets, result counts, facets, or other result metadata.
- User-facing typeahead and filters show only approved and enabled tags.
- “Create anyway” cannot override group creation policy, approval requirements, or duplicate/alias rules.
- Staff taxonomy management uses applicable staff permissions. “Staff” follows G-7: admins plus users holding the relevant permission; admins implicitly hold all permissions.
- Hidden-content precedence and visibility enforcement across other surfaces remain open under P-050 and P-075.

### 15.6 Open Questions

- Choose the search-indexing design and verify permission enforcement before results and metadata are returned (P-068).
- Decide disabled-tag behavior for historical content, new tagging, typeahead, filters, and direct tag pages (P-069).
- Define browse-page popular-content calculation separately from the already-defined popular search sort (P-070).
- Define allowed polymorphic target validation and target deletion behavior, including `entity_tag` (P-074).
- Reconcile hidden-content visibility across search, feeds, notifications, counters, and other surfaces (P-075).
- Review the purpose/need for `taxonomy_group_scope.thread_context` and confirm the supported `entity_tag.target_type` set.
- Confirm collision handling for normalized tag/alias resolution and any additional alias constraints.

## Feature 16: Actors

### 16.1 Overview

The Actors system separates the authenticated account from the identity used to appear and author content. Each user has exactly one Out-Of-Character (OOC) player actor and may own any number of In-Character (IC) character actors. A character profile may represent either a character or a hub. Actor handles are globally unique. Auth owns credentials and sessions; content modules use actor identity for authorship.

### 16.2 Use Cases

As a user, I should be able to:

| ID | Use case |
| --- | --- |
| UC-16.1 | Have one player actor representing my OOC identity |
| UC-16.2 | Create and own multiple character or hub actors |
| UC-16.3 | Set and update globally unique actor handles |
| UC-16.4 | Manage my character or hub profile lifecycle, including activating, archiving, retiring, and reactivating it |
| UC-16.5 | Link images from my central media gallery to a character |
| UC-16.6 | Set a character's static avatar using a reference to my media |
| UC-16.7 | Retain my authored content with masked attribution if a character or account is deleted |

As a content author, I should:

| ID | Use case |
| --- | --- |
| UC-16.8 | Author content as an actor rather than directly as an account |
| UC-16.9 | Be prevented from writing content as an actor I do not own |

### 16.3 Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| F16-FR-01 | Each user owns exactly one player actor and may own any number of character actors; a character record represents either a character or a hub. (R-009) | TBD |
| F16-FR-02 | All content is authored by an actor, and every content write verifies server-side that the actor belongs to the authenticated session user. A client-supplied actor ID is not proof of ownership. (R-010) | TBD |
| F16-FR-03 | Actor handles are globally unique across player, character, and hub actors. | TBD |
| F16-FR-04 | Character and hub lifecycle states are draft, active, archived, and retired. Draft and archived profiles are owner/staff-only and cannot post; active profiles are public; retired profiles are public but locked/read-only and reactivatable. (R-027, R-028) | TBD |
| F16-FR-05 | Owners may change their own character/hub lifecycle state; staff require `characters.manage`. Each transition is recorded in an audit event in the same transaction. Allowed transitions are draft → active, active → archived, active → retired, archived → active, and retired → active. | TBD |
| F16-FR-06 | Publishing or reactivating a character/hub requires a 1–60-character name, a valid handle, and no active account ban or mute. (R-033) | TBD |
| F16-FR-07 | Soft deletion is separate from lifecycle status. A soft-deleted character's profile is inaccessible, while existing posts remain with masked author attribution and a visual indicator. (R-030, R-053) | TBD |
| F16-FR-08 | Account hard deletion retains posts, threads, and comments with masked authorship, strips sensitive user data, and does not create a system actor. (R-031) | TBD |
| F16-FR-09 | Restoring an account unmasks only actors deleted as part of account deletion; separately deleted characters remain deleted. | TBD |
| F16-FR-10 | A character may link any number of images from its owner's central media gallery, subject to the owner's media quota. (R-032) | TBD |
| F16-FR-11 | A character's static avatar is a nullable `static_avatar_media_id` reference to `rpc.user_media`. | TBD |

### 16.4 Data Layer

Candidate entities and fields from the Actors system:

- `rpc.actor`: owner `user_id`, `actor_type` (`player` or `character`), globally unique `handle`, RP status, searchability, tagline, comment controls, details, counts, and deletion fields (`deleted`, `deleted_at`, `deleted_reason`)
- `rpc.player`: OOC profile extension, including `display_name` and account-level profile/social settings
- `rpc.character`: `actor_id`, `profile_type` (`character` or `hub`), `status` (`draft`, `active`, `archived`, or `retired`), `name`, and nullable `static_avatar_media_id`
- `rpc.user`: owning authenticated account
- Character-to-media gallery links to owner-owned `rpc.user_media` records
- Actor handles are globally unique; one player actor exists per user
- Soft deletion uses actor-level `deleted` and nullable `deleted_at`, which must be consistent; `deleted_reason` distinguishes `character_deleted` from `account_deleted`

*Entities, fields, and relationships to be mapped against the schema.*

### 16.5 Security and Privacy

- Every actor-authored content write must validate actor ownership against the authenticated session user on the server.
- Draft and archived profiles are visible only to their owner and staff with `characters.manage`; active and retired profiles are public. Soft-deleted actors are inaccessible.
- Draft, archived, and retired profiles cannot post. Retired profiles may be reactivated by their owner or authorized staff.
- Active bans and mutes prevent publishing; sanctions apply to the account and cascade to linked characters and hubs.
- Character gallery links may reference only media owned by the relevant user.
- Ordinary search excludes deleted actors; handle and mention resolution uses globally unique handles and respects visibility and authorization.

### 16.6 Open Questions

- What exact masked-author display text and visual indicator should be used for deleted characters and users? (P-038)
- What should happen to `character.static_avatar_media_id` when the referenced media row is hard-purged? (P-071)
- The legacy documentation places character dossier `details` on `rpc.character`, while the current intended schema places `details` on `rpc.actor`; downstream documentation should follow the current schema.
- The richer character profile/dossier UI and character-to-media gallery relationship are not yet complete; acceptance should remain pending until implemented and verified.

## Feature 17: Content System

### 17.1 Overview

The Content system covers personal Lore Library articles, shared editor drafts and auto-save, asynchronous data portability exports, and central user media/gallery assets. Blog and journal publication is documented in Feature 12; comments are documented in Feature 13; detailed moderation and audit controls remain in Feature 8.

### 17.2 Use Cases

As a user, I should be able to:

| ID | Use case |
| --- | --- |
| UC-17.1 | Organize personal lore articles in folders and link them to supported content |
| UC-17.2 | Continue editing supported content through shared auto-saved drafts |
| UC-17.3 | Request an export of my eligible account data and receive a notification when it is ready |
| UC-17.4 | Upload and organize media in a central gallery, subject to file and account quotas |
| UC-17.5 | Embed or attach gallery media to supported content and see an unavailable placeholder if media is purged |

### 17.3 Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| F17-FR-01 | Lore folders and articles are account-owned; shared lore libraries are deferred (P-066) | TBD |
| F17-FR-02 | Lore articles support moderation hiding through `is_hidden` and `hidden_reason` | TBD |
| F17-FR-03 | Lore articles can link to characters, forum threads, forum posts, and blog posts; links support ordering and are unique per article/target tuple | TBD |
| F17-FR-04 | Lore articles may be referenced inline using the documented `[[lore:id]]` convention | TBD |
| F17-FR-05 | `rpc.user_draft` is the shared auto-save store across supported editors, including forum threads and forum posts/replies | TBD |
| F17-FR-06 | Drafts require `target_id` and enforce at most one draft per user/target | TBD |
| F17-FR-07 | Preserve legacy draft synchronization timing, enforce a 50-draft per-user cap, remove drafts on publication, and purge drafts inactive for 180 days | TBD |
| F17-FR-08 | Data exports are machine-readable JSON in a ZIP bundle and are processed asynchronously | TBD |
| F17-FR-09 | Export only items to which the requesting user contributed, retaining full legacy scope including complete thread context and DMs | TBD |
| F17-FR-10 | Export completion notifies the user; files and download links are purged after 7 days | TBD |
| F17-FR-11 | Export requests use a default 24-hour per-user cooldown configurable through `site_config.export_cooldown_hours` | TBD |
| F17-FR-12 | Media uploads accept PNG, JPEG, WebP, and GIF; SVG is excluded and file type is verified using magic bytes | TBD |
| F17-FR-13 | Default media limits are 5 MB per file and 100 MB per user, configurable through `site_config` and per-user quota overrides | TBD |
| F17-FR-14 | Media moderation state (`approved`, `pending_review`), hiding (`is_hidden`), and soft deletion (`deleted`, `deleted_at`) remain distinct | TBD |
| F17-FR-15 | Media links track inline embeds and attachments; permanently purged media leaves unavailable link tombstones and renders a standard placeholder | TBD |
| F17-FR-16 | Soft-deleted media is purged after the configurable retention period, default 30 days, without an investigation hold | TBD |
| F17-FR-17 | Server-side media handling strips EXIF GPS/camera metadata and avoids exposing raw storage paths | TBD |
| F17-FR-18 | Animated GIFs must be converted to animated WebP output where conversion is used, so animation is not lost | TBD |
| F17-FR-19 | Soft deletion for applicable content/media entities uses `deleted` plus nullable `deleted_at`, with a consistency check | TBD |
| F17-FR-20 | Each hide/unhide transition commits atomically with an `rpc.audit_log` event containing previous/new state and reason | TBD |

### 17.4 Data Layer

- `rpc.lore_folder` and `rpc.lore_article` are owned by `rpc.user`; an article may reference a folder or have no folder
- Lore articles include title, body, category, visibility, comment settings, hiding fields, and common soft-delete fields
- `rpc.lore_link` connects lore articles to characters, forum threads, forum posts, and blog posts
- `rpc.user_draft` stores editor drafts for `forum_thread`, `forum_post`, `blog_post`, `dm_conversation`, and `lore_article`; actor attribution is nullable
- `rpc.user_export_job` stores export jobs with states `pending`, `processing`, `completed`, and `failed`
- `rpc.user_media` stores user-owned media; `rpc.user_media_quota` stores per-user quota overrides
- `rpc.album` and `rpc.album_media` represent albums and membership; album visibility is inherited from the parent entity
- `rpc.media_link` tracks media embeds/attachments for forum posts, blog posts, comments, lore articles, direct messages, and shoutbox messages
- `rpc.site_config` stores configurable export cooldown, media retention, and upload limits
- `rpc.audit_log` records atomic hide/unhide transitions
- `character.static_avatar_media_id` references central media; avatar behavior remains in Feature 3

### 17.5 Security and Privacy

- Enforce contributor eligibility and the requesting user's access rights before exporting any item; export generation must not bypass content access or privacy controls.
- Apply blog and lore visibility rules; do not expose private or friend-only content to unauthorized viewers.
- Validate media types using magic bytes, reject SVG, strip EXIF location/camera metadata, and avoid exposing raw storage paths.
- Enforce per-file and per-user quotas, including administrative configuration and per-user overrides.
- Keep moderation status, hiding, and soft deletion as distinct states.
- Hide/unhide state changes and their audit events must be atomic.
- Purged media must not silently render as available; preserve unavailable `media_link` tombstones.
- Export files and links expire and are purged after 7 days.

### 17.6 Open Questions

- Reconcile hiding policy, eligible hidden entity types, and interactions between hiding, soft deletion, and visibility restrictions (P-050).
- Define safe behavior for active `character.static_avatar_media_id` references when media is purged (P-071).
- Ensure hide/unhide transitions and audit events commit atomically (P-072).
- Define allowed polymorphic target validation and deletion behavior for `media_link` and `lore_link` (P-074).
- Resolve hidden-content visibility across feeds, search, notifications, counters, and other surfaces (P-075).
- Shared lore ownership, collaboration, and permissions remain deferred (P-066).
- Revisit blog visibility (`private` versus `friends_only`) and lore visibility (including whether `private` or `guild_only` is needed); preserve current values until explicitly decided.
- Reconcile `media_link.target_type`, `usage_type`, and `lore_article.hidden_reason` as shared contracts.
- Confirm media purge handling for album membership and active avatar references before purge implementation.

## Cross-Cutting Data Model

*(Filled in once the features are complete. Consolidates the entities from each feature, resolves overlaps, and shows the full set of relationships.)*

| Entity | Used by features | Notes |
| --- | --- | --- |
| `rpc.blog_post` | 12 | Blog, journal, and admin-news content; actor-authored, with optional cover media. |
| `rpc.lore_folder`, `rpc.lore_article`, `rpc.lore_link` | 17 | Personal lore library and polymorphic links to supported content. |
| `rpc.user_draft` | 17 | Shared per-user/per-target editor draft persistence. |
| `rpc.user_export_job` | 17 | Asynchronous data portability export jobs. |
| `rpc.user_media`, `rpc.user_media_quota`, `rpc.album`, `rpc.album_media`, `rpc.media_link` | 3, 17 | Central media/gallery storage, quotas, albums, and content links. |
| `rpc.site_config`, `rpc.audit_log` | 8, 17 | Shared configuration and audit contracts. |
| `rpc.taxonomy_group`, `rpc.taxonomy_group_scope` | 15 | Admin-defined taxonomy groups and content-type scopes. |
| `rpc.tag`, `rpc.tag_alias`, `rpc.entity_tag` | 15 | Canonical tags, aliases, and polymorphic tag associations. |
| \[Entity\] | \[1, 2\] | \[Shared / owned by which feature\] |

## Global Open Questions and Risks

| # | Item | Type (Question / Risk) | Owner | Status |
| --- | --- | --- | --- | --- |
| 1 | \[Item\] | \[Type\] | \[Name\] | Open |
