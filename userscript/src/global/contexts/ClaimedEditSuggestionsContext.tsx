import { DeleteObjectAction } from '@/@waze/Waze/actions';
import { CreateObjectAction } from '@/@waze/Waze/actions/create-object.action';
import { EditSuggestionDataModel } from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { MapCommentDataModel } from '@/@waze/Waze/DataModels/MapCommentDataModel';
import { useMatchingMapComments } from '@/hooks';
import {
  createMandatoryUseContext,
  createMapCommentsForEditSuggestion,
  getWazeMapEditorWindow,
} from '@/utils';
import { createContext, ReactNode, useCallback, useMemo } from 'react';

interface ClaimEditSuggestion {
  editSuggestionId: number;
  claimedBy: number;
  claimedOn: number;
  associatedMapComment: MapCommentDataModel;
}
interface ClaimedEditSuggestionsContextData {
  claimedSuggestions: ClaimEditSuggestion[];
  claimSuggestion(editSuggestion: EditSuggestionDataModel): Promise<boolean>;
}
const ClaimedEditSuggestionsContext =
  createContext<ClaimedEditSuggestionsContextData | null>(null);

interface ClaimedEditSuggestionsProviderProps {
  children: ReactNode;
}
export function ClaimedEditSuggestionsProvider({
  children,
}: ClaimedEditSuggestionsProviderProps) {
  const matchingMapComments = useMatchingMapComments(
    (mapComment) => {
      return isMapCommentSubjectMatches(mapComment);
    },
    { removeFromEditor: true, processExistingComments: true },
  );

  const claimedEditSuggestions = useMemo(() => {
    const claims: ClaimEditSuggestion[] = [];
    for (const matchingMapComment of matchingMapComments) {
      const extractedData = extractSuggestionFromMapComment(matchingMapComment);
      if (!extractedData) continue;
      claims.push({
        editSuggestionId: extractedData.editSuggestion,
        claimedBy:
          extractedData.claimedBy ??
          matchingMapComment.getAttribute('createdBy'),
        claimedOn:
          extractedData.claimedOn ??
          matchingMapComment.getAttribute('createdOn'),
        associatedMapComment: matchingMapComment,
      });
    }
    return claims;
  }, [matchingMapComments]);

  const claimEditSuggestion = useCallback(
    async (editSuggestion: EditSuggestionDataModel) => {
      const commentPayload = {
        editSuggestion: editSuggestion.getAttribute('id'),
      };
      const commentPayloadJson = JSON.stringify(commentPayload);
      const encodedPayload = '$SA$' + btoa(commentPayloadJson) + '$SA$E$';

      const suggestionMapComments = await createMapCommentsForEditSuggestion(
        editSuggestion,
        '[SA] Suggestion in Review',
        encodedPayload,
      );
      const dataModel = getWazeMapEditorWindow().W.model;
      const mapCommentsRepo = dataModel.mapComments;
      const addMapCommentActions = suggestionMapComments.map((mapComment) => {
        mapComment.attributes.id = mapCommentsRepo.generateUniqueID();
        return new CreateObjectAction(mapComment, mapCommentsRepo);
      });
      await getWazeMapEditorWindow().W.controller.save({
        actions: addMapCommentActions,
      });
      return true;
    },
    [],
  );

  return (
    <ClaimedEditSuggestionsContext.Provider
      value={{
        claimedSuggestions: claimedEditSuggestions,
        claimSuggestion: claimEditSuggestion,
      }}
    >
      {children}
    </ClaimedEditSuggestionsContext.Provider>
  );
}

export const useClaimedEditSuggestionsContext = createMandatoryUseContext(
  ClaimedEditSuggestionsContext,
  'ClaimedEditSuggestionsContext',
);

export function useEditSuggestionClaim(suggestion: EditSuggestionDataModel) {
  const { claimSuggestion, claimedSuggestions } =
    useClaimedEditSuggestionsContext();
  const currentSuggestionClaims = useMemo(() => {
    const currentSuggestionId = suggestion.getAttribute('id');
    return claimedSuggestions.filter(
      (claim) => claim.editSuggestionId === currentSuggestionId,
    );
  }, [claimedSuggestions, suggestion]);

  return {
    isClaimed: currentSuggestionClaims.length > 0,
    isClaimedByCurrentUser: currentSuggestionClaims.some(
      (claim) =>
        claim.claimedBy ===
        getWazeMapEditorWindow().W.loginManager.user.getAttribute('id'),
    ),
    claimedBy: claimedSuggestions.map((claim) => claim.claimedBy),
    claimedOn: Math.max(...claimedSuggestions.map((claim) => claim.claimedOn)),
    claim: () => claimSuggestion(suggestion),
    async unClaim() {
      const mapCommentsToDelete = claimedSuggestions.map(
        (claim) => claim.associatedMapComment,
      );
      const deleteMapCommentActions = mapCommentsToDelete.map(
        (mapComment) => new DeleteObjectAction(mapComment),
      );
      await getWazeMapEditorWindow().W.controller.save({
        actions: deleteMapCommentActions,
      });
      getWazeMapEditorWindow().W.model.mapComments.trigger(
        'objectsremoved',
        mapCommentsToDelete,
      );
    },
  };
}

function isMapCommentSubjectMatches(mapComment: MapCommentDataModel): boolean {
  return mapComment.getSubject().startsWith('[SA] ');
}
function extractSuggestionFromMapComment(mapComment: MapCommentDataModel): any {
  const regionStart = '$SA$';
  const regionEnd = '$SA$E$';

  try {
    // get the region content
    const body = mapComment.getBody();
    const regionStartIndex = body.indexOf(regionStart);
    const regionEndIndex = body.indexOf(regionEnd);
    if (
      regionStartIndex === -1 ||
      regionStartIndex === regionEndIndex ||
      regionEndIndex === -1
    )
      return null;
    const regionContent = body.substring(
      regionStartIndex + regionStart.length,
      regionEndIndex,
    );
    if (!regionContent) return null;

    // try to decode the base64 of the region
    const rawJson = atob(regionContent);
    return JSON.parse(rawJson);
  } catch {
    return null;
  }
}
