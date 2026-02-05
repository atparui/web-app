/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/** Angular Imports */
import { Component } from '@angular/core';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';

/**
 * In-app help page with sample questions and answers.
 */
@Component({
  selector: 'mifosx-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ]
})
export class HelpComponent {}
