import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CAMERA_FEATURE_STREAM,
  cameraSupportsHls,
  getCameraMjpegUrl,
  getCameraPosterUrl,
  joinHassUrl,
} from "./stream";

describe("camera stream helpers", () => {
  it("joins relative HA paths to the instance URL", () => {
    assert.equal(
      joinHassUrl("http://ha.local:8123/", "/api/hls/abc/playlist.m3u8"),
      "http://ha.local:8123/api/hls/abc/playlist.m3u8"
    );
    assert.equal(
      joinHassUrl("http://ha.local:8123", "api/hls/abc/playlist.m3u8"),
      "http://ha.local:8123/api/hls/abc/playlist.m3u8"
    );
  });

  it("detects HLS support from capabilities or STREAM feature bit", () => {
    assert.equal(
      cameraSupportsHls({ frontend_stream_types: ["hls"] }),
      true
    );
    assert.equal(
      cameraSupportsHls({ frontend_stream_types: ["webrtc"] }, CAMERA_FEATURE_STREAM),
      false
    );
    assert.equal(cameraSupportsHls(null, CAMERA_FEATURE_STREAM), true);
    assert.equal(cameraSupportsHls(null, 0), false);
  });

  it("builds authenticated proxy URLs", () => {
    const mjpeg = getCameraMjpegUrl(
      "http://ha.local:8123",
      "camera.front",
      "tok"
    );
    assert.match(mjpeg, /\/api\/camera_proxy_stream\/camera\.front/);
    assert.match(mjpeg, /token=tok/);

    const poster = getCameraPosterUrl(
      "http://ha.local:8123",
      "camera.front",
      "tok"
    );
    assert.match(poster, /\/api\/camera_proxy\/camera\.front/);
    assert.match(poster, /token=tok/);
  });
});
