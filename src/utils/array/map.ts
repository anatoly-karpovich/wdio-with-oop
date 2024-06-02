import { AsyncCallback, MaybePromise } from "../../types/array/array";

/**
 * iterate async array and returns new array with results
 *
 * **Note:** if you want to use `serial` option, you should use `serial` setting instead.
 *
 * @template T type of element
 * @param {MaybePromise<T>} array array or async array. Auto wait in case of async array.
 * @param {AsyncCallback<T>} callback - A function that accepts up to three arguments. The map method calls the `callback` function one time for each element in the array.
 */
export default async function map<T, U>(array: MaybePromise<readonly T[]>, callback: AsyncCallback<T, U>) {
  const awaited: readonly T[] = await array;
  return Promise.all(awaited.map(callback));
}
