export const CATEGORIES = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"] as const;

export const AMENITIES = [
  "Wi-Fi",
  "Air Conditioning",
  "Cyc Wall",
  "Green Screen",
  "Soundproofing",
  "Lighting Kit",
  "Parking",
  "Changing Room",
  "Mixing Console",
  "Microphones",
  "Backdrops",
  "Kitchenette",
];

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
