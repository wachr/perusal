import reduce, {
  DeleteFromArray,
  DeleteString,
  Narrow,
  PromoteEmptyToString,
  PromoteStringToArray,
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

  it(
    "should replace the entire state if given an action without type and " +
      "with a payload",
    () => {
      expect(reduce("foo", { payload: { foo: { bar: "baz" } } })).toEqual({
        foo: { bar: "baz" },
      });
    }
  );
});
