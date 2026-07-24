import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import type { Page } from "@repo/types/page";

describe("publish settings + export", () => {
  let dataDir: string;
  let publishDir: string;
  let viewerDist: string;
  let readPublishSettings: typeof import("../store/publishSettings").readPublishSettings;
  let writePublishSettings: typeof import("../store/publishSettings").writePublishSettings;
  let exportPublishedPage: typeof import("./exportPage").exportPublishedPage;
  let removePublishedPage: typeof import("./exportPage").removePublishedPage;

  before(async () => {
    dataDir = await mkdtemp(path.join(tmpdir(), "casaboard-pub-data-"));
    publishDir = await mkdtemp(path.join(tmpdir(), "casaboard-pub-out-"));
    viewerDist = await mkdtemp(path.join(tmpdir(), "casaboard-viewer-"));

    process.env.DATA_DIR = dataDir;
    process.env.PUBLISH_DIR = publishDir;
    process.env.VIEWER_DIST_DIR = viewerDist;

    await writeFile(
      path.join(dataDir, "ha-connection.json"),
      JSON.stringify({ hass_url: "http://homeassistant.local:8123", auth: null }),
      "utf-8"
    );

    const assetsDir = path.join(viewerDist, "assets");
    const { mkdir } = await import("node:fs/promises");
    await mkdir(assetsDir, { recursive: true });
    await writeFile(path.join(assetsDir, "viewer.js"), "export {};\n", "utf-8");
    await writeFile(path.join(assetsDir, "viewer.css"), "body{}\n", "utf-8");

    ({ readPublishSettings, writePublishSettings } = await import(
      "../store/publishSettings"
    ));
    ({ exportPublishedPage, removePublishedPage } = await import("./exportPage"));
  });

  after(async () => {
    await rm(dataDir, { recursive: true, force: true });
    await rm(publishDir, { recursive: true, force: true });
    await rm(viewerDist, { recursive: true, force: true });
  });

  it("reads default publish settings from env", async () => {
    const settings = await readPublishSettings();
    assert.equal(settings.publishDir, publishDir);
  });

  it("persists publish settings", async () => {
    const saved = await writePublishSettings({
      publishDir,
      publicBaseUrl: "http://homeassistant.local:8123/local/casaboard",
    });
    assert.equal(
      saved.publicBaseUrl,
      "http://homeassistant.local:8123/local/casaboard"
    );
    const again = await readPublishSettings();
    assert.equal(again.publicBaseUrl, saved.publicBaseUrl);
  });

  it("exports page files and removes them on unpublish", async () => {
    await writePublishSettings({
      publishDir,
      publicBaseUrl: "http://homeassistant.local:8123/local/casaboard",
    });

    const page: Page = {
      id: "test-id",
      name: "Home",
      slug: "home",
      puck_data: { content: [], root: { props: {} } },
      published: true,
      sidebar_id: null,
      theme_id: null,
      theme_overrides: null,
      style_id: "homekit",
      created_at: "2026-07-24T00:00:00.000Z",
      updated_at: "2026-07-24T00:00:00.000Z",
    };

    await exportPublishedPage(page);

    const jsonPath = path.join(publishDir, "pages", "home.json");
    const htmlPath = path.join(publishDir, "home", "index.html");
    const jsPath = path.join(publishDir, "assets", "viewer.js");

    await access(jsonPath);
    await access(htmlPath);
    await access(jsPath);

    const payload = JSON.parse(await readFile(jsonPath, "utf-8"));
    assert.equal(payload.slug, "home");
    assert.equal(payload.hassUrl, "http://homeassistant.local:8123");
    assert.equal(payload.version, 1);
    assert.ok(!("auth" in payload));
    assert.ok(!("access_token" in payload));

    const html = await readFile(htmlPath, "utf-8");
    assert.match(html, /viewer\.js/);

    await removePublishedPage("home");
    await assert.rejects(() => access(jsonPath));
    await assert.rejects(() => access(htmlPath));
  });

  it("fails clearly when viewer bundle is missing", async () => {
    const badViewer = await mkdtemp(path.join(tmpdir(), "casaboard-no-viewer-"));
    const prev = process.env.VIEWER_DIST_DIR;
    process.env.VIEWER_DIST_DIR = badViewer;

    // Re-import would cache module — call sync via export with env already read at call time
    const { exportPublishedPage: exportAgain } = await import("./exportPage");

    const page: Page = {
      id: "x",
      name: "X",
      slug: "missing-viewer",
      puck_data: { content: [], root: { props: {} } },
      published: true,
      created_at: "2026-07-24T00:00:00.000Z",
      updated_at: "2026-07-24T00:00:00.000Z",
    };

    await assert.rejects(
      () => exportAgain(page),
      /Viewer bundle not found/
    );

    process.env.VIEWER_DIST_DIR = prev;
    await rm(badViewer, { recursive: true, force: true });
  });
});
