/* Renamed with the product. A visitor who had stored a preference under
   the old key falls back to the light default once, then re-stores under
   this one. */
export const THEME_KEY = "devyapos-theme";

/**
 * Inlined in <head> so the stored theme is applied before first paint.
 *
 * Without this the page would render in the OS theme and then snap to the
 * stored one on hydration — a full-page flash on every navigation. Kept as a
 * string constant so the script and ThemeToggle can never drift on the
 * storage key or the attribute they agree on.
 *
 * It lives here, in a plain module, and not in ThemeToggle.tsx, on purpose.
 * Anything a server component imports from a "use client" module is a client
 * reference, even a string: the layout's <head> then carried a pointer to
 * ThemeToggle's chunk instead of the script text. When React reached <head>
 * before that chunk had loaded it suspended there, and React 19 resumes the
 * <head> with its place in <body> lost, so every so often hydration failed with
 * error #418 and the whole page was re-rendered on the client (QEN-F5,
 * tests/client-boundary.test.ts).
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
