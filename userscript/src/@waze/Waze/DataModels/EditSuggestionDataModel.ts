import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { Geometry } from '@turf/helpers';

export interface EditSuggestionTransaction {
  actionType: 'ADD' | 'UPDATE' | 'DELETE' | string;
  attributes: any;
  geometry: Geometry;
  groupId: number;
  id: string;
  objectId: number | string;
  objectType: string;
  transactionId: string;
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
  suggestions: Array<EditSuggestionTransaction>;
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
