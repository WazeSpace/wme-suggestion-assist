import { ComponentType, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  portalKey?: string;
}
export function createReactPortal(
  getContainer: () => Element | DocumentFragment,
): ComponentType<PortalProps> {
  return ({ children, portalKey }: PortalProps) => {
    const container = useMemo(() => getContainer(), []);
    if (!container) {
      console.error(
        '[Suggestion Assist] Unable to get container using function',
        getContainer,
      );
      return null;
    }
    return createPortal(children, container, portalKey);
  };
}
