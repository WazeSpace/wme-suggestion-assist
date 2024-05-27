export function uniqBy<T, K extends keyof T, O = T[K]>(
  arr: T[],
  predicate: K | ((item: T) => O),
): T[] {
  const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];

  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item);

        map.has(key) || map.set(key, item);

        return map;
      }, new Map())
      .values(),
  ];
}
