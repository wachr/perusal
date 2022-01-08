import PropTypes from "prop-types";

export class Topic {
  #title = "";
  #description = "";
  #subordinates;

  constructor(title, description, subordinates) {
    if (!title) throw new TypeError("missing required argument: title");
    this.#title = title;
    this.#description = description;
    this.#subordinates = Array.isArray(subordinates) && new Set(subordinates);
  }

  static propTypes = PropTypes.oneOf([
    PropTypes.string.isRequired,
    PropTypes.shape({
      __perusal_Topic: PropTypes.string.isRequired,
      __perusal_Description: PropTypes.string,
      __perusal_Subordinates: PropTypes.arrayOf(
        PropTypes.oneOf([
          PropTypes.string.isRequired,
          PropTypes.shape({
            __perusal_Topic: PropTypes.string.isRequired,
          }),
        ])
      ),
    }).isRequired,
  ]).isRequired;
}

export class Perusal {
  #alternates;

  constructor(topics) {
    this.#alternates = Array.isArray(topics) && new Set(topics);
  }

  static propTypes = PropTypes.arrayOf(Topic.propType).isRequired;
}
