function getCookieValue(name: string): string | null {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

export function getUser() {
  const raw = getCookieValue("user");
  return raw ? JSON.parse(raw) : null;
}
