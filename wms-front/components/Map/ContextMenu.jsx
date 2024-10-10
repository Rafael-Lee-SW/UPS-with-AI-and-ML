// ContextMenu.jsx

import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Import styles
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerMapStyle";
const useStyles = makeStyles(styles);

const ContextMenu = ({ menuRef, handleDelete, handleMouseEnter, handleMouseLeave }) => {
  const classes = useStyles();

  return (
    <div id="menu" className={classes.rightClickMenu} ref={menuRef}>
      <div>
        <button
          id="pulse-button"
          className={classes.pulse}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Pulse
        </button>
        <button
          id="delete-button"
          className={classes.delete}
          onClick={handleDelete}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;
