import { assert, property } from "fast-check";
import * as fc from "fast-check";

import { isEmpty } from "./ops";
import reduce, {
  DeleteString,
  PromoteEmptyToString,
  PromoteStringToArray,
  PromoteStringToObject,
  ReplaceString,
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
  describe(PromoteEmptyToString.name, () => {
    it("on empties", () => {
      assert(
        property(
          fc.constantFrom({}, "", null, undefined),
          nonEmptyString(),
          (state, payload) => {
            const nextState = reduce(state, PromoteEmptyToString(payload));
            expect(nextState).toBe(payload);
          }
        )
      );
    });

    it("on non-empties", () => {
      assert(
        property(
          fc.oneof(
            nonEmptyString(),
            nonEmptyArray(nonEmptyString()),
            nonEmptyObject(fc.string())
          ),
          nonEmptyString(),
          (state, payload) => {
            const initialState = JSON.parse(JSON.stringify(state));
            const nextState = reduce(state, PromoteEmptyToString(payload));
            expect(nextState).toBe(state);
            expect(state).toStrictEqual(initialState);
          }
        )
      );
    });
  });

  describe(DeleteString.name, () => {
    it("on strings", () => {
      assert(
        property(nonEmptyString(), (str) => {
          expect(reduce(str, DeleteString())).toStrictEqual({});
        })
      );
    });

    it("on arrays of strings", () => {
      assert(
        property(
          nonEmptyArray(nonEmptyString()),
          fc.nat().map(String),
          (arr, index) => {
            const nextState = reduce(arr, withPath(index)(DeleteString()));
            expect(nextState || []).not.toContain(arr[index]);
            arr.length === 1
              ? expect(isEmpty(nextState)).toBe(true)
              : expect(nextState === undefined ? arr : nextState).toEqual(
                  expect.arrayContaining(arr)
                );
          }
        )
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

  function expectNestedToStrictEqual(actionCreator, valueSupplier) {
    return ({ state, path }, actionPayload) => {
      const initialValue = state[path];
      const nextState = reduce(
        state,
        withPath(path)(actionCreator(actionPayload))
      );
      expect(nextState).toBeUndefined();
      expect(state[path]).toStrictEqual(
        valueSupplier(initialValue, actionPayload)
      );
    };
  }

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
              path: fc.nat({ max: arr.length - 1 }).map(String),
            })
          ),
          nonEmptyString(),
          expectNestedToStrictEqual(
            PromoteStringToArray,
            (initial, payload) => [initial, payload]
          )
        )
      );
    });

    it("on objects of strings", () => {
      assert(
        property(
          nonEmptyObject(nonEmptyString()).chain((obj) =>
            fc.record({
              state: fc.constant(obj),
              path: fc.oneof(...Object.keys(obj).map(fc.constant)),
            })
          ),
          nonEmptyString(),
          expectNestedToStrictEqual(
            PromoteStringToArray,
            (initial, payload) => [initial, payload]
          )
        )
      );
    });
  });

  describe(PromoteStringToObject.name, () => {
    it("on strings", () => {
      assert(
        property(nonEmptyString(), nonEmptyString(), (state, str) => {
          const nextState = reduce(state, PromoteStringToObject(str));
          expect(nextState).toStrictEqual({ [state]: str });
        })
      );
    });

    it("on arrays of strings", () => {
      assert(
        property(
          nonEmptyArray(nonEmptyString()).chain((arr) =>
            fc.record({
              state: fc.constant(arr),
              path: fc.nat({ max: arr.length - 1 }).map(String),
            })
          ),
          nonEmptyString(),
          expectNestedToStrictEqual(
            PromoteStringToObject,
            (initial, payload) => ({ [initial]: payload })
          )
        )
      );
    });

    it("on objects of strings", () => {
      assert(
        property(
          nonEmptyObject(fc.string()).chain((obj) =>
            fc.record({
              state: fc.constant(obj),
              path: fc.oneof(...Object.keys(obj).map(fc.constant)),
            })
          ),
          nonEmptyString(),
          expectNestedToStrictEqual(
            PromoteStringToObject,
            (initial, payload) => ({ [initial]: payload })
          )
        )
      );
    });
  });

  describe(ReplaceString.name, () => {
    it("on strings", () => {
      assert(
        property(nonEmptyString(), nonEmptyString(), (state, payload) => {
          const nextState = reduce(state, ReplaceString(payload));
          expect(nextState).toBe(payload);
        })
      );
    });

    it("on arrays of strings", () => {
      assert(
        property(
          nonEmptyArray(nonEmptyString()).chain((arr) =>
            fc.record({
              state: fc.constant(arr),
              path: fc.nat({ max: arr.length - 1 }).map(String),
            })
          ),
          nonEmptyString(),
          expectNestedToStrictEqual(ReplaceString, (_, payload) => payload)
        )
      );
    });

    it("on objects of strings", () => {
      assert(
        property(
          nonEmptyObject(nonEmptyString()).chain((obj) =>
            fc.record({
              state: fc.constant(obj),
              path: fc.oneof(...Object.keys(obj).map(fc.constant)),
            })
          ),
          nonEmptyString(),
          expectNestedToStrictEqual(ReplaceString, (_, payload) => payload)
        )
      );
    });
  });

  it.each(
    [
      DeleteString,
      PromoteStringToArray,
      PromoteStringToObject,
      ReplaceString,
    ].map((actionCreator) => [actionCreator.name, actionCreator])
  )("for %s on non-strings without a path", (_, stringActionCreator) => {
    assert(
      property(
        fc.oneof(nonEmptyArray(nonEmptyString()), nonEmptyObject(fc.string())),
        nonEmptyString(),
        (state, str) => {
          const initialState = JSON.parse(JSON.stringify(state));
          const nextState = reduce(state, stringActionCreator(str));
          expect(nextState).toBe(state);
          expect(state).toStrictEqual(initialState);
        }
      )
    );
  });
});
