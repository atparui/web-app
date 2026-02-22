/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Custom Components */
import { LoginComponent } from './login.component';

/** Guards: redirect to Keycloak when OIDC enabled so login page never shows */
import { OidcRedirectGuard } from '../core/authentication/oidc-redirect.guard';

/** Login Routes */
const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [OidcRedirectGuard],
    data: { title: 'Login' }
  }
];

/**
 * Login Routing Module
 *
 * Configures the login routes.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [OidcRedirectGuard]
})
export class LoginRoutingModule {}
