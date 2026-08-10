# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Create React App (react-scripts v5, React 18) frontend for **OSPAS/CBPLD** — the City Government of Butuan's Online Special Permit Application System, run by the City Business Permits and Licensing Department (CBPLD). It talks to a separate Laravel backend (not in this repo) over a REST API plus Pusher/Laravel Echo for realtime notifications.

The codebase started from a generic Bootstrap admin dashboard template (folders like `Chat`, `Crypto`, `e-commerce`, `Calendar`, `Mails`, `Projects`, `AllCharts` under `src/pages` and `src/store` are template leftovers, mostly unused). On top of that, the repo also carries a second, more substantial inherited layer: an ITSM-style document-routing workflow that was the product before it became OSPAS (`package.json`'s `name` is still `"BPLD Document Tracker"`) — see [A second inherited layer](#a-second-inherited-layer-the-itsmdocument-tracker-workflow) below before assuming anything under `InitialReceiver`/`AssessmentReceiver`/`AssessmentReleaser`/`CompleteReceiver`/`FinalReleaser` is live or dead. **The actual current product lives under `src/pages/CbpldLandingPage/`** and its supporting `src/features/*` Redux slices — that's where almost all real work happens.

## Commands

```bash
npm start                 # dev server (react-scripts start)
npm run build              # production build (uses .env, GENERATE_SOURCEMAP=false)
npm run build-staging       # build with .env.staging
npm run build-production    # build with .env.production
npm run lint                # eslint .
npm run lint:fix            # eslint --fix .
npm run format               # prettier --write on js/jsx/json/md/html/css/less/scss
npm test                     # react-scripts test (Jest + RTL), watch mode by default
```

There is no `test:single` script; use CRA's built-in filtering, e.g. `npm test -- MyComponent` or `npm test -- --testPathPattern=path/to/file`.

Both `yarn.lock` and `package-lock.json` are committed; `yarn.lock` is the one that changes in recent history, so prefer `yarn` for installs unless told otherwise.

ESLint config lives inline in `package.json` (`eslintConfig`), not a `.eslintrc`. Notably `no-unused-vars`, `no-undef`, `react/prop-types`, and `semi` are all turned **off** — don't flag those in review, and don't add semicolons/prop-types purely for style compliance.

## Environment

Env vars are loaded from `.env.development` / `.env.production` / `.env.staging` (all gitignored, present locally). Key ones:
- `REACT_APP_API` — backend base URL, assigned to `axios.defaults.baseURL` in `src/App.js` (constructed as `window.location.protocol + "//" + REACT_APP_API`)
- `REACT_APP_PUSHER_APP_KEY` / `REACT_APP_PUSHER_APP_CLUSTER` — Laravel Echo/Pusher realtime config (`src/pages/CbpldLandingPage/SpecialPermit/AuthAdminPages/Common/echo.js`)
- `REACT_APP_EPAY`, `REACT_APP_FEEDBACK_URL`, Firebase `REACT_APP_*` keys — used by specific features

## Architecture

### Routing & auth gate
- `src/routes/route.js` (`Authmiddleware`) wraps every route. It reads `localStorage.authUser` (JSON blob with `.user.user_type`) to decide access, redirects unauthenticated users to `/login`, unverified users to `/email-verification`, and routes already-authenticated users straight to `/admin/dashboard` (user_type `admin`) or `/client/services` (user_type `client`) if they hit a public route.
- `src/routes/index.js` exports `publicRoutes` / `authProtectedRoutes` arrays consumed by `src/App.js`, which renders each through `Authmiddleware` inside a single `react-router-dom` v5 `Switch`.
- Login writes both `localStorage.authUser` (full user object) and `localStorage.authToken` (bearer token) — see `src/features/user/userSlice.js`. `src/App.js` attaches an axios request interceptor that reads `authToken` and sets the `Authorization: Bearer <token>` header on every request, plus a response interceptor that redirects to `/pages-forbidden` on 401.

### State management (two systems coexist)
- **Redux Toolkit slices** under `src/features/*/*.js` are the pattern for all current work: `createSlice` + `createAsyncThunk` calling `axios` directly with relative URLs like `api/admin/special-permit/applications` (baseURL is global, see above). Thunk action types follow `"<sliceName>/<thunkName>"`. Reducers are wired into the store in `src/app/store.js`.
- **Legacy `redux-saga`** (`src/store/*`, `rootSaga` in `src/store/sagas`) still runs alongside RTK for the inherited template features (auth/register/forgetpwd/profile reducers). Don't extend the saga pattern for new work — follow the RTK slice pattern instead.
- Both reducer trees are combined in one `combineReducers` in `src/app/store.js`, persisted via `redux-persist` (only the `user` slice is whitelisted for persistence). Logging out (`user/logoutUser/fulfilled` or `/rejected`) resets the entire Redux state to `undefined`.
- `src/helpers/api_helper.js`, `url_helper.js`, and `src/helpers/AuthType/fakeBackend.js` are unused template boilerplate (fake endpoints like `/post-fake-login`) — don't build on them; real API calls go straight through `axios` inside RTK thunks.

### A second inherited layer: the ITSM/document-tracker workflow
Beyond the generic template pages, `src/pages/` also has a full receive→assess→release document-routing pipeline (`InitialReceiver`, `AssessmentReceiver`, `AssessmentReleaser`, `CompleteReceiver`, `FinalReleaser`, plus `RequestedServices`, `Services/RequestTracker`, `Reports`, `Summary`, `Tools/MultipurposeSMS`, `Tools/VaxcertSMS`, `UserControls/Verification`), backed by real `src/features/*` slices (`InitialReceiver`, `AssessmentReceiver`, `AssessmentReleaser`, `CompleteReceiver`, `FinalReleaser`, `Summary`, `office`, `status`, `request`, `filters`, `modal`) wired into `src/app/store.js`.

`src/routes/index.js` imports all of this under an `//ITSM Components` comment banner, but **almost none of it is added to the exported `authProtectedRoutes`/`publicRoutes` arrays** — it's unreachable in the running app, same as the generic template folders, just with real backing slices that can mislead you into thinking it's active. The only two exceptions actually mounted: `pages/Analytics` (mounted at `/dashboard`, though no post-login redirect in `Authmiddleware` ever sends a user there — see Routing above) and `pages/UserControls/Controls` (mounted at `/user-control`). Don't extend this pipeline for new work.

That cuts the other way too — some pieces of this "ITSM" layer are still load-bearing for the live CBPLD product, so don't assume everything with that flavor is dead:
- `features/AdminSlice` backs the real `AuthAdminPages/AdminControls` page (clearances, exempted cases, government property).
- `components/Notifications` is rendered unconditionally in `App.js` and is a **second, legacy realtime connection** — raw `pusher-js` with a hardcoded app key, gated on `userDetails.role === 'Administrator'` — running alongside the newer Laravel-Echo connection in `AuthAdminPages/Common/echo.js`. It depends on `features/pusher`, `features/office`, `features/status`, `features/request`, `features/modal`, `features/filters`, `features/notifications`, and `features/user/onlineUserSlice`.

### The actual product: `src/pages/CbpldLandingPage/SpecialPermit/`
Split into parallel portals sharing one backend:
- `AuthClientPages/` — applicant-facing portal (Services, Pending, Declined, ForSignature, Payment, Profile, Dashboard)
- `AuthAdminPages/` — staff-facing portal (Dashboard, Pending, AdminControls, SuperAdminControl, Payment, ForSignature, OfflineTransaction, Analytics, Printables)
- `Forms/` — application intake forms (e.g. `GoodMoralCertificate.js`, `IndividualRegistrationForm.js`)
- `Printables/` (admin) and `Printables/` (client-facing certificates) — printable request forms and issued certificates, rendered via `react-to-print`. These fetch pre-filled data from endpoints like `api/admin/get-request-form-data` and print a pixel-styled replica of the official paper form.
- `SpecialPermitDetailsQr/` — QR-code verification page for issued permits (QR codes are generated client-side with `react-qr-code`, not stored as static images)

Corresponding RTK slices: `features/SpecialPermitAdmin`, `features/SpecialPermitClient`, `features/SpecialPermitReport`.

### Printables are CSS-fragile — read before editing
Files under any `Printables/` folder (e.g. `MayorsAndGoodMoralRequestForm.js`, `RequestForm.js`, `OccupationalRequestForm.js`, `CertificateFormat.js`) are hand-pixel-styled replicas of official government forms, built with inline styles plus a same-named `.css` file. **These `.css` files are plain global imports, not CSS Modules** — classes like `.title`, `.header-title`, `.cambraText`, `.bolder-text`, `.header-content`, `.main-table`/`.footer-table` borders are reused (and sometimes only *defined*) in a sibling printable's CSS file and leak globally once that sibling is mounted anywhere in the app. When editing one of these forms:
- Don't assume a class is unstyled just because it's not in the file's own CSS — check sibling `Printables/*.css` files first.
- Prefer making a form's own CSS file self-contained (define the classes it uses locally) over relying on load-order-dependent leakage, since that's what causes inconsistent rendering between sessions.
- Avoid `position: absolute` with hand-tuned pixel offsets for layout (e.g. positioning a title relative to a parent's bottom edge) — it silently breaks whenever surrounding text content changes length/height. Prefer normal document flow with margins.
- The outer print wrapper only gets a fixed width via `@media print { .testing { width: 990px !important; } }` in several of these files — on-screen modal preview can render at a different width than the actual print output unless the wrapper/table also has an explicit inline width.

### Internationalization
`src/i18n.js` + `src/locales/{eng,gr,it,rs,sp}` (i18next). This is inherited template scaffolding — the CBPLD/OSPAS product pages are not translated through it and use hardcoded English/Cebuano text directly (see the Cebuano reminder text in the Printables forms, for example).

### Path aliases
`jsconfig.json` sets `baseUrl: "./src"`, so both `import Foo from "features/foo/fooSlice"` (absolute-from-src) and `import Foo from "../../features/foo/fooSlice"` (relative) resolve — the codebase mixes both styles freely, including within the same file.
