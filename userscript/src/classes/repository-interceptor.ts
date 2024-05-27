import { DataModel } from '@/@waze/Waze/DataModels/DataModel';
import {
  BeforeMethodInvocationInterceptor,
  MethodInterceptor,
} from '@/method-interceptor';

type ShouldAddObject<T extends DataModel> = (object: T) => boolean;

export class RepositoryInterceptor<T extends DataModel = DataModel> {
  private readonly _dataModel: any;
  private readonly _objectType: string;
  private _interceptors: MethodInterceptor<any, any, any>[];
  private readonly _shouldAddObject: ShouldAddObject<T>;
  private readonly _handleClear: () => void;

  constructor(
    dataModel: any,
    objectType: string,
    shouldAddObject: ShouldAddObject<T>,
    handleClear: () => void,
  ) {
    this._dataModel = dataModel;
    this._objectType = objectType;
    this._shouldAddObject = shouldAddObject;
    this._handleClear = handleClear;
    this._createRepositoryInterceptors();
  }

  /** Returns the repository from the dataModel by the objectType */
  private _getRepository() {
    return this._dataModel.getRepository(this._objectType);
  }

  /** Creates the interceptors on the repository's methods */
  private _createRepositoryInterceptors() {
    const repository = this._getRepository();

    this._interceptors = [
      new BeforeMethodInvocationInterceptor(
        repository,
        'put',
        (object: T | T[], ...args: unknown[]) => {
          if (Array.isArray(object)) {
            const filteredObjects = object.filter((object) =>
              this._handleObjectMerge(object),
            );
            if (!filteredObjects.length) return;
            return [
              BeforeMethodInvocationInterceptor.CONTINUE_EXECUTION,
              filteredObjects,
              ...args,
            ];
          }

          if (!this._handleObjectMerge(object)) return;
          return BeforeMethodInvocationInterceptor.CONTINUE_EXECUTION;
        },
      ),
      new BeforeMethodInvocationInterceptor(
        repository,
        'mergeObjects',
        (
          { objects, ...restData }: { objects?: T[] },
          ...restArgs: unknown[]
        ) => {
          if (!objects)
            return BeforeMethodInvocationInterceptor.CONTINUE_EXECUTION;
          const filteredObjects = objects.filter((object) =>
            this._handleObjectMerge(object),
          );
          if (!filteredObjects.length) return;
          return [
            BeforeMethodInvocationInterceptor.CONTINUE_EXECUTION,
            {
              objects: filteredObjects,
              ...restData,
            },
            ...restArgs,
          ];
        },
      ),
      new BeforeMethodInvocationInterceptor(repository, 'clear', () => {
        this._handleClear();
        return BeforeMethodInvocationInterceptor.CONTINUE_EXECUTION;
      }),
    ];
  }

  /** Enables all repository interceptors */
  enableInterceptors() {
    this._interceptors.forEach((interceptor) => interceptor.enable());
  }

  /** Disables all repository interceptors */
  disableInterceptors() {
    this._interceptors.forEach((interceptor) => interceptor.disable());
  }

  /**
   * Handles the "merge" request of an object into the repository
   * @param object The object that should be merged
   * @returns True if this object should be passed the original method, false otherwise
   */
  private _handleObjectMerge(object: T): boolean {
    const repository = this._getRepository();
    const objectId = object.getAttribute('id');
    // this object already exists and must be updated
    if (repository.objects[objectId]) return true;
    return this._handleObjectAdd(object);
  }

  /**
   * Handles the "add" request of an object into the repository
   * @param object The object that should be added
   * @returns True if this object should be passed the original method, false otherwise
   */
  private _handleObjectAdd(object: T): boolean {
    return this._shouldAddObject(object);
  }
}
