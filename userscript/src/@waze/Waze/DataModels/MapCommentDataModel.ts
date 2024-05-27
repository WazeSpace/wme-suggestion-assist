import {
  DataModel,
  DataModelAttributes,
} from '@/@waze/Waze/DataModels/DataModel';
import { Geometry, Point, Polygon } from '@turf/helpers';

export interface MapCommentDataModelAttributes extends DataModelAttributes {
  geoJSONGeometry: Geometry;
  subject: string;
  body: string;
  conversation: unknown[];
  endDate: number;
  isFollowing: boolean;
  lockRank: number;
  oldId: string;
}

export interface MapCommentDataModel
  extends DataModel<MapCommentDataModelAttributes> {
  isPoint(): boolean;
  getPolygonGeometry(): Polygon;
  getPointGeometry(): Point;
  getComments(): unknown[];
  getOldId(): string;
  isFollowing(): boolean;
  setFollowing(newFollowing: boolean): Promise<void>;
  addComment(text: string): Promise<unknown>;
  getSubject(): string;
  getBody(): string;
  getEndDate(): number;
  getLockRank(): number;
}
