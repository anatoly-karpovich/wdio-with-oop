import { AsyncCallback, MaybePromise } from "../../types/array/array";

/**
 * foreach for async array function
 *
 * **Note:** if you want to use `serial` option, you should use `serial` setting instead.
 *
 * @template T type of element
 * @param {Array<T>} array array or promise array, like `Promise.resolve([1,2,3,4,5])`
 * @param {AsyncCallback<T>} callback - async callback function
 */
export default async function forEach<T>(array: MaybePromise<readonly T[]>, callback: AsyncCallback<T, unknown>): Promise<void> {
  const awaited: readonly T[] = await array;
  await Promise.all(awaited.map(callback));
}
