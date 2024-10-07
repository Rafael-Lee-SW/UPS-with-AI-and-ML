import { container } from "/styles/jss/nextjs-material-kit.js";

const selectStyle = (theme) => ({
  //모바일 환경
  section: {
    padding: "30px 0 0 0",
  },
  selectContainer: {
    margin: "15px 0 0 0",
    fontWeight: "bold",
  },
  container,
  marginAuto: {
    marginLeft: "auto !important",
    marginRight: "auto !important",
  },
  centerAlign: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  // 카드 grid 속성을 정하는 거시기
  cardGrid: {
    margin: "5px 0 5px 0",
    padding: "0",
    width: "150px", // Adjusted from the original size
    height: "230px",
    // border : "2px solid",
    borderRadius: "20px",
    marginRight: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
  },
  cardSelect: {},
  cardLink: {
    width: "100%",
    margin: "0 0 0 0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50px", // Height set to 1/3 of the card
    position: "relative", // 이미지 포지셔닝을 위해 설정
    borderRadius: "20px 20px 0 0",
  },
  cardImage: {
    position: "absolute",
    bottom: 0,
    width: "30%", // 이미지 너비를 30%로 조정
    height: "auto", // 높이를 자동으로 조정하여 비율 유지
    borderLeft: "4px solid #000", // 왼쪽 테두리
    borderRight: "4px solid #000", // 오른쪽 테두리
    borderTop: "4px solid #000", // 위쪽 테두리
    borderBottom: "none", // 아래쪽 테두리는 없음
  },
  warehouseImage: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column", // 제목과 퍼센트 바를 세로로 정렬
    justifyContent: "center",
    alignItems: "center",
    height: "45%", // Height set to 1/3 of the card
  },
  cardMain: {
    width: "80%",
    height: "30px",
    backgroundColor: "lightgray",
    borderRadius: "20px",
    overflow: "hidden",
    marginTop: "10px",
    border: "2px solid #ccc",
  },
  cardProgress: {
    //일부 속성은 페이지 내에서 함수로 받아온다.(width and backgroundColor)
    height: "100%",
    display: "flex", // 플렉스 박스를 사용하여 중앙 정렬
    justifyContent: "center", // 수평 중앙 정렬
    alignItems: "center", // 수직 중앙 정렬
    color: "white", // 텍스트 색상 (배경과 대비되도록 설정)
    fontWeight: "bold", // 텍스트 굵게
  },
  usageBarContainer: {
    width: "100%",
    height: "20px",
    backgroundColor: "lightgray",
    borderRadius: "4px",
    overflow: "hidden",
    marginTop: "10px",
  },
  usageBar: {
    height: "100%",
    backgroundColor: "rgb(27, 177, 231)", // 기본 배경 색상은 JSX에서 동적으로 설정
    display: "flex", // 플렉스 박스를 사용하여 중앙 정렬
    justifyContent: "center", // 수평 중앙 정렬
    alignItems: "center", // 수직 중앙 정렬
    color: "white", // 텍스트 색상 (배경과 대비되도록 설정)
    fontWeight: "bold", // 텍스트 굵게
  },
  cardFooter: {
    display: "flex",
    justifyContent: "center", // 요소를 가운데 정렬하여 간격 줄임
    alignItems: "center", // 수직 정렬
    gap: "15px", // pcsContainer와 locationContainer 사이 간격
    height: "100%", // 맨 아래에 위치
    position: "relative", // ::before 가상 요소 위치를 위해 필요
    "&::before": {
      content: '""', // 내용 없음
      position: "absolute",
      top: 0, // 상단에 위치
      left: "5%", // 가로선이 더 길어지도록 시작점을 좌측으로 이동
      width: "90%", // 가로선 길이를 카드의 90%로 설정
      height: "1px", // 가로선의 높이
      background:
        "linear-gradient(to right, rgba(128, 128, 128, 0) 0%, rgba(128, 128, 128, 1) 50%, rgba(128, 128, 128, 0) 100%)", // 양 끝이 희미해지는 회색 그라데이션
    },
  },
  pcsContainer: {
    display: "flex",
    flexDirection: "column", // 이미지와 텍스트를 세로로 정렬
    alignItems: "center", // 중앙 정렬
    gap: "5px", // 이미지와 텍스트 사이의 간격
    marginTop: "10px",
  },
  locationContainer: {
    display: "flex",
    flexDirection: "column", // 이미지와 텍스트를 세로로 정렬
    alignItems: "center", // 중앙 정렬
    gap: "5px", // 이미지와 텍스트 사이의 간격
    marginTop: "10px",
  },
  containerImage: {
    width: "30px",
    height: "30px",
  },
  gradientLine: {
    height: "2px",
    background:
      "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(27,177,231,1) 50%, rgba(255,255,255,0) 100%)",
    margin: "10px 0", // Margin around the line
  },
  gradientHr: {
    height: "1px",
    background: "black", // 기본 배경 색상
    backgroundImage: "linear-gradient(to right, #eee 0%, #777 50%, #eee 100%)", // 표준 문법
  },
  activeDelete: {
    display: "block", // 토글 상태에 따라 Delete 버튼을 보이게 함
    cursor: "pointer", // 커서가 포인터 모양으로 바뀜
  },
  // 새 창고 생성하기 파트
  plusCardGrid: {
    width: "160px", // Same size as the image card
    marginRight: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 10px 0 0",
  },
  buttonCard: {
    height: "230px",
    border: "2px solid #ccc",
    width: "100%",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    fontSize: "3rem", // Slightly larger for visibility
    cursor: "pointer", // Cursor is pointer for the plus button too
  },
  // 새 창고 정보
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: "none",
    borderRadius: "8px",
    width: "80%", // Width of the modal content
    maxWidth: "500px", // Maximum width of the modal
    margin: "auto",
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },

  // PC 환경
  "@media (min-width: 960px)": {
    section: {
      padding: "70px 0",
    },
    selectContainer: {
      margin: "30px 0 0 0",
      fontWeight: "bold",
      fontSize: "24px",
    },
    container,
    marginAuto: {
      marginLeft: "auto !important",
      marginRight: "auto !important",
    },
    centerAlign: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    // 카드 grid 속성을 정하는 거시기
    cardGrid: {
      margin: "30px 0 250px 0",
      padding: "0",
      borderRadius: "20px",
      marginRight: theme.spacing(20),
      display: "flex",
      flexDirection: "column",
    },
    cardSelect: {},
    cardLink: {
      position: "relative",
      flexDirection: "column",
      height: "450px", // Total height of the card
      width: "300px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      transition: "transform 0.3s ease",
      transformOrigin: "center",
      "&:hover": {
        transform: "scale(1.2)",
        zIndex:"1200",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-2px",
        left: "-2px",
        width: "calc(100% + 4px)",
        height: "calc(100% + 4px)",
        borderRadius: "inherit",
        border: "2px solid transparent",
        boxSizing: "border-box",
        transition: "border-color 0.5s ease",
        pointerEvents: "none",
      },
      "&:hover::before": {
        animation: "$borderRainbow 0.5s forwards",
      },
    },
    "@keyframes borderRainbow": {
      "0%": { borderColor: "red" },
      "25%": { borderColor: "yellow" },
      "50%": { borderColor: "green" },
      "75%": { borderColor: "blue" },
      "100%": { borderColor: "black" },
    },

    actionButtons: {
      position: "absolute",
      top: "150px", // Position above the card
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "10px",
      zIndex: 5, // Ensure buttons appear above other elements
    },
    actionButton: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "#ffffff",
      },
    },
    // Optional: Adjust the card to have a higher z-index when clicked
    cardLinkClicked: {
      zIndex: 5,
    },
    imageCard: {
      width: "300px", // Adjusted from the original size
      border: "2px solid",
      borderRadius: "20px",
      marginRight: theme.spacing(2),
      "&:hover": {
        cursor: "pointer", // Cursor changes to pointer on hover
      },
    },
    cardImage: {
      position: "absolute",
      bottom: 0,
      width: "30%", // 이미지 너비를 30%로 조정
      height: "auto", // 높이를 자동으로 조정하여 비율 유지
      borderLeft: "4px solid #000", // 왼쪽 테두리
      borderRight: "4px solid #000", // 오른쪽 테두리
      borderTop: "4px solid #000", // 위쪽 테두리
      borderBottom: "none", // 아래쪽 테두리는 없음
    },
    cardHeader: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "33.33%", // Height set to 1/3 of the card
      backgroundColor: "rgb(27, 177, 231)", // 기본 배경 색상은 JSX에서 동적으로 설정
      position: "relative", // 이미지 포지셔닝을 위해 설정
    },
    plusCardGrid: {
      width: "30%", // Same size as the image card
      marginRight: theme.spacing(2),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0",
    },
    buttonCard: {
      height: "450px",
      border: "2px solid #ccc",
      width: "100%",
      borderRadius: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    plusButton: {
      fontSize: "3rem", // Slightly larger for visibility
      cursor: "pointer", // Cursor is pointer for the plus button too
    },
    warehouseImage: {
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
    cardBody: {
      display: "flex",
      flexDirection: "column", // 제목과 퍼센트 바를 세로로 정렬
      justifyContent: "center",
      alignItems: "center",
      height: "45%", // Height set to 1/3 of the card
    },
    cardMain: {
      width: "80%",
      height: "30px",
      backgroundColor: "lightgray",
      borderRadius: "20px",
      overflow: "hidden",
      marginTop: "10px",
      border: "2px solid #ccc",
    },
    cardProgress: {
      //일부 속성은 페이지 내에서 함수로 받아온다.(width and backgroundColor)
      height: "100%",
      display: "flex", // 플렉스 박스를 사용하여 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      color: "white", // 텍스트 색상 (배경과 대비되도록 설정)
      fontWeight: "bold", // 텍스트 굵게
    },
    usageBarContainer: {
      width: "100%",
      height: "20px",
      backgroundColor: "lightgray",
      borderRadius: "4px",
      overflow: "hidden",
      marginTop: "10px",
    },
    usageBar: {
      height: "100%",
      backgroundColor: "rgb(27, 177, 231)", // 기본 배경 색상은 JSX에서 동적으로 설정
      display: "flex", // 플렉스 박스를 사용하여 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      color: "white", // 텍스트 색상 (배경과 대비되도록 설정)
      fontWeight: "bold", // 텍스트 굵게
    },
    cardFooter: {
      display: "flex",
      justifyContent: "center", // 요소를 가운데 정렬하여 간격 줄임
      alignItems: "center", // 수직 정렬
      gap: "100px", // pcsContainer와 locationContainer 사이 간격
      height: "33.33%", // 카드의 1/3 높이
      position: "relative", // ::before 가상 요소 위치를 위해 필요
      "&::before": {
        content: '""', // 내용 없음
        position: "absolute",
        top: 0, // 상단에 위치
        left: "5%", // 가로선이 더 길어지도록 시작점을 좌측으로 이동
        width: "90%", // 가로선 길이를 카드의 90%로 설정
        height: "1px", // 가로선의 높이
        background:
          "linear-gradient(to right, rgba(128, 128, 128, 0) 0%, rgba(128, 128, 128, 1) 50%, rgba(128, 128, 128, 0) 100%)", // 양 끝이 희미해지는 회색 그라데이션
      },
    },
    pcsContainer: {
      display: "flex",
      flexDirection: "column", // 이미지와 텍스트를 세로로 정렬
      alignItems: "center", // 중앙 정렬
      gap: "5px", // 이미지와 텍스트 사이의 간격
    },
    locationContainer: {
      display: "flex",
      flexDirection: "column", // 이미지와 텍스트를 세로로 정렬
      alignItems: "center", // 중앙 정렬
      gap: "5px", // 이미지와 텍스트 사이의 간격
    },
    containerImage: {
      width: "40px",
      height: "auto",
    },
    gradientLine: {
      height: "2px",
      background:
        "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(27,177,231,1) 50%, rgba(255,255,255,0) 100%)",
      margin: "10px 0", // Margin around the line
    },
    gradientHr: {
      height: "1px",
      background: "black", // 기본 배경 색상
      backgroundImage:
        "linear-gradient(to right, #eee 0%, #777 50%, #eee 100%)", // 표준 문법
    },
    activeDelete: {
      display: "block", // 토글 상태에 따라 Delete 버튼을 보이게 함
      cursor: "pointer", // 커서가 포인터 모양으로 바뀜
    },
    // 새 창고 정보
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      outline: "none",
      borderRadius: "8px",
      width: "80%", // Width of the modal content
      maxWidth: "500px", // Maximum width of the modal
      margin: "auto",
    },
    formControl: {
      marginBottom: theme.spacing(2),
    },
  },
});

export default selectStyle;
