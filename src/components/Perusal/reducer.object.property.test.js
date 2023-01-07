import {
  empties,
  expectNoOpFor,
  nonEmptyArray,
  nonEmptyObject,
  nonEmptyString,
  withObjectPath,
} from "./reducer.property";
import { assert, property } from "fast-check";
import * as fc from "fast-check";

import reduce, { DeleteFromObject } from "./reducer";

describe(reduce.name, () => {
  beforeAll(() => {
    // global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
  });

  describe("object actions", () => {
    it.each(
      [DeleteFromObject].map((actionCreator) => [
        actionCreator.name,
        actionCreator,
      ])
    )("for %s on non-objects without a path", (_, actionCreator) => {
      assert(
        property(
          fc.oneof(empties(), nonEmptyString(), nonEmptyArray(fc.string())),
          nonEmptyString(),
          nonEmptyString(),
          (state, path, payload) =>
            expectNoOpFor(state, actionCreator(path, payload))
        )
      );
    });

    describe(DeleteFromObject.name, () => {
      it("deleting absent key is no-op", () => {
        assert(
          property(
            nonEmptyObject(nonEmptyString())
              .chain(withObjectPath)
              .chain(({ state, _ }) =>
                fc.record({
                  state: fc.constant(state),
                  path: fc
                    .string()
                    .filter((s) => !Object.keys(state).includes(s)),
                })
              ),
            ({ state, path }) => expectNoOpFor(state, DeleteFromObject(path))
          )
        );
      });

      it("deletes key from object", () => {
        assert(
          property(
            nonEmptyObject(nonEmptyString()).chain(withObjectPath),
            ({ state, path }) => {
              const nextState = reduce(state, DeleteFromObject(path));
              expect(nextState).toBeUndefined();
              expect(Object.keys(state)).not.toContain(path);
            }
          )
        );
      });
    });
  });
});
