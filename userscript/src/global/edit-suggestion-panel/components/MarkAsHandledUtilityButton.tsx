import { EditSuggestionDataModel } from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { useEditSuggestionClaim } from '@/global/contexts/HandledEditSuggestionsContext';
import { UtilityButton } from '@/global/edit-suggestion-panel/generic-components';
import { useTranslate } from '@/hooks';
import { SyntheticEvent, useState } from 'react';

interface MarkAsHandledUtilityButtonProps {
  editSuggestion: EditSuggestionDataModel;
}
export function MarkAsHandledUtilityButton({
  editSuggestion,
}: MarkAsHandledUtilityButtonProps) {
  const t = useTranslate('sa.issues_tracker.labels');
  const { isHandled, isHandledByCurrentUser, claim, unClaim } =
    useEditSuggestionClaim(editSuggestion);
  const [isClaiming, setIsClaiming] = useState<boolean | undefined>();

  const label = t(isHandledByCurrentUser ? 'mark_unhandled' : 'mark_handled');
  const iconName = isHandledByCurrentUser ? 'alert-fill' : 'alert';

  const handleButtonClick = async (e: SyntheticEvent) => {
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.blur();

    try {
      setIsClaiming(true);
      if (!isHandled) await claim();
      else await unClaim();
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <UtilityButton
      isBusy={isClaiming}
      iconName={iconName}
      label={label}
      onClick={handleButtonClick}
    />
  );
}
