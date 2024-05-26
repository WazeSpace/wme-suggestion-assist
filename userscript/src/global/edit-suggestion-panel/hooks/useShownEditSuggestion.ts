import { EditSuggestionDataModel } from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { useMutationObserver } from '@/hooks';
import { getWazeMapEditorWindow } from '@/utils';
import { useEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useEventCallback } from 'usehooks-ts';

const EDIT_SUGGESTION_SHOWN_EVENT = 'edit_suggestion:shown';
const EDIT_SUGGESTION_CLOSED_EVENT = 'edit_suggestion:closed';

export function useShownEditSuggestion() {
  const [panelRoot, setPanelRoot] = useState<HTMLElement | null>(null);
  const [panelContainer, setPanelContainer] = useState<HTMLElement | null>(null);
  const [editSuggestion, setEditSuggestion] = useState<EditSuggestionDataModel | null>(null);
  useMutationObserver(panelRoot, () => {
    const editSuggestionRoot = panelRoot.getElementsByClassName('edit-suggestion-panel')[0] as HTMLDivElement;
    setPanelContainer(editSuggestionRoot);
  }, { childList: true, subtree: true });

  const updatePanelContainerElement = () => {
    return setPanelRoot(
      document.getElementById('panel-container'),
    );
  }
  const onEditSuggestionShown = useEventCallback((suggestion: EditSuggestionDataModel) => {
    unstable_batchedUpdates(() => {
      updatePanelContainerElement();
      setEditSuggestion(suggestion);
    });
  });
  const onEditSuggestionClosed = useEventCallback(() => {
    unstable_batchedUpdates(() => {
      setPanelRoot(null);
      setPanelContainer(null);
      setEditSuggestion(null);
    });
  });

  useEffect(() => {
    const appInstance = getWazeMapEditorWindow().W.app;
    appInstance.on(EDIT_SUGGESTION_SHOWN_EVENT, onEditSuggestionShown);
    appInstance.on(EDIT_SUGGESTION_CLOSED_EVENT, onEditSuggestionClosed);

    return () => {
      appInstance.off(EDIT_SUGGESTION_SHOWN_EVENT, onEditSuggestionShown);
      appInstance.off(EDIT_SUGGESTION_CLOSED_EVENT, onEditSuggestionClosed);
    };
  }, [onEditSuggestionShown, onEditSuggestionClosed]);

  return {
    editSuggestion,
    editSuggestionPanel: panelContainer,
  };
}
