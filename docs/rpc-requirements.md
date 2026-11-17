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
| 6 | Forum | Forum > Category > Board > (optional one-level sub-board) > Thread > Post, updated in real time | TBD | Notes captured |
| 7 | Direct Messages | A simple DM system between users, respecting blocks | TBD | Notes captured |
| 8 | Admin | An admin panel for users, permissions, forum, shoutbox, site, reports, and audit log | TBD | Notes captured |
| 9 | Creatures | Space reserved; to be defined later | TBD | Not started |
| 10 | User Interactions | Account-level friendships, blocking, follows, bookmarks, mentions, and thread read tracking | TBD | Notes captured |
| 11 | User Profiles | Profile pages with a bio, activity feed, counts, avatar, creature, blog, and comments | TBD | Notes captured |
| 12 | Blogs | A simple per-user blog with tags, visibility controls, and comments | TBD | Notes captured |
| 13 | Comments | Flat actor-authored comments on supported profiles and content, with owner soft-delete controls | TBD | Notes captured |
| 14 | Reactions | Configurable account-level reactions across supported content and messaging targets | TBD | Notes captured |
| 15 | Taxonomy & Discovery | Shared taxonomy/tagging, tag administration, aliases, and permission-aware global search/browse | TBD | Notes captured |
| 16 | Actors | OOC player and IC character/hub identities, handles, ownership, lifecycle, and authorship | TBD | Notes captured |
| 17 | Content System | Lore library, shared editor drafts, data exports, and central media/gallery assets | TBD | Notes captured |
| 18 | Guilds | User-owned community groups, membership and roles, character affiliations, guild-linked boards/news, and guild-scoped activity | TBD | Notes captured |

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

The forum is organized as Forum > Category > Board > (optional one-level sub-board) > Thread > Post. It supports OOC discussion, IC roleplay, advertisements, and guild-linked writing spaces. Content updates live, without page refreshes. Thread ownership is account-level (`creator_user_id`); posts are authored by actors.

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
| F6-FR-13 | Board modes are `ooc_only`, `ic_only`, and `blend`; board access is `public`, `member_only`, `group_restricted`, or `guild_restricted`. | TBD |
| F6-FR-14 | Thread context is `ic`, `ooc`, or `advertisement`, selected at creation and validated against board mode; staff may change it. | TBD |
| F6-FR-15 | Thread ownership is held only by `thread.creator_user_id`; participants do not receive an owner role. | TBD |
| F6-FR-16 | Thread privacy supports `public`, `restricted`, and `private`, subject to board access and staff access rules. | TBD |
| F6-FR-17 | Thread participants are actors with roles `participant` or `invited`; open threads permit eligible non-creator actors without participant rows, while invite-only threads require a participant row. | TBD |
| F6-FR-18 | Thread metadata is one-to-one with the thread and supports description, writing notes, banner media, and participant-edit configuration. | TBD |
| F6-FR-19 | Thread status flags `is_pinned`, `is_locked`, and `is_archived` are independent and may coexist. | TBD |
| F6-FR-20 | Thread URLs use `/thread/{short_id}-{slug}`; lookup uses `short_id` only and stale slugs redirect to the canonical URL. | TBD |
| F6-FR-21 | Posts are authored by actors; every write, edit, and persona correction verifies actor ownership by the authenticated session user. | TBD |
| F6-FR-22 | Posts record `is_edited` and `last_edited_at`; a full edit-history table is not defined. Report snapshots capture content at report time. | TBD |
| F6-FR-23 | Forum content is limited to 50,000 characters and JSON request bodies to 2 MB; authored Markdown/HTML is sanitized server-side before rendering. | TBD |
| F6-FR-24 | Posting cooldowns are configured by trust tier through `rpc.trust_tier.post_cooldown_seconds`. | TBD |
| F6-FR-25 | Threads and posts support hiding and soft deletion; soft deletion uses `deleted` and `deleted_at`, with a consistency check. | TBD |
| F6-FR-26 | Shadow-banned posts do not update `thread.last_post_id`, `thread.last_post_at`, or `thread.post_count`. | TBD |
| F6-FR-27 | Staff soft-deletes are centrally audit logged; user self-deletes are not. Content rows do not store `deleted_by`. | TBD |
| F6-FR-28 | Guild-linked boards use `rpc.guild_board_link`; active guild membership is required to post, and `guild_restricted` reads require active membership with staff/admin read bypass. | TBD |
| F6-FR-29 | Recruitment advertisements may reference a guild and auto-pause after 60 days of inactivity; paused ads remain on the board and sink below active ads. Automated bumping is not allowed. | TBD |
| F6-FR-30 | Threads use shared taxonomy/tagging; tag policy, aliases, and normalization are owned by Discovery. | TBD |
| F6-FR-31 | Thread read tracking stores `last_read_at` per user/thread; unread anchors derive from post timestamps, and inactive tracker rows are pruned after 180 days. | TBD |

### 6.4 Functional Behaviour

#### Categories, Boards, and Hierarchy

- Categories contain boards. A board may optionally reference a parent board for one level of sub-board nesting: Category → Board → Sub-board.
- `board_mode` values are `ooc_only`, `ic_only`, and `blend`. `ooc_only` permits OOC Player actor posting; `ic_only` permits IC Character/Hub actor posting; `blend` permits either, subject to thread context.
- `board_access` values are `public`, `member_only`, `group_restricted`, and `guild_restricted`.
- `group_restricted` means approved-user reply access for private roleplay; it is not the guild membership mechanism.
- A `guild_restricted` board requires a `rpc.guild_board_link` row and is readable only by active members of the linked guild. Staff/admins bypass the guild membership check for reading. Only active members may post on any guild-linked board, including a public one.
- Board access is enforced on every relevant route and API operation, not merely by hiding UI controls.

#### Threads, Ownership, Privacy, and Metadata

- `thread.creator_user_id` is the account owner of thread metadata, privacy settings, and participant management. Participants do not have an owner role.
- `thread.context` is selected at creation and validated against board mode. Advertisement boards use `advertisement`; `ic_only` forces `ic`; `ooc_only` forces `ooc`; `blend` permits the applicable IC or OOC choice. Staff may change context.
- Thread privacy values are `public`, `restricted`, and `private`: `public` follows board access; `restricted` is limited to the participant whitelist subject to staff access; `private` is visible to the creator and staff only.
- `rpc.thread_participant` links actors to threads with role `participant` or `invited`. The creator's actors may post without participant rows. For invite-only threads, other actors must be included as participants.
- Each thread has one `rpc.thread_metadata` record keyed by `thread_id`, with `description_markdown`, `writing_notes`, `banner_media_id`, and `allow_participant_edits`.
- When `allow_participant_edits` is enabled, whitelisted participants may update writing notes and lore references as described by the legacy specification. Exact field-level boundaries require implementation validation.
- `is_pinned`, `is_locked`, and `is_archived` are independent booleans and can coexist.
- URLs use `/thread/{short_id}-{slug}`. Resolve by `short_id` only; redirect stale slugs to the canonical URL. Slugs are cosmetic and not unique.

#### Posts, Authorship, and Editing

- Posts use `author_actor_id`, not a user ID. Every write validates that the actor belongs to the authenticated session user.
- The first post is the opening narrative post; `post_count` convention and counters must remain consistent with D-070 and the schema.
- On `ic_only` or `blend` boards, an author may correct an accidental persona selection by changing `author_actor_id`, provided the replacement actor belongs to the same session user and board/thread constraints remain satisfied.
- Edits set `is_edited` and `last_edited_at`. No separate full post edit-history table is defined.
- Forum content is capped at 50,000 characters, with a 2 MB JSON request body limit.
- Sanitize `content_markdown` server-side before rendering; do not render unsanitized user-authored HTML.
- Posting velocity cooldown is configured per trust tier through `rpc.trust_tier.post_cooldown_seconds`.

#### Hiding, Deletion, and Counters

- Posts and threads support hiding through `is_hidden`; `hidden_reason` distinguishes `shadow_ban` and `moderator`.
- Shadow-banned posts are hidden at write time and must not change `thread.last_post_id`, `thread.last_post_at`, or `thread.post_count` (D-140).
- Soft deletion uses `deleted` and `deleted_at` together, with `CHECK (deleted = (deleted_at IS NOT NULL))`. Do not use legacy `is_soft_deleted` or a `soft_deleted` status.
- Soft-deleted threads are hidden from regular users while remaining available to staff; the underlying thread and posts are not hard-deleted by this action.
- Staff soft-deletes write a central `audit_log` entry identifying the staff actor and target. User self-deletion is not audit logged. Content rows do not carry `deleted_by` (D-141).
- Cross-surface behavior for hidden, shadow-banned, and deleted content—including counters, search, feeds, notifications, unread markers, and recalculation after release—remains open under P-075.

#### Advertisements, Tags, and Read Tracking

- A recruitment advertisement may reference a guild through nullable `advertisement.guild_id` (D-075, D-129).
- Advertisements auto-pause after 60 days of inactivity based on `last_bumped_at`; they remain visible on the board in a paused state and sink to the bottom. Automated bumping is not allowed (D-077).
- Threads use the central tag component and taxonomy contracts. Thread tag scope includes IC, OOC, and advertisement contexts; Discovery owns tag scope, aliases, and policy.
- `rpc.thread_read_tracker` stores one `last_read_at` per `(user_id, thread_id)`. Unread posts and “jump to first unread” anchors are calculated by comparing post timestamps to `last_read_at`; there is no `last_read_post_id` FK.
- Read-tracker rows are pruned after 180 days of inactivity by background workers. DM read state is separate and stored in `rpc.dm_participant.last_read_at`.

### 6.5 Security and Privacy

- Guests may read public content but cannot post, comment, react, or DM (R-002). Enforce authorization server-side on every route and mutation.
- Verify `author_actor_id` belongs to the current session user on every post write, edit, and persona correction (R-010).
- For restricted/invite-only threads, validate participant membership for the posting actor; thread creator ownership is not a participant role.
- Enforce board access, guild link existence, active guild membership, and guild-restricted read rules. Staff/admin read bypass applies to guild-restricted boards; posting still follows the active-member rule unless the owning contract specifies a staff exception.
- Treat numeric `short_id` as the lookup key; do not trust the slug as an identifier or require it to be unique.
- Do not expose shadow-banned activity through thread bump fields or post counts.
- Sanitize user-authored Markdown/HTML server-side and apply the 50,000-character and 2 MB request limits.
- Staff deletion is centrally audited; self-deletion is not. Do not add deletion-attribution columns to `thread` or `post`.
- Do not assume one global visibility rule for hidden, deleted, and shadow-banned content until cross-module visibility and recalculation behavior is finalized.

### 6.6 Data Layer

- Hierarchy: `rpc.category`, `rpc.board`, optional one-level parent-board relationship, `rpc.thread`, `rpc.post`.
- Thread metadata and participants: `rpc.thread_metadata`, `rpc.thread_participant`.
- Advertisements and guild access: `rpc.advertisement`, `rpc.guild_board_link`.
- Read tracking: `rpc.thread_read_tracker`; DM read state remains in `rpc.dm_participant`.
- Shared contracts: `rpc.entity_tag`, `rpc.taxonomy_group_scope`, `rpc.moderation_report`, `rpc.audit_log`, `rpc.user_bookmark`.
- Thread state includes independent lock, pin, archive, privacy, context, hiding, and deletion fields.
- Post state includes actor authorship, edit marker/timestamp, hiding/deletion fields, and visible counter behavior.
- Guild board links, actor ownership, audit records, media references, tags, interactions, and notifications are owned by their respective modules.

### 6.7 Open Questions

- Which formatting options does the basic WYSIWYG panel include?
- Exact field-level boundaries for participant edits to thread metadata and lore references require validation.
- Exact interaction between thread privacy and board-level access should be tested; do not infer broader access than the contracts allow.
- Cross-surface visibility and recalculation for hidden, shadow-banned, and soft-deleted content remains open under P-075.
- Retention windows for forum-specific records require confirmation under P-043.
- Hiding fields and precedence among hiding, deletion, and other restrictions require reconciliation under P-050.
- Safe FK behavior when referenced media is hard-purged must include `thread_metadata.banner_media_id` (P-071).
- Real-time update technology remains unspecified.
- Read-tracker cleanup is specified as 180 days; confirm implementation scheduling details against the tracking worker.

### 6.8 Decision Traceability

- **Requirements:** R-002, R-010, R-021; D-068–D-079; D-123, D-124, D-129, D-136, D-137, D-138, D-140, D-141.
- **Open follow-ups:** P-043, P-050, P-071, P-075.
- **Schema/legacy notes:** `project.puml` Forum System and linked Guild, Tagging & Taxonomy, Moderation, Interaction, and Read/Unread Tracker entities; `rpc_temp_bundle.md` Forum and Tracking READMEs.
- Legacy `is_soft_deleted` is superseded by `deleted` / `deleted_at`. Participant rows link actors, not user IDs. Visibility/counter recalculation and media lifecycle behavior remain unresolved.

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

The Interactions module consolidates account relationships and shared engagement features: friendships, blocking, follows, bookmarks, mentions, and forum thread read tracking. Relationship state is bound to user accounts; authored comments and mention source content use actors. Comments and reactions are specified in Features 13 and 14.

### 10.2 Use Cases

*To be written.*

### 10.3 Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| F10-FR-01 | Users can send friend requests and accept or decline requests; declined requests remain stored. Friendship is an OOC account-to-account relationship, unique per unordered user pair. (D-093) | TBD |
| F10-FR-02 | Users can block other accounts. Blocking operates across all linked actors and cleans up applicable friendships, pending requests, and follows in both directions; future social requests between the accounts are prevented. (D-096) | TBD |
| F10-FR-03 | Users can follow supported users and content through one-way polymorphic subscriptions. Following a user or character notifies the owning account in-app, subject to `notify_in_app`; email delivery is out of scope. (D-094) | TBD |
| F10-FR-04 | Users can bookmark supported content. Bookmarks are unique per user and target; bookmarking another user's content may notify the content owner in-app. (D-095) | TBD |
| F10-FR-05 | Mentions resolve globally unique `actor.handle` values and store actor references, rather than relying on display names as identifiers. (D-083) | TBD |
| F10-FR-06 | Forum thread read tracking stores one `last_read_at` per user/thread and derives unread state and the first-unread anchor from post timestamps. (D-068) | TBD |
| F10-FR-07 | Inactive thread read-tracker rows are pruned after 180 days by a background worker. | TBD |
| F10-FR-08 | Friend-list presence is deferred. Future presence controls must support global visibility and an option allowing friends to see active status. (D-097) | TBD |
| F10-FR-09 | Player settings `allow_friend_requests` and `allow_follows` govern the corresponding actions; disabled actions are suppressed in the UI and rejected by the API. | TBD |

Related behavior is noted in Feature 7 (blocked users cannot DM) and Feature 11 (users can display or hide their friend list). Direct-message read tracking remains owned by Messaging and stored on `rpc.dm_participant.last_read_at`.

### 10.4 Data Layer

- `rpc.user_friend`: account-to-account friendship/request records, with `pending`, `accepted`, and `declined` status and uniqueness on the unordered user pair.
- `rpc.user_block`: account-level block records. Verify its exact fields and constraints against `project.puml` before implementation.
- `rpc.user_follow`: one-way subscriptions using `follower_user_id` and polymorphic `target_type` / `target_id`; current targets are `user`, `character`, `forum_thread`, `forum_board`, `blog_post`, `lore_folder`, and `lore_article`. Unique by follower and target.
- `rpc.user_bookmark`: polymorphic bookmarks, unique by `(user_id, target_type, target_id)`; supported targets are `forum_post`, `forum_thread`, `blog_post`, and `lore_article`.
- `rpc.mention`: polymorphic source reference, mentioned actor, author actor, and creation timestamp. Supported sources are `comment`, `forum_post`, `blog_post`, `shoutbox_message`, and `lore_article`.
- `rpc.thread_read_tracker`: one `last_read_at` per `(user_id, thread_id)`; no `last_read_post_id` foreign key.
- Reactions are covered by Feature 14; comments are covered by Feature 13. Their target vocabularies remain table-specific.

### 10.5 Security and Privacy

- Guests may read public content but cannot perform interactive actions; enforce this server-side for every protected operation. (R-002)
- Friendships, follows, bookmarks, and blocks are account-bound, not actor-persona-bound. Mention source content is actor-authored and validates that the author actor belongs to the authenticated account.
- Blocking and its relationship cleanup are application-level coordinated behavior; do not assume database cascades provide the complete contract. (D-096)
- Follow/bookmark notifications identify the recipient account and respect in-app preferences; email delivery is not included. (D-094, D-095)
- Do not expose inaccessible content or actor details through mentions, relationship lists, or polymorphic target metadata.
- Reject `character_dossier` as a bookmark target; do not introduce a replacement player/character target under D-142.

### 10.6 Open Questions

- **P-055:** Confirm the shared actor-resolution helper contract, including handle, display name, and avatar; deleted actors use the established masked-name pattern.
- **P-058:** Align follow/bookmark polymorphic target vocabularies where practical without reopening the settled reaction schema; clarify actor versus user/character targets.
- **P-062:** Decide whether bookmarks to deleted targets are removed or retained with a “This item no longer exists” placeholder.
- **P-063:** Define online visibility settings, including global visibility and allowing friends to see active status.
- **P-075:** Define cross-surface visibility for hidden, shadow-banned, and soft-deleted content, including reactions, bookmarks, feeds, search, and notifications.
- Verify the exact `rpc.user_block` fields and uniqueness/check constraints against the full schema.
- Confirm the `comment_poster_restriction` vocabulary against the source definition (also relevant to Feature 13).
- Direct-message read tracking remains out of scope for this feature; see Feature 7.

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

Comments are flat chronological feeds on supported actor profiles and content targets. Content owners can remove comments on their supported content through soft deletion; target visibility and posting restrictions remain governed by the owning entity.

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
| F13-FR-06 | Comments on supported targets are flat chronological feeds, not nested reply trees. (D-080) | TBD |
| F13-FR-07 | Content owners can toggle comments through `allow_comments` on supported content. (D-082) | TBD |
| F13-FR-08 | Comments support only `actor`, `blog_post`, `gallery_media`, and `lore_article` targets; `actor` covers player and character profiles. (D-086) | TBD |
| F13-FR-09 | Comment creation and editing validate that `author_actor_id` belongs to the authenticated account. (R-010) | TBD |
| F13-FR-10 | Content owners can remove comments on their supported content by setting `deleted` and `deleted_at` consistently; there is no separate owner-hide state. (D-084, D-138) | TBD |
| F13-FR-11 | Comment poster restrictions are enforced server-side using the target's `comment_poster_restriction` setting. (D-082) | TBD |

### 13.4 Data Layer

Candidate data from the notes:

- `rpc.comment`: author actor, polymorphic target, body, timestamps, and soft-delete fields.
- Supported `target_type` values are `actor`, `blog_post`, `gallery_media`, and `lore_article`; `actor` covers player and character profiles.
- Commentable entities support `allow_comments` and `comment_poster_restriction`; confirm the complete allowed-value vocabulary against the source schema before implementation.
- Comments are flat and chronological, not nested. Content-owner removal uses soft deletion, with no separate owner-hide state.
- Staff soft-deletes are centrally audit logged; routine author self-deletion is not. (D-141)

### 13.5 Open Questions

- **P-056:** Does the UI need to distinguish a comment removed by the target owner from one removed by its author? The current comment row does not record which party removed it.
- Confirm the exact full allowed-value vocabulary for `comment_poster_restriction` against the source definition.
- Comment target visibility and moderation behavior must follow the owning entity's access rules; cross-surface handling remains under P-075.

## Feature 14: Reactions

### 14.1 Overview

A configurable, account-level reaction system. A user may have one active reaction per target across all actor personas; reaction changes replace the previous reaction, and selecting the current reaction removes it.

### 14.2 Use Cases

*To be written.*

### 14.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F14-FR-01 | The system provides configurable reaction codes; the palette is not fixed by a database enum. (D-085) | TBD |
| F14-FR-02 | Users can react to supported shoutbox messages, direct messages, forum posts/threads, gallery media, characters, lore articles, blog posts, and comments. | TBD |
| F14-FR-03 | Reactions are unique per OOC user account and target, allowing at most one active reaction per account/item across alternate characters. (D-081) | TBD |
| F14-FR-04 | Users can add, switch, or remove their reaction by selecting a reaction code; switching replaces the previous reaction. | TBD |
| F14-FR-05 | Users cannot react to their own content; ownership is determined through the target/actor relationship, not the selected persona. | TBD |
| F14-FR-06 | Reaction displays may show multiple reaction codes with counts and reacting member handles. | TBD |
| F14-FR-07 | Reaction-triggered notifications are queued/debounced or bundled according to the notification contract; grouping and read-state behavior remain open. (P-059, P-060) | TBD |

### 14.4 Data Layer

Candidate data from the notes:

- `rpc.entity_reaction`: polymorphic target and reacting `user_id`; composite uniqueness on `(target_type, target_id, user_id)`.
- Supported targets: `shoutbox_message`, `direct_message`, `forum_post`, `forum_thread`, `gallery_media`, `character`, `lore_article`, `blog_post`, and `comment`. Do not silently replace `character` with a generic `actor` target.
- Reaction codes are configurable application values, not a fixed schema enum. Retired-code handling remains open under P-057.
- The reaction palette may display counts and reacting member handles. Notification bundling behavior is owned jointly with Notifications and remains open under P-059/P-060.

### 14.5 Open Questions

- **P-057:** When an emoji leaves the reaction palette, should existing reactions using that code be hidden, retained, or removed?
- **P-059:** Decide the grouping key and time window for bundling reaction notifications from multiple users on the same item.
- **P-060:** Decide whether a new reaction updates an existing read notification bundle or creates a new unread notification.
- **P-075:** Define visibility and recalculation rules for reactions attached to hidden, shadow-banned, or soft-deleted content.

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

## Feature 18: Guilds

### 18.1 Overview

The Guilds module supports user-owned community groups, membership applications and roles, character affiliations, guild-linked forum boards, guild blog/news posts, and guild-scoped activity within the existing activity feed. Guild identity, description, theme configuration, status, and soft deletion are managed by this feature. Guild boards reuse `rpc.board`, guild news reuses `rpc.blog_post`, and activity reuses the existing feed; no separate guild forum or activity-feed schema is introduced.

### 18.2 Functional Behaviour

**Guild identity and lifecycle**

- `rpc.guild` stores `owner_user_id`, name, slug, description, `theme_config`, status, soft-delete fields, and timestamps. Names and slugs are unique.
- `status` is `active` or `frozen_pending_review`; it is the guild visibility/moderation state, separate from soft deletion.
- Soft deletion uses `deleted` and `deleted_at` together, with a schema consistency check.
- Member count is computed from membership rows when displayed; do not store `rpc.guild.member_count`.
- `theme_config` remains text in the current schema. Its representation is a development follow-up under P-007; do not silently change its type.

**Membership and leadership**

- `rpc.guild_membership` has composite key `(guild_id, user_id)`, allowing at most one membership row per account and guild.
- Membership statuses are `pending_approval`, `active`, `declined`, and `banned`; roles are `leader`, `officer`, and `member`.
- Each guild must have exactly one active leader, and `owner_user_id` must match that leader's user account. Leadership transfer must update ownership and membership role/status values consistently.
- Only active memberships qualify for participation rules requiring guild membership. Application text and join/create timestamps are captured; detailed application workflows and remaining roster constraints follow source decisions and P-007 rather than assumptions from legacy prose.

**Character affiliations**

- `rpc.guild_character_link` links a guild and character and records the associated user and optional `title_in_guild`.
- The linked character must belong to the specified user, and that user must be an active guild member. Character affiliations cannot bypass account ownership or membership checks.
- Character soft deletion and actor attribution remain owned by Actors.

**Guild-linked forum boards**

- Guild boards reuse `rpc.board` and `rpc.guild_board_link`; there is no guild-specific board table. A board can be linked to at most one guild; the bridge has composite primary key `(guild_id, board_id)` and unique `board_id`.
- A linked board may use `public` or `guild_restricted` access. A `guild_restricted` board must have a link row and is readable only by active members of the linked guild, with staff/admin read bypass.
- Only active guild members may post on any guild-linked board, including public boards.
- `group_restricted` remains the approved-user reply mechanism for private roleplay and is distinct from guild membership restrictions. Read and write boundary checks must be tested.

**Guild blog and news**

- Guild blog/news posts reuse `rpc.blog_post` and `rpc.guild_blog_link`; a blog post can be linked to at most one guild. The bridge has composite primary key `(guild_id, blog_post_id)` and unique `blog_post_id`.
- Guild staff may choose public or private visibility for guild-linked posts. Only active guild members may comment, even when a post is public.
- General blog publication lifecycle, visibility semantics, comment settings, and soft deletion remain governed by Content and D-104; guild-specific comment restrictions are an additional contract.

**Recruitment advertisements and activity feed**

- `rpc.advertisement.guild_id` remains nullable; not every advertisement belongs to a guild.
- Guild activity reuses the existing Widgets activity feed. Do not add a separate guild activity-feed table.
- Feed queries must be scoped to the guild and relevant activity/users, enforce viewer authorization, and prevent guild-restricted activity leaking to non-members. Staff/admin bypass, where applicable, follows shared authorization policy. Implementation and testing remain under P-007.

### 18.3 Requirements

| ID | Requirement | Status |
| --- | --- | --- |
| R-117 | Each guild has exactly one active leader; `owner_user_id` matches that active membership with role `leader`. Leadership transfers update ownership and membership consistently. | TBD |
| R-117 | A user has at most one membership row per guild. A linked character must belong to the specified user, and that user must be an active guild member. | TBD |
| D-123 | Guild-linked boards are ordinary `rpc.board` records linked through `rpc.guild_board_link`. Linked boards may be public or guild-restricted, but only active guild members may post regardless of read visibility. | TBD |
| D-124 | `group_restricted` means approved-user reply access for private roleplay; it is not the guild access mechanism. | TBD |
| D-125 | Guild blog/news posts reuse `rpc.blog_post` through `rpc.guild_blog_link`. Guild staff choose public/private visibility, but only active guild members may comment, even on public posts. | TBD |
| D-126 | Guild activity reuses the existing Widgets activity feed; no separate guild activity feed is created solely for this purpose. | TBD |
| D-127 | Guild member count is computed from membership records and is not stored as `rpc.guild.member_count`. | TBD |
| D-128 | Guild visibility/hiding uses `guild.status`; do not add a separate `is_hidden` field. | TBD |
| D-129 | Keep nullable `rpc.advertisement.guild_id` for guild-linked recruitment advertisements. | TBD |
| D-136 | Confirmed guild model includes leader consistency, unique membership per guild/user, character ownership and active-membership checks, typed board/blog bridges, guild-member posting/commenting restrictions, and use of `status` for guild visibility. | TBD |
| D-137 | `rpc.board.board_access` includes `guild_restricted`. Such a board is readable only by active members of its linked guild, with staff/admin bypass; it must have a guild link. Any guild-linked board requires active membership to post. | TBD |
| D-138 | Guild soft deletion uses `deleted` plus nullable `deleted_at`, with a consistency check; `guild.status` remains `active` or `frozen_pending_review`. | TBD |

### 18.4 Security and Privacy

- Enforce account ownership, active membership, and character ownership when creating or changing guild membership and character affiliations (R-117, D-136).
- Maintain exactly one active leader and keep `owner_user_id` consistent with that membership (R-117, D-136).
- Only active guild members may post to guild-linked boards, regardless of public or guild-restricted read visibility (D-123, D-137).
- A guild-restricted board is readable only by active members; pending, declined, and banned memberships do not qualify. Staff/admin read bypass is permitted under D-137.
- Only active guild members may comment on guild-linked blog/news posts, including public posts (D-125, D-136).
- Guild visibility/hiding is controlled by `guild.status`; do not introduce a separate `is_hidden` flag (D-128, P-050).
- Soft-delete state must use `deleted` and `deleted_at` consistently (D-138). Staff-initiated soft deletion is recorded in `rpc.audit_log` under D-141; ordinary user self-deletion is not audit logged.
- Guild activity feed queries must enforce guild scoping and viewer authorization (D-126, P-007). Recruitment ads may have no guild; retain nullable `advertisement.guild_id` (D-129).

### 18.5 Data Model

- **Entities:** `rpc.guild`, `rpc.guild_membership`, `rpc.guild_character_link`, `rpc.guild_board_link`, `rpc.guild_blog_link`, `rpc.board`, `rpc.blog_post`, `rpc.advertisement`, `rpc.activity_tracker`, and `rpc.audit_log`.
- **Relationships:** `guild.owner_user_id` references `rpc.user`; membership links users and guilds; character links connect guilds, characters, and users; bridge tables join guilds to boards and blog posts; advertisements may optionally reference a guild.
- **Constraints:** Membership primary key `(guild_id, user_id)`; guild-board link primary key `(guild_id, board_id)` and unique `board_id`; guild-blog link primary key `(guild_id, blog_post_id)` and unique `blog_post_id`; guild status is `active`/`frozen_pending_review`; soft deletion uses `deleted`/`deleted_at` with a consistency check.
- Exactly-one-active-leader and owner/membership consistency require application-level transactional enforcement unless additional database enforcement is separately approved. Character ownership/active membership, board access restrictions, guild-blog comment restrictions, and feed scoping are application contracts. `theme_config` remains text pending P-007. Guild visibility policy requires broader reconciliation under P-050 without adding `is_hidden`.

### 18.6 Cross-Module Dependencies and Open Questions

- **Forum:** Guild boards reuse `rpc.board`; active membership is required to post, and guild-restricted boards require a guild link (D-123, D-124, D-137). `group_restricted` remains private-RP approved-user access.
- **Content:** Guild news reuses `rpc.blog_post`; only active members may comment (D-125, D-136). Public visibility does not make comments public.
- **Discovery:** Guilds are taggable and searchable under shared taxonomy (D-116, D-117); Discovery must respect guild visibility and viewer authorization.
- **Actors & Hubs:** Guild character links require character ownership by the linked user and active guild membership (R-117, D-136). Character ownership stays account-based.
- **Moderation, Governance & Admin:** Guild status handles hiding/frozen review; staff deletion is audited (D-128, D-138, D-141, P-050). Do not add a separate guild hiding flag.
- **Live Widgets:** Guild activity uses the existing activity feed with guild scoping and authorization (D-126, P-007); no separate guild feed table.
- **Forum / Advertising:** Recruitment advertisements may optionally link to a guild (D-129); `advertisement.guild_id` remains nullable.
- **Media & Gallery:** Album/media ownership and inherited visibility may intersect guilds (P-032, P-034); resolve parent/ownership contract before implementing guild-scoped galleries.

| ID | Open question / follow-up | Required next step |
| --- | --- | --- |
| P-007 | Implement guild-scoped activity filtering and authorization; revisit `theme_config` representation and remaining roster constraints. | Implement and test; keep `theme_config` as text until a change is approved. |
| P-032 / P-034 | Settle album ownership, parent-child integrity, and inherited gallery visibility. | Resolve parent/ownership contract before implementing guild-scoped galleries. |
| P-050 | Reconcile guild visibility with the cross-module hiding policy. | Keep `guild.status` as the visibility/hiding state; do not add `is_hidden`. |
| P-075 | Ensure hidden/frozen/deleted guild content is treated consistently across search, feeds, notifications, and other surfaces. | Validate cross-surface policy during development. |

### 18.7 Acceptance Criteria

- [ ] Every guild has exactly one active leader, and owner identity matches the active leader membership (R-117, D-136).
- [ ] Member counts are derived from membership rows rather than stored in `rpc.guild` (D-127).
- [ ] Only active guild members can post on guild-linked boards; guild-restricted boards require a guild link and enforce active-member read access, with staff/admin bypass (D-123, D-137).
- [ ] `group_restricted` continues to represent approved-user replies for private roleplay, not guild membership (D-124).
- [ ] Guild-linked blog posts support public/private visibility while comments remain restricted to active guild members (D-125).
- [ ] Guild activity reuses the existing feed and enforces guild-scoped filtering and viewer authorization (D-126, P-007).
- [ ] Guild visibility uses status and soft deletion uses consistent `deleted`/`deleted_at` values (D-128, D-138).
- [ ] Recruitment advertisements can have a nullable guild link (D-129).
- [ ] Gallery ownership, guild visibility, and cross-surface access questions are explicitly resolved and tested before related functionality is considered complete (P-032, P-034, P-050, P-075).

### 18.8 Source Traceability

- **Requirements source:** `DECISION_LOG.md` — R-117 and D-123–D-129, D-136–D-138, D-141.
- **Decision source:** `DECISION_LOG.md` — D-123–D-129, D-136–D-138, D-141; open items P-007, P-032, P-034, P-050, P-075.
- **Schema source:** `project.puml` — Guild System, Forum System, Blog & Journal System, and existing Widgets/activity and moderation relationships.
- **Legacy documentation:** `rpc_temp_bundle.md` — Guilds, forum integration, guild news, and activity feed material.
- **Traceability note:** Current schema and settled decisions override legacy proposals. Application-level invariants are called out explicitly; unresolved work remains in the open questions above.

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
| `rpc.category`, `rpc.board`, `rpc.thread`, `rpc.thread_metadata`, `rpc.thread_participant`, `rpc.post`, `rpc.advertisement`, `rpc.guild_board_link` | 6 | Forum hierarchy, thread ownership/metadata/participants, actor-authored posts, advertisements, and guild-linked boards. |
| `rpc.thread_read_tracker` | 6, 10 | Per-user/per-thread read timestamps and unread tracking; direct-message read state remains separate in Messaging. |
| `rpc.guild`, `rpc.guild_membership`, `rpc.guild_character_link` | 18 | Guild identity, membership/leadership, and character affiliations. |
| `rpc.guild_board_link`, `rpc.guild_blog_link` | 6, 12, 18 | Typed bridges linking ordinary forum boards and blog posts to guilds. |
| `rpc.user_friend`, `rpc.user_block`, `rpc.user_follow` | 10 | Account-level friendships, blocks, and polymorphic follows/subscriptions. |
| `rpc.mention` | 10 | Polymorphic actor-handle mention records. |
| `rpc.comment` | 13 | Flat chronological actor-authored comments with polymorphic targets and soft deletion. |
| `rpc.entity_reaction` | 14 | Account-level unique reactions on supported polymorphic targets. |
| `rpc.moderation_report`, `rpc.audit_log`, `rpc.user_bookmark` | 6, 8, 10 | Forum report snapshots, central staff-action audit events, and polymorphic bookmarks. |
| \[Entity\] | \[1, 2\] | \[Shared / owned by which feature\] |

## Global Open Questions and Risks

| # | Item | Type (Question / Risk) | Owner | Status |
| --- | --- | --- | --- | --- |
| 1 | \[Item\] | \[Type\] | \[Name\] | Open |
