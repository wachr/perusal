import defects from "../../test/resources/defects.json";
import { expectNoOpFor } from "./reducer.property";

import reduce, {
  AddToArray,
  DeleteFromArray,
  DeleteFromObject,
  DeleteString,
  DemoteObjectToArray,
  Narrow,
  PromoteEmptyToString,
  PromoteStringToArray,
  PromoteStringToObject,
  ReplaceString,
  withPath,
} from "./reducer";

beforeAll(() => {
  // global.structuredClone = jest.fn((obj) => JSON.parse(JSON.stringify(obj)));
});

describe(reduce.name, () => {
  test.each(["", {}, []])("should narrow empty %p to {}", (empty) => {
    expect(reduce(empty, Narrow())).toStrictEqual("");
  });

  it("should narrow by default", () => {
    expect(reduce(["foo"])).toBe("foo");
  });

  describe("should no-op", () => {
    it.each([
      [AddToArray.name, "foo", AddToArray(0, "bar")],
      [DeleteFromArray.name, "foo", DeleteFromArray(0)],
      [DeleteFromObject.name, "foo", DeleteFromObject("bar")],
      [DeleteString.name, ["foo"], DeleteString()],
      [DemoteObjectToArray.name, "foo", DemoteObjectToArray()],
      [PromoteEmptyToString.name, "foo", PromoteEmptyToString("bar")],
      [PromoteStringToArray.name, ["foo"], PromoteStringToArray("bar")],
      [PromoteStringToObject.name, ["foo"], PromoteStringToObject("bar")],
      [ReplaceString.name, ["foo"], ReplaceString("bar")],
    ])(
      "if the dispatched action %s does not match the state's type",
      (_, state, action) => expect(reduce(state, action)).toBe(state)
    );

    it.each([{}, "foo", ["foo", "bar"], { foo: "bar" }])(
      "if the dispatched action type is not recognized %#",
      (state) => {
        expect(
          reduce(state, { type: "simulated-unrecognized-action-type" })
        ).toBe(state);
      }
    );
  });

  it("should coerce to string if promoting an empty to string", () => {
    expect(reduce({}, PromoteEmptyToString({ foo: [] }))).toBe(
      "[object Object]"
    );
  });

  it("should replace strings with strings", () => {
    expect(reduce("foo", ReplaceString("bar"))).toBe("bar");
  });

  it("should delete a string into an empty state", () => {
    expect(reduce("foo", DeleteString())).toStrictEqual("");
  });

  it("should delete a string from an array of strings", () => {
    const state = [" ", " "];
    expect(reduce(state, withPath("0")(DeleteString()))).toBe(undefined);
    expect(state).toStrictEqual([" "]);
  });

  it("should delete from an array", () => {
    const array = ["a", "b", "c", "d", "e"];
    expect(reduce(array, DeleteFromArray(2))).toBeUndefined();
    expect(array).toStrictEqual(["a", "b", "d", "e"]);
    expect(reduce(array, DeleteFromArray(3))).toBeUndefined();
    expect(array).toStrictEqual(["a", "b", "d"]);
    expect(reduce(array, DeleteFromArray(0))).toBeUndefined();
    expect(array).toStrictEqual(["b", "d"]);
  });

  it("should add to an array", () => {
    const array = ["b", "d"];
    expect(reduce(array, AddToArray(0, "a"))).toBeUndefined();
    expect(array).toStrictEqual(["a", "b", "d"]);
    expect(reduce(array, AddToArray(3, "e"))).toBeUndefined();
    expect(array).toStrictEqual(["a", "b", "d", "e"]);
    expect(reduce(array, AddToArray(2, "c"))).toBeUndefined();
    expect(array).toStrictEqual(["a", "b", "c", "d", "e"]);
  });

  it("should delete from an array down to a string", () => {
    expect(reduce(["a", "b"], DeleteFromArray(0))).toEqual("b");
  });

  it("should delete empty items from an array when narrowing", () => {
    expect(reduce(["a", {}, "b", "", []], Narrow())).toEqual(["a", "b"]);
  });

  it(
    "should replace the entire state if given an action without type and " +
      "with a payload",
    () => {
      expect(reduce("foo", { payload: { foo: { bar: "baz" } } })).toEqual({
        foo: { bar: "baz" },
      });
    }
  );

  it("should create an object given a string from a string state", () => {
    expect(reduce("foo", PromoteStringToObject("bar"))).toEqual({ foo: "bar" });
  });

  it("should narrow an object with an empty right hand side to a normalized empty", () => {
    expect(reduce({ foo: "", bar: "baz" }, Narrow())).toEqual({
      foo: "",
      bar: "baz",
    });
  });

  it("should no-op an object with an empty left hand side", () => {
    expectNoOpFor({ "": "foo", bar: "baz" }, Narrow());
    expectNoOpFor({ "": ["foo", "bar"], bar: "baz" }, Narrow());
    expectNoOpFor({ "": "", bar: "baz" }, Narrow());
  });

  describe("reducing objects", () => {
    it("can delete a given key from an object", () => {
      const input = { a: "x", b: "y", c: "z" };
      const output = { a: "x", c: "z" };
      expect(reduce(input, DeleteFromObject("b"))).toBeUndefined();
      expect(input).toEqual(output);
    });

    it("can demote an object to an array", () => {
      const input = { a: "x", b: "y", c: "z" };
      const output = [{ a: "x" }, { b: "y" }, { c: "z" }];
      expect(reduce(input, DemoteObjectToArray())).toEqual(output);
    });

    it("will demote an object into an array of single key objects", () => {
      const input = { a: "a", b: "b" };
      const output = [{ a: "a" }, { b: "b" }];
      expect(reduce(input, DemoteObjectToArray())).toEqual(output);
    });

    it.each([
      [{ "": [] }, ""],
      [{ "": "" }, ""],
      [{ a: "" }, "a"],
      [{ "": "a" }, "a"],
      [{ "": ["a", "b"] }, ["a", "b"]],
      [{ a: "", b: "" }, ["a", "b"]],
      [{ a: { b: "" } }, { a: "b" }],
    ])("narrows objects %#", (input, output) =>
      expect(reduce(input, Narrow())).toEqual(output)
    );

    it.each([
      { "": "a", b: "" },
      { "": "a", b: "c" },
      { a: "", b: ["c", "d"] },
    ])("narrowing object is no-op %#", (input) =>
      expectNoOpFor(input, Narrow())
    );
  });

  describe("reproducing user testing", () => {
    it("can delete key from object inside array", () => {
      const startState = [{ a: "foo", b: "bar" }];
      const action = withPath("0")(DeleteFromObject("a"));
      const endState = [{ b: "bar" }];
      expect(reduce(startState, action)).toBeUndefined();
      expect(startState).toEqual(endState);
    });

    it("can delete from a two-element array nested in an object", () => {
      const state = { foo: "foo", bar: ["abc", "def"] };
      const action = withPath("bar")(DeleteFromArray(1));
      const expected = { foo: "foo", bar: "abc" };
      expect(reduce(state, action)).toBeUndefined();
      expect(state).toEqual(expected);
    });

    it("can delete from a two-element array nested in an array", () => {
      const state = ["foo", ["abc", "def"]];
      const action = withPath("1")(DeleteFromArray(1));
      const expected = ["foo", "abc"];
      expect(reduce(state, action)).toBeUndefined();
      expect(state).toEqual(expected);
    });

    it.each(defects)(
      "handles user-reported defect $#: $title",
      ({ action, state, expected, run }) => {
        if (defects.some((defect) => defect.run) && !run) return;
        const result = reduce(state, action);
        if (result !== undefined) expect(result).toStrictEqual(expected);
        else expect(state).toStrictEqual(expected);
      }
    );
  });
});
