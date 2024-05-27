import { MapCommentDataModel } from '@/@waze/Waze/DataModels/MapCommentDataModel';
import { RepositoryInterceptor } from '@/classes';
import { getWazeMapEditorWindow } from '@/utils';
import { useEffect, useState } from 'react';

interface UseMatchingMapCommentsOptions {
  removeFromEditor: boolean;
  processExistingComments: boolean;
}

const defaultOptions: UseMatchingMapCommentsOptions = {
  removeFromEditor: false,
  processExistingComments: true,
};

export function useMatchingMapComments(
  matcher: (mapComment: MapCommentDataModel) => boolean,
  options?: Partial<UseMatchingMapCommentsOptions>,
) {
  const { removeFromEditor, processExistingComments } = {
    ...defaultOptions,
    ...options,
  };
  const [mapComments, setMapComments] = useState<MapCommentDataModel[]>(() => {
    if (!processExistingComments) return [];
    const mapCommentsRepo = getWazeMapEditorWindow().W.model.mapComments;
    const matchingMapComments = mapCommentsRepo
      .getObjectArray()
      .filter(matcher);
    if (removeFromEditor) mapCommentsRepo.remove(matchingMapComments);
    return matchingMapComments;
  });

  useEffect(() => {
    const mapCommentsRepoInterceptor =
      new RepositoryInterceptor<MapCommentDataModel>(
        getWazeMapEditorWindow().W.model,
        'mapComment',
        (mapComment) => {
          if (!matcher(mapComment)) return true;
          setMapComments((prev) => {
            const existingMapCommentIndex = prev.findIndex(
              (existingMC) =>
                existingMC.getAttribute('id') === mapComment.getAttribute('id'),
            );
            if (existingMapCommentIndex === -1) return [...prev, mapComment];
            const before = prev.slice(0, existingMapCommentIndex);
            const after = prev.slice(existingMapCommentIndex + 1);
            return [...before, mapComment, ...after];
          });
          return !removeFromEditor;
        },
        () => setMapComments([]),
      );
    mapCommentsRepoInterceptor.enableInterceptors();

    return () => {
      mapCommentsRepoInterceptor.disableInterceptors();
    };
  }, [matcher, removeFromEditor]);
  useEffect(() => {
    const onObjectsRemoved = (removedMapComments: MapCommentDataModel[]) => {
      const removedMapCommentIds = new Set(
        removedMapComments.map((mapComment) => mapComment.getAttribute('id')),
      );

      setMapComments((prev) => {
        return prev.filter(
          (mapComment) =>
            !removedMapCommentIds.has(mapComment.getAttribute('id')),
        );
      });
    };

    const target = getWazeMapEditorWindow().W.model.mapComments;
    target.on('objectsremoved', onObjectsRemoved);
    return () => {
      target.off('objectsremoved', onObjectsRemoved);
    };
  }, []);

  return mapComments;
}
