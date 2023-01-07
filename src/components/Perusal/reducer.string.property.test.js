import {
  empties,
  expectNestedToStrictEqual,
  expectNoOpFor,
  nonEmptyArray,
  nonEmptyObject,
  nonEmptyString,
  withArrayPath,
  withObjectPath,
} from "./reducer.property";
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

describe(reduce.name, () => {
  beforeAll(() => {
    // global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
  });

  describe(PromoteEmptyToString.name, () => {
    it("on empties", () => {
      assert(
        property(empties(), nonEmptyString(), (state, payload) => {
          const nextState = reduce(state, PromoteEmptyToString(payload));
          expect(nextState).toBe(payload);
        })
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
          (state, payload) =>
            expectNoOpFor(state, PromoteEmptyToString(payload))
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
      assert(
        property(
          nonEmptyObject(nonEmptyString()).chain(withObjectPath),
          ({ state, path }) => {
            expect(state[path]).toBeDefined();
            expect(
              reduce(state, withPath(path)(DeleteString()))
            ).toBeUndefined();
            expect(isEmpty(state[path])).toBe(true);
            expect(isEmpty(state)).toBe(false);
          }
        )
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
          nonEmptyArray(nonEmptyString()).chain(withArrayPath),
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
          nonEmptyObject(nonEmptyString()).chain(withObjectPath),
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
          nonEmptyArray(nonEmptyString()).chain(withArrayPath),
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
          nonEmptyObject(fc.string()).chain(withObjectPath),
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
          nonEmptyArray(nonEmptyString()).chain(withArrayPath),
          nonEmptyString(),
          expectNestedToStrictEqual(ReplaceString, (_, payload) => payload)
        )
      );
    });

    it("on objects of strings", () => {
      assert(
        property(
          nonEmptyObject(nonEmptyString()).chain(withObjectPath),
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
        (state, str) => expectNoOpFor(state, stringActionCreator(str))
      )
    );
  });
});
