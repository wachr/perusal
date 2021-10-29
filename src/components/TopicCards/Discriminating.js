import { discriminateTopic } from "./utils";

class DiscriminatingType {
  #topicHolder;
  #topicTypes;

  constructor(topicHolder) {
    this.#topicHolder = topicHolder;
  }

  considering(...topicTypes) {
    this.#topicTypes = topicTypes;
    return this;
  }

  renderWith(renderFn) {
    this.#topicHolder.considerCase(this.#topicTypes, renderFn);
    return this;
  }

  renderWithDefault(renderFn) {
    this.#topicHolder.byDefault(renderFn);
    return this;
  }

  render() {
    return this.#topicHolder.render();
  }
}

class DiscriminatingTopic {
  #topic;
  #cases = [];
  #defaultCase = null;

  constructor(topic) {
    this.#topic = topic;
  }

  considerCase(topicTypes, renderFn) {
    this.#cases.push([topicTypes, renderFn]);
  }

  byDefault(renderFn) {
    this.#defaultCase = renderFn;
  }

  render() {
    return (
      this.#cases.reduce((rendered, considering) => {
        const [topicTypes, renderFn] = considering;
        if (rendered) return rendered;
        if (topicTypes.includes(discriminateTopic(this.#topic)))
          return renderFn();
        return null;
      }, null) ||
      (this.#defaultCase && this.#defaultCase()) ||
      null
    );
  }
}

export function discriminating(topic) {
  const topicHolder = new DiscriminatingTopic(topic);
  return new DiscriminatingType(topicHolder);
}
