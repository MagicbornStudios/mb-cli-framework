import fs from 'node:fs';
import { installHookLog } from '../../../scripts/run-install-hook-log.mjs';

installHookLog('[mb-cli-framework] prepare: start');
fs.writeSync(
  2,
  '[mb-cli-framework] prepare: `tsc` (parallel with repub). Hooks log: `.tmp/pnpm-install-hooks.log`\n',
);
