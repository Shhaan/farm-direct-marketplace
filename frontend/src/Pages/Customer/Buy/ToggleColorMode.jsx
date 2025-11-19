import * as React from "react";
import PropTypes from "prop-types";

import IconButton from "@mui/material/IconButton";
function ToggleColorMode({ mode, toggleColorMode }) {
  return (
    <IconButton
      onClick={toggleColorMode}
      color="primary"
      aria-label="Theme toggle button"
    ></IconButton>
  );
}

ToggleColorMode.propTypes = {
  mode: PropTypes.oneOf(["dark", "light"]).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default ToggleColorMode;
