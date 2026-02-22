# Keycloak (auth.atparui.com) Setup for Finos Web App

This app uses **keycloak-js** (same idea as React’s Keycloak provider): Keycloak is initialized **before** Angular in `main.ts`. If the user is not logged in, the browser is redirected to `auth.atparui.com` immediately, so there is no blank screen and no reliance on Angular routing for the redirect.

## Enable Keycloak login

Set the following (e.g. in `window.env` or build-time env):

- **`oidcServerEnabled`** = `true` (or `FINERACT_PLUGIN_OIDC_ENABLED=true`)
- **`oidcBaseUrl`** = `https://auth.atparui.com/realms/nbk-demo` (optional; this is the default)
- **`oidcClientId`** = `finos-web` (optional; this is the default)
- **`oidcFrontUrl`** = base URL of the app (e.g. `https://finos.atparui.com`). If not set, `window.location.origin` is used.

Example `window.env` (in `index.html` or your env loader):

```javascript
// API via console (same pattern as rms-web-app: https://console.atparui.com/services/fineract-provider/api/v1)
window.env = {
  oidcServerEnabled: true,
  oidcBaseUrl: 'https://auth.atparui.com/realms/nbk-demo',
  oidcClientId: 'finos-web',
  oidcFrontUrl: 'https://finos.atparui.com',
  fineractPlatformTenantId: 'default',
  fineractApiUrl: 'https://console.atparui.com',
  apiProvider: '/services/fineract-provider/api'
};
```

## Keycloak realm and client (auth.atparui.com)

In **Keycloak Admin** (e.g. `https://auth.atparui.com/admin`), ensure:

1. **Realm**: `nbk-demo` exists and is the realm used for this app.
2. **Client**: Create or edit client **finos-web** in realm `nbk-demo`:
   - **Client ID**: `finos-web`
   - **Client authentication**: OFF (public SPA with PKCE).
   - **Valid redirect URIs**: add **the app root** (keycloak-js redirects here after login):
     - `https://finos.atparui.com/`
     - `https://finos.atparui.com` (optional; some servers require both)
     - `http://localhost:4200/` (if you run the app locally)
   - **Web origins**: add `https://finos.atparui.com` (and `http://localhost:4200` for local).
3. Save the client so that login from `https://finos.atparui.com` redirects to Keycloak and back to `https://finos.atparui.com/`.

## Redirect URI (keycloak-js)

- The app uses **redirect URI** = app root: `https://finos.atparui.com/` (so Keycloak redirects to `https://finos.atparui.com/?code=...`).
- This **must** be listed in the Keycloak client **finos-web** under **Valid redirect URIs** (with trailing slash).
- The app uses **PKCE** with **S256** for the authorization code flow.

## Flow

1. User opens the app (e.g. `https://finos.atparui.com` or `https://finos.atparui.com/#/`).
2. **Before Angular loads**, `main.ts` runs keycloak-js `init({ onLoad: 'login-required' })`. If the user is not authenticated, the browser is **immediately** redirected to Keycloak (`auth.atparui.com`).
3. User signs in at Keycloak and is redirected back to `https://finos.atparui.com/?code=...&state=...`.
4. `main.ts` runs again; keycloak-js processes the callback, exchanges the code for tokens, and then Angular bootstraps.
5. The app uses the Keycloak token for `Authorization: Bearer <token>` on all Fineract API requests.

## API via Console (same pattern as rms-web-app)

Fineract is exposed through the **Console** at `https://console.atparui.com/services/fineract-provider/**` (same style as RMS at `https://console.atparui.com/services/rms-service/api`). The app must call the console for the API, not finos.atparui.com.

- **Console** has a static route: `/services/fineract-provider/**` → Fineract backend (path rewritten to `/fineract-provider/**`). No Consul registration; Fineract is a static route under `/services/`.
- **Finos Web App** default: `baseApiUrl` = `https://console.atparui.com`, `apiProvider` = `/services/fineract-provider/api`, so full API URL = `https://console.atparui.com/services/fineract-provider/api/v1`. Do **not** use `https://finos.atparui.com` for the API base.
- The gateway requires JWT for `/services/**` and forwards the request to Fineract.

## Fineract backend

Fineract must be run with **Keycloak resource server** enabled and **Basic Auth** disabled:

- `fineract.security.keycloak.enabled=true`
- `fineract.security.keycloak.issuer-uri=https://auth.atparui.com/realms/nbk-demo`
- `fineract.security.basicauth.enabled=false`

Each Keycloak user that should access Fineract must exist as a user in Fineract (same **username** as Keycloak’s **preferred_username**) for the tenant indicated by the `Fineract-Platform-TenantId` header.
