import { combine, onArray, onEmpty, onString } from "./ops";

function narrow(state) {
  return combine(
    onEmpty(() => ({})),
    onString(() => state),
    onArray(() => (state.length === 1 ? state[0] : state.map(narrow)))
    // onObject(() => Object.from(state.entries.map((key, value) => return [key, narrow(value)])))
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
    default:
      return action.payload || state;
  }
}
