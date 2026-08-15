// Locates a usable Chromium for the render scripts.
//
// This environment ships Chromium preinstalled under /opt/pw-browsers and
// blocks outbound access to remotion.media, so Remotion's own headless-shell
// download fails with a 403. Every script resolves the local binary through
// here instead. Set REMOTION_BROWSER_EXECUTABLE to override.
import fs from 'node:fs';

const CANDIDATES = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
];

export const browserExecutable = CANDIDATES.find((p) => p && fs.existsSync(p)) ?? null;

if (!browserExecutable) {
  console.warn('! no local Chromium found; Remotion will try to download one');
}
