import { combine, isEmpty, onArray, onEmpty, onObject, onString } from "./ops";

function partition(condition) {
  return (arr) =>
    !Array.isArray(arr)
      ? []
      : arr.reduce(
          ([pass, fail], elem) =>
            condition(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]],
          [[], []]
        );
}

function narrow(state) {
  return combine(
    onEmpty(() => ({})),
    onString(() => state),
    onArray(() =>
      state.length === 1
        ? narrow(state[0])
        : state.map(narrow).filter((item) => !isEmpty(item))
    ),
    onObject(() => {
      const [partials, entries] = partition((entry) => entry.some(isEmpty))(
        Object.entries(state).map(([key, value]) => [key, narrow(value)])
      );
      const filteredPartials = partials.flat().filter((e) => !isEmpty(e));
      return filteredPartials.length === 0
        ? Object.fromEntries(entries)
        : narrow(
            entries.length === 0
              ? filteredPartials
              : [Object.fromEntries(entries), ...filteredPartials]
          );
    })
  )(state, state);
  // We use state as the unitValue so this becomes
  // a passthrough for unrecognized state shapes.
}

const NARROW = "narrow";
const PROMOTE_EMPTY_TO_STRING = "promote-empty-to-string";
const REPLACE_STRING = "replace-string";
const DELETE_STRING = "delete-string";
const PROMOTE_STRING_TO_ARRAY = "promote-string-to-array";
const DELETE_FROM_ARRAY = "delete-from-array";
const PROMOTE_STRING_TO_OBJECT = "promote-string-to-object";
const DELETE_KEY_FROM_OBJECT = "delete-key-from-object";
const DEMOTE_OBJECT_TO_ARRAY = "demote-object-to-array";

export function Narrow() {
  return { type: NARROW };
}

export function PromoteEmptyToString(str) {
  return { type: PROMOTE_EMPTY_TO_STRING, payload: str };
}

export function ReplaceString(str) {
  return { type: REPLACE_STRING, payload: str };
}

export function DeleteString() {
  return { type: DELETE_STRING };
}

export function PromoteStringToArray(str) {
  return { type: PROMOTE_STRING_TO_ARRAY, payload: str };
}

export function DeleteFromArray(ind) {
  return { type: DELETE_FROM_ARRAY, payload: ind };
}

export function PromoteStringToObject(str) {
  return { type: PROMOTE_STRING_TO_OBJECT, payload: str };
}

export function DeleteFromObject(key) {
  return { type: DELETE_KEY_FROM_OBJECT, payload: key };
}

export function DemoteObjectToArray() {
  return { type: DEMOTE_OBJECT_TO_ARRAY };
}

export default function reduce(
  state,
  action = { type: NARROW, payload: undefined }
) {
  switch (action.type) {
    case NARROW:
      return narrow(state);
    case PROMOTE_EMPTY_TO_STRING:
      return narrow(onEmpty(() => String(action.payload), state)(state)); // Coerce to string primitive
    case REPLACE_STRING:
      return narrow(onString(() => String(action.payload), state)(state));
    case DELETE_STRING:
      return narrow(onString(() => "", state)(state));
    case PROMOTE_STRING_TO_ARRAY:
      return narrow(
        onString(() => [state, String(action.payload)], state)(state)
      );
    case DELETE_FROM_ARRAY:
      return narrow(
        onArray(() => {
          const index = action.payload;
          return state.slice(0, index).concat(state.slice(index + 1));
        }, state)(state)
      );
    case PROMOTE_STRING_TO_OBJECT:
      return narrow(
        onString(() => {
          return { [state]: action.payload };
        }, state)(state)
      );
    case DELETE_KEY_FROM_OBJECT:
      return narrow(
        onObject(() => {
          const { [action.payload]: _, ...withoutKey } = state;
          return withoutKey;
        }, state)(state)
      );
    case DEMOTE_OBJECT_TO_ARRAY:
      return narrow(
        onObject(
          () => Object.entries(state).map(([key, value]) => ({ [key]: value })),
          state
        )(state)
      );
    default:
      return action.payload || state;
  }
}