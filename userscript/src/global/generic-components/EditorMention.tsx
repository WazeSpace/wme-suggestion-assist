import { ExternalUserDataModel } from '@/@waze/Waze/DataModels/ExternalUserDataModel';
import { WmeSdkContext } from '@/contexts/WmeSdkContext';
import { StartChatButton } from '@/global/generic-components/StartChatButton';
import { Logger } from '@/logger';
import { getWazeMapEditorWindow } from '@/utils';
import { WzAnchor } from '@wazespace/wme-react-components';
import { useContext } from 'react';
import { WmeSDK } from 'wme-sdk-typings';

interface EditorMentionProps {
  userId: number;
  chatContext?: any;
}
export function EditorMention({ userId, chatContext }: EditorMentionProps) {
  const wmeSdk = useContext(WmeSdkContext);
  const dataModel = getWazeMapEditorWindow().W.model;
  const user: ExternalUserDataModel = dataModel.users.getObjectById(userId);
  if (!user) return <>{userId}</>;

  return (
    <>
      <WzAnchor
        href={getEditorProfileUrl(user.getAttribute('userName'), wmeSdk)}
        target="_blank"
        rel="noopener noreferrer"
        withIcon={false}
      >
        {getUserLabel(user)}
      </WzAnchor>

      <span>
        {' '}
        <StartChatButton user={user} chatContext={chatContext} />
      </span>
    </>
  );
}

function getUserLabel(user: ExternalUserDataModel): string {
  const name = user.getAttribute('userName');
  const rank = getUserRankContent(user.getRank());
  const staffLabel = getWazeMapEditorWindow()
    .I18n.t('edit.segment.lock_levels.staff')
    .toLowerCase();
  return `${name}(${user.isStaffUser() ? staffLabel : rank})`;
}

function getUserRankContent(rank: number): number {
  switch (rank) {
    case 0:
      return 1;
    case 1:
      return 2;
    case 2:
      return 3;
    case 3:
      return 4;
    case 4:
      return 5;
    case 5:
    case 6:
      return 6;
    default:
      return 1;
  }
}

function getEditorProfileUrl(username: string, wmeSdk?: WmeSDK): string {
  if (wmeSdk) {
    Logger.log('getEditorProfileUrl engine: SDK');
    return wmeSdk.DataModel.Users.getUserProfileLink({
      userName: username,
    });
  }

  Logger.log('getEditorProfileUrl engine: self');
  const encodedUsername = encodeURIComponent(username);
  const userProfileConfig = getWazeMapEditorWindow().W.Config.user_profile;
  if ('url' in userProfileConfig) {
    const baseUrl = userProfileConfig.url;
    return baseUrl + encodedUsername;
  }

  return new URL(`/user/editor/${encodedUsername}`, location.origin).toString();
}
