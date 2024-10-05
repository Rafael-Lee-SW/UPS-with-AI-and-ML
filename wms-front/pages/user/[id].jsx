// [id].jsx
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import Header from "/components/Header/UserHeader.jsx";
import HeaderLinks from "/components/Header/UserHeaderLinks.js";
import Button from "/components/CustomButtons/Button.js";
import dynamic from "next/dynamic";
import styles from "/styles/jss/nextjs-material-kit/pages/users.js"; // Let's make a media query for mobile
import "aos/dist/aos.css";
import { useRouter } from "next/router";

const DynamicMyContainerMap = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerMap.jsx"),
  { ssr: false }
);
const DynamicMyContainerNavigation = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerNavigation.jsx"),
  { ssr: false }
);
const DynamicMyContainerProduct = dynamic(
  () => import("/pages-sections/Components-Sections/MyContainerProduct.jsx"),
  { ssr: false }
);
const DynamicMyStorePrevent = dynamic(
  () => import("/pages-sections/Components-Sections/MyStorePrevent.jsx"),
  { ssr: false }
);

const useStyles = makeStyles(styles);

export default function Components({
  initialCards,
  initialUserData,
  initialBusinessData,
}) {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;

  const [cards, setCards] = useState(initialCards || []);
  const [userData, setUserData] = useState(initialUserData || null);
  const [businessData, setBusinessData] = useState(initialBusinessData || null);
  const [selectedStore, setSelectedStore] = useState(id || "");
  const [selectedStoreTitle, setSelectedStoreTitle] = useState(""); // State to store the selected warehouse title
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamic component array
  const componentsArray = [
    <DynamicMyContainerMap
      key={`map-${selectedStore}`}
      storeId={selectedStore}
    />,
    <DynamicMyContainerNavigation
      key={`nav-${selectedStore}`}
      WHId={selectedStore}
      businessId={userData?.businessId}
      warehouses={cards}
    />,
    <DynamicMyContainerProduct
      key={`product-${selectedStore}`}
      WHId={selectedStore}
      businessId={userData?.businessId}
      warehouses={cards}
      warehouseTitle={selectedStoreTitle}
    />,
    <DynamicMyStorePrevent
      key={`product-${selectedStore}`}
      WHId={selectedStore}
      businessId={userData?.businessId}
      warehouses={cards}
      warehouseTitle={selectedStoreTitle}
    />,
  ];

  const handleNextComponent = (index) => {
    setCurrentIndex(index);
  };

  const handleStoreChange = (event) => {
    const warehouseId = event.target.value;
    setSelectedStore(warehouseId);
    router.push(`/user/${warehouseId}`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (router.query.component) {
      switch (router.query.component) {
        case "map":
          setCurrentIndex(0);
          break;
        case "nav":
          setCurrentIndex(1);
          break;
        case "product":
          setCurrentIndex(2);
          break;
        case "protect":
          setCurrentIndex(3);
          break;
        default:
          setCurrentIndex(0);
      }
    }
  }, [router.query]);

  return (
    <div>
      <Header
        rightLinks={<HeaderLinks />}
        fixed
        color="transparentWhite" // Custom color here
      />
      <div className={classes.sidebar}>
        <button className={classes.homeButton}>
          <Link href="/components" as="/components">
            <img className={classes.homeImg} src="/img/logo1.png" alt="logo" />
          </Link>
        </button>
        <br />
        <div className={classes.currentStoreIndex}>현재 창고</div>
        <div className={classes.warehouseDropdown}>
          <select
            className={classes.warehouseSelect}
            value={selectedStore}
            onChange={handleStoreChange}
          >
            <option value="" disabled>
              창고를 선택하세요
            </option>
            {cards.map((warehouse) => (
              <option
                key={warehouse.id}
                value={warehouse.id}
                className={classes.warehouseOption}
              >
                {warehouse.title}
              </option>
            ))}
          </select>
        </div>
        <Button
          className={classNames(classes.buttonStyle, classes.button1, {
            [classes.selectedButton]: currentIndex === 0,
          })}
          round
          onClick={() => handleNextComponent(0)}
        >
          창고 관리
        </Button>
        <Button
          className={classNames(classes.buttonStyle, classes.button2, {
            [classes.selectedButton]: currentIndex === 1,
          })}
          round
          onClick={() => handleNextComponent(1)}
        >
          재고 현황
        </Button>
        <Button
          className={classNames(classes.buttonStyle, classes.button3, {
            [classes.selectedButton]: currentIndex === 2,
          })}
          round
          onClick={() => handleNextComponent(2)}
        >
          재고 관리
        </Button>
        <Button
          className={classNames(classes.buttonStyle, classes.button4, {
            [classes.selectedButton]: currentIndex === 3,
          })}
          round
          onClick={() => handleNextComponent(3)}
        >
          방범 관리
        </Button>
      </div>

      <div className={classes.mainContent}>
        {componentsArray.length > 0 ? (
          componentsArray[currentIndex]
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

// getInitialProps를 _app.js에서 사용하지 않음에 따라
// serverSide Rendering이 필요한 곳마다 아래 함수를 사용한다.
// Use getServerSideProps to fetch data
export async function getServerSideProps(context) {
  const { id } = context.params; // 현재 창고 아이디

  try {
    // 토큰에서 유저정보를 가져온다.
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰 유무로 로그인 여부를 판단하여 로그인 상태가 아닐 경우 로그인 창으로
      router.push("/signIn");
      return;
    }

    // 유저의 모든 매장 정보를 가져온다.
    const response = await fetch(`https://j11a302.p.ssafy.io/api/stores`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Include the token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
    });
    const apiConnection = await response.clone().json(); // clone the response to avoid consuming the body
    const stores = apiConnection.result;
    const storeCards = stores.map((store) => ({
      id: store.id,
      storeName: store.storeName,
    }));

    console.log("Parsed response:", apiConnection);

    return {
      props: {
        initialCards: storeCards || [],
      },
    };
  } catch (error) {
    return {
      props: {
        initialCards: [],
        initialUserData: null,
        initialBusinessData: null,
      },
    };
  }
}
