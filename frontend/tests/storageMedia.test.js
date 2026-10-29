import test from "node:test";
import assert from "node:assert/strict";
import {
  privateImagePath,
  validateImage,
  MAX_IMAGE_BYTES,
} from "../src/lib/storageMedia.js";
test("private media accepts only namespaced UUID paths", () => {
  const path =
    "11111111-1111-4111-8111-111111111111/22222222-2222-4222-8222-222222222222.png";
  assert.equal(privateImagePath("supabase:" + path), path);
  for (const input of [
    "supabase:../other.png",
    "supabase:https://example.com/image.png",
    path,
    "demo:trade-01-review",
    null,
  ])
    assert.equal(privateImagePath(input), null);
});
test("uploads reject unsupported, empty, and oversized files", () => {
  validateImage({ type: "image/png", size: 1234 });
  validateImage({ type: "image/webp", size: MAX_IMAGE_BYTES });
  for (const input of [
    { type: "image/svg+xml", size: 100 },
    { type: "image/png", size: 0 },
    { type: "image/jpeg", size: MAX_IMAGE_BYTES + 1 },
    null,
  ])
    assert.throws(() => validateImage(input));
});
