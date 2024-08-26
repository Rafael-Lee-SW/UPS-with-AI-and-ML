import React from "react";
import { useRouter } from "next/router"; // Import useRouter
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem } from "@mui/material"; // Correct casing for ListItem
import Button from "/components/CustomButtons/Button.js";
import { Link as ScrollLink } from "react-scroll"; // react-scroll import 추가
import axios from "axios"; // Axios import 추가

import styles from "/styles/jss/nextjs-material-kit/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const router = useRouter(); // Initialize useRouter

  const handleLogout = () => {
    // Remove the token from local storage

    localStorage.removeItem("token");
    localStorage.removeItem("user");  

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

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <Button
          onClick={handleWarehouseManagement} // 클릭 시 handleWarehouseManagement 함수 호출
          color="transparent"
          className={classes.navLink}>
          창고 관리
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <Button
          href="/mypage"
          color="transparent"
          className={classes.navLink}>
          마이페이지
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <Button
          onClick={handleLogout} 
          color="transparent"
          className={classes.navLink}>
          로그아웃
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <ScrollLink to="service-info" smooth={true} duration={500}>
          <Button
            color="transparent"
            className={classes.navLink}>
            서비스 소개
          </Button>
        </ScrollLink>
      </ListItem>
      <ListItem className={classes.listItem}> {/* Correct casing */}
        <ScrollLink to="how-to-use-start" smooth={true} duration={500}>
          <Button
            color="transparent"
            className={classes.navLink}>
            사용방법
          </Button>
        </ScrollLink>
      </ListItem>
    </List>
  );
}
