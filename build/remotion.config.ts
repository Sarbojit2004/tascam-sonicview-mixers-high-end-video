import { Config } from "@remotion/cli/config";
Config.setPublicDir("./public");
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle-egl");

// This environment blocks egress to remotion.media, so Remotion cannot fetch
// its own Chrome Headless Shell. A Playwright-managed Chromium headless shell
// is pre-installed here, so point Remotion at that instead of downloading.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER ??
    "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
);
Config.setConcurrency(4);
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setJpegQuality(95);
