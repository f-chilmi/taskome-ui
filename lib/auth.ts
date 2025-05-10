function getCookieValue(name: string): string | null {
  if (typeof window === "undefined" || !document.cookie) return null;

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export function getUser() {
  if (typeof window === "undefined" || !document.cookie) return null;

  const raw = getCookieValue("user");
  return raw ? JSON.parse(raw) : null;
}
