import React from "react";
import Link from "next/link";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { AppBar, Toolbar, IconButton, Drawer, Button, Box } from "@mui/material";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import styles from "/styles/jss/nextjs-material-kit/components/selectHeaderStyle.js";

const useStyles = makeStyles(styles);

export default function Header(props) {
  const {
    color = "white",
    rightLinks,
    leftLinks,
    brand,
    fixed,
    absolute,
    changeColorOnScroll,
  } = props; // Use default parameter for color

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
    <Link href="/components" as="/components">
      <Button className={classes.title}>{brand}</Button>
    </Link>
  );

  return (
    <AppBar className={appBarClasses}>
      <Toolbar className={classes.container}>
        {leftLinks !== undefined ? brandComponent : null}
        <div className={classes.flex}>
          {leftLinks !== undefined ? (
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {leftLinks}
            </Box>
          ) : (
            brandComponent
          )}
        </div>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {rightLinks}
        </Box>
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </IconButton>
        </Box>
      </Toolbar>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
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
      </Box>
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
    ]).isRequired,
  }),
};
