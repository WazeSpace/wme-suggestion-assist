import {
  EditSuggestionDataModel,
  EditSuggestionTransaction,
} from '@/@waze/Waze/DataModels/EditSuggestionDataModel';
import { uniqBy } from '@/utils';
import { Geometry, Polygon } from '@turf/helpers';
import buffer from '@turf/buffer';

function getSuggestionBufferedPolygon(
  suggestion: EditSuggestionTransaction,
): Polygon {
  if (!suggestion.geometry) return null;
  switch (suggestion.geometry.type) {
    case 'LineString':
      return buffer(suggestion.geometry, 3, { units: 'meters' })
        .geometry as Polygon;
    default:
      throw new Error(
        `Suggestion geometry of type ${suggestion.geometry.type} is not supported`,
      );
  }
}

export function getEditSuggestionBufferedGeometries(
  editSuggestion: EditSuggestionDataModel,
): Geometry[] {
  const suggestions = editSuggestion.getSuggestions();
  const uniqueObjectSuggestions = uniqBy(
    suggestions,
    (transaction) => `${transaction.objectType}${transaction.objectId}`,
  );
  return uniqueObjectSuggestions
    .map(getSuggestionBufferedPolygon)
    .filter(Boolean);
}
