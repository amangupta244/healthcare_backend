// NOTE: These helpers decode the JWT payload for UI rendering purposes only.
// Authorization is always enforced server-side via the backend middleware.
// Client-side role checks must never be the sole security gate.

export function getTokenPayload() {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined') return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function getUserRole() {
  const payload = getTokenPayload();
  return payload?.role || null;
}

export function isAuthenticated() {
  return getTokenPayload() !== null;
}
