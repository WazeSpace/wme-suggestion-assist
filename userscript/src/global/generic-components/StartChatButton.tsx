import { ExternalUserDataModel } from '@/@waze/Waze/DataModels/ExternalUserDataModel';
import { getWazeMapEditorWindow } from '@/utils';

interface StartChatButtonProps {
  user: ExternalUserDataModel;
  chatContext?: any;
}
export function StartChatButton({ user, chatContext }: StartChatButtonProps) {
  const chatService = getWazeMapEditorWindow().W.WMPChatService;

  return (
    <span
      className="waze-chat-with-user"
      onClick={() => {
        chatService.startChat(
          user.getAttribute('id'),
          user.getAttribute('userName'),
          chatContext,
        );
      }}
    >
      <i className="w-icon w-icon-chat"></i>
    </span>
  );
}
