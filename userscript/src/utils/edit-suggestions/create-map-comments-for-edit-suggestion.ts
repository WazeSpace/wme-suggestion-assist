import { EditSuggestionDataModel } from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { getEditSuggestionBufferedGeometries } from './get-edit-suggestion-geometries';
import { createMapComment } from '../waze-map-editor';

export async function createMapCommentsForEditSuggestion(
  editSuggestion: EditSuggestionDataModel,
  subject: string,
  body?: string,
  lockRank?: number,
) {
  const mapCommentGeometries =
    getEditSuggestionBufferedGeometries(editSuggestion);

  const mapCommentPromises = mapCommentGeometries.map(async (geometry) => {
    return createMapComment({
      geoJSONGeometry: geometry,
      subject,
      body,
      lockRank,
    });
  });
  return Promise.all(mapCommentPromises);
}
