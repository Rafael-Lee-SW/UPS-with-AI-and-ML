// styles\jss\nextjs-material-kit\pages\componentsSections\MyContainerStyle.jsx

import { container, title } from "/styles/jss/nextjs-material-kit.js";
import customCheckboxRadioSwitch from "/styles/jss/nextjs-material-kit/effect/customCheckboxRadioSwitch.js";

const basicsStyle = {
  navigationContainer: {
    position: "relative",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
  },
  //캔버스 기본 설정
  basicCanvas: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  //줌인, 줌아웃 등 버튼 관련 모음
  buttonContainer: {
    position: "absolute",
    left: "45%",
    top: "3rem",
    display: "flex",
    gap: "10px",
  },
  icons: {
    width: "35px",
    height: "35px",
    fontWeight: "bold",
  },
  leftSidebar: {
    position: "absolute",
    top: "10vh",
    padding: "10px",
    width: "200px",
    height: "80vh",
    overflowY: "auto",
    backgroundColor: "rgba(247, 247, 247, 0.9)",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
  },
  leftSidebarContent: {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  sidebarButton: {
    color: "#7D4A1A",
    fontWeight: "bold",
    textAlign: "center",
  },
  //재고함 목록, 알림함 목록 보기
  listTitle: {
    textAlign: "center",
  },
  locations: {
    // 스타일 없는데 구분을 위해 일단 생성
  },
  locationList: {
    width: "100%",
  },
  ulLocationList: {
    height: "50vh",
    overflowY: "auto",
    listStyle: "none",
    padding: 0,
  },
  liLocationsList: {
    cursor: "pointer",
    padding: "5px",
    borderBottom: "1px solid #ccc",
    textAlign: "center",
  },
  notification: {
    textAlign: "center",
  },
  ulNotificationsList: {
    listStyle: "none",
    padding: 0,
  },
  liNotificationsList: {
    cursor: "pointer",
    padding: "5px",
    borderBottom: "1px solid #ccc",
    justifyContent: "center",
  },
  // 디테일 항목 파트
  rightSidebar: {
    position: "absolute",
    top: "10vh",
    right: "10px",
    padding: "10px",
    border: "2px solid black",
    borderRadius: "10px",
    width: "36%",
    height: "80vh",
    overflowY: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  //우측 사이드바 닫기 버튼
  closeButtonPart: {
    display: "flex",
    justifyContent: "flex-end",
  },
  closeButton: {
    color: "#7D4A1A",
  },
  /**
   * 각 상자 정보와 이에 속하는 재고 목록을 보여주는 파트
   */
  //상자 정보
  infoBox: {
    display: "flex",
  },
  infoBoxNum: {
    width: "45%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  infoZindexBox: {
    marginLeft: "10px",
    height: "200px",
    width: "65%",
    overflowY: "auto",
    border: "1px solid gray",
    borderRadius: "5px",
    padding: "5px",
    display: "flex",
    flexDirection: "column-reverse",
  },
  floorBox: {
    display: "flex",
    width: "90%",
    height: "30px",
    marginBottom: "5px",
    borderRadius: "5px",
    border: "1px solid black",
    textAlign: "center",
    lineHeight: "30px",
    marginLeft: "auto",
    marginRight: "auto",
    cursor: "pointer",
  },
  //재고 목록을 보여주는 파트
  productList: {
    marginTop: "20px",
  },
  productListTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  trProductListTable: {
    borderBottom: "1px solid #ccc",
  },
  tdMainProductListTable: {
    padding: "10px",
    width: "70%",
    fontSize: "18px",
  },
  productBarcode: {
    fontSize: "12px",
    color: "#666",
  },
  tdSubProductListTable: {
    padding: "10px",
    width: "30%",
    textAlign: "right",
    fontSize: "16px",
  },
  /**
   * 각 알림(날짜, 알림종류, 창고)의 상세 내역에 관한 파트
   */
  detailedNotifications: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  notificationTitle: {
    textAlign: "center",
    marginBottom: "20px",
  },
  printButton: {
    color: "#7D4A1A",
  },
  notificationTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  // Table의 th 항목들
  thNameNotificationTable: {
    borderBottom: "2px solid #ccc",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
    fontSize: "18px",
  },
  thQuantityNotificationTable: {
    borderBottom: "2px solid #ccc",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#f2f2f2",
    fontSize: "18px",
  },
  thTypeNotificationTable: {
    borderBottom: "2px solid #ccc",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#f2f2f2",
    fontSize: "18px",
  },
  // table의 td 항목들
  tdProductNotificationTable: {
    padding: "10px",
    verticalAlign: "top",
  },
  tdNameNotificationTable: {
    display: "block",
    fontSize: "16px",
    marginBottom: "5px",
  },
  tdBarcodeNotificationTable: {
    display: "block",
    fontSize: "12px",
    color: "#666",
  },
  tdQuantityNotificationTable: {
    padding: "10px",
    textAlign: "center",
    fontSize: "16px",
    verticalAlign: "middle",
  },
  tdLocationNotificationTable: {
    padding: "10px",
    textAlign: "center",
    fontSize: "16px",
    verticalAlign: "middle",
  },
  StoreTitle: {
    display: "block",
    fontSize: "12px",
    color: "#666",
  },
  //로딩 스타일
  loading: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  //프린트 테이블 컨텐츠
  printTableContent: {
    padding: "20px",
  },
  printTableTitle: {
    textAlign: "center",
    marginBottom: "20px",
  },
  printTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  thPrintTable: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
  },
  thPrintTable: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },

  ...customCheckboxRadioSwitch,
};

export default basicsStyle;
