//MyContainerMap.jsx
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// CSS스타일
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerMapStyle";

const useStyles = makeStyles(styles);

const MyStorePrevent = ({ warehouseId, businessId }) => {
  const router = useRouter();
  const classes = useStyles();

  return (
    <div className={classes.protectContainer}>
      <h1>방범 섹터입니다.</h1>
      <h2>수정 예정입니다.</h2>
    </div>
  );
};

export default MyStorePrevent;
