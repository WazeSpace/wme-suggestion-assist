import {
  MapCommentDataModel,
  MapCommentDataModelAttributes,
} from '@/@waze/Waze/DataModels/MapCommentDataModel';
import { getMapCommentPrototype } from '@/utils/waze-map-editor/entities/map-comments/get-map-comment-prototype';

export async function createMapComment(
  attributes: Partial<MapCommentDataModelAttributes>,
) {
  const mapCommentPrototype: {
    new (
      attributes: Partial<MapCommentDataModelAttributes>,
    ): MapCommentDataModel;
  } = await getMapCommentPrototype();
  return new mapCommentPrototype(attributes);
}
