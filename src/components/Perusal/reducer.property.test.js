import { assert, property } from "fast-check";
import * as fc from "fast-check";

import { isEmpty } from "./ops";
import reduce, {
  DeleteString,
  PromoteStringToArray,
  withPath,
} from "./reducer";

function nonEmptyString() {
  return fc.string({ minLength: 1 });
}

function nonEmptyArray(arb) {
  return fc.uniqueArray(arb, { minLength: 1 });
}

function nonEmptyObject(arb) {
  return fc.dictionary(nonEmptyString(), arb, { minKeys: 1 });
}

describe(reduce.name, () => {
  describe(DeleteString.name, () => {
    it("on strings", () => {
      assert(
        property(nonEmptyString(), (str) => {
          expect(reduce(str, DeleteString())).toStrictEqual({});
        })
      );
    });

    it("on arrays without a path", () => {
      assert(
        property(nonEmptyArray(nonEmptyString()), (arr) => {
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
        property(nonEmptyArray(nonEmptyString()), fc.nat(), (arr, index) => {
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

    it("on objects of strings", () => {
      const arbPerusal = (arb) =>
        nonEmptyObject(arb).chain((arbObj) =>
          fc.record({
            state: fc.constant(arbObj),
            path: fc.oneof(...Object.keys(arbObj).map(fc.constant)),
          })
        );
      assert(
        property(arbPerusal(nonEmptyString()), ({ state, path }) => {
          expect(state[path]).toBeDefined();
          expect(reduce(state, withPath(path)(DeleteString()))).toBeUndefined();
          expect(isEmpty(state[path])).toBe(true);
        })
      );
    });
  });

  describe(PromoteStringToArray.name, () => {
    it("on strings", () => {
      assert(
        property(nonEmptyString(), nonEmptyString(), (state, str) => {
          const nextState = reduce(state, PromoteStringToArray(str));
          expect(nextState).toStrictEqual([state, str]);
        })
      );
    });

    it("on arrays of strings", () => {
      assert(
        property(
          nonEmptyArray(nonEmptyString()).chain((arr) =>
            fc.record({
              state: fc.constant(arr),
              path: fc.option(fc.nat({ max: arr.length - 1 }).map(String)),
            })
          ),
          nonEmptyString(),
          ({ state, path }, str) => {
            if (!path) {
              const nextState = reduce(state, PromoteStringToArray(str));
              expect(nextState).toStrictEqual(state);
              return;
            }
            const nextState = reduce(
              state,
              withPath(path)(PromoteStringToArray(str))
            );
            expect(nextState).toBeUndefined();
            expect(state[path]).toHaveLength(2);
          }
        )
      );
    });
  });
});
