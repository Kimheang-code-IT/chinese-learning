export const useApi = () => {
  const config = useRuntimeConfig();
  const token = useCookie('auth_token');
  const router = useRouter();

  type HttpMethod =
    | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE'
    | 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete' | 'connect' | 'options' | 'trace'

  type FetchOptionsLike = {
    headers?: Record<string, string>
    method?: HttpMethod
    body?: BodyInit | object | null
    // allow passing through any other $fetch/ofetch options without using `any`
    [key: string]: unknown
  }

  const fetchOptions = (options: FetchOptionsLike = {}) => {
    const headers: Record<string, string> = {
      ...options.headers,
    };

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`;
    }

    return {
      baseURL: config.public.apiBase,
      ...options,
      headers,
      async onResponseError({ response }: { response: { status: number } }) {
        if (response.status === 401) {
          // Clear token and redirect to login
          token.value = null;
          router.push('/login');
        }
      },
    };
  };

  return {
    get: <T>(url: string, options?: FetchOptionsLike) => $fetch<T>(url, fetchOptions({ ...options, method: 'GET' as const })),
    post: <T>(url: string, body?: FetchOptionsLike['body'], options?: FetchOptionsLike) => $fetch<T>(url, fetchOptions({ ...options, method: 'POST' as const, body })),
    put: <T>(url: string, body?: FetchOptionsLike['body'], options?: FetchOptionsLike) => $fetch<T>(url, fetchOptions({ ...options, method: 'PUT' as const, body })),
    delete: <T>(url: string, options?: FetchOptionsLike) => $fetch<T>(url, fetchOptions({ ...options, method: 'DELETE' as const })),
  };
};
