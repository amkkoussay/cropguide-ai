const VISITOR_ID_KEY = "cropguide-visitor-id";

export function getVisitorId() {
  const saved = window.localStorage.getItem(VISITOR_ID_KEY);
  if (saved && /^cg_[A-Za-z0-9_-]{24,92}$/.test(saved)) return saved;

  const entropy = typeof crypto.randomUUID === "function"
    ? crypto.randomUUID().replace(/-/g, "")
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  const visitorId = `cg_${entropy}`;
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
}
