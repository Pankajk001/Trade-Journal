import { currentUser, db } from "../lib/supabase";
import {
  IMAGE_BUCKET,
  IMAGE_EXTENSIONS,
  privateImagePath,
  validateImage,
} from "../lib/storageMedia";

function storageResult({ data, error }) {
  if (error) {
    if (/bucket.*not found/i.test(error.message))
      throw new Error(
        "Screenshot storage needs setup. Run supabase/migrations/002_private_storage.sql in the Supabase SQL Editor.",
      );
    throw new Error(error.message || "Screenshot request failed.");
  }
  return data;
}
export const mediaService = {
  async upload(file) {
    validateImage(file);
    const user = await currentUser();
    const path =
      user.id + "/" + crypto.randomUUID() + "." + IMAGE_EXTENSIONS[file.type];
    storageResult(
      await db().storage.from(IMAGE_BUCKET).upload(path, file, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      }),
    );
    return { key: "supabase:" + path };
  },
  async read(key) {
    const path = privateImagePath(key);
    if (!path) throw new Error("This screenshot reference is not supported.");
    const blob = storageResult(
      await db().storage.from(IMAGE_BUCKET).download(path),
    );
    return URL.createObjectURL(blob);
  },
  async remove(key) {
    const path = privateImagePath(key);
    if (!path) throw new Error("This screenshot reference is not supported.");
    storageResult(await db().storage.from(IMAGE_BUCKET).remove([path]));
  },
};
