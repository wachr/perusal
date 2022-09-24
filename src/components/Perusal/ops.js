export function isEmpty(nodeState) {
  if (!nodeState) return true;
  if (typeof nodeState === "string" && nodeState === "") return true;
  if (Array.isArray(nodeState) && nodeState.length === 0) return true;
  if (typeof nodeState === "object" && Object.entries(nodeState).length === 0)
    return true;
  return false;
}

export function onEmpty(emptyTransform, unitValue = undefined) {
  return (nodeState, unit = unitValue) => {
    if (isEmpty(nodeState)) return emptyTransform();
    return unit;
  };
}

export function onString(stringTransform, unitValue = undefined) {
  return (nodeState, unit = unitValue) => {
    if (!isEmpty(nodeState) && typeof nodeState === "string")
      return stringTransform(nodeState);
    return unit;
  };
}

export function onArray(arrayTransform, unitValue = undefined) {
  return (nodeState, unit = unitValue) => {
    if (!isEmpty(nodeState) && Array.isArray(nodeState))
      return arrayTransform(nodeState);
    return unit;
  };
}

// TODO export function onObject(objectTransform, unitValue = undefined) {}

export function combine(...ops) {
  return (nodeState, unitValue = undefined) =>
    ops.reduce(
      (result, transform) =>
        result !== unitValue ? result : transform(nodeState, unitValue),
      unitValue
    );
}
