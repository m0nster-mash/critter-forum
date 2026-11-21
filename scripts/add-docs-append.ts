#!/usr/bin/env tsx
/**
 * Codemod (append mode): adds a fresh TSDoc stub to every file and declaration under a source
 * directory, whether or not it already has documentation.
 *
 * Usage (from the project root):
 *   npx tsx scripts/add-docs-append.ts [--src src] [--tsconfig tsconfig.json] [--dry-run]
 *
 * Behaviour:
 *   - If a target already has a doc block, the new stub is written in a SEPARATE comment block
 *     directly below it. The original block is never modified or deleted.
 *   - If a target has no doc block, the stub is written above it, as usual.
 *   - Targets: the file header; top-level functions, arrow-function consts, consts, classes,
 *     interfaces, type aliases and enums; and their members.
 *   - Callables get `@typeParam`, `@param`, `@returns` (non-void only) and `@throws` (only when the
 *     body has a direct `throw`) stubs.
 *
 * Re-running: a target is skipped if one of its doc blocks contains a line that is exactly the
 * placeholder text (`TODO: document`), i.e. a stub this script generated. Once you replace the
 * placeholder summary in a generated block, a re-run will append another stub to that target, so
 * treat this as a one-shot tool: run it, commit, then clean up.
 *
 * Not handled (add by hand): `export default <expression>`, namespaces, object-literal methods,
 * nested functions, setters (the getter's doc covers the pair).
 */

import {existsSync, writeFileSync} from "node:fs";
import * as path from "node:path";
import {Node, Project, SyntaxKind, ts, type ParameterDeclaration, type SourceFile} from "ts-morph";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const CONFIG = {
    /** Text used for every placeholder; grep for it to find work remaining. */
    placeholder: "TODO: document",
    /** `@status` value written on generated file / top-level stubs. */
    newStatus: "Requires documentation",
    ignoreGlobs: [
        "**/node_modules/**",
        "**/.next/**",
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/__tests__/**",
    ],
};

/** Matches a JSDoc block that is acting as a file header. */
const FILE_HEADER_TAG = /@(module|fileoverview|file|packageDocumentation)\b/i;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A text edit: replaces `[start, end)` with `text`. An insertion has `start === end`. */
interface Edit {
    start: number;
    end: number;
    text: string;
    /** Creation order; breaks ties between edits at the same position. */
    order: number;
}

/** Describes the contents of one generated doc block. */
interface Stub {
    /** Whether to emit an `@status` tag (top-level declarations only). */
    status: boolean;
    typeParams: string[];
    params: string[];
    returns: boolean;
    throws: boolean;
}

const EMPTY_STUB: Stub = {status: false, typeParams: [], params: [], returns: false, throws: false};

// ---------------------------------------------------------------------------
// Analysis helpers
// ---------------------------------------------------------------------------

/** True for nodes that start a new function scope (used to scope `throw` detection). */
const isFunctionBoundary = (node: Node): boolean =>
    Node.isFunctionDeclaration(node) ||
    Node.isFunctionExpression(node) ||
    Node.isArrowFunction(node) ||
    Node.isMethodDeclaration(node) ||
    Node.isConstructorDeclaration(node) ||
    Node.isGetAccessorDeclaration(node) ||
    Node.isSetAccessorDeclaration(node);

/** Name to use in `@param`; destructured parameters become `props` (React convention). */
const paramName = (param: ParameterDeclaration): string =>
    Node.isIdentifier(param.getNameNode()) ? param.getName() : "props";

/** True if `fn` itself (not a nested function) contains a `throw` statement. */
function throwsDirectly(fn: Node): boolean {
    return fn
        .getDescendantsOfKind(SyntaxKind.ThrowStatement)
        .some((t) => t.getFirstAncestor(isFunctionBoundary) === fn);
}

/** Names of the type parameters declared on `node`, if any. */
const typeParamNames = (node: Node): string[] =>
    Node.isTypeParametered(node) ? node.getTypeParameters().map((t) => t.getName()) : [];

/** Builds the callable-specific part of a stub for a function, method, constructor or signature. */
function callableInfo(fn: Node): Omit<Stub, "status"> {
    const params = Node.isParametered(fn) ? fn.getParameters().map(paramName) : [];
    let returns = false;
    if (!Node.isConstructorDeclaration(fn) && Node.isReturnTyped(fn)) {
        const type = fn.getReturnType().getText();
        returns = !["void", "Promise<void>", "undefined", "Promise<undefined>", "never"].includes(type);
    }
    return {typeParams: typeParamNames(fn), params, returns, throws: throwsDirectly(fn)};
}

/**
 * True if a comment contains a line that is exactly the placeholder, i.e. it was generated by this
 * script. Lines like `@fileOverview TODO: document` deliberately do not match.
 */
function isGenerated(commentText: string): boolean {
    return commentText.split(/\r?\n/).some((line) => {
        const stripped = line
            .replace(/^\s*(\/\*\*|\*)?\s*/, "")
            .replace(/\s*\*\/\s*$/, "")
            .trim();
        return stripped === CONFIG.placeholder;
    });
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

/** Renders a doc block with no leading indent on its first line and no trailing newline. */
function renderBlock(indent: string, stub: Stub): string {
    const tags: string[] = [];
    if (stub.status) tags.push(`@status ${CONFIG.newStatus}`);
    for (const name of stub.typeParams) tags.push(`@typeParam ${name} - ${CONFIG.placeholder}`);
    for (const name of stub.params) tags.push(`@param ${name} - ${CONFIG.placeholder}`);
    if (stub.returns) tags.push(`@returns ${CONFIG.placeholder}`);
    if (stub.throws) tags.push(`@throws ${CONFIG.placeholder}`);

    if (tags.length === 0) return `/** ${CONFIG.placeholder} */`;

    const lines = [CONFIG.placeholder, "", ...tags].map((l) => (l ? `${indent} * ${l}` : `${indent} *`));
    return `/**\n${lines.join("\n")}\n${indent} */`;
}

/** Renders the file header block. */
const renderHeader = (modulePath: string): string =>
    `/**\n * ${CONFIG.placeholder}\n *\n * @module ${modulePath}\n * @status ${CONFIG.newStatus}\n */`;

/** Derives the `@module` path (relative to the source dir, no extension, no trailing `/index`). */
function modulePathOf(sf: SourceFile, srcDir: string): string {
    const rel = path.relative(srcDir, sf.getFilePath()).split(path.sep).join("/");
    let mod = rel.replace(/\.(tsx?|mts|cts)$/, "");
    if (mod.endsWith("/index")) mod = mod.slice(0, -"/index".length);
    return mod;
}

// ---------------------------------------------------------------------------
// Edit collection
// ---------------------------------------------------------------------------

/** Computes every edit needed for one file. Does not modify the file. */
function collectEdits(sf: SourceFile, srcDir: string): Edit[] {
    const full = sf.getFullText();
    const eol = full.includes("\r\n") ? "\r\n" : "\n";
    const statements = sf.getStatements();
    if (statements.length === 0) return [];

    const edits: Edit[] = [];
    const push = (start: number, end: number, text: string): void => {
        edits.push({start, end, text: text.replace(/\r?\n/g, eol), order: edits.length});
    };

    /** Whitespace between the start of the line and `pos`, or "" if other text precedes it. */
    const indentAt = (pos: number): string => {
        const lead = full.slice(full.lastIndexOf("\n", pos - 1) + 1, pos);
        return /^\s*$/.test(lead) ? lead : "";
    };

    /**
     * Documents `node`. With no existing doc, the stub goes above the node; with existing docs, it
     * goes in a new block immediately after the last one. Skips nodes that already carry a stub.
     */
    const doc = (node: Node, stub: Partial<Stub> = {}): void => {
        const existing = Node.isJSDocable(node) ? node.getJsDocs() : [];
        if (existing.some((d) => isGenerated(d.getText()))) return;

        const indent = indentAt(node.getStart());
        const block = renderBlock(indent, {...EMPTY_STUB, ...stub});

        if (existing.length > 0) {
            const end = existing[existing.length - 1].getEnd();
            push(end, end, `\n${indent}${block}`);
        } else {
            const pos = node.getStart();
            push(pos, pos, `${block}\n${indent}`);
        }
    };

    /** Documents members of an interface or object type literal. */
    const documentTypeMembers = (members: Node[]): void => {
        for (const m of members) {
            if (Node.isPropertySignature(m)) doc(m);
            else if (Node.isMethodSignature(m)) doc(m, {...callableInfo(m), throws: false});
        }
    };

    // --- File header (pushed first so it sorts before any declaration doc at the same position) ---
    const headers = statements[0]
        .getLeadingCommentRanges()
        .filter((r) => r.getText().startsWith("/**") && FILE_HEADER_TAG.test(r.getText()));

    if (!headers.some((r) => isGenerated(r.getText()))) {
        const header = renderHeader(modulePathOf(sf, srcDir));
        if (headers.length > 0) {
            // Append below the last existing header comment.
            const end = headers[headers.length - 1].getEnd();
            push(end, end, `\n${header}`);
        } else {
            const at = full.startsWith("#!") ? full.indexOf("\n") + 1 : 0;
            push(at, at, `${header}\n\n`);
        }
    }

    // --- Top-level declarations ---
    for (const stmt of statements) {
        if (Node.isFunctionDeclaration(stmt)) {
            if (stmt.isImplementation() && stmt.getOverloads().length > 0) continue; // docs live on overloads
            doc(stmt, {status: true, ...callableInfo(stmt)});
        } else if (Node.isVariableStatement(stmt)) {
            const declarations = stmt.getDeclarations();
            const init = declarations.length === 1 ? declarations[0].getInitializer() : undefined;
            if (init && (Node.isArrowFunction(init) || Node.isFunctionExpression(init))) {
                doc(stmt, {status: true, ...callableInfo(init)});
            } else {
                doc(stmt);
            }
        } else if (Node.isClassDeclaration(stmt)) {
            doc(stmt, {status: true, typeParams: typeParamNames(stmt)});
            for (const m of stmt.getMembers()) {
                if (Node.isConstructorDeclaration(m) || Node.isMethodDeclaration(m)) {
                    if (m.isImplementation() && m.getOverloads().length > 0) continue;
                    doc(m, callableInfo(m));
                } else if (Node.isPropertyDeclaration(m) || Node.isGetAccessorDeclaration(m)) {
                    doc(m);
                }
            }
        } else if (Node.isInterfaceDeclaration(stmt)) {
            doc(stmt, {status: true, typeParams: typeParamNames(stmt)});
            documentTypeMembers(stmt.getMembers());
        } else if (Node.isTypeAliasDeclaration(stmt)) {
            doc(stmt, {status: true, typeParams: typeParamNames(stmt)});
            const typeNode = stmt.getTypeNode();
            if (typeNode && Node.isTypeLiteral(typeNode)) documentTypeMembers(typeNode.getMembers());
        } else if (Node.isEnumDeclaration(stmt)) {
            doc(stmt, {status: true});
            for (const m of stmt.getMembers()) doc(m);
        }
    }

    return edits;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/** Parses CLI flags, runs the codemod over every matching file, and prints a summary. */
function main(): void {
    const args = process.argv.slice(2);
    const option = (name: string, fallback: string): string => {
        const i = args.indexOf(name);
        return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
    };
    const dryRun = args.includes("--dry-run");
    const srcDir = path.resolve(option("--src", "src"));
    const tsconfig = path.resolve(option("--tsconfig", "tsconfig.json"));

    if (!existsSync(srcDir)) {
        console.error(`Source directory not found: ${srcDir}`);
        process.exit(1);
    }

    // Using the project's tsconfig lets the type checker infer return types accurately.
    const project = existsSync(tsconfig)
        ? new Project({tsConfigFilePath: tsconfig, skipAddingFilesFromTsConfig: true})
        : new Project({compilerOptions: {jsx: ts.JsxEmit.Preserve}});

    const root = srcDir.split(path.sep).join("/");
    const files = project.addSourceFilesAtPaths([
        `${root}/**/*.{ts,tsx}`,
        ...CONFIG.ignoreGlobs.map((g) => `!${g}`),
    ]);

    let changedFiles = 0;
    let totalEdits = 0;

    for (const sf of files) {
        let edits: Edit[];
        try {
            edits = collectEdits(sf, srcDir);
        } catch (error) {
            console.warn(`SKIPPED ${path.relative(process.cwd(), sf.getFilePath())}: ${String(error)}`);
            continue;
        }
        if (edits.length === 0) continue;

        // Apply from the end of the file so earlier offsets stay valid. Ties: higher order first.
        let text = sf.getFullText();
        for (const e of [...edits].sort((a, b) => b.start - a.start || b.order - a.order)) {
            text = text.slice(0, e.start) + e.text + text.slice(e.end);
        }

        changedFiles += 1;
        totalEdits += edits.length;
        console.log(`${dryRun ? "[dry-run] " : ""}${path.relative(process.cwd(), sf.getFilePath())}: ${edits.length} doc block(s)`);
        if (!dryRun) writeFileSync(sf.getFilePath(), text);
    }

    console.log(`\n${files.length} files scanned, ${changedFiles} ${dryRun ? "would change" : "changed"}, ${totalEdits} edits.`);
}

main();
