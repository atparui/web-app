/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Entry point of the application.
 * When OIDC/Keycloak is enabled, Keycloak is initialized here before Angular
 * so that unauthenticated users are redirected to auth.atparui.com before
 * any app code runs (avoids blank screen and ensures login works).
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Logger } from './app/core/logger/logger.service';

const log = new Logger('Bootstrap');

if (environment.production) {
  enableProdMode();
  Logger.enableProductionMode();
}

declare global {
  interface Window {
    __keycloak?: import('keycloak-js').KeycloakInstance;
  }
}

function isOidcEnabled(): boolean {
  const env = (window as unknown as { env?: { oidcServerEnabled?: boolean | string } }).env;
  if (env?.oidcServerEnabled === true || env?.oidcServerEnabled === 'true') {
    return true;
  }
  if (typeof window !== 'undefined' && window.location?.hostname === 'finos.atparui.com') {
    return true;
  }
  return false;
}

function getKeycloakConfig(): { url: string; realm: string; clientId: string } {
  const env = (window as unknown as { env?: Record<string, string> }).env;
  return {
    url: env?.oidcBaseUrl || env?.FINERACT_PLUGIN_OIDC_BASE_URL || 'https://auth.atparui.com/realms/nbk-demo',
    realm: 'nbk-demo',
    clientId: env?.oidcClientId || env?.FINERACT_PLUGIN_OIDC_CLIENT_ID || 'finos-web'
  };
}

/**
 * Initialize Keycloak before bootstrapping Angular when OIDC is enabled.
 * Uses login-required so unauthenticated users are redirected to Keycloak immediately.
 * Redirect URI is root (/) so Keycloak redirects to origin/?code=... and keycloak-js can process the callback.
 */
async function initKeycloakWhenOidc(): Promise<void> {
  if (!isOidcEnabled()) {
    return;
  }
  const baseUrl = getKeycloakConfig().url;
  const url = baseUrl.includes('/realms/') ? baseUrl.replace(/\/realms\/.*$/, '') : baseUrl;
  const { default: Keycloak } = await import('keycloak-js');
  const keycloak = new Keycloak({
    url,
    realm: getKeycloakConfig().realm,
    clientId: getKeycloakConfig().clientId
  });
  const redirectUri = window.location.origin + '/';
  try {
    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      redirectUri,
      pkceMethod: 'S256',
      checkLoginIframe: false
    });
    window.__keycloak = keycloak;
    if (authenticated && (window.location.search || window.location.hash)) {
      const cleanUrl = window.location.origin + '/#' + (window.location.hash || '/');
      if (window.location.href !== cleanUrl) {
        window.history.replaceState(null, '', cleanUrl);
      }
    }
  } catch (e) {
    log.error('Keycloak init failed', e);
    throw e;
  }
}

function bootstrap(): void {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => log.error('Application bootstrap failed:', err));
}

initKeycloakWhenOidc()
  .then(() => bootstrap())
  .catch((err) => {
    log.error('Bootstrap failed:', err);
  });
