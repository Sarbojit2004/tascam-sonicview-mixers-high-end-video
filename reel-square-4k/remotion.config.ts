import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(94);
Config.setOverwriteOutput(true);
Config.setConcurrency(3);
Config.setDelayRenderTimeoutInMilliseconds(240000);
Config.setChromiumOpenGlRenderer('angle');

// Remotion cannot download its own headless shell here (remotion.media is not
// reachable), so point it at the pre-installed Playwright one.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
);
