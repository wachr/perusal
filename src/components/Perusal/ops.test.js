import { combine, isEmpty, onArray, onEmpty, onObject, onString } from "./ops";

const mockTransform = jest.fn();
const mockUnit = { some: "value" };

afterEach(() => mockTransform.mockClear());

describe(isEmpty.name, () => {
  it.each([{}, "", [], null, undefined])("empty: %o", (nodeState) => {
    expect(isEmpty(nodeState)).toBeTruthy();
  });

  it.each(["a", ["a"], { a: {} }])("nonempty: %o", (nodeState) => {
    expect(isEmpty(nodeState)).toBeFalsy();
  });
});

describe(onString.name, () => {
  it("applies the given transformation to a string nodeState", () => {
    onString(mockTransform)("a");
    expect(mockTransform).toHaveBeenCalledWith("a", undefined);
  });

  it("returns unit value for a non-string nodeState", () => {
    const result = onString(mockTransform, mockUnit)({ a: "" });
    expect(mockTransform).not.toHaveBeenCalled();
    expect(result).toBe(mockUnit);
  });

  it("returns unit value for a nodeState that is the empty string", () => {
    const result = onString(mockTransform, mockUnit)("");
    expect(mockTransform).not.toHaveBeenCalled();
    expect(result).toBe(mockUnit);
  });

  it("returns undefined if unit value not passed in and applied a non-string nodeState", () => {
    const result = onArray(mockTransform)({ a: "" });
    expect(mockTransform).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe(onArray.name, () => {
  it("applies the given transformation to an array nodeState", () => {
    onArray(mockTransform)(["a"]);
    expect(mockTransform).toHaveBeenCalledWith(["a"], undefined);
  });

  it("returns unit value for a non-array nodeState", () => {
    const result = onArray(mockTransform, mockUnit)("a");
    expect(mockTransform).not.toHaveBeenCalled();
    expect(result).toBe(mockUnit);
  });

  it("returns unit value for a nodeState that is an empty array", () => {
    const result = onArray(mockTransform, mockUnit)([]);
    expect(mockTransform).not.toHaveBeenCalled();
    expect(result).toBe(mockUnit);
  });

  it("returns undefined if unit value not passed in and applied a non-array nodeState", () => {
    const result = onArray(mockTransform)({ a: [] });
    expect(mockTransform).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe(onObject.name, () => {
  it("applies the given transformation to an object nodeState", () => {
    onObject(mockTransform)({ a: "b" });
    expect(mockTransform).toHaveBeenCalled();
  });

  it("does not apply the given transformation to an array nodestate", () => {
    onObject(mockTransform)(["a", "b"]);
    expect(mockTransform).not.toHaveBeenCalled();
  });

  it("does not apply the given transformation to a string nodestate", () => {
    onObject(mockTransform)("a");
    expect(mockTransform).not.toHaveBeenCalled();
  });

  it("does not apply the given transformation to an empty nodestate", () => {
    onObject(mockTransform)({});
    expect(mockTransform).not.toHaveBeenCalled();
  });
});

describe("composing operations", () => {
  const stringResult = "result";
  const arrayResult = ["result"];
  const mockStringTransform = jest.fn().mockReturnValue(stringResult);
  const mockArrayTransform = jest.fn().mockReturnValue(arrayResult);

  afterEach(() => {
    mockStringTransform.mockClear();
    mockArrayTransform.mockClear();
  });

  describe("can define a function that selects the appropriate transformation to apply to a given nodeState", () => {
    const composition = combine(
      onString(mockStringTransform),
      onArray(mockArrayTransform)
    );

    it("returns unit when nothing matches", () => {
      const result = composition({ nonArray: { nonString: {} } }, mockUnit);
      expect(result).toBe(mockUnit);
      expect(mockStringTransform).not.toHaveBeenCalled();
      expect(mockArrayTransform).not.toHaveBeenCalled();
    });

    it("applies string transformation to string nodeState", () => {
      const result = composition("a", mockUnit);
      expect(result).toBe(stringResult);
      expect(mockStringTransform).toHaveBeenCalledWith("a", mockUnit);
      expect(mockArrayTransform).not.toHaveBeenCalled();
    });

    it("applies array transformation to array nodeState", () => {
      const result = composition(["a"], mockUnit);
      expect(result).toBe(arrayResult);
      expect(mockStringTransform).not.toHaveBeenCalled();
      expect(mockArrayTransform).toHaveBeenCalledWith(["a"], mockUnit);
    });
  });

  describe(combine.name, () => {
    it("can apply a single op correctly", () => {
      const mockTransform = jest.fn().mockReturnValue("b");
      const result = combine(onString(mockTransform))("a");
      expect(result).toBe("b");
      expect(mockTransform).toHaveBeenCalledTimes(1);
      expect(mockTransform).toHaveBeenCalledWith("a", undefined);
    });

    it("returns unit value if no transform is appropriate", () => {
      const result = combine(
        onString(mockStringTransform),
        onArray(mockArrayTransform)
      )({ a: {} }, mockUnit);
      expect(result).toBe(mockUnit);
      expect(mockStringTransform).not.toHaveBeenCalled();
      expect(mockArrayTransform).not.toHaveBeenCalled();
    });

    it("returns the expected result", () => {
      const result = combine(
        onString(mockStringTransform),
        onEmpty(jest.fn().mockReturnValue(["an entirely new topic"])),
        onArray(mockArrayTransform)
      )(["a"]);
      expect(result).toBe(arrayResult);
      expect(mockStringTransform).not.toHaveBeenCalled();
      expect(mockArrayTransform).toHaveBeenCalledWith(["a"], undefined);
    });
  });
});
