/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Injectable, inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AuthMode, getActiveAuthMode } from './oauth.config';

/**
 * When OIDC/Keycloak is enabled, redirects to Keycloak before the login route activates.
 * Prevents the app login page from showing (same behaviour as React app with login-required).
 */
@Injectable()
export class OidcRedirectGuard implements CanActivate {
  private authenticationService = inject(AuthenticationService);

  canActivate(): boolean {
    if (getActiveAuthMode() !== AuthMode.OIDC) {
      return true;
    }
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }
    this.authenticationService.login().subscribe();
    return false;
  }
}
