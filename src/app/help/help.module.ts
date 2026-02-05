/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/** Custom Modules */
import { SharedModule } from '../shared/shared.module';
import { HelpRoutingModule } from './help-routing.module';

/** Custom Components */
import { HelpComponent } from './help.component';

/**
 * Help Module
 *
 * In-app help page with sample Q&A.
 */
@NgModule({
  imports: [SharedModule, TranslateModule, HelpRoutingModule, HelpComponent],
  providers: []
})
export class HelpModule {}
