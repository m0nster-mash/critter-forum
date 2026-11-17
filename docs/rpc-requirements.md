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

Two elements: an `/activity` page and a `<WhosOnline/>` sidebar widget.

### 2.2 Use Cases

As a user, I should:

| ID | Element | Use case |
| --- | --- | --- |
| UC-2.1 | Widget | See a simple widget in the sidebar that reads "n User Online" |
| UC-2.2 | Widget | Only see the count of registered users online, not a count of guests viewing the website |
| UC-2.3 | Widget | Be able to click the widget to be directed to the 'activity' page |
| UC-2.4 | Activity page | See a table of all currently online users who are choosing to display their status |
| UC-2.5 | Activity page | Be able to click the "View Profile" / eye-icon button to view any visible user's profile |
| UC-2.6 | Activity page | See a 'location' column showing the last page a user was on |
| UC-2.7 | Activity page | See a 'timestamp' column showing the last time the user made an action on the site |
| UC-2.8 | Activity page | See a count beneath the table of the number of guests currently viewing the site |
| UC-2.9 | Activity page | See a separate count beneath the table of the number of 'hidden' users currently viewing the site |
| UC-2.10 | Activity page | Not see an entry in the table for any user who is hiding their online status / appearing offline |
| UC-2.11 | Activity page | Not see the location of any user who is hiding their location; instead see masking text (e.g. "Viewing the Site") |
| UC-2.12 | Settings and privacy | Be able to hide my online status, making me appear offline |
| UC-2.13 | Settings and privacy | Be able to hide my location, masking the current page I am viewing |

As an admin, I should:

| ID | Element | Use case |
| --- | --- | --- |
| UC-2.14 | Admin controls | Be able to set the activity threshold in the admin panel. It defaults to 30 minutes. Any user who has not been active within the threshold is removed from the activity list and displayed as offline |
| UC-2.15 | Admin controls | Be able to see all online users, regardless of their privacy settings, on the 'activity' page |

### 2.3 Requirements

*To be defined while working through the use cases.*

### 2.4 Data Layer

Candidate data from the notes:

- Per-user last-active timestamp
- Per-user last page visited (location)
- Per-user privacy settings: hide online status, hide location
- Site setting: activity threshold (default 30 minutes)
- Counts of guests and hidden users currently viewing

*Entities, fields, and relationships to be mapped.*

### 2.5 Open Questions

- How are guests tracked, so they can be counted without a user account?
- How do hidden users count toward the separate 'hidden' total?

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

The admin panel is split into sections for managing users, permissions, the forum, the shoutbox, the site, reports, and an audit log.

### 8.2 Use Cases

*To be written.*

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

Related admin capabilities are noted in Feature 1 (account management), Feature 2 (activity threshold), Feature 4 (shoutbox moderation), and Feature 6 (locking and pinning threads).

### 8.4 Data Layer

Candidate data from the notes:

- Roles and permissions
- Reports (the report queue)
- Audit log entries
- Site settings (for example, the activity threshold)

*Entities, fields, and relationships to be mapped.*

### 8.5 Open Questions

- What belongs in the Forum, Shoutbox, and Site sections of the admin panel?
- Which actions are written to the audit log?
- What permissions exist beyond the `admin` role (for example, permission to view reports)?

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

## Cross-Cutting Data Model

*(Filled in once the features are complete. Consolidates the entities from each feature, resolves overlaps, and shows the full set of relationships.)*

| Entity | Used by features | Notes |
| --- | --- | --- |
| \[Entity\] | \[1, 2\] | \[Shared / owned by which feature\] |

## Global Open Questions and Risks

| # | Item | Type (Question / Risk) | Owner | Status |
| --- | --- | --- | --- | --- |
| 1 | \[Item\] | \[Type\] | \[Name\] | Open |
