import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';

export interface ExternalUserDataModelAttributes extends DataModelAttributes {
  anonymous: boolean;
  globalEditor: boolean;
  id: number;
  rank: number;
  userName: string;
}

export interface ExternalUserDataModel
  extends DataModel<ExternalUserDataModelAttributes> {
  isStaffUser(): boolean;
  getRank(): number;
}
