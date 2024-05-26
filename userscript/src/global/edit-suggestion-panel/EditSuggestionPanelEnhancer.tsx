import { MarkAsClaimedUtilityButton } from '@/global/edit-suggestion-panel/components';
import { useShownEditSuggestion } from '@/global/edit-suggestion-panel/hooks';
import { UtilityButtonsRowPortal } from '@/global/edit-suggestion-panel/portals';
import { ReactElement } from 'react';

export function EditSuggestionPanelEnhancer(): ReactElement {
  const { editSuggestionPanel } = useShownEditSuggestion();

  if (!editSuggestionPanel) return null;

  return (
    <>
      <UtilityButtonsRowPortal>
        <MarkAsClaimedUtilityButton />
      </UtilityButtonsRowPortal>
    </>
  );
}
