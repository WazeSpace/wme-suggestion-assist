import { EditSuggestionDataModel } from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { useMutationObserver } from '@/hooks';
import { getWazeMapEditorWindow } from '@/utils';
import { getReactFiberNode, findFiberParentNode } from '@/utils/react-fiber';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useEventCallback } from 'usehooks-ts';

interface ShownEditSuggestionContextData {
  editSuggestion: EditSuggestionDataModel;
  editSuggestionPanel: HTMLElement;
}
const ShownEditSuggestionContext =
  createContext<ShownEditSuggestionContextData>({
    editSuggestion: null,
    editSuggestionPanel: null,
  });

const EDIT_SUGGESTION_SHOWN_EVENT = 'edit_suggestion:shown';
const EDIT_SUGGESTION_CLOSED_EVENT = 'edit_suggestion:closed';

export function ShownEditSuggestionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [panelRoot, setPanelRoot] = useState<HTMLElement | null>(null);
  const [panelContainer, setPanelContainer] = useState<HTMLElement | null>(
    null,
  );
  const [editSuggestion, setEditSuggestion] =
    useState<EditSuggestionDataModel | null>(null);
  useMutationObserver(
    panelRoot,
    () => {
      const potentialContainer = panelRoot.querySelector(
        'div:has(> [class^=container])',
      );
      if (!potentialContainer || !(potentialContainer instanceof HTMLElement))
        return;

      const potentialContainerFiber = getReactFiberNode(potentialContainer);
      const editSuggestionFiberNode = findFiberParentNode(
        potentialContainerFiber,
        (node) => 'editSuggestion' in node.memoizedProps,
      );
      if (!editSuggestionFiberNode) return;
      setPanelContainer(potentialContainer);
    },
    { childList: true, subtree: true },
  );

  const updatePanelContainerElement = () => {
    return setPanelRoot(document.getElementById('panel-container'));
  };
  const onEditSuggestionShown = useEventCallback(
    (suggestion: EditSuggestionDataModel) => {
      unstable_batchedUpdates(() => {
        updatePanelContainerElement();
        setEditSuggestion(suggestion);
      });
    },
  );
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

  return (
    <ShownEditSuggestionContext.Provider
      value={{ editSuggestion, editSuggestionPanel: panelContainer }}
    >
      {children}
    </ShownEditSuggestionContext.Provider>
  );
}

export function useShownEditSuggestionContext() {
  return useContext(ShownEditSuggestionContext);
}
