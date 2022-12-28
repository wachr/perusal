import {
  empties,
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
import reduce, { AddToArray, DeleteFromArray, withPath } from "./reducer";

describe(reduce.name, () => {
  beforeAll(() => {
    // global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
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

      it("on nested arrays of more than two elements with path", () => {
        assert(
          property(
            fc.oneof(
              nonEmptyObject(fc.string())
                .chain(withObjectPath)
                .chain(({ state, path }) =>
                  nonEmptyArray(nonEmptyString())
                    .filter((arr) => arr.length > 2)
                    .chain(withArrayPath)
                    .chain(({ state: nested, path: index }) => {
                      const newState = Array.from(state);
                      newState[path] = Array.from(nested);
                      return fc.constant({
                        state: newState,
                        path,
                        index,
                      });
                    })
                ),
              nonEmptyArray(nonEmptyString())
                .chain(withArrayPath)
                .chain(({ state, path }) =>
                  nonEmptyArray(nonEmptyString())
                    .filter((arr) => arr.length > 2)
                    .chain(withArrayPath)
                    .chain(({ state: nested, path: index }) => {
                      state[path] = Array.from(nested);
                      return fc.constant({
                        state,
                        path,
                        index,
                      });
                    })
                )
            ),
            ({ state, path, index }) => {
              expect(Array.isArray(state[path])).toBe(true);
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

      it.todo("on nested arrays of two elements inside objects with path");
      it.todo("on nested arrays of two elements inside arrays with path");

      it.todo("on nested singleton arrays inside objects with path");
      it.todo("on nested singleton arrays inside arrays with path");

      it.todo("on nested empty arrays inside objects with path");
      it.todo("on nested empty arrays inside arrays with path");
    });
  });
});
