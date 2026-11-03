export async function uploadToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not configured. Paste an image URL instead.");
  const fd = new FormData();
  fd.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
  const json = await res.json();
  if (!json.success) throw new Error("Image upload failed. Please try again.");
  return json.data.url as string;
}
