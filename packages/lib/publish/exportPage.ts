import {
  access,
  cp,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "fs/promises";
import path from "path";
import type { CSSProperties } from "react";
import type { Page } from "@repo/types/page";
import type { PublishedPagePayload } from "@repo/types/publishedPage";
import { resolveDashboardThemeStyles } from "../theme/resolveDashboardTheme";
import { resolveDashboardStyle } from "../style/resolveDashboardStyle";
import { readHAConnection } from "../store/haConnection";
import { readPublishSettings } from "../store/publishSettings";

const VIEWER_VERSION_FILE = ".viewer-version";

function cssPropsToRecord(style: CSSProperties): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(style ?? {})) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

export function viewerDistDir(): string {
  return (
    process.env.VIEWER_DIST_DIR ||
    path.resolve(process.cwd(), "apps/viewer/dist")
  );
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function assertWritableDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
    const probe = path.join(dir, ".casaboard-write-test");
    await writeFile(probe, "ok", "utf-8");
    await rm(probe, { force: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Publish directory is not writable: ${dir}. Mount HA www/casaboard (or set publishDir). ${message}`
    );
  }
}

/**
 * Copy built viewer assets into publishDir/assets when missing or version changed.
 */
export async function syncViewerAssets(publishDir: string): Promise<void> {
  const dist = viewerDistDir();
  const srcJs = path.join(dist, "assets", "viewer.js");
  const srcCss = path.join(dist, "assets", "viewer.css");

  if (!(await pathExists(srcJs))) {
    throw new Error(
      `Viewer bundle not found at ${srcJs}. Build apps/viewer (npm run build --workspace=viewer) before publishing.`
    );
  }

  const assetsDir = path.join(publishDir, "assets");
  await mkdir(assetsDir, { recursive: true });

  const versionMarker = path.join(publishDir, VIEWER_VERSION_FILE);
  const distStat = await stat(srcJs);
  const version = String(distStat.mtimeMs);

  let current: string | null = null;
  if (await pathExists(versionMarker)) {
    current = await readFile(versionMarker, "utf-8");
  }

  if (
    current?.trim() === version &&
    (await pathExists(path.join(assetsDir, "viewer.js")))
  ) {
    return;
  }

  await cp(srcJs, path.join(assetsDir, "viewer.js"));
  if (await pathExists(srcCss)) {
    await cp(srcCss, path.join(assetsDir, "viewer.css"));
  } else {
    await writeFile(
      path.join(assetsDir, "viewer.css"),
      "/* casaboard viewer */\n",
      "utf-8"
    );
  }

  const distAssets = path.join(dist, "assets");
  if (await pathExists(distAssets)) {
    const files = await readdir(distAssets);
    for (const file of files) {
      if (file === "viewer.js" || file === "viewer.css") continue;
      await cp(path.join(distAssets, file), path.join(assetsDir, file));
    }
  }

  await writeFile(versionMarker, version, "utf-8");
}

function htmlShell(slug: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CasaBoard — ${slug}</title>
    <link rel="stylesheet" href="../assets/viewer.css" />
  </head>
  <body class="min-h-dvh">
    <div id="root"></div>
    <script type="module" src="../assets/viewer.js"></script>
  </body>
</html>
`;
}

export async function buildPublishedPayload(
  page: Page
): Promise<PublishedPagePayload> {
  const connection = await readHAConnection();
  const hassUrl = connection?.hass_url;
  if (!hassUrl) {
    throw new Error(
      "Cannot publish: Home Assistant connection URL is not configured."
    );
  }

  const themeStyles = await resolveDashboardThemeStyles(page);
  const styleResult = resolveDashboardStyle(page);

  return {
    version: 1,
    slug: page.slug,
    name: page.name,
    hassUrl,
    puck_data: page.puck_data,
    sidebar: page.sidebar?.puck_data
      ? { puck_data: page.sidebar.puck_data }
      : null,
    themeMain: cssPropsToRecord(themeStyles.main),
    themeSidebar: cssPropsToRecord(themeStyles.sidebar),
    styleMainId: styleResult.mainId,
    styleMainVars: cssPropsToRecord(styleResult.main),
    styleSidebarId: styleResult.sidebarId,
    styleSidebarVars: cssPropsToRecord(styleResult.sidebar),
  };
}

export async function exportPublishedPage(page: Page): Promise<void> {
  const settings = await readPublishSettings();
  const publishDir = path.resolve(settings.publishDir);

  await assertWritableDir(publishDir);
  await syncViewerAssets(publishDir);

  const payload = await buildPublishedPayload(page);
  const pagesDir = path.join(publishDir, "pages");
  const slugDir = path.join(publishDir, page.slug);

  await mkdir(pagesDir, { recursive: true });
  await mkdir(slugDir, { recursive: true });

  await writeFile(
    path.join(pagesDir, `${page.slug}.json`),
    JSON.stringify(payload, null, 2),
    "utf-8"
  );
  await writeFile(
    path.join(slugDir, "index.html"),
    htmlShell(page.slug),
    "utf-8"
  );
}

export async function removePublishedPage(slug: string): Promise<void> {
  const settings = await readPublishSettings();
  const publishDir = path.resolve(settings.publishDir);

  if (!(await pathExists(publishDir))) return;

  await rm(path.join(publishDir, "pages", `${slug}.json`), { force: true });
  await rm(path.join(publishDir, slug), { recursive: true, force: true });
}
