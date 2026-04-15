import isEqual from 'lodash.isequal';

export function getEditedObject<T extends Record<string, any>>(
  prev: T,
  cur: Partial<T>
): Partial<T> {
  const res: Partial<T> = {};

  for (let key in cur) {
    if (!isEqual(prev[key], cur[key])) {
      res[key] = cur[key];
    }
  }

  return res;
}
