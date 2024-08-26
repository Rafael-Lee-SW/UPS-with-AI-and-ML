/*eslint-disable*/
import React from "react";
import Link from "next/link";

import { useRouter } from "next/router"; // Import useRouter
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, Tooltip, Icon } from "@mui/material";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

// core components
import CustomDropdown from "/components/CustomDropdown/CustomDropdown.js";
import Button from "/components/CustomButtons/Button.js";

import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const router = useRouter();
  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to the homepage
    router.push("/");
  };

  const classes = useStyles();
  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        {" "}
        {/* Correct casing */}
        <Button
          onClick={handleLogout}
          color="transparent"
          className={classes.navLink}
        >
          로그아웃
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/mypage"
          color="transparent"
          // target="_blank" // 이를 통해 새로운 페이지로 띄워버릴 수 있다.
          className={classes.navLink}
        >
          마이페이지
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/components"
          color="transparent"
          className={classes.navLink}
        >
          사용방법
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="/user/select"
          color="transparent"
          className={classes.navLink}
        >
          창고목록
        </Button>
      </ListItem>
    </List>
  );
}
