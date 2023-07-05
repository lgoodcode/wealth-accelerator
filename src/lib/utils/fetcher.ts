type FetcherResults<T, E = Error> = {
  error: E | null;
  data: T | null;
};

/**
 * Utility function that wraps the fetch API and returns the data or error.
 *
 * This is a generic function that can be used for any API call. It by default
 * sets the content type to JSON.
 */
export const fetcher = async <T = any, E = Error>(
  url: string,
  options?: RequestInit
): Promise<FetcherResults<T, E>> => {
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
      const json = await res.json();

      if ('error' in json) {
        return {
          error: json.error as E,
          data: null,
        };
      }
      return {
        error: null,
        data: json as T,
      };
    } else {
      return {
        error: (await res.json()) as E,
        data: null,
      };
    }
  } catch (error) {
    return {
      error: error as E,
      data: null,
    };
  }
};
