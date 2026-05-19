export function formatDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

export function readingTime(text: string): number {
  const cjk = (text.match(/[一-鿿]/g) ?? []).length;
  const words = text.split(/\s+/).filter((w) => /[a-zA-Z0-9]/.test(w)).length;
  const minutes = Math.max(1, Math.round(cjk / 400 + words / 220));
  return minutes;
}

export const TILT_ANGLES = [-2.5, 1.5, -1, 2, -1.8, 1.2];

export function pickTilt(seed: number): number {
  return TILT_ANGLES[Math.abs(seed) % TILT_ANGLES.length];
}

export function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return h;
}
