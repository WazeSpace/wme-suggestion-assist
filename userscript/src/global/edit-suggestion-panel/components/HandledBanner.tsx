import { useShownEditSuggestionContext } from '@/global/contexts/ShownEditSuggestionContext';
import { EditorMention } from '@/global/generic-components';
import { useTranslate } from '@/hooks';
import { getWazeMapEditorWindow } from '@/utils';
import { WzBadge, WzCaption } from '@wazespace/wme-react-components';
import { useEffect } from 'react';

interface HandledBannerProps {
  handledOn: number;
  handledBy: number[];
}
export function HandledBanner({ handledOn, handledBy }: HandledBannerProps) {
  const t = useTranslate();
  const { editSuggestionPanel } = useShownEditSuggestionContext();

  useEffect(() => {
    const originalBanner = editSuggestionPanel?.querySelector<HTMLDivElement>(
      'div[class^=headerContainer] + wz-banner',
    );
    if (originalBanner) originalBanner.style.display = 'none';

    return () => {
      if (originalBanner) originalBanner.style.display = null;
    };
  });

  const formattedHandledOn = getWazeMapEditorWindow().I18n.strftime(
    new Date(handledOn),
    '%d/%m/%Y',
  );

  return (
    <wz-banner color="orange">
      <div className="banner-content">
        <WzCaption>
          {t('sa.issues_tracker.EDIT_SUGGESTION.handled_on', {
            date: formattedHandledOn,
          })}
          <br />
          {t('issues_tracker.EDIT_SUGGESTION.by')}{' '}
          {handledBy.map((userId) => (
            <EditorMention key={userId} userId={userId} />
          ))}
        </WzCaption>

        <WzBadge>
          <i
            style={{
              fontSize: 16,
              marginLeft: 1,
              color: 'var(--cautious_variant)',
            }}
            className="w-icon w-icon-clock-fill"
          />
          {t('sa.issue_tracker.issue.status.handled')}
        </WzBadge>
      </div>
    </wz-banner>
  );
}
