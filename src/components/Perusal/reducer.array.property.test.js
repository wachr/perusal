import {
  empties,
  expectNoOpFor,
  nested,
  nestedWithinArray,
  nestedWithinObject,
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
  AddToArray,
  DeleteFromArray,
  ReplaceInArray,
  withPath,
} from "./reducer";

describe(reduce.name, () => {
  beforeAll(() => {
    // global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
  });

  describe("array actions", () => {
    it.each(
      [AddToArray, DeleteFromArray, ReplaceInArray].map((actionCreator) => [
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
            nestedWithinObject(
              nonEmptyArray(nonEmptyString()).chain(withArrayPath)
            ),
            nonEmptyString(),
            ({ state, path, index }, payload) => {
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
            nestedWithinArray(
              nonEmptyArray(nonEmptyString()).chain(withArrayPath)
            ),
            nonEmptyString(),
            ({ state, path, index }, payload) => {
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
            fc.tuple(nonEmptyString(), nonEmptyString()).noShrink(),
            fc.constantFrom(0, 1).map(String).noShrink(),
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

      it("on nested arrays of more than two elements with path", () => {
        assert(
          property(
            nested(
              nonEmptyArray(nonEmptyString())
                .filter((arr) => arr.length > 2)
                .chain(withArrayPath)
            ),
            ({ state, path, index }) => {
              const initialLength = state[path].length;
              const initialValue = state[path][index];
              const nextState = reduce(
                state,
                withPath(path)(DeleteFromArray(index))
              );
              expect(nextState).toBeUndefined();
              expect(Array.isArray(state[path])).toBe(true);
              expect(state[path].length).toBe(initialLength - 1);
              expect(state[path]).not.toContain(initialValue);
            }
          )
        );
      });

      it("on nested arrays of two elements with path", () => {
        assert(
          property(
            nested(
              fc.tuple(nonEmptyString(), nonEmptyString()).chain(withArrayPath)
            ).noShrink(),
            ({ state, path, index }) => {
              const expected = state[path][index === "0" ? 1 : 0];
              const nextState = reduce(
                state,
                withPath(path)(DeleteFromArray(index))
              );
              expect(nextState).toBeUndefined();
              expect(state[path]).toStrictEqual(expected);
            }
          )
        );
      });

      it("on nested singleton arrays inside objects with path", () => {
        assert(
          property(
            nestedWithinObject(
              fc.tuple(nonEmptyString()).chain(withArrayPath)
            ).noShrink(),
            ({ state, path, index }) => {
              const nextState = reduce(
                state,
                withPath(path)(DeleteFromArray(index))
              );
              expect(nextState).toBeUndefined();
              expect(Object.keys(state)).toContain(path);
              expect(isEmpty(state[path])).toBe(true);
            }
          )
        );
      });

      it("on nested singleton arrays inside arrays with path", () => {
        assert(
          property(
            nestedWithinArray(
              fc.tuple(nonEmptyString()).chain(withArrayPath)
            ).noShrink(),
            ({ state, path, index }) => {
              const initialLength = state.length;
              const nextState = reduce(
                state,
                withPath(path)(DeleteFromArray(index))
              );
              expect(nextState).toBeUndefined();
              expect(state.length).toBe(initialLength);
              expect(isEmpty(state[path])).toBe(true);
            }
          )
        );
      });
    });

    describe(ReplaceInArray.name, () => {
      it("on arrays", () => {
        assert(
          property(
            nonEmptyArray(fc.string()).chain(withArrayPath),
            nonEmptyString(),
            ({ state, path }, payload) => {
              const nextState = reduce(state, ReplaceInArray(path, payload));
              expect(nextState).toBeUndefined();
              expect(state[path]).toStrictEqual(payload);
            }
          )
        );
      });

      it("on nested arrays", () => {
        assert(
          property(
            nested(nonEmptyArray(fc.string()).chain(withArrayPath)).noShrink(),
            nonEmptyString(),
            ({ state, path, index }, payload) => {
              const nextState = reduce(
                state,
                withPath(path)(ReplaceInArray(index, payload))
              );
              expect(nextState).toBeUndefined();
              expect(state[path][index]).toStrictEqual(payload);
            }
          )
        );
      });
    });
  });
});
