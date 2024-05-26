import { UtilityButton } from '@/global/edit-suggestion-panel/generic-components';
import { useTranslate } from '@/hooks';
import { MouseEvent, MouseEventHandler, SyntheticEvent, useState } from 'react';

export function MarkAsClaimedUtilityButton() {
  const t = useTranslate('sa.issues_tracker.labels');
  const [isClaimMarked, setIsClaimMarked] = useState(false);
  const toggleIsClaimMarked = () => setIsClaimMarked((prev) => !prev);
  const label = t(isClaimMarked ? 'mark_unclaimed' : 'mark_claimed');
  const iconName = isClaimMarked ? 'alert-fill' : 'alert';

  const handleButtonClick = (e: SyntheticEvent) => {
    if (e.currentTarget instanceof HTMLElement)
      e.currentTarget.blur();
    toggleIsClaimMarked();
  }

  return (
    <UtilityButton iconName={iconName} label={label} onClick={handleButtonClick} />
  )
}
