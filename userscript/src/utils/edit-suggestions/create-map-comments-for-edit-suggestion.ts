import { EditSuggestionDataModel } from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { getEditSuggestionBufferedGeometries } from './get-edit-suggestion-geometries';
import { createMapComment } from '../waze-map-editor';
import { getWazeMapEditorWindow } from '../get-wme-window';

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
      endDate: getWazeMapEditorWindow().I18n.strftime(
        new Date().addMonths(1),
        '%Y-%m-%d %H:%M',
      ),
    });
  });
  return Promise.all(mapCommentPromises);
}
