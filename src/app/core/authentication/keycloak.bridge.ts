/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Bridge to the Keycloak instance initialized in main.ts before Angular bootstrap.
 * Used when OIDC is enabled so the app uses keycloak-js for auth instead of angular-oauth2-oidc.
 */

export type KeycloakInstance = import('keycloak-js').KeycloakInstance;

declare global {
  interface Window {
    __keycloak?: KeycloakInstance;
  }
}

export function getKeycloakInstance(): KeycloakInstance | undefined {
  return typeof window !== 'undefined' ? window.__keycloak : undefined;
}

export function isKeycloakAuthenticated(): boolean {
  const kc = getKeycloakInstance();
  return !!(kc?.authenticated);
}

export function getKeycloakToken(): string | undefined {
  const kc = getKeycloakInstance();
  return kc?.token;
}
