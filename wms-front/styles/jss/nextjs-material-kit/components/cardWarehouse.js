const cardStyle = {
  card: {
    border: "0",
    marginBottom: "30px",
    marginTop: "30px",
    borderRadius: "30px",
    color: "rgba(0, 0, 0, 0.87)",
    background: "#fff",
    width: "100%",
    boxShadow:
      "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", // 기본 그림자 설정
    position: "relative",
    display: "flex",
    flexDirection: "column",
    minWidth: "0",
    wordWrap: "break-word",
    fontSize: ".875rem",
    transition: "transform 0.3s ease, box-shadow 0.3s ease", // 부드러운 전환 효과
    transformStyle: "preserve-3d", // 3D 효과를 유지하기 위해 추가
  },
  cardPlain: {
    background: "transparent",
    boxShadow: "none",
  },
  cardCarousel: {
    overflow: "hidden",
  },
  frame: {
    perspective: "1000px", // 입체감을 위한 원근감 추가
  },
  light: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none", // 포인터 이벤트를 무시하도록 설정
  },
};

export default cardStyle;
