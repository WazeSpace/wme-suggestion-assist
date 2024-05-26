import { BeforeMethodInvocationInterceptor } from '@/method-interceptor';
import { getWazeMapEditorWindow } from '@/utils';

function getUrlFromFetchInput(input: RequestInfo | URL): URL {
  if (input instanceof URL) return input;
  const path = typeof input === 'string' ? input : input.url;
  return new URL(path, location.toString());
}

function getHrefWithoutSearchParams(url: URL): string {
  const clonedURL = new URL(url);
  clonedURL.search = '';
  return clonedURL.toString();
}

const requestsMap = new Map<string, Response>();

const fetchInterceptor = new BeforeMethodInvocationInterceptor(
  getWazeMapEditorWindow(),
  'fetch',
  (input: RequestInfo | URL) => {
    const requestPath = getHrefWithoutSearchParams(getUrlFromFetchInput(input));
    if (requestsMap.has(requestPath)) {
      const response = requestsMap.get(requestPath);
      requestsMap.delete(requestPath);
      return Promise.resolve(response);
    }

    return BeforeMethodInvocationInterceptor.CONTINUE_EXECUTION;
  },
);

export function overrideFetchRequest(
  requestPath: string | URL,
  responseToReturn: Response,
) {
  const requestUrl = getHrefWithoutSearchParams(
    getUrlFromFetchInput(requestPath),
  );
  requestsMap.set(requestUrl, responseToReturn);
  fetchInterceptor.enable();
}
