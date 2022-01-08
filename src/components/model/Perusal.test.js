import { Perusal, Topic } from "./Perusal";

describe(Topic.name, () => {
  test("deserializes", () => {
    const expected = new Topic("test");
    expect(JSON.parse(JSON.stringify(new Topic("test")))).toEqual(expected);
  });
});

describe(Perusal.name, () => {
  test("deserializes", () => {
    const expected = new Perusal([]);
    expect(JSON.parse(JSON.stringify(new Perusal([])))).toEqual(expected);
  });
});
