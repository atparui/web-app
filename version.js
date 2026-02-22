/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const { resolve, relative } = require('path');
const { writeFileSync } = require('node:fs');
const moment = require('moment');

let version = moment().format('YYMMDD');
let hash = 'unknown';
let raw = 'no-git';

try {
  const { gitDescribeSync } = require('git-describe');
  const gitInfo = gitDescribeSync({ dirtyMark: false, dirtySemver: false });
  version = moment().format('YYMMDD');
  hash = gitInfo.hash || hash;
  raw = gitInfo.raw || raw;
} catch (err) {
  // No git (e.g. Docker build without .git) or not a repo: use env or defaults
  hash = process.env.BUILD_NUMBER || process.env.GIT_COMMIT || process.env.GIT_SHA || 'docker';
  raw = `docker-${hash}`;
}

const file = resolve(__dirname, '.', 'src', 'environments', '.env.ts');
writeFileSync(
  file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export default {
  'mifos_x': {
    'version': '${version}',
    'hash': '${hash}'
  },
  'allow_switching_backend_instance': true
};
/* tslint:enable */
`,
  { encoding: 'utf-8' }
);

console.log(`Wrote version info ${raw} to ${relative(resolve(__dirname, '..'), file)}`);
