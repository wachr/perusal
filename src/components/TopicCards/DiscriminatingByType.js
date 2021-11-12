export const TOPIC_ARRAY = Symbol("TOPIC_ARRAY");
export const TOPIC_OBJECT = Symbol("TOPIC_OBJECT");
export const TOPIC_STRING = Symbol("TOPIC_STRING");
export const TOPIC_UNKNOWN = Symbol("TOPIC_UNKNOWN");
export function discriminating(topic) {
  return new DiscriminatingByType(topic);
}

class DiscriminatingByType {
  #topic;
  #topicTypes = [];
  #cases = [];
  #defaultCase = null;

  static discriminator(topic) {
    if (Array.isArray(topic)) return TOPIC_ARRAY;
    if (topic && topic.topicTitle) return TOPIC_OBJECT;
    if (topic && typeof topic === "string") return TOPIC_STRING;
    return TOPIC_UNKNOWN;
  }

  constructor(topic) {
    this.#topic = topic;
  }

  considering(...topicTypes) {
    this.#topicTypes = topicTypes;
    return this;
  }

  renderWith(renderFn) {
    this.#cases.push([this.#topicTypes, renderFn]);
    return this;
  }

  defaultTo(renderFn) {
    this.#defaultCase = renderFn;
    return this;
  }

  type() {
    return DiscriminatingByType.discriminator(this.#topic);
  }

  render() {
    return (
      this.#cases.reduce((rendered, [topicTypes, renderFn]) => {
        if (rendered) return rendered;
        if (topicTypes.includes(this.type())) return renderFn();
        return null;
      }, null) ||
      (this.#defaultCase && this.#defaultCase()) ||
      null
    );
  }
}
