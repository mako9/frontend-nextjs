# Test Coverage Design

**Date:** 2026-05-04
**Scope:** Full application — utilities, lib functions, components, pages
**Stack:** Jest 30 + React Testing Library, Next.js 16 Pages Router, next-auth v4, next-i18next v16

---

## Goals

Cover all meaningful application behavior across every layer:
- Happy paths and key error/edge cases for each unit
- No specific coverage percentage target — test what matters
- All tests run in CI without a running backend

---

## Architecture

### File Placement

Tests are **co-located** with source files. Exception: page tests live in `__tests__/pages/` because `pages/` is Next.js-controlled and cannot contain arbitrary files.

```
app/
  lib/
    items.test.ts
    communities.test.ts
  utils/
    request.test.ts
    session.test.ts
    logger.test.ts
  components/
    button.test.tsx
    input.test.tsx
    dropdown.test.tsx
    imageGallery.test.tsx
    FileUpload.test.tsx
    gallery.test.tsx
    navBar.test.tsx
    map.test.tsx
    table.test.tsx
    datePicker.test.tsx
    keyValue.test.tsx
    spinner.test.tsx
    toggleButton.test.tsx
    context.test.tsx
    subpages/
      ownedCommunity.test.tsx
      foreignCommunity.test.tsx
      ownedItem.test.tsx
      foreignItem.test.tsx
__tests__/
  pages/
    index.test.tsx
    login.test.tsx
    my-area.test.tsx
    about.test.tsx
    settings.test.tsx
    contact.test.tsx
    communities/
      [id].test.tsx
      create.test.tsx
    items/
      index.test.tsx
      [id].test.tsx
      create.test.tsx
```

### Global Mocks (setupTests.ts)

| Mock target | Strategy |
|---|---|
| `fetch` | `jest.spyOn(global, 'fetch')`, reset in `beforeEach` |
| `next-auth/react` | Already mocked — returns mock session |
| `next/router` | Already mocked |
| `next-i18next/pages` | Mock `useTranslation` → `t = (key) => key` |
| `react-leaflet` + `leaflet` | Mock entire modules (Leaflet requires canvas unavailable in jsdom) |
| `next-auth` (`getServerSession`) | Mocked per test file needing server-side session |

No new packages required.

---

## Layer 1: Utility Tests

### `app/utils/request.test.ts`

- `request()` happy path: correct URL called, `Authorization: Bearer <token>` header set, response data returned
- `request()` with no session: request made without Authorization header
- `request()` POST with body: correct method, `Content-Type: application/json`, body serialized
- `request()` non-ok response (e.g. 500): returns `{ data: null, statusCode: 500, errorMessage: ... }`
- `request()` 401 response: returns null data
- `clientSideRequest()`: sets `isLoading: true` before the call, `false` after; passes args through; returns result

### `app/utils/session.test.ts`

- Returns session object when `getServerSession` resolves with a session
- Returns `null` when `getServerSession` resolves with null

### `app/utils/logger.test.ts`

- Logger instance exports `debug`, `info`, `warn`, `error` methods

---

## Layer 2: Lib Function Tests

Each function gets:
- A **happy-path** test: correct URL, correct HTTP method, Authorization header present, correct return value
- An **error-path** test: fetch rejects or returns non-ok response → returns null/undefined

### `app/lib/items.test.ts`

| Function | URL | Method | Returns |
|---|---|---|---|
| `getOwnedItems` | `/user/item` | GET | `Page<Item>` |
| `getAllItemsOfMyCommunities` | `/user/item/community` | GET | `Page<Item>` |
| `getItem` | `/user/item/:uuid` | GET | `Item` |
| `createItem` | `/user/item` | POST | `Item` |
| `editItem` | `/user/item/:uuid` | PUT | `Item` |
| `deleteItem` | `/user/item/:uuid` | DELETE | — |
| `getItemImageUuids` | `/user/item/:uuid/image` | GET | `string[]` |
| `getItemImage` | `/user/item/image/:uuid` | GET | `Blob` |
| `uploadItemImage` | `/user/item/:uuid/image` | POST | — |
| `deleteItemImage` | `/user/item/image/:uuid` | DELETE | — |
| `bookItem` | `/user/item/:uuid/booking` | POST | — |

### `app/lib/communities.test.ts`

| Function | URL | Method | Returns |
|---|---|---|---|
| `getAllCommunities` | `/community` | GET | `Page<Community>` |
| `getOwnedCommunities` | `/user/community` | GET | `Page<Community>` |
| `getMyCommunities` | `/user/community/member` | GET | `Page<Community>` |
| `getCommunity` | `/community/:uuid` | GET | `Community` |
| `createCommunity` | `/community` | POST | `Community` |
| `editCommunity` | `/community/:uuid` | PUT | `Community` |
| `deleteCommunity` | `/community/:uuid` | DELETE | — |
| `getItemsOfCommunity` | `/community/:uuid/item` | GET | `Page<Item>` |
| `getMemberOfCommunity` | `/community/:uuid/member` | GET | `Page<User>` |
| `getReguestingMemberOfCommunity` | `/community/:uuid/member/request` | GET | `Page<User>` |
| `approveMemberRequests` | `/community/:uuid/member/approve` | POST | — |
| `declineMemberRequests` | `/community/:uuid/member/decline` | POST | — |
| `joinCommunity` | `/community/:uuid/member` | POST | — |

---

## Layer 3: Component Tests

### Simple Components

| File | What's tested |
|---|---|
| `button.test.tsx` | Renders title; calls `onClick`; disabled state prevents click |
| `input.test.tsx` | Renders placeholder; calls `setInput` with typed value |
| `keyValue.test.tsx` | Renders name and string value; renders ReactNode value |
| `spinner.test.tsx` | Renders without crashing |
| `toggleButton.test.tsx` | Renders both options; calls `onChange` on click |
| `navItem.test.tsx` | Renders label; applies active style when selected |
| `footer.test.tsx` | Renders without crashing |

### Complex Components

| File | What's tested |
|---|---|
| `dropdown.test.tsx` | Renders placeholder; single-select calls `onChange` with one value; multi-select calls `onChange` with array; search filters options; initial options pre-selected |
| `imageGallery.test.tsx` | Renders first image; next/prev buttons update index; calls `setCurrentImageIndex` |
| `FileUpload.test.tsx` | Renders upload button; selecting a file calls `handleUploadedFile` with the File object |
| `gallery.test.tsx` | Renders list of items; clicking an item calls the item click handler |
| `datePicker.test.tsx` | Renders with selected date; calls `setSelectedDate` on date change |
| `navBar.test.tsx` | Renders all nav links; active item highlighted |
| `context.test.tsx` | `useStateValue` returns state and setState; state updates propagate to consumers |
| `map.test.tsx` | Renders container without crashing (Leaflet fully mocked) |
| `table.test.tsx` | Renders column headers and row data |

### Subpages

| File | What's tested |
|---|---|
| `subpages/ownedCommunity.test.tsx` | Renders community name/details; approve/decline buttons call the correct lib functions; member list renders |
| `subpages/foreignCommunity.test.tsx` | Renders community details; join button calls `joinCommunity` |
| `subpages/ownedItem.test.tsx` | Renders item name/fields; save calls `editItem`; delete calls `deleteItem`; image upload/delete work |
| `subpages/foreignItem.test.tsx` | Renders item details and categories; book button calls `bookItem` with selected dates |

---

## Layer 4: Page Tests

Each page gets two test groups.

### Data Fetching (`getServerSideProps` / `getStaticProps`)

Lib functions mocked; assert correct functions called and props returned.

| Page | Functions called | Special assertions |
|---|---|---|
| `pages/index.tsx` | `getAllCommunities`, `getAllItemsOfMyCommunities` | Props contain communities and items |
| `pages/my-area.tsx` | `getOwnedCommunities`, `getOwnedItems` | Props contain owned data |
| `pages/communities/[id].tsx` | `getCommunity`, `getMemberOfCommunity`, `getReguestingMemberOfCommunity` | Props contain community + member data |
| `pages/communities/create.tsx` | — | Returns i18n props only |
| `pages/items/create.tsx` | `getMyCommunities` | Props contain communities |
| `pages/items/[id].tsx` | `getItem`, `getItemImageUuids`, `getMyCommunities` | Props contain item + image UUIDs + communities |
| `pages/items/index.tsx` | — | Returns redirect to `/my-area` |
| `pages/about.tsx` | — | Returns i18n props |
| `pages/settings.tsx` | — | Returns i18n props |
| `pages/contact.tsx` | — | Returns i18n props |

### Component Render

Render with mock props; assert key UI elements and auth markers.

| Page | What's tested |
|---|---|
| `pages/index.tsx` | Community names visible; item gallery renders; `.auth === true` |
| `pages/login.tsx` | Sign-in button renders |
| `pages/my-area.tsx` | Toggle between communities/items view; table renders data; `.auth === true` |
| `pages/communities/[id].tsx` | Owned view shown when session user owns community; foreign view shown otherwise |
| `pages/communities/create.tsx` | Form fields render; `.auth === true` |
| `pages/items/create.tsx` | Form fields render; dropdown options present; `.auth === true` |
| `pages/items/[id].tsx` | Owned view shown for item owner; foreign view shown otherwise |
| `pages/about.tsx` | Renders without crashing |
| `pages/settings.tsx` | Renders without crashing |
| `pages/contact.tsx` | Renders without crashing |

---

## Summary

| Layer | Test files | Approx. test cases |
|---|---|---|
| Utilities | 3 | ~12 |
| Lib functions | 2 | ~48 |
| Components | 18 | ~45 |
| Pages | 11 | ~25 |
| **Total** | **34** | **~130** |
