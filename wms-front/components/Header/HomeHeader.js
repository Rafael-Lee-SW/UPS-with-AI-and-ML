import React from "react";
import Link from "next/link";
import classNames from "classnames";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Drawer, Button } from "@mui/material";
import Menu from "@material-ui/icons/Menu";
import styles from "/styles/jss/nextjs-material-kit/components/headerStyle.js";

const useStyles = makeStyles(styles);

export default function Header({
  color = "white", 
  rightLinks,
  leftLinks,
  brand,
  fixed,
  absolute,
  changeColorOnScroll,
}) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (changeColorOnScroll) {
      window.addEventListener("scroll", headerColorChange);
    }
    return function cleanup() {
      if (changeColorOnScroll) {
        window.removeEventListener("scroll", headerColorChange);
      }
    };
  }, [changeColorOnScroll]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const headerColorChange = () => {
    const windowsScrollTop = window.pageYOffset;
    const header = document.body.getElementsByTagName("header")[0];

    if (windowsScrollTop > 0) {
      header.classList.remove(classes[color]);
      header.classList.add(classes[changeColorOnScroll.color]);
    } else {
      header.classList.add(classes[color]);
      header.classList.remove(classes[changeColorOnScroll.color]);
    }
  };

  const appBarClasses = classNames({
    [classes.appBar]: true,
    [classes[color]]: color,
    [classes.absolute]: absolute,
    [classes.fixed]: fixed,
  });

  const brandComponent = (
    <Link href="/">
      <Button className={classes.title}>
        <img
          style={{ height: "30px", width: "60px", paddingRight: "15px" }}
          src="/img/logo1.png"
          alt="logo"
        />
        {brand}
      </Button>
    </Link>
  );

  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        {leftLinks !== undefined ? brandComponent : null}
        <div className={classes.flex}>
          {leftLinks !== undefined ? (
            <div className={classes.hiddenSmDown}>{leftLinks}</div>
          ) : (
            brandComponent
          )}
        </div>
        {/* Hide rightLinks in mobile view */}
        <div className={classes.hiddenSmDown}>{rightLinks}</div>
        {/* Show only in mobile */}
        <div className={classes.hiddenMdUp}>
          <IconButton
            color="#986C58"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </div>
      </Toolbar>
      {/* Drawer only visible on mobile */}
      <div className={classes.hiddenMdUp}>
        <Drawer
          variant="temporary"
          anchor={"right"}
          open={mobileOpen}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={handleDrawerToggle}
        >
          <div className={classes.appResponsive}>
            {leftLinks}
            {rightLinks}
          </div>
        </Drawer>
      </div>
    </AppBar>
  );
}

Header.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark",
    "transparentWhite",
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool,
  changeColorOnScroll: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark",
      "transparentWhite",
    ]).isRequired,
  }),
};
