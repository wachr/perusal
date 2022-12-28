import * as fc from "fast-check";

import reduce, { withPath } from "./reducer";

export function empties() {
  return fc.constantFrom({}, [], "", null, undefined);
}

export function nonEmptyString() {
  return fc.string({ minLength: 1 });
}

export function nonEmptyArray(arb) {
  return fc.uniqueArray(arb, { minLength: 1 });
}

export function nonEmptyObject(arb) {
  return fc.dictionary(nonEmptyString(), arb, { minKeys: 1 });
}

export function withArrayPath(arr) {
  return fc.record({
    state: fc.constant(arr),
    path: fc.nat({ max: arr.length - 1 }).map(String),
  });
}

export function withObjectPath(obj) {
  return fc.record({
    state: fc.constant(obj),
    path: fc.constantFrom(...Object.keys(obj)),
  });
}

export function expectNoOpFor(state, action) {
  const initialState = state && JSON.parse(JSON.stringify(state));
  const nextState = reduce(state, action);
  expect(nextState).toBe(state);
  expect(state).toStrictEqual(initialState);
}

export function expectNestedToStrictEqual(actionCreator, valueSupplier) {
  return ({ state, path }, actionPayload) => {
    const initialValue = state[path];
    const nextState = reduce(
      state,
      withPath(path)(actionCreator(actionPayload))
    );
    expect(nextState).toBeUndefined();
    expect(state[path]).toStrictEqual(
      valueSupplier(initialValue, actionPayload)
    );
  };
}
