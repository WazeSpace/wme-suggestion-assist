import { MarkAsHandledUtilityButton } from './components';
import { useShownEditSuggestion } from './hooks';
import { UtilityButtonsRowPortal } from './portals';
import { ReactElement } from 'react';

export function EditSuggestionPanelEnhancer(): ReactElement {
  const { editSuggestionPanel, editSuggestion } = useShownEditSuggestion();

  if (!editSuggestionPanel || !editSuggestion) return null;

  return (
    <>
      <UtilityButtonsRowPortal>
        <MarkAsHandledUtilityButton editSuggestion={editSuggestion} />
      </UtilityButtonsRowPortal>
    </>
  );
}
