"""
Bundle repository files into Markdown for AI context.

Usage:
    python project_bundle.py                       # flat, entire repo
    python project_bundle.py flat                  # flat, entire repo
    python project_bundle.py nested                # root + each root directory
    python project_bundle.py src-nested            # only src/, split by directory

Outputs are written to ./exports/.

Versioning:
    Every output file carries a "**Version:** N" line. Before old bundles are
    deleted, the highest version found in exports/*_bundle.md is read, and the
    replacement files are written with that number + 1. If no previous bundle
    exists (or none has a version), the first version is 1. All files written
    in a single run share the same version number.

bundle_meta.md:
    Every run also writes exports/bundle_meta.md. It holds the version, the
    AI INSTRUCTIONS, and the full directory tree of all eligible files.

Optional per-bundle extras (both default to False, see CONFIGURATION):
    INCLUDE_TREE_IN_BUNDLES          directory tree at the top of each bundle
    INCLUDE_INSTRUCTIONS_IN_BUNDLES  AI INSTRUCTIONS at the top of each bundle

Git ignore rules are respected for untracked files, including nested
.gitignore files. Tracked files follow Git's normal behavior and remain
eligible even if a .gitignore rule matches them.

.env files are explicitly included, even when ignored by Git.
"""

import argparse
import re
import subprocess
from pathlib import Path
from collections import defaultdict

# ============================================================================
# CONFIGURATION
# ============================================================================

OUTPUT_FILE = "project_bundle.md"
META_FILE = "bundle_meta.md"

# Always written to bundle_meta.md. Set these to True to ALSO repeat them
# inside every bundle file.
INCLUDE_TREE_IN_BUNDLES = False
INCLUDE_INSTRUCTIONS_IN_BUNDLES = False
EXPORTS_DIR_NAME = "exports"

SCRIPT_PATH = Path(__file__).resolve()
PROJECT_ROOT = SCRIPT_PATH.parent
EXPORTS_DIR = PROJECT_ROOT / EXPORTS_DIR_NAME

# Version line written into every bundle, and the pattern used to read it back.
VERSION_PATTERN = re.compile(r"^\*\*Version:\*\*\s*(\d+)\s*$", re.MULTILINE)
VERSION_SCAN_CHARS = 4096  # only the top of each old bundle is scanned


# ============================================================================
# OMIT DIRECTORIES AND FILES
#
# This is the main exclusion list. Comment out any entry to include it again.
#
# OMIT_DIRECTORIES:
#   Directory names excluded wherever they occur in the repository.
#
# OMIT_ROOT_DIRECTORIES:
#   Directories excluded only at the repository root.
#
# OMIT_MODULES:
#   Module folders under src/modules/. Uncommented = omitted.
#
# OMIT_FILENAMES:
#   Exact filenames excluded wherever they occur.
#
# OMIT_FILENAME_PREFIXES:
#   Filename prefixes excluded wherever they occur.
#
# OMIT_EXTENSIONS:
#   File extensions excluded wherever they occur.
#
# These exclusions apply even if Git tracks the file or directory.
# .env files are an intentional exception to Git ignore rules, but are still
# subject to the explicit exclusions below.
# ============================================================================

OMIT_DIRECTORIES = {
    ".git",
    ".idea",
    ".next",
    ".turbo",
    "node_modules",
    "__pycache__",
    ".venv",
    "venv",
    "dist",
    "build",
    "coverage",
    "drizzle",
    EXPORTS_DIR_NAME,
}

OMIT_ROOT_DIRECTORIES = {
    "public",
    # "docs",
    # "tests",
}

# Modules under src/modules/. Every module is listed.
# An UNCOMMENTED entry is OMITTED. COMMENT OUT a module to include it.
# Files sitting directly in src/modules/ (DECISION_LOG.md, project.puml)
# are not affected by this list.
MODULES_PATH = ("src", "modules")

OMIT_MODULES = {
#     "activity",
#     "actors",
#     "admin",
#     "auth",
#     "avatar",
#     "content",
#     "discovery",
#     "forums",
#     "guilds",
#     "interactions",
#     "messaging",
#     "notifications",
#     "shoutbox",
}

OMIT_FILENAMES = {
    SCRIPT_PATH.name,
    ".DS_Store",
    "Thumbs.db",
    "tsconfig.tsbuildinfo",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
}

OMIT_FILENAME_PREFIXES = (
    # "secret-",
)

OMIT_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".bmp", ".tiff",
    ".pdf", ".zip", ".tar", ".gz", ".7z",
    ".mp3", ".wav", ".ogg", ".mp4", ".mov", ".avi", ".webm",
    ".woff", ".woff2", ".ttf", ".otf", ".eot",
    ".svg",
}

# Set to True to include .env files even when Git ignores them.
INCLUDE_ENV_FILES = False


# ============================================================================
# LANGUAGE DETECTION
# ============================================================================

LANGUAGES = {
    ".html": "html", ".htm": "html", ".css": "css",
    ".js": "javascript", ".mjs": "javascript", ".cjs": "javascript",
    ".json": "json", ".py": "python", ".md": "markdown", ".txt": "text",
    ".xml": "xml", ".svg": "xml", ".yaml": "yaml", ".yml": "yaml",
    ".sh": "bash", ".bash": "bash", ".sql": "sql", ".php": "php",
    ".java": "java", ".c": "c", ".h": "c", ".cpp": "cpp", ".hpp": "cpp",
    ".ts": "typescript", ".tsx": "tsx", ".jsx": "jsx", ".vue": "vue",
    ".scss": "scss", ".less": "less", ".go": "go", ".rs": "rust",
    ".toml": "toml", ".ini": "ini", ".graphql": "graphql",
    ".prisma": "prisma", ".mdx": "mdx", ".svelte": "svelte",
    ".kt": "kotlin", ".swift": "swift", ".rb": "ruby",
    ".ex": "elixir", ".exs": "elixir", ".dart": "dart",
    ".r": "r", ".lua": "lua", ".pl": "perl",
}


def language_from_extension(path):
    """Return a Markdown code-fence language for a file."""
    return LANGUAGES.get(path.suffix.lower(), "")


# ============================================================================
# FILE DISCOVERY
# ============================================================================

def is_env_file(path):
    """Recognize .env, .env.local, .env.example, and similar files."""
    return path.name == ".env" or path.name.startswith(".env.")


def is_explicitly_omitted(path):
    """Apply the user-editable exclusion lists."""
    relative = path.relative_to(PROJECT_ROOT)
    parts = relative.parts

    if any(part in OMIT_DIRECTORIES for part in parts):
        return True

    if parts and parts[0] in OMIT_ROOT_DIRECTORIES:
        return True

    # src/modules/<name>/... is omitted when <name> is listed in OMIT_MODULES.
    depth = len(MODULES_PATH)
    if (
        len(parts) > depth
        and parts[:depth] == MODULES_PATH
        and parts[depth] in OMIT_MODULES
    ):
        return True

    if path.name in OMIT_FILENAMES:
        return True

    if path.name.startswith(OMIT_FILENAME_PREFIXES):
        return True

    if path.suffix.lower() in OMIT_EXTENSIONS:
        return True

    return False


def git_eligible_files():
    """
    Collect Git-tracked files and non-ignored untracked files.

    Git handles .gitignore rules, nested ignore files, .git/info/exclude,
    and the user's global ignore rules.

    Tracked files are returned even if they match an ignore rule, consistent
    with Git's normal behavior.
    """
    command = [
        "git", "-C", str(PROJECT_ROOT),
        "ls-files", "--cached", "--others", "--exclude-standard", "-z",
    ]

    try:
        result = subprocess.run(
            command,
            check=True,
            capture_output=True,
        )
    except FileNotFoundError:
        raise SystemExit(
            "Git was not found. Install Git and ensure it is on your PATH."
        )
    except subprocess.CalledProcessError as exc:
        raise SystemExit(
            "Could not list Git files. Run this script inside a Git repository.\n"
            + exc.stderr.decode("utf-8", errors="replace")
        )

    paths = set()

    for raw_path in result.stdout.split(b"\0"):
        if not raw_path:
            continue

        relative = Path(raw_path.decode("utf-8", errors="surrogateescape"))
        path = PROJECT_ROOT / relative

        if path.is_file():
            paths.add(path.resolve())

    # Git intentionally hides ignored, untracked .env files. Add them back
    # explicitly, unless they fall under one of the custom exclusions.
    if INCLUDE_ENV_FILES:
        for path in PROJECT_ROOT.rglob("*"):
            if path.is_file() and is_env_file(path):
                resolved = path.resolve()

                try:
                    resolved.relative_to(PROJECT_ROOT)
                except ValueError:
                    continue

                if not is_explicitly_omitted(resolved):
                    paths.add(resolved)

    return sorted(
        (
            path for path in paths
            if not is_explicitly_omitted(path)
        ),
        key=lambda p: p.relative_to(PROJECT_ROOT).as_posix().lower(),
    )


def files_in_directory(directory, all_files):
    """Return eligible files belonging to a directory, recursively."""
    if not directory.is_dir():
        return []

    try:
        prefix = directory.resolve().relative_to(PROJECT_ROOT).as_posix()
    except ValueError:
        return []

    prefix += "/"

    return [
        path for path in all_files
        if path.relative_to(PROJECT_ROOT).as_posix().startswith(prefix)
    ]


def files_at_root(all_files):
    """Return eligible files sitting directly in the repository root."""
    return [
        path for path in all_files
        if len(path.relative_to(PROJECT_ROOT).parts) == 1
    ]


def sort_files(files):
    """Deduplicate and sort files by repository-relative path."""
    return sorted(
        set(files),
        key=lambda p: p.relative_to(PROJECT_ROOT).as_posix().lower(),
    )


# ============================================================================
# AI INSTRUCTIONS (written to bundle_meta.md; optionally to each bundle)
# ============================================================================

AI_INSTRUCTIONS_TEXT = r"""# AI INSTRUCTIONS

These rules apply to every message in this conversation, not just the first.

## 1. Role

You are a code assistant skilled in web development with Next.js, TypeScript, and the surrounding ecosystem. Deliver complete, release-ready code that meets the stated requirements.

Be clear, clean, and concise. Do not pad replies with explanation, preamble, or closing remarks.

## 2. Decisions

When in doubt, stop and ask. Do not guess or decide impactful matters yourself.

**Requires sign-off (ask first):**
- New dependencies
- DB schema or migration changes
- Creating, deleting, moving, or renaming files or folders
- Changing a function's signature or return type
- Changes to auth, permissions, or audit logging
- Config files (`package.json`, `tsconfig`, `next.config`, `drizzle.config`, `.env*`)
- Any behavior change beyond what was requested
- Using `any`, `@ts-ignore`, or `eslint-disable`

**You may decide (list under "Decisions Made"):** local variable names, function names, and helper placement within a file.

**Asking questions:**
- Ask all questions in one message, before writing code.
- When blocked, reply with questions only. Return no code.
- If these rules conflict with a request, ask. Do not pick a side.
- Asking takes priority over producing release-ready code.

## 3. Scope

Change only what the request requires.

- Do not reformat code or alter spacing, indentation, or import order. Unrequested formatting changes add noise to the diff and make review harder.
- Do not modify unrelated code.
- Do not refactor, optimize, add features, add extra error handling, or remove dead code or unused imports. Exception: imports the change itself orphans.
- Update documentation and comments only if the change makes them inaccurate.
- If you notice an unrelated bug or issue, report it in one line under "Out-of-Scope Observations". Do not fix it.
- Preserve line endings, trailing newlines, and everything outside the changed region.

## 4. Project Conventions

Follow patterns already established in the project. Match nearby code.

- **Module structure:** keep each module's layout (`actions/`, `queries/`, `components/`, `db/`, `hooks/`, `lib/`, `styles/`, `constants.ts`, `types.ts`, barrel `index.ts`).
- **Placement:**
  - Actions go in the module's `/actions`.
  - Queries go in the module's `/queries`.
  - Props and types go in the module's `types.ts`.
  - Constants go in the module's `constants.ts`.
- **Constants:** no magic strings or numbers. Use judgment: not every literal needs a constant.
- **Imports:** use barrel (`index.ts`) imports where the surrounding code does.
- **Styling:** CSS modules only. No inline styles or new styling approaches.
- **Next.js:** respect the server/client boundary and `"use client"` placement.
- **Security:** follow existing patterns for guards, permission checks, and audit logging.
- **Naming:** follow existing naming conventions.

## 5. Bundles

You receive the project as Markdown bundles. Treat them as a snapshot.

- Read the relevant bundles and `bundle_meta` before planning changes.
- `bundle_meta` holds the full directory tree. Use it to see what exists.
- Bundles may be partial (omitted modules, `public/`, `drizzle/`, etc.). If you need a file you don't have, ask for it. Never guess its contents.
- Bundle versions may differ. This is normal: a single bundle may have been regenerated alone. Do not assume a version difference means files are out of sync. Flag it only if you see actual evidence of inconsistency, such as a missing export or a mismatched import.
- On follow-up requests, work from the latest version of any file you already returned, not the original bundle.
- Bundles may contain secrets (`.env`). Never repeat secrets in your output.

## 6. Verification

You cannot run code. Never state or imply that you did.

- Before returning, check by reading: imports resolve, types align, and nothing references anything renamed or removed.
- Identify existing tests affected, and whether they need updating or new tests are needed.
- In the Verification section, `Executed` is "None" unless you actually ran something. Separate what was executed from what was only checked by reading.

## 7. Output

### Rules

- Return only files that changed. Never return unchanged files.
- Always make clear where each file lives: give the full path in its heading.
- **Never put the path in a comment inside the code.**
- **Types:**
  - `NEW`: file did not exist. Full contents.
  - `REPLACE`: full file contents.
  - `UPDATE`: partial. Return a complete function or a clearly bounded section.
  - `DELETE`: path only.
  - `MOVE`: old path → new path.
- **Partial returns (`UPDATE`):**
  - Return the entire function or section, even if only one line changed.
  - The `Scope` line names the function or section.
  - No elision (`// ...unchanged`) inside the block.
  - Never describe edits in prose, such as "replace X with Y" or "find the line that starts with...". Return code the user can paste.
- Return the full file if changes are spread across it or a partial would be harder to apply.
- List files in project-tree order.
- Omit empty sections. Summary and Verification are always present.
- Start at Summary. No preamble or closing chatter.
- Use four backticks for the outer fence when a returned file itself contains triple backticks.
- Add a `Note` only when a change needs explaining. If a change does exactly what was requested, no note.
- If a change was a sign-off item, the Note says it was approved.

### Template

````markdown
## Summary
**Bundles used:** bundle_meta (vN), src_modules_auth_bundle (vN)
**Changes:** N files (N NEW, N UPDATE, N REPLACE, N DELETE, N MOVE)

## Questions
<!-- ONLY if blocked. If present, return this section alone. No code. -->
1. ...

## Changes

### 1. [UPDATE] `path/to/file.ts`
**Scope:** function `name`
**Note:** <!-- only if needed -->

```ts
// complete function
```

### 2. [REPLACE] `path/to/file.ts`
```ts
// full file contents
```

### 3. [NEW] `path/to/file.ts`
```ts
// full file contents
```

### 4. [DELETE] `path/to/file.ts`

### 5. [MOVE] `old/path.ts` → `new/path.ts`

## Follow-up Actions
<!-- Only if needed: npm install, migrations, new env vars, etc. -->

## Decisions Made
<!-- Minor choices made without sign-off. One line each. -->

## Out-of-Scope Observations
<!-- Noticed, NOT changed. One line each. -->

## Verification
**Executed:** None
**Checked by reading:** imports resolve; types align; no dangling references
**Tests affected:** `path/to/test.ts` (needs update / no change)
**Suggested commands:** `npm run typecheck`, `npm run lint`, `npm test`
````

## 8. Delivery

The reply format above is identical for every model. Only the delivery wrapper differs.

- **Gemini:** output everything into the Studio as a file named `updated_bundle.md`.
- **ChatGPT:** output a `updated_bundle.zip`, with folders matching the project's file system so each file's destination is clear.
- **Claude:** return individual files or a ZIP, whichever costs fewer tokens. A ZIP uses folders matching the project's file system. Individual files are named with their path in the heading, not in code comments.
- When files are delivered separately from the reply, the Summary, Follow-up Actions, Decisions Made, Out-of-Scope Observations, and Verification still appear in chat.
"""


# ============================================================================
# VERSIONING
# ============================================================================

def read_bundle_version(path):
    """Return the version number recorded in a bundle, or None if absent."""
    try:
        with path.open("r", encoding="utf-8", errors="replace") as handle:
            head = handle.read(VERSION_SCAN_CHARS)
    except OSError:
        return None

    match = VERSION_PATTERN.search(head)
    return int(match.group(1)) if match else None


def existing_output_files():
    """All files this script produces in exports/ (bundles + meta)."""
    if not EXPORTS_DIR.is_dir():
        return []

    files = list(EXPORTS_DIR.glob("*_bundle.md"))
    meta = EXPORTS_DIR / META_FILE
    if meta.is_file():
        files.append(meta)
    return files


def next_version():
    """
    Highest version among existing bundles in exports/, plus one.

    Must be called BEFORE old bundles are deleted. Returns 1 when there is
    no previous versioned bundle.
    """
    highest = 0

    if EXPORTS_DIR.is_dir():
        for bundle in existing_output_files():
            version = read_bundle_version(bundle)
            if version is not None and version > highest:
                highest = version

    return highest + 1


# ============================================================================
# DIRECTORY TREE
# ============================================================================

def build_tree(paths):
    """Turn file paths into a nested dict. Files map to None."""
    tree = {}

    for path in paths:
        parts = path.relative_to(PROJECT_ROOT).parts
        node = tree

        for part in parts[:-1]:
            node = node.setdefault(part, {})

        node[parts[-1]] = None

    return tree


def render_tree(node, prefix=""):
    """Render a nested dict as tree lines (directories first, A-Z)."""
    lines = []

    entries = sorted(
        node.items(),
        key=lambda item: (item[1] is None, item[0].lower()),
    )

    for index, (name, child) in enumerate(entries):
        last = index == len(entries) - 1
        connector = "└── " if last else "├── "

        if child is None:
            lines.append(f"{prefix}{connector}{name}")
        else:
            lines.append(f"{prefix}{connector}{name}/")
            extension = "    " if last else "│   "
            lines.extend(render_tree(child, prefix + extension))

    return lines


def directory_tree_text(paths):
    """Full tree text, rooted at the repository name."""
    lines = [f"{PROJECT_ROOT.name}/"]
    lines.extend(render_tree(build_tree(paths)))
    return "\n".join(lines)


# ============================================================================
# MARKDOWN OUTPUT
# ============================================================================

def make_title(name):
    return name.replace("_", " ").replace("-", " ").title() + " Bundle"


def read_file(path):
    """Read a text file without modifying it."""
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            return path.read_text(encoding="utf-8", errors="replace")
        except OSError:
            return None
    except OSError:
        return None


def write_markdown_bundle(output_path, files, title, version):
    """Write a collection of files into a Markdown bundle."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Read everything first so the tree lists exactly what gets written.
    entries = []
    for path in sort_files(files):
        content = read_file(path)
        if content is not None:
            entries.append((path, content))

    with output_path.open("w", encoding="utf-8") as bundle:
        bundle.write(f"# {title}\n\n")
        bundle.write(f"**Version:** {version}\n\n")
        bundle.write(
            "This file contains a snapshot of eligible repository files.\n\n"
        )

        if INCLUDE_INSTRUCTIONS_IN_BUNDLES:
            bundle.write(AI_INSTRUCTIONS_TEXT + "\n")

        if INCLUDE_TREE_IN_BUNDLES:
            bundle.write(f"# Directory Tree ({len(entries)} files)\n\n")
            bundle.write("```text\n")
            bundle.write(directory_tree_text([path for path, _ in entries]))
            bundle.write("\n```\n\n")

        bundle.write("# Files\n\n")

        for path, content in entries:
            relative_path = path.relative_to(PROJECT_ROOT).as_posix()
            language = language_from_extension(path)

            bundle.write(f"`/{relative_path}`\n\n")
            bundle.write(f"```{language}\n")
            bundle.write(content)

            if content and not content.endswith("\n"):
                bundle.write("\n")

            bundle.write("```\n\n")

    return len(entries)


def write_meta_file(version, all_files):
    """Write bundle_meta.md: version, AI instructions, full directory tree."""
    output_path = EXPORTS_DIR / META_FILE
    files = sort_files(all_files)

    with output_path.open("w", encoding="utf-8") as meta:
        meta.write("# Bundle Meta\n\n")
        meta.write(f"**Version:** {version}\n\n")
        meta.write(AI_INSTRUCTIONS_TEXT + "\n")
        meta.write(f"# Directory Tree ({len(files)} files)\n\n")
        meta.write("```text\n")
        meta.write(directory_tree_text(files))
        meta.write("\n```\n")

    return output_path


# ============================================================================
# BUNDLE PLANNING
# ============================================================================

def plan_flat(all_files):
    """One bundle containing everything eligible in the repository."""
    return {"project": sort_files(all_files)}


def plan_nested(all_files):
    """
    One bundle for root-level files and one bundle per root directory.

    Each directory bundle recursively contains eligible files under it.
    Empty directories are not represented because Git does not track them.
    """
    plan = defaultdict(list)

    root_files = files_at_root(all_files)
    if root_files:
        plan["root"] = root_files

    root_directories = sorted(
        (
            path for path in PROJECT_ROOT.iterdir()
            if path.is_dir()
            and not is_explicitly_omitted(path)
        ),
        key=lambda p: p.name.lower(),
    )

    for directory in root_directories:
        files = files_in_directory(directory, all_files)

        if files:
            plan[directory.name] = files

    return dict(plan)


def plan_src_nested(all_files):
    """
    Bundle only src/.

    Files directly in src/ go into src_bundle.md.
    Every immediate child directory gets its own recursive bundle, e.g.
    src_components_bundle.md and src_modules_bundle.md.
    """
    src_dir = PROJECT_ROOT / "src"

    if not src_dir.is_dir():
        raise SystemExit(
            f"Could not find {src_dir}. "
            "The src-nested mode expects a src/ directory at the repo root."
        )

    plan = {}

    # Files directly inside src/.
    src_root_files = [
        path for path in all_files
        if path.parent.resolve() == src_dir.resolve()
    ]

    if src_root_files:
        plan["src"] = src_root_files

    # Each immediate subdirectory gets its own recursive bundle.
    for directory in sorted(
        (path for path in src_dir.iterdir() if path.is_dir()),
        key=lambda p: p.name.lower(),
    ):
        if is_explicitly_omitted(directory):
            continue

        files = files_in_directory(directory, all_files)

        if files:
            plan[f"src_{directory.name}"] = files

    return plan


# ============================================================================
# GENERATION
# ============================================================================

def create_bundle(mode):
    all_files = git_eligible_files()

    if mode == "flat":
        plan = plan_flat(all_files)
    elif mode == "nested":
        plan = plan_nested(all_files)
    elif mode == "src-nested":
        plan = plan_src_nested(all_files)
    else:
        raise SystemExit(f"Unsupported mode: {mode}")

    plan = {
        name: sort_files(files)
        for name, files in plan.items()
        if files
    }

    if not plan:
        print("No files found to bundle.")
        return

    EXPORTS_DIR.mkdir(parents=True, exist_ok=True)

    # Check the existing version BEFORE deleting anything.
    version = next_version()
    print(f"Bundle version: {version}")

    # Remove stale Markdown bundles so changing modes doesn't leave old
    # bundles looking like current output. Only files in exports/ are touched.
    for old_file in existing_output_files():
        old_file.unlink()

    if mode == "flat":
        output_path = EXPORTS_DIR / OUTPUT_FILE
        count = write_markdown_bundle(
            output_path, plan["project"], make_title("project"), version
        )
        print(f"Flat bundle created: {output_path}")
        print(f"Files included: {count}")
        print(f"Meta file created: {write_meta_file(version, all_files)}")
        return

    print(f"{mode} bundles created in: {EXPORTS_DIR}")

    total = 0

    for name, files in plan.items():
        output_path = EXPORTS_DIR / f"{name}_bundle.md"
        count = write_markdown_bundle(
            output_path, files, make_title(name), version
        )
        total += count
        print(f"  {output_path.name} ({count} files)")

    print(f"Total file entries across bundles: {total}")
    print(f"Meta file created: {write_meta_file(version, all_files)}")


def main():
    parser = argparse.ArgumentParser(
        description="Bundle Git-eligible repository files into Markdown."
    )

    parser.add_argument(
        "mode",
        nargs="?",
        default="flat",
        choices=["flat", "nested", "src-nested"],
        help=(
            "'flat' = one bundle; 'nested' = root + root directories; "
            "'src-nested' = src + its immediate subdirectories"
        ),
    )

    args = parser.parse_args()
    create_bundle(args.mode)


if __name__ == "__main__":
    main()
