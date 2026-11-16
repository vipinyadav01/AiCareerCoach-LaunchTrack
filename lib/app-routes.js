// Signed-in app sections. They render inside the sidebar shell, so the
// marketing header and footer stay off them. (middleware.ts keeps its own
// literal matcher list: Next requires it to be static.)
export const APP_ROUTES = ["/dashboard", "/resume", "/ai-cover-letter", "/interview", "/goals", "/account", "/diagnostics"];

export const isAppRoute = (pathname = "") =>
  APP_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
