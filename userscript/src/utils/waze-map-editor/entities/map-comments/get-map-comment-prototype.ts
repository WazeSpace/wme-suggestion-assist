import { getWazeMapEditorWindow } from '@/utils';
import { createJsonResponse, overrideFetchRequest } from '@/utils/fetch';
import { point } from '@turf/helpers';

let mapCommentPrototype: any = null;

function createFakeMapCommentDescartesPayload() {
  return {
    mapComments: {
      objects: [
        {
          geometry: point([0, 0]).geometry,
        },
      ],
    },
  };
}

async function getFeaturesWithFakeMapComment(): Promise<any> {
  const W = getWazeMapEditorWindow().W;
  const requestPath = W.Config.paths.features;
  overrideFetchRequest(
    requestPath,
    createJsonResponse(requestPath, createFakeMapCommentDescartesPayload()),
  );
  return await W.controller.descartesClient.getFeatures(
    [0, 0, 0, 0],
    { mapComments: true },
    {},
  );
}

export async function getMapCommentPrototype() {
  if (mapCommentPrototype) return mapCommentPrototype;

  const { mapComments } = await getFeaturesWithFakeMapComment();
  return (mapCommentPrototype = mapComments.objects[0].constructor);
}
