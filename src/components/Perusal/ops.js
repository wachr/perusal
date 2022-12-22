export function isEmpty(nodeState) {
  if (!nodeState) return true;
  if (typeof nodeState === "string" && nodeState === "") return true;
  if (Array.isArray(nodeState) && nodeState.length === 0) return true;
  if (typeof nodeState === "object" && Object.entries(nodeState).length === 0)
    return true;
  return false;
}

export function onCondition(condition, transform, unitValue = undefined) {
  return (nodeState, unit = unitValue) => {
    if (condition(nodeState)) return transform(nodeState, unit);
    return unit;
  };
}

export function onEmpty(emptyTransform, unitValue = undefined) {
  return onCondition(isEmpty, emptyTransform, unitValue);
}

export function onString(stringTransform, unitValue = undefined) {
  return onCondition(
    (state) => !isEmpty(state) && typeof state === "string",
    stringTransform,
    unitValue
  );
}

export function onArray(arrayTransform, unitValue = undefined) {
  return onCondition(
    (state) => !isEmpty(state) && Array.isArray(state),
    arrayTransform,
    unitValue
  );
}

export function onObject(objectTransform, unitValue = undefined) {
  return onCondition(
    (state) =>
      !isEmpty(state) && typeof state === "object" && !Array.isArray(state),
    objectTransform,
    unitValue
  );
}

export function combine(...ops) {
  return (nodeState, unitValue = undefined) =>
    ops.reduce(
      (result, transform) =>
        result !== unitValue ? result : transform(nodeState, unitValue),
      unitValue
    );
}
