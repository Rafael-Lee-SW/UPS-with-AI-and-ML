// styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx

// 해당 파일의 스타일은 각 Components의 Style 파일로 옮겨질 여지가 있으며,
// 혹은 해당 파일을 공유하여 원하는 CSS만 뽑아서 쓸 수도 있음

const ProductStyles = {
  productContainer: {
    marginTop: "3rem",
    display: "flex",
  },
  //좌측 사이드바(left sidebar)
  leftsidebar: {
    position: "absolute",
    width: "200px",
    height: "80vh",
    marginRight: "5px",
    padding: "15px",
    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f7f7f7", // Soft background color
    borderRadius: "8px", // Rounded corners
    top: "10vh", // Slight padding from the top of the viewport
    left: "90px", // Align it to the left of the viewport
    overflow: "auto",
    zIndex: 1000, // Ensure it stays above other content
  },
  topButtonContainer: {
    marginBottom: "10px",
    marginTop: "10vh",
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: "10px",
    textAlign: "center",
  },
  // 선택되기 이전 상태
  sidebarButton: {
    width: "70%",
    backgroundColor: "transparent", // Default inactive background
    color: "#7D4A1A",
    outline: "1px solid #7D4A1A",
  },
  //선택된 버튼
  activeButton: {
    backgroundColor: "#7D4A1A",
    color: "white",
    outline: "none",
  },

  /**
   * 입고하기 Modal 스타일
   * 출고하기 Modal 스타일
   */
  importButton: {
    color: "#7D4A1A",
  },

  /**
   * 이동하기 Modal 스타일
   */
  // 각각 옮기기 모드에서 각 상품별로 찢는 dv
  eachProductMove: {
    marginBottom: "20px",
  },
  movbeButton: {
    color: "#7D4A1A",
  },

  /**
   * 프린트 Modal 스타일
   */
  printButton: {
    color: "#7D4A1A",
  },

  // loading 로딩 스타일
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

  // 여기부터 Section Style
  baseSection: {
    display: "flex",
    width: "100%",
    margin: "0 0 0 200px",
    height: "85vh",
  },

  /**
   * 입고하기 Section
   */

  importSection: {
    width: "100%",
    marginRight: "20px",
  },
  importProduct: {
    padding: "1rem",
  },
  importingTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tdImportingTable: {
    padding: "8px",
  },
  tdImportingTableExpire: {
    paddingTop: "51px",
  },
  // Global Button Style
  buttonStyle: {
    backgroundColor: "#C2B6A1",
    width: "100px",
    color: "white ",
    marginTop: "5px",
    height: "55px",
    borderRadius: "4px",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "#C2B6A1",
      color: "white",
    },
  },
  importingButton: {
    backgroundColor: "#C2B6A1",
    width: "100px",
    color: "white ",
    marginTop: "5px",
    height: "55px",
    borderRadius: "4px",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: "#C2B6A1",
      color: "white",
    },
    marginRight: "10px",
    height: "40px",
    textAlign: "center",
  },
  expectedImportList: {
    width: "100%",
    height: "75vh",
    padding: "1rem",
    overflow: "auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
  },
  expectedImportTable: {
    width: "100%",
    borderCollapse: "collapse",
  },
  thExpectedImportTable: {
    borderBottom: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
  thExpectedImportTable: {
    padding: "8px",
  },

  /**
   * Mobile 모바일 환경
   */
  "@media (max-width: 960px)": {
    
    productContainer: {
      marginTop: "3rem",
      display: "flex",
    },
    //좌측 사이드바(left sidebar)
    leftsidebar: {
      position: "absolute",
      width: "140px",
      height: "90vh",
      marginRight: "0px",
      padding: "15px",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f7f7f7", // Soft background color
      borderRadius: "8px", // Rounded corners
      top: "10vh", // Slight padding from the top of the viewport
      left: "0px", // Align it to the left of the viewport
      overflow: "auto",
      zIndex: 1000, // Ensure it stays above other content
    },
    topButtonContainer: {
      marginBottom: "10px",
      marginTop: "0vh",
      textAlign: "center",
    },
    buttonContainer: {
      marginBottom: "10px",
      textAlign: "center",
    },
    // 선택되기 이전 상태
    sidebarButton: {
      width: "100%",
      backgroundColor: "transparent", // Default inactive background
      color: "#7D4A1A",
      outline: "1px solid #7D4A1A",
    },
    //선택된 버튼
    activeButton: {
      backgroundColor: "#7D4A1A",
      color: "white",
      outline: "none",
    },

    /**
     * 입고하기 Modal 스타일
     * 출고하기 Modal 스타일
     */
    importButton: {
      color: "#7D4A1A",
    },

    /**
     * 이동하기 Modal 스타일
     */
    // 각각 옮기기 모드에서 각 상품별로 찢는 dv
    eachProductMove: {
      marginBottom: "20px",
    },
    movbeButton: {
      color: "#7D4A1A",
    },

    /**
     * 프린트 Modal 스타일
     */
    printButton: {
      color: "#7D4A1A",
    },

    // loading 로딩 스타일
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

    // 여기부터 Section Style
    baseSection: {
      display: "flex",
      width: "100%",
      margin: "0 0 0 150px",
      height: "85vh",
    },
    /**
     * 입고하기 Section
     */
    importSection: {
      width: "100%",
      marginRight: "20px",
    },
    importProduct: {
      padding: "1rem",
    },
    importingTable: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tdImportingTable: {
      padding: "8px",
    },
    tdImportingTableExpire: {
      paddingTop: "51px",
    },
    // Global Button Style
    buttonStyle: {
      backgroundColor: "#C2B6A1",
      width: "100px",
      color: "white ",
      marginTop: "5px",
      height: "55px",
      borderRadius: "4px",
      "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "#C2B6A1",
        color: "white",
      },
    },
    importingButton: {
      backgroundColor: "#C2B6A1",
      width: "100px",
      color: "white ",
      marginTop: "5px",
      height: "55px",
      borderRadius: "4px",
      "&:hover": {
        transform: "scale(1.05)",
        backgroundColor: "#C2B6A1",
        color: "white",
      },
      marginRight: "10px",
      height: "40px",
      textAlign: "center",
    },
    expectedImportList: {
      width: "100%",
      height: "75vh",
      padding: "1rem",
      overflow: "auto",
      border: "1px solid #ddd",
      borderRadius: "8px",
    },
    expectedImportTable: {
      width: "100%",
      borderCollapse: "collapse",
    },
    thExpectedImportTable: {
      borderBottom: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
    },
    thExpectedImportTable: {
      padding: "8px",
    },
  },
};

export default ProductStyles;
