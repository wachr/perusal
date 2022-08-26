import { h } from "preact";

import { nolookalikesSafe } from "nanoid-dictionary";
import { customAlphabet } from "nanoid/non-secure";
import PropTypes from "prop-types";

const UniqueDialogId = ({ open, id, setId }) => {
  const genId = () => customAlphabet(nolookalikesSafe, 12);
  const uniqueId = open ? id || genId() : "";
  setId(uniqueId);
};

UniqueDialogId.propTypes = {
  open: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  setId: PropTypes.func.isRequired,
};

export default UniqueDialogId;
