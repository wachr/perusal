import defects from "../../test/resources/defects.json";

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
    expect(reduce(empty, Narrow())).toStrictEqual({});
  });

  it("should narrow by default", () => {
    expect(reduce(["foo"])).toBe("foo");
  });

  it("should no-op if the dispatched action does not match the state's type", () => {
    expect(reduce(["foo", "bar"], PromoteStringToArray("baz"))).toEqual([
      "foo",
      "bar",
    ]);
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
    expect(reduce("foo", DeleteString())).toStrictEqual({});
  });

  it("should delete a string from an array of strings", () => {
    const state = [" ", " "];
    expect(reduce(state, withPath(0)(DeleteString()))).toBe(undefined);
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

  it("should demote an object with an empty right hand side to a string", () => {
    expect(reduce({ foo: "" }, Narrow())).toEqual("foo");
  });

  it(
    "should demote an object with an empty left hand side and a string " +
      "right hand side to a string",
    () => {
      expect(reduce({ "": "foo" }, Narrow())).toEqual("foo");
    }
  );

  it(
    "should demote an object with an empty left hand side and an array " +
      "right hand side to an array",
    () => {
      expect(reduce({ "": ["foo", "bar"] }, Narrow())).toEqual(["foo", "bar"]);
    }
  );

  it(
    "should demote an object with an empty left hand side and an empty " +
      "right hand side to an empty",
    () => {
      expect(reduce({ "": [] }, Narrow())).toEqual({});
    }
  );

  describe("reducing objects", () => {
    it("can delete a given key from an object", () => {
      const input = { a: "x", b: "y", c: "z" };
      const output = { a: "x", c: "z" };
      expect(reduce(input, DeleteFromObject("b"))).toEqual(output);
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

    it("will narrow every value of an object", () => {
      const input = { a: "a", b: ["b", "", "b"], c: {}, d: "" };
      expect(reduce(input, Narrow())).toEqual([
        { a: "a", b: ["b", "b"] },
        "c",
        "d",
      ]);
    });

    it("will demote an object to an array if any key is empty", () => {
      const input = { a: "a", b: "b", "": "c" };
      const output = [{ a: "a", b: "b" }, "c"];
      expect(reduce(input, Narrow())).toEqual(output);
    });

    it("will demote an object to an array if any value is empty", () => {
      const input = { a: "a", b: "b", c: "" };
      const output = [{ a: "a", b: "b" }, "c"];
      expect(reduce(input, Narrow())).toEqual(output);
    });

    it.each([{ a: "a", b: "b", "": "c", d: "" }])(
      "should not lose information narrowing objects with empties %#",
      (input) => {
        expect(reduce(input, Narrow())).toEqual([{ a: "a", b: "b" }, "c", "d"]);
      }
    );

    it.each([
      [{ "": [] }, {}],
      [{ "": "" }, {}],
      [{ a: "" }, "a"],
      [{ "": "a" }, "a"],
      [{ "": "a", b: "c" }, [{ b: "c" }, "a"]],
      [{ "": "a", b: "" }, ["a", "b"]],
      [{ "": ["a", "b"] }, ["a", "b"]],
      [{ a: "", b: "" }, ["a", "b"]],
      [{ a: "", b: ["c", "d"] }, [{ b: ["c", "d"] }, "a"]],
      [{ a: { b: "" } }, { a: "b" }],
    ])("narrows objects %#", (input, output) => {
      expect(reduce(input, Narrow())).toEqual(output);
    });
  });

  describe("reproducing user testing", () => {
    it("can delete key from object inside array", () => {
      const startState = [{ a: "foo", b: "bar" }];
      const action = withPath("0")(DeleteFromObject("a"));
      const endState = [{ b: "bar" }];
      expect(reduce(startState, action)).toBeUndefined();
      expect(startState).toEqual(endState);
    });

    it.each(defects)(
      "handles user-reported defect $#: $title",
      ({ action, state, expected, run }) => {
        if (defects.some((defect) => defect.run) && !run) return;
        const result = reduce(state, action);
        if (result !== undefined) expect(result).toBe(expected);
        else expect(state).toStrictEqual(expected);
      }
    );
  });
});
