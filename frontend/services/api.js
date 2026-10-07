export const API_BASE_URL = '/api';

export async function apiGet(path) {
  return { ok: true, path };
}
