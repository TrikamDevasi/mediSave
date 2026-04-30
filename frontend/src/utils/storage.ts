/**
 * Storage utilities — never use localStorage directly, always use these helpers.
 * All functions are try/catch safe and handle JSON serialization.
 */

// ─── localStorage ─────────────────────────────────────────────────────────

export function getFromStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota exceeded)
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // noop
  }
}

export function clearAuthStorage(): void {
  removeFromStorage('authToken');
  removeFromStorage('authUser');
  // NEVER store raw passwords
}

// ─── sessionStorage ──────────────────────────────────────────────────────

export function getFromSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveToSession<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // noop
  }
}

export function removeFromSession(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // noop
  }
}

// ─── Auth helpers ────────────────────────────────────────────────────────

export function getAuthToken(): string | null {
  return getFromStorage<string>('authToken');
}

export function setAuthToken(token: string): void {
  saveToStorage('authToken', token);
}

export function getAuthUser<T>(): T | null {
  return getFromStorage<T>('authUser');
}

export function setAuthUser<T>(user: T): void {
  saveToStorage('authUser', user);
}
