import {Config} from '@remotion/cli/config';
import fs from 'node:fs';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(2);

// This environment ships Chromium preinstalled and blocks egress to
// remotion.media, so Remotion's own headless-shell download cannot run. Point
// it at the local binary instead. REMOTION_BROWSER_EXECUTABLE overrides.
const LOCAL_CHROME = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  '/opt/pw-browsers/chromium',
].find((p) => p && fs.existsSync(p));

if (LOCAL_CHROME) {
  Config.setBrowserExecutable(LOCAL_CHROME);
}
