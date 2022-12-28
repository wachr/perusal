import trampoline from "../../utils/trampoline";
import { nolookalikesSafe } from "nanoid-dictionary";
import { customAlphabet } from "nanoid/non-secure";

import { combine, isEmpty, onArray, onEmpty, onObject, onString } from "./ops";

function generateRandomPerusal(size = 5) {
  function randomIntExclusive(max) {
    return Math.floor(Math.random() * max);
  }
  if (size < 1)
    return customAlphabet(" " + nolookalikesSafe, randomIntExclusive(12) + 3)();
  switch (randomIntExclusive(3)) {
    case 2:
      return Object.fromEntries(
        Array.from(Array(randomIntExclusive(size))).map(() => [
          generateRandomPerusal(0),
          generateRandomPerusal(size - 1),
        ])
      );
    case 1:
      return Array.from(Array(randomIntExclusive(size / 2) + 2)).flatMap(() =>
        generateRandomPerusal(size - 1)
      );
    default:
      return generateRandomPerusal(0);
  }
}

function narrow(state) {
  function partition(condition) {
    return (arr) =>
      !Array.isArray(arr)
        ? []
        : arr.reduce(
            ([pass, fail], elem) =>
              condition(elem)
                ? [[...pass, elem], fail]
                : [pass, [...fail, elem]],
            [[], []]
          );
  }
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
const RANDOMIZE = "randomize";
const PROMOTE_EMPTY_TO_STRING = "promote-empty-to-string";
const REPLACE_STRING = "replace-string";
const DELETE_STRING = "delete-string";
const PROMOTE_STRING_TO_ARRAY = "promote-string-to-array";
const ADD_TO_ARRAY = "add-to-array";
const DELETE_FROM_ARRAY = "delete-from-array";
const REPLACE_IN_ARRAY = "replace-in-array";
const PROMOTE_STRING_TO_OBJECT = "promote-string-to-object";
const DELETE_KEY_FROM_OBJECT = "delete-key-from-object";
const DEMOTE_OBJECT_TO_ARRAY = "demote-object-to-array";
const SET_KEY_VALUE_IN_OBJECT = "set-key-value-in-object";

export function Narrow() {
  return { type: NARROW };
}

export function Randomize() {
  return { type: RANDOMIZE };
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

export function AddToArray(index, element) {
  return { type: ADD_TO_ARRAY, payload: { index, element } };
}

export function DeleteFromArray(index) {
  return { type: DELETE_FROM_ARRAY, payload: index };
}

export function ReplaceInArray(index, element) {
  return { type: REPLACE_IN_ARRAY, payload: { index, element } };
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

export function SetKeyValueInObject(key, value) {
  return { type: SET_KEY_VALUE_IN_OBJECT, payload: { key, value } };
}

export function withPath(...pathParts) {
  if (pathParts.some((e) => typeof e !== "string"))
    throw new Error("withPath requires arguments to be strings");
  return (action) => {
    !!action.path
      ? action.path.unshift(...pathParts)
      : (action.path = pathParts);
    return action;
  };
}

const reduce = trampoline(function _reduce(
  state,
  action = { type: NARROW, payload: undefined, path: [], recursive: false }
) {
  if (!!global.structuredClone)
    if (action?.recursive) console.log("recursive reduction");
    else
      console.log({
        action: structuredClone(action),
        state: state && JSON.parse(JSON.stringify(state)),
      });

  const path = Array.isArray(action.path) && action.path[0];
  if (followPath(state, action)) {
    action.path.shift();
    return recur(state[path], action);
  }

  switch (action.type) {
    case NARROW:
      return narrow(state);

    case RANDOMIZE:
      return narrow(generateRandomPerusal());

    case PROMOTE_EMPTY_TO_STRING: {
      const newString = narrow(String(action.payload));
      return combine(
        onEmpty(() => newString),
        onObject(
          onPath(() => {
            state[path] = newString;
          })
        )
      )(state, state);
    }

    case REPLACE_STRING: {
      const newString = narrow(String(action.payload));
      return combine(
        onString(() => newString),
        onArray(onPath(() => void state.splice(path, 1, newString))),
        onObject(onPath(() => void (state[path] = newString)))
      )(state, state);
    }

    case DELETE_STRING:
      return combine(
        onString(() => narrow("")),
        onArray(
          onPath(() => {
            if (action?.path?.length > 1)
              return recur(
                state[path],
                withPath(...action.path.slice(1))(DeleteString())
              );
            return recur(
              state,
              withPath(...action.path)(DeleteFromArray(action.path.slice(1)))
            );
          })
        ),
        onObject(
          onPath(() => recur(state, SetKeyValueInObject(path, narrow(""))))
        )
      )(state, state);

    case PROMOTE_STRING_TO_ARRAY: {
      const newString = narrow(String(action.payload));
      return combine(
        onString(() => [state, newString]),
        onArray(
          onPath(() =>
            recur(state, ReplaceInArray(path, [state[path], newString]))
          )
        ),
        onObject(
          onPath(() =>
            recur(state, SetKeyValueInObject(path, [state[path], newString]))
          )
        )
      )(state, state);
    }

    case ADD_TO_ARRAY:
      return combine(
        onPath((_, unit) => {
          if (typeof state[path] !== "object") return unit;
          action.path.shift();
          return recur(state[path], action);
        }),
        onArray(() => {
          if (!path)
            state.splice(
              action.payload.index,
              0,
              narrow(action.payload.element)
            );
        })
      )(state, state);

    case DELETE_FROM_ARRAY: {
      const index = Number.parseInt(action.payload);
      function arrayBoundaryCheck(leftTransform, rightTransform) {
        return (state, unit) =>
          onArray(() => {
            if (state.length === 2) {
              switch (index) {
                case 0:
                  return leftTransform(state, unit);
                case 1:
                  return rightTransform(state, unit);
              }
            }
            state.splice(index, 1);
          })(state, unit);
      }
      return combine(
        onObject(
          onPath(() =>
            arrayBoundaryCheck(
              () => recur(state, SetKeyValueInObject(path, state[path][1])),
              () => recur(state, SetKeyValueInObject(path, state[path][0]))
            )(state[path], state)
          )
        ),
        onArray(
          onPath(() =>
            arrayBoundaryCheck(
              () => recur(state, ReplaceInArray(path, state[path][1])),
              () => recur(state, ReplaceInArray(path, state[path][0]))
            )(state[path], state)
          )
        ),
        onPath((_, unit) => {
          if (typeof state[path] !== "object") return unit;
          action.path.shift();
          return recur(state[path], action);
        }),
        arrayBoundaryCheck(
          (state) => narrow(state[1]),
          (state) => narrow(state[0])
        )
      )(state, state);
    }

    case REPLACE_IN_ARRAY:
      return onArray(() =>
        isEmpty(action.payload.element)
          ? recur(
              state,
              withPath(...action.path)(DeleteFromArray(action.payload.index))
            )
          : void state.splice(
              action.payload.index,
              1,
              narrow(action.payload.element)
            )
      )(state, state);

    case PROMOTE_STRING_TO_OBJECT: {
      return combine(
        onString(() => ({ [state]: narrow(action.payload) })),
        onArray(
          onPath(
            () =>
              void state.splice(path, 1, {
                [state[path]]: narrow(action.payload),
              })
          )
        ),
        onObject(
          onPath(() =>
            recur(
              state,
              withPath(path)(
                SetKeyValueInObject(path, {
                  [state[path]]: narrow(String(action.payload)),
                })
              )
            )
          )
        )
      )(state, state);
    }

    case DELETE_KEY_FROM_OBJECT: {
      function withoutKey(obj, key) {
        if (!obj) return narrow({});
        const { [key]: _, ...withoutKey } = obj;
        return narrow(withoutKey);
      }
      return combine(
        onArray(() =>
          recur(
            state,
            withPath(...action.path.slice(0, -1))(
              ReplaceInArray(
                action.path.slice(-1),
                withoutKey(state[action.path.slice(-1)], action.payload)
              )
            )
          )
        ),
        onObject(() => withoutKey(state, action.payload))
      )(state, state);
    }

    case DEMOTE_OBJECT_TO_ARRAY:
      return narrow(
        onObject(
          () => Object.entries(state).map(([key, value]) => ({ [key]: value })),
          state
        )(state)
      );

    case SET_KEY_VALUE_IN_OBJECT:
      return combine(
        onArray(onPath(() => recur(state[path], action))),
        onObject(() => void (state[action.payload.key] = action.payload.value))
      )(state, state);

    default:
      return action.payload || state;
  }

  function recur(state, action) {
    action.recursive = true;
    return () => _reduce(state, action);
  }

  function followPath(state, action) {
    return (
      Array.isArray(action.path) &&
      action.path.length > 1 &&
      (!Array.isArray(state) ||
        state.length > 2 ||
        ![DELETE_STRING].includes(action.type))
    );
  }

  function onPath(transform) {
    return (a, unit) => (path ? transform(a, unit) : unit);
  }
});

Object.defineProperty(reduce, "name", {
  value: "reduce",
  writable: false,
});

export default reduce;
