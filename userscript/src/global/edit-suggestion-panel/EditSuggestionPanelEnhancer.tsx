import { useEditSuggestionClaim } from '@/global/contexts/HandledEditSuggestionsContext';
import { HeaderPortal } from '@/global/edit-suggestion-panel/portals/header-portal';
import { HandledBanner, MarkAsHandledUtilityButton } from './components';
import { useShownEditSuggestion } from './hooks';
import { UtilityButtonsRowPortal } from './portals';
import { ReactElement } from 'react';

export function EditSuggestionPanelEnhancer(): ReactElement {
  const { editSuggestionPanel, editSuggestion } = useShownEditSuggestion();
  const { isHandled, handledBy, handledOn } =
    useEditSuggestionClaim(editSuggestion);

  if (!editSuggestionPanel || !editSuggestion) return null;

  return (
    <>
      <UtilityButtonsRowPortal>
        <MarkAsHandledUtilityButton editSuggestion={editSuggestion} />
      </UtilityButtonsRowPortal>
      <HeaderPortal>
        {isHandled && (
          <HandledBanner handledOn={handledOn} handledBy={handledBy} />
        )}
      </HeaderPortal>
    </>
  );
}
