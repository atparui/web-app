# Keycloak (auth.atparui.com) Setup for Finos Web App

This app can use **Keycloak** at `auth.atparui.com` (realm **nbk-demo**, client **finos-web**) for login. Users visiting the app are redirected to Keycloak to sign in and then back to the app with a token used for the Fineract API.

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

## Redirect URI

- The app uses **redirect URI** `{oidcFrontUrl}/callback` (e.g. `https://finos.atparui.com/callback`).
- This must be listed in the Keycloak client **finos-web** (Valid redirect URIs).
- The app uses **PKCE** with **S256** for the authorization code flow.

## Flow

1. User opens the app (e.g. `https://finos.atparui.com`) and goes to the login page.
2. User clicks **Login** → app redirects to Keycloak (`auth.atparui.com`) with `client_id=finos-web` and PKCE.
3. User signs in at Keycloak and is redirected back to `https://finos.atparui.com/callback?code=...`.
4. The app exchanges the code for tokens and stores the access token.
5. All requests to the Fineract API include `Authorization: Bearer <token>` and `Fineract-Platform-TenantId`.

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
