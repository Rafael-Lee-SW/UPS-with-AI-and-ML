import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";  // useRouter 훅 추가
import { Link as ScrollLink } from "react-scroll";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem } from "@mui/material";
import Button from "/components/CustomButtons/Button.js";
import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";
import axios from "axios";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const router = useRouter();  // useRouter 훅 초기화
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const handleWarehouseManagement = async () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userInfo = JSON.parse(user);
      const userId = userInfo.id;

      try {
        const response = await axios.get(`https://i11a508.p.ssafy.io/api/users/${userId}`);
        const userData = response.data.result;

        if (userData.roleTypeEnum === "GENERAL") {
          alert("사업자 등록 후 이용해 주세요")
          router.push({
            pathname: "/mypage",
            query: { component: "license" },
          });
        } else {
          router.push("/user/select");
        }
      } catch (error) {
        router.push('/404');
        alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      }
    } else {
      alert("로그인이 필요합니다.");
      router.push("/signIn");
    }
  };

  // 현재 경로가 /mypage인지 확인
  const isMypage = router.pathname === '/mypage';
  const isSelect = router.pathname === '/user/select';

  return (
    <List className={classes.list}>
      {isLoggedIn && !isMypage && !isSelect ? (  // isMypage가 false일 때만 로그인 관련 링크 표시
        <>
          <ListItem className={classes.listItem}>
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
              className={classes.navLink}
            >
              마이페이지
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              onClick={handleWarehouseManagement}
              color="transparent"
              className={classes.navLink}
            >
              창고관리
            </Button>
          </ListItem>
        </>
      ) : isLoggedIn && isMypage ? (  // 마이페이지일 때 로그아웃과 창고관리 링크만 표시
        <>
          <ListItem className={classes.listItem}>
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
              onClick={handleWarehouseManagement}
              color="transparent"
              className={classes.navLink}
            >
              창고관리
            </Button>
          </ListItem>
        </>
      ) : isLoggedIn && isSelect ? (
        <>
          <ListItem className={classes.listItem}>
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
              className={classes.navLink}
            >
              마이페이지
            </Button>
          </ListItem>
        </>
      ) : (
        <>
          <ListItem className={classes.listItem}>
            <Button
              href="/signIn"
              color="transparent"
              className={classes.navLink}
            >
              로그인
            </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              href="/signup"
              color="transparent"
              className={classes.navLink}
            >
              회원가입
            </Button>
          </ListItem>
        </>
      )}
    </List>
  );
}
