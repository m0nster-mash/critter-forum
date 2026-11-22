# critters-forum


## Documentation

### File-level Header

```tsx
/**
 * @fileOverview    <one-line description>
 * @module          features/<feature name> OR core-application
 * 
 * @TODO            <summary of any pending items in the file>
 */
```

### Function-level Header

```tsx
/**
 * <one-line description>
 *
 * @remarks     <additional details>
 * @remarks     <additional details>
 *     
 * @TODO        <something to do>
 * @TODO        <something to do>
 *
 * @param       param1      <A simple param>
 * @param       [param2]    Optional; <an optional param>
 *
 * @returns     {<type>}    <return statement>
 */
```

### Const-level Headers
```tsx
/** <one-line description> */

/**
 * <one-line description>
 * 
 * @remarks     <additional details>
 */
```

### Type-level and Interface-level Headers

```tsx
/**
 * <one-line description>
 *
 * @remarks     <additional details>
 * @remarks     <additional details>
 *     
 * @TODO        <something to do>
 * @TODO        <something to do>
 *     
 * @param       param1      <A simple param>
 * @param       [param2]    Optional; <an optional param>
 *
 * @property    property    <A simple param>
 * @property    [property]  Optional; <an optional param>
 *
 * @returns     {<type>}    <return statement>
 */
```

## Icons

```tsx
<Icon name={UI_ICONS.SUN} size={ICON_SIZE.SMALL}/>
```

## Alerts

Errors, warnings and success messages all go through one system: a registry of alerts, one server logger, one browser
logger, and shared on-page components (toasts and inline banners).

See [docs/alerts.md](docs/alerts.md) for how it works, which presentation to use when, and how to add an alert.

Quick checks: `npm run alerts:check` (logic), `npm run noEmit` (types), `npm run lint` (also forbids stray `console.*`).

## Permissions

Independent per-user permissions, defined in code and enforced on the server. Pages call `requirePagePermission(...)`
using the permission declared on their route.

See [docs/permissions.md](docs/permissions.md) for how it works and how to add a permission.

