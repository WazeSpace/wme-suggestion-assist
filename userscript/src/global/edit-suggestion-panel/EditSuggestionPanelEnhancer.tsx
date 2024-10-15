import { useEditSuggestionClaim } from '@/global/contexts/HandledEditSuggestionsContext';
import { HeaderPortal } from '@/global/edit-suggestion-panel/portals/header-portal';
import { HandledBanner, MarkAsHandledUtilityButton } from './components';
import { UtilityButtonsRowPortal } from './portals';
import { ReactElement } from 'react';
import { useShownEditSuggestionContext } from '../contexts/ShownEditSuggestionContext';

export function EditSuggestionPanelEnhancer(): ReactElement {
  const { editSuggestionPanel, editSuggestion } =
    useShownEditSuggestionContext();
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
