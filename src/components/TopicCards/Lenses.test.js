import { TOPIC_OBJECT, TOPIC_STRING } from "./DiscriminatingByType";
import { editByPath, selectByPath } from "./Lenses";

describe(selectByPath.name, () => {
  it("returns null if path doesn't indicate subtopic", () => {
    const topic = { topicTitle: "foo", topicSubtopics: ["bar"] };
    expect(selectByPath(topic, ["foo", "quux"])).toBeNull();
  });

  it("returns null if path doesn't include current topic", () => {
    const topic = { topicTitle: "foo", topicSubtopics: ["bar"] };
    expect(selectByPath(topic, ["quux"])).toBeNull();
  });

  it("returns the top level for an empty path", () => {
    const topic = { topicTitle: "foo" };
    expect(selectByPath(topic, [])).toEqual(topic);
  });

  it("returns the top level for single path element matching topic string", () => {
    const topic = "foo";
    expect(selectByPath(topic, ["foo"])).toEqual(topic);
  });

  it("returns the top level for single path element matching topic title", () => {
    const topic = { topicTitle: "foo" };
    expect(selectByPath(topic, ["foo"])).toEqual(topic);
  });

  it("should be able to lens into a subtopic", () => {
    const topic = {
      topicTitle: "foo",
      topicSubtopics: ["bar", "baz"]
    };
    const path = ["foo", "bar"];
    expect(selectByPath(topic, path)).toEqual("bar");
  });

  test.each([
    [
      TOPIC_OBJECT,
      {
        topicTitle: "foo",
        topicSubtopics: [{ topicTitle: "bar" }]
      },
      { topicTitle: "bar" }
    ],
    [
      TOPIC_STRING,
      {
        topicTitle: "foo",
        topicSubtopics: ["bar"]
      },
      "bar"
    ]
  ])(
    "returns the %s subtopic identified by a single path element",
    (topicType, topic, subtopic) => {
      expect(selectByPath(topic, ["bar"])).toEqual(subtopic);
    }
  );
});

describe(editByPath.name, () => {
  it("updates the top level for an empty path", () => {
    const topicFoo = { topicTitle: "foo" };
    const topicBar = { topicTitle: "bar" };
    const updateFn = jest.fn(() => topicBar);
    expect(editByPath(topicFoo, [], updateFn)).toEqual(topicBar);
    expect(updateFn).toBeCalledWith(topicFoo);
  });

  it("updates the top level for a single path element matching topic title", () => {
    const topicFoo = { topicTitle: "foo" };
    const topicBar = { topicTitle: "bar" };
    const updateFn = jest.fn(() => topicBar);
    expect(editByPath(topicFoo, ["foo"], updateFn)).toEqual(topicBar);
    expect(updateFn).toBeCalledWith(topicFoo);
  });

  it("does not update the top level for a single path element not matching topic title", () => {
    const topicFoo = { topicTitle: "foo" };
    const topicBar = { topicTitle: "bar" };
    const updateFn = jest.fn(() => topicBar);
    expect(editByPath(topicFoo, ["bar"], updateFn)).toBeNull();
    expect(updateFn).not.toHaveBeenCalled();
  });
});
