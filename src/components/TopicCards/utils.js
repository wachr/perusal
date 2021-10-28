import {
  TOPIC_ARRAY,
  TOPIC_OBJECT,
  TOPIC_STRING,
  TOPIC_UNKNOWN
} from "./constants";

function discriminator(topic) {
  if (Array.isArray(topic)) return TOPIC_ARRAY;
  if (topic && topic.topicTitle) return TOPIC_OBJECT;
  if (topic && typeof topic === "string") return TOPIC_STRING;
  return TOPIC_UNKNOWN;
}

export function discriminating(topic) {
  return function(...cases) {
    function toPairs(accumulator, value, index) {
      if (index % 2 === 0) accumulator.push([value]);
      else accumulator[accumulator.length - 1].push(value);
      return accumulator;
    }
    return cases
      .reduce(toPairs, [])
      .reduce(
        (rendered, [topicTypes, renderFn]) =>
          !rendered && topicTypes.includes(discriminator(topic)) && renderFn(),
        null
      );
  };
}

export const discriminateTopic = discriminator;
