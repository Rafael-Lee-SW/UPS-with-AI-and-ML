// /components/Card/CardSelect.js
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import styles from "/styles/jss/nextjs-material-kit/components/cardStyle.js"; // Adjust the path if needed

const useStyles = makeStyles(styles);

const CardSelect = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { className, children, ...rest } = props;
  const cardClasses = classNames({
    [classes.card]: true,
    [className]: className !== undefined,
  });

  return (
    <div className={classes.cardWrapper}>
      <div className={cardClasses} {...rest}>
        {children}
      </div>
    </div>
  );
});

CardSelect.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default CardSelect;
