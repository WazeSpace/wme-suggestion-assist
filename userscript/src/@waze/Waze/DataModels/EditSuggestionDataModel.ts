import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { GeometryObject } from '@turf/helpers';

export interface EditSuggestionEntityEdit {
  actionType: 'ADD' | 'UPDATE' | 'DELETE' | string;
  attributes: any;
  geometry: GeometryObject;
  objectId: number | string;
  objectType: string;
}
export interface EditSuggestionTransaction extends EditSuggestionEntityEdit {
  groupId: number;
  id: string;
  transactionId: string;
}

export interface EditSuggestion {
  entityEdits: EditSuggestionEntityEdit[];
  id: string;
  permissions: unknown;
  status: unknown;

  getEntityEdits(): EditSuggestionEntityEdit[];
  getID(): string;
  getPermissions(): unknown;
  getStatus(): unknown;
}

export interface EditSuggestionDataModelAttributes extends DataModelAttributes {
  bbox: number[];
  description: string;
  isRead: boolean;
  isStarred: boolean;
  lockRank: number;
  mapIssueId: number;
  rejectionMessage: string;
  rejectionReason: string;
  source: 'WME' | string;
  status: 'OPEN' | 'CLOSED' | string;
  suggestions: Array<EditSuggestionTransaction> | Array<EditSuggestion>;
}

export interface EditSuggestionDataModel
  extends DataModel<EditSuggestionDataModelAttributes> {
  getCreatedOn(): number;
  getIsRead(): boolean;
  getIsStarred(): boolean;
  getMapIssueId(): number;
  getRelatedObjects<DM = DataModel>(dataModel: any): DM[];
  getStatus(): EditSuggestionDataModelAttributes['status'];
  getSuggestions(): EditSuggestionDataModelAttributes['suggestions'];
  getSuggestionsCount(): number;
  isEditable(): boolean;
  isRemovable(): boolean;
  isProposalAPI(): boolean;
  isSuggestionTransactionAPI(): boolean;
}
