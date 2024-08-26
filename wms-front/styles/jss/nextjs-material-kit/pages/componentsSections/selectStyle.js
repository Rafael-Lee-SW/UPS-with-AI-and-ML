import { container } from "/styles/jss/nextjs-material-kit.js";

const selectStyle = theme => ({
  section: {
    padding: "70px 0",
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
  imageCard: {
    width: "90%", // Adjusted from the original size
    borderRadius: "20px",
    marginRight: theme.spacing(2),
    "&:hover": {
      cursor: "pointer", // Cursor changes to pointer on hover
    },
  },
  cardImage: {
    height: "400px",
    width: "100%",
    borderRadius: "20px 20px 0 0",
  },
  plusCard: {
    width: "30%", // Same size as the image card
    marginRight: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    fontSize: "3rem", // Slightly larger for visibility
    cursor: "pointer", // Cursor is pointer for the plus button too
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
  cardSelect: {
    display: "flex",
    flexDirection: "column",
    height: "450px", // Total height of the card
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "33.33%", // Height set to 1/3 of the card
    backgroundColor: "rgb(27, 177, 231)", // 기본 배경 색상은 JSX에서 동적으로 설정
    position: "relative", // 이미지 포지셔닝을 위해 설정
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
    display: "none", // 기본 상태에서는 보이지 않음
  },
  cardBody: {
    display: "flex",
    flexDirection: "column", // 제목과 퍼센트 바를 세로로 정렬
    justifyContent: "center",
    alignItems: "center",
    height: "45%", // Height set to 1/3 of the card
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
      background: "linear-gradient(to right, rgba(128, 128, 128, 0) 0%, rgba(128, 128, 128, 1) 50%, rgba(128, 128, 128, 0) 100%)", // 양 끝이 희미해지는 회색 그라데이션
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
    background: "linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(27,177,231,1) 50%, rgba(255,255,255,0) 100%)",
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
});

export default selectStyle;
