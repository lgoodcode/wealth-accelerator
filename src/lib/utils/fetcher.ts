type SuccessResponse<T> = { data: T; error: null };
type ErrorResponse = { data: null; error: string };
type FetcherResults<T> = Promise<SuccessResponse<T> | ErrorResponse>;

/**
 * Utility function that wraps the fetch API and returns the data or error.
 *
 * This is a generic function that can be used for any API call. It by default
 * sets the content type to JSON.
 */
export const fetcher = async <T = any>(url: string, options?: RequestInit): FetcherResults<T> => {
  const OPTIONS: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  try {
    const res = await fetch(url, OPTIONS);

    if (res.ok) {
      return await res.json();
    } else {
      if (res.status === 404) {
        console.error('Not found');
        return { error: 'Not found', data: null };
      } else if (res.headers.get('Content-Type')?.includes('application/json')) {
        // The server response format is { error: string, data: null }
        return await res.json();
      } else {
        return { error: await res.text(), data: null };
      }
    }
  } catch (_err) {
    const error = _err as Error;
    return { error: error.message || 'Failed to fetch', data: null };
  }
};
