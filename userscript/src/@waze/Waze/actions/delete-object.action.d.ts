import { Action } from '@/@waze/Waze/actions/action';
import { DataModel } from '@/@waze/Waze/DataModels/DataModel';

export class DeleteObjectAction<
  DM extends DataModel = DataModel,
> extends Action {
  actionName: 'DELETE_OBJECT';

  object: DM;
  repo: any;

  constructor(object: DM, props?: any);
}

export function isDeleteObjectAction<DM extends DataModel = DataModel>(
  action: Action,
): action is DeleteObjectAction<DM>;
