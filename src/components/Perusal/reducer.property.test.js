import { assert, property } from "fast-check";
import * as fc from "fast-check";

import { isEmpty } from "./ops";
import reduce, {
  AddToArray,
  DeleteFromArray,
  DeleteString,
  PromoteEmptyToString,
  PromoteStringToArray,
  PromoteStringToObject,
  ReplaceString,
  withPath,
} from "./reducer";

function empties() {
  return fc.constantFrom({}, [], "", null, undefined);
}

function nonEmptyString() {
  return fc.string({ minLength: 1 });
}

function nonEmptyArray(arb) {
  return fc.uniqueArray(arb, { minLength: 1 });
}

function nonEmptyObject(arb) {
  return fc.dictionary(nonEmptyString(), arb, { minKeys: 1 });
}

function withArrayPath(arr) {
  return fc.record({
    state: fc.constant(arr),
    path: fc.nat({ max: arr.length - 1 }).map(String),
  });
}

function withObjectPath(obj) {
  return fc.record({
    state: fc.constant(obj),
    path: fc.constantFrom(...Object.keys(obj)),
  });
}

function expectNoOpFor(state, action) {
  const initialState = state && JSON.parse(JSON.stringify(state));
  const nextState = reduce(state, action);
  expect(nextState).toBe(state);
  expect(state).toStrictEqual(initialState);
}

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

  describe("array actions", () => {
    it.each(
      [AddToArray, DeleteFromArray].map((actionCreator) => [
        actionCreator.name,
        actionCreator,
      ])
    )("for %s on non-arrays without a path", (_, actionCreator) => {
      assert(
        property(
          fc.oneof(empties(), nonEmptyString(), nonEmptyObject(fc.string())),
          fc.nat(),
          nonEmptyString(),
          (state, index, payload) =>
            expectNoOpFor(state, actionCreator(index, payload))
        )
      );
    });

    describe(AddToArray.name, () => {
      it("on strings", () => {
        assert(
          property(
            fc.string(),
            fc.nat(),
            nonEmptyString(),
            (state, index, payload) =>
              expectNoOpFor(state, AddToArray(index, payload))
          )
        );
      });

      it("on arrays", () => {
        assert(
          property(
            nonEmptyArray(nonEmptyString()).chain(withArrayPath),
            nonEmptyString(),
            ({ state, path: index }, payload) => {
              const initialLength = state.length;
              const nextState = reduce(state, AddToArray(index, payload));
              expect(nextState).toBeUndefined();
              expect(state[index]).toBe(payload);
              expect(state.length).toBe(initialLength + 1);
            }
          )
        );
      });

      it("on objects of strings with path", () => {
        assert(
          property(
            nonEmptyObject(fc.string()).chain(withObjectPath),
            fc.nat(),
            nonEmptyString(),
            ({ state, path }, index, payload) =>
              expectNoOpFor(state, withPath(path)(AddToArray(index, payload)))
          )
        );
      });

      it("on nested arrays inside objects with path", () => {
        assert(
          property(
            nonEmptyObject(nonEmptyString())
              .chain(withObjectPath)
              .chain(({ state: outer, path }) =>
                nonEmptyArray(nonEmptyString()).chain((nested) =>
                  fc.record({
                    state: fc.constant({
                      ...outer,
                      [path]: Array.from(nested),
                    }),
                    path: fc.constant(path),
                    index: fc.nat({ max: nested.length }),
                  })
                )
              ),
            nonEmptyString(),
            ({ state, path, index }, payload) => {
              expect(Array.isArray(state[path])).toBe(true);
              const initialLength = state[path].length;
              const nextState = reduce(
                state,
                withPath(path)(AddToArray(index, payload))
              );
              expect(nextState).toBeUndefined();
              expect(Array.isArray(state[path])).toBe(true);
              expect(state[path].length).toBe(initialLength + 1);
              expect(state[path]).toContain(payload);
            }
          )
        );
      });

      it("on nested arrays inside arrays with path", () => {
        assert(
          property(
            nonEmptyArray(nonEmptyString())
              .chain(withArrayPath)
              .chain(({ state, path }) =>
                nonEmptyArray(nonEmptyString()).chain((nested) => {
                  const newState = Array.from(state);
                  newState[path] = Array.from(nested);
                  return fc.constant({ state: newState, path });
                })
              )
              .chain(({ state, path }) =>
                fc.record({
                  state: fc.constant(state),
                  path: fc.constant(path),
                  index: fc.nat({ max: state[path].length }),
                })
              ),
            fc.lorem().filter((str) => !str.match(/\s/)),
            ({ state, path, index }, payload) => {
              expect(Array.isArray(state[path])).toBe(true);
              const initialLength = state[path].length;
              const nextState = reduce(
                state,
                withPath(path)(AddToArray(index, payload))
              );
              expect(nextState).toBeUndefined();
              expect(Array.isArray(state[path])).toBe(true);
              expect(state[path].length).toBe(initialLength + 1);
              expect(state[path]).toContain(payload);
            }
          )
        );
      });
    });

    describe(DeleteFromArray.name, () => {
      it("on arrays of more than two elements", () => {
        assert(
          property(
            nonEmptyArray(nonEmptyString())
              .filter((arr) => arr.length > 2)
              .chain(withArrayPath),
            ({ state, path: index }) => {
              const initialLength = state.length;
              const initialValue = state[index];
              const nextState = reduce(state, DeleteFromArray(index));
              expect(nextState).toBeUndefined();
              expect(state.length).toBe(initialLength - 1);
              expect(state).not.toContain(initialValue);
            }
          )
        );
      });

      it("on arrays of two elements", () => {
        assert(
          property(
            fc.tuple(nonEmptyString(), nonEmptyString()),
            fc.constantFrom(0, 1).map(String),
            (state, index) => {
              const expected = state[index === "0" ? 1 : 0];
              const nextState = reduce(state, DeleteFromArray(index));
              expect(nextState).toStrictEqual(expected);
            }
          )
        );
      });

      it("on singleton arrays", () => {
        assert(
          property(fc.tuple(nonEmptyString()), (state) => {
            const nextState = reduce(state, DeleteFromArray(0));
            expect(isEmpty(nextState)).toBe(true);
          })
        );
      });

      it("on objects of strings with path", () => {
        assert(
          property(
            nonEmptyObject(fc.string()).chain(withObjectPath),
            fc.nat(),
            ({ state, path }, index) =>
              expectNoOpFor(state, withPath(path)(DeleteFromArray(index)))
          )
        );
      });

      it.todo("on nested arrays with path");
    });
  });
});
