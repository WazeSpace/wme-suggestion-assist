// import { createReactPortal } from '@/utils';
import { useShownEditSuggestionContext } from '@/global/contexts/ShownEditSuggestionContext';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function UtilityButtonsRowPortal({ children }: { children: ReactNode }) {
  const { editSuggestionPanel } = useShownEditSuggestionContext();
  if (!editSuggestionPanel) return null;

  const headerActionsContainer = editSuggestionPanel.querySelector(
    'div[class^=headerActions]',
  );
  if (!headerActionsContainer) return null;

  return createPortal(children, headerActionsContainer);
}
