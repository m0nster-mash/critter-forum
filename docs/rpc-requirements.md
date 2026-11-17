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
| 1 | Authentication | Login, logout, registration, email confirmation, account pages, and role-based access, built on BetterAuth | TBD | Notes captured |
| 2 | Activity Tracker | An /activity page and a Who's Online sidebar widget, with user privacy controls | TBD | Notes captured |
| 3 | Avatars | Customizable avatars built from layered SVG images | TBD | Notes captured |
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
| 15 | Taxonomy | A standard tagging system for all communications | TBD | Notes captured |
| 16 | Actors | OOC player and IC character/hub identities, handles, ownership, lifecycle, and authorship | TBD | Notes captured |

## Feature 1: Authentication

### 1.1 Overview

Authentication uses BetterAuth, with its default user, session, and related tables. Additional tables bridge the default BetterAuth tables.

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

*To be defined while working through the use cases.*

### 1.4 Data Layer

Candidate data from the notes:

- BetterAuth default tables (user, session, etc.)
- Additional tables that bridge the default BetterAuth tables (to be defined)
- Username, in addition to email and password
- Roles, including `user` and `admin`
- Email confirmation status
- Account ban status

*Entities, fields, and relationships to be mapped.*

### 1.5 Open Questions

- Does avatar and creature creation happen at registration, or after email validation?
- Which additional tables bridge the default BetterAuth tables?

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

Customizable avatars created out of various layered `.svg` images.

### 3.2 Use Cases

As a user, I should be able to:

| ID | Use case |
| --- | --- |
| UC-3.1 | Create an avatar when I register an account or when my account is activated |
| UC-3.2 | Edit my avatar on my `/settings` page |
| UC-3.3 | See my avatar next to any posts that I make on the site |

### 3.3 Requirements

*To be defined while working through the use cases.*

### 3.4 Data Layer

Candidate data from the notes:

- Avatar per user
- Layered `.svg` images (the available layers and options)
- The layer selections that make up each user's avatar

*Entities, fields, and relationships to be mapped.*

### 3.5 Open Questions

- Which layer categories exist (for example, body, hair, clothing)?
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

A simple per-user blog. A user's blog appears on their profile.

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

### 12.4 Data Layer

Candidate data from the notes:

- Blog post (author, title, body, visibility setting)
- Tags on blog posts (see Feature 15)
- Comments on blog posts (see Feature 13)

*Entities, fields, and relationships to be mapped.*

### 12.5 Open Questions

- Which visibility options exist (public, friends, private, etc.)?
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

### 13.4 Data Layer

Candidate data from the notes:

- Comment (author, target blog or profile, body, timestamp)
- Per-blog and per-profile settings: comments enabled, who can see comments, who can comment

*Entities, fields, and relationships to be mapped.*

### 13.5 Open Questions

- Are comments flat or threaded?
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

## Feature 15: Taxonomy

### 15.1 Overview

A standard tagging system for all communications.

### 15.2 Use Cases

*To be written.*

### 15.3 Requirements

Draft requirements from the notes:

| ID | Requirement | Priority |
| --- | --- | --- |
| F15-FR-01 | The system provides a standard tagging system for all communications | TBD |

Blog tagging is noted in Feature 12.

### 15.4 Data Layer

Candidate data from the notes:

- Tag
- Tagged items across all communication types

*Entities, fields, and relationships to be mapped.*

### 15.5 Open Questions

- Which content types count as "communications" (threads, posts, blogs, shoutbox, DMs)?
- Can users create new tags, or only admins?

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

## Cross-Cutting Data Model

*(Filled in once the features are complete. Consolidates the entities from each feature, resolves overlaps, and shows the full set of relationships.)*

| Entity | Used by features | Notes |
| --- | --- | --- |
| \[Entity\] | \[1, 2\] | \[Shared / owned by which feature\] |

## Global Open Questions and Risks

| # | Item | Type (Question / Risk) | Owner | Status |
| --- | --- | --- | --- | --- |
| 1 | \[Item\] | \[Type\] | \[Name\] | Open |
