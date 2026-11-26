import {getBreadcrumbs} from "@/features/navigation/utilities/breadcrumb-utils";
import {ADMIN_ROUTES} from "@/lib/constants/routes";
import {Suite} from "@/tests/test-config";
import assert from "node:assert/strict";

const suite = new Suite("navigation/breadcrumbs", 1);

suite.test("resolves the complete admin user-edit hierarchy", () => {
    assert.deepEqual(
        getBreadcrumbs(ADMIN_ROUTES.USERS_EDIT, {userId: "123"}),
        [
            {label: "Administration", href: "/admin"},
            {label: "User Management", href: "/admin/users"},
            {label: "Edit User", href: undefined},
        ],
    );
});
