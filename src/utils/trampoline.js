export default function trampoline(f) {
  return function trampolined(...args) {
    let result = f.bind(null, ...args);

    while (typeof result === "function") result = result();

    return result;
  };
}
