import reduce, {
  DeleteFromArray,
  DeleteFromObject,
  DeleteString,
  DemoteObjectToArray,
  Narrow,
  PromoteEmptyToString,
  PromoteStringToArray,
  PromoteStringToObject,
  ReplaceString,
} from "./reducer";

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

  it("should delete from an array", () => {
    const inState = ["a", "b", "c", "d", "e"];
    const outState = ["a", "b", "c", "e"];
    expect(reduce(inState, DeleteFromArray(3))).toEqual(outState);
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
});
