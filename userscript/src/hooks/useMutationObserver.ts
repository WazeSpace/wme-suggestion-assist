import { useCallback, useEffect, useRef } from 'react';
import { useEventCallback, useUnmount } from 'usehooks-ts';

export function useMutationObserver(
  target: Element | null,
  callback: MutationCallback,
  options: MutationObserverInit,
) {
  const observer = useRef<MutationObserver>();
  const memoizedCallback = useEventCallback(callback);

  const observeTarget = useCallback(() => {
    if (!observer.current || !target) return;
    observer.current.observe(target, options);
  }, [options, target]);
  const disconnectTarget = useCallback(() => {
    if (!observer.current) return;
    observer.current.disconnect();
  }, []);

  useUnmount(disconnectTarget);

  useEffect(() => {
    observer.current = new MutationObserver(memoizedCallback);
    observeTarget();

    return () => {
      disconnectTarget();
    };
  }, [memoizedCallback, disconnectTarget, observeTarget]);
}
