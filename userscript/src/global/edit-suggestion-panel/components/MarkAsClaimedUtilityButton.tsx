import { EditSuggestionDataModel } from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { useEditSuggestionClaim } from '@/global/contexts/ClaimedEditSuggestionsContext';
import { UtilityButton } from '@/global/edit-suggestion-panel/generic-components';
import { useTranslate } from '@/hooks';
import { SyntheticEvent, useState } from 'react';

interface MarkAsClaimedUtilityButtonProps {
  editSuggestion: EditSuggestionDataModel;
}
export function MarkAsClaimedUtilityButton({
  editSuggestion,
}: MarkAsClaimedUtilityButtonProps) {
  const t = useTranslate('sa.issues_tracker.labels');
  const { isClaimed, isClaimedByCurrentUser, claim, unClaim } =
    useEditSuggestionClaim(editSuggestion);
  const [isClaiming, setIsClaiming] = useState<boolean | undefined>();

  const label = t(isClaimedByCurrentUser ? 'mark_unclaimed' : 'mark_claimed');
  const iconName = isClaimedByCurrentUser ? 'alert-fill' : 'alert';

  const handleButtonClick = async (e: SyntheticEvent) => {
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.blur();

    try {
      setIsClaiming(true);
      if (!isClaimed) await claim();
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
