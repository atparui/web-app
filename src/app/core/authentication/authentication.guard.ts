/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

/** Custom Services */
import { Logger } from '../logger/logger.service';
import { AuthenticationService } from './authentication.service';
import { AuthMode, getActiveAuthMode } from './oauth.config';

/** Initialize logger */
const log = new Logger('AuthenticationGuard');

/**
 * Route access authorization.
 * When OIDC/Keycloak is enabled, redirects to auth.atparui.com (Keycloak) instead of showing the app login page.
 */
@Injectable()
export class AuthenticationGuard {
  private router = inject(Router);
  private authenticationService = inject(AuthenticationService);

  /**
   * Ensures route access is authorized. When OIDC is enabled, redirects to Keycloak (no app login screen).
   *
   * @returns {boolean} True if user is authenticated.
   */
  canActivate(): boolean {
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    if (getActiveAuthMode() === AuthMode.OIDC) {
      log.debug('OIDC enabled: redirecting to Keycloak (auth.atparui.com)...');
      this.authenticationService.login().subscribe();
      return false;
    }

    log.debug('User not authenticated, redirecting to login...');
    this.authenticationService.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
}
