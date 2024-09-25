import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { List, ListItem } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import styles from "/styles/jss/nextjs-material-kit/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer() {
  const classes = useStyles();
 
  return (
    <footer>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="/"
                className={classes.block}
                target="_blank"
              >
                About us
              </a>
            </ListItem>
            <listItem className={classes.inlineBlock}>
              <a
                href="/"
                className={classes.block}
                target="_blank"
              >
                Q&A
              </a>
            </listItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="/"
                className={classes.block}
                target="_blank"
              >
                notice
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()} , made with by Team 508
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
