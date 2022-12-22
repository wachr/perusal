import { assert, property } from "fast-check";
import * as fc from "fast-check";

import { isEmpty } from "./ops";
import reduce, { DeleteString, withPath } from "./reducer";

describe(reduce.name, () => {
  describe(DeleteString.name, () => {
    const nonEmptyString = fc.string({ minLength: 1 });
    const nonEmptyArray = (arb) => fc.uniqueArray(arb, { minLength: 1 });
    const nonEmptyObject = (arb) =>
      fc.dictionary(nonEmptyString, arb, { minKeys: 1 });
    it("on strings", () => {
      assert(
        property(nonEmptyString, (str) => {
          expect(reduce(str, DeleteString())).toStrictEqual({});
        })
      );
    });

    it("on arrays without a path", () => {
      assert(
        property(nonEmptyArray(nonEmptyString), (arr) => {
          expect(reduce(arr, DeleteString())).toBeUndefined();
        })
      );
    });

    it("on objects without a path", () => {
      assert(
        property(nonEmptyObject(fc.string()), (obj) => {
          expect(reduce(obj, DeleteString())).toBeUndefined();
        })
      );
    });

    it("on arrays of strings", () => {
      assert(
        property(nonEmptyArray(nonEmptyString), fc.nat(), (arr, index) => {
          const nextState = reduce(arr, withPath(index)(DeleteString()));
          expect(nextState || []).not.toContain(arr[index]);
          arr.length === 1
            ? expect(isEmpty(nextState)).toBe(true)
            : expect(nextState === undefined ? arr : nextState).toEqual(
                expect.arrayContaining(arr)
              );
        })
      );
    });

    it.todo("on objects of strings");
  });
});
