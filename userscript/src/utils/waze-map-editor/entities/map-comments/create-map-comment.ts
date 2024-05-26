import { getMapCommentPrototype } from '@/utils/waze-map-editor/entities/map-comments/get-map-comment-prototype';

export async function createMapComment(attributes: any) {
  const mapCommentPrototype = await getMapCommentPrototype();
  return new mapCommentPrototype(attributes);
}
