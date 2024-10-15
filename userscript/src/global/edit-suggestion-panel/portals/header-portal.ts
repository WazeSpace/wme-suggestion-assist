import { useShownEditSuggestionContext } from '@/global/contexts/ShownEditSuggestionContext';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function HeaderPortal({ children }: { children: ReactNode }) {
  const { editSuggestionPanel } = useShownEditSuggestionContext();
  if (!editSuggestionPanel) return null;

  const headerActionsContainer = editSuggestionPanel.querySelector(
    'div[class^=headerContainer]',
  );
  if (!headerActionsContainer) return null;

  return createPortal(children, headerActionsContainer);
}
