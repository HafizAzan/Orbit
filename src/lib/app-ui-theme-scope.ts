import { ADMIN_ROUTES } from '../router/admin-routes';
import { WORKSPACE_ROUTES } from '../router/workspace-routes';

function toPathPrefix(path: string) {
  const dynamicIndex = path.indexOf('/:');
  return dynamicIndex === -1 ? path : path.slice(0, dynamicIndex);
}

const APP_UI_THEME_PATH_PREFIXES = [
  ...new Set([
    ...Object.values(WORKSPACE_ROUTES).map(toPathPrefix),
    ...Object.values(ADMIN_ROUTES).map(toPathPrefix),
    '/admin',
  ]),
].sort((left, right) => right.length - left.length);

/** User UI themes apply only inside workspace + platform admin shells. */
export function isAppUiThemePath(pathname: string) {
  return APP_UI_THEME_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
