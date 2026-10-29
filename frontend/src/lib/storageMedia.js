export const IMAGE_BUCKET = "journal-images";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_EXTENSIONS = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export function privateImagePath(key) {
  if (typeof key !== "string") return null;
  const match =
    /^supabase:([0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:png|jpg|webp))$/.exec(key);
  return match ? match[1] : null;
}

export function validateImage(file) {
  if (
    !file ||
    !IMAGE_EXTENSIONS[file.type] ||
    file.size <= 0 ||
    file.size > MAX_IMAGE_BYTES
  )
    throw new Error("Use a PNG, JPEG or WebP image under 5 MB.");
}
