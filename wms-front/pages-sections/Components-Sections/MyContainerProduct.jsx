// MyContainerProduct.jsx
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
// 알림창을 위한 import
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Section components
import MLAnalysis from "../../components/Product/MLAnalysis";
import ImportSection from "../../components/Product/ImportSection";
import ExportSection from "../../components/Product/ExportSection"; // 사용 X
// Modal components
import MoveProduct from "../../components/Product/MoveProduct";

// Import MUI components
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
// 모달 페이지를 위한 Import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

// Import SheetJS xlsx for Excel operations
import * as XLSX from "xlsx";

// Import Handsontable plugins and cell types
import {
  AutoColumnSize,
  Autofill,
  ContextMenu,
  CopyPaste,
  DropdownMenu,
  Filters,
  HiddenRows,
  registerPlugin,
} from "handsontable/plugins";
import {
  CheckboxCellType,
  NumericCellType,
  registerCellType,
} from "handsontable/cellTypes";

// Import Handsontable and its styles
import "@handsontable/react";
import { HotTable } from "@handsontable/react";
import "pikaday/css/pikaday.css";
import "handsontable/dist/handsontable.full.css";

// Import custom hooks and callbacks
import {
  addClassesToRows,
  alignHeaders,
} from "/components/Test/hooksCallbacks.jsx";

// MUI-DataTable 관련 import
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import Chip from "@mui/material/Chip";
import { Tooltip, InputLabel, FormControl } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoveIcon from "@mui/icons-material/MoveUp";
import PrintIcon from "@mui/icons-material/Print";
import { Download } from "@mui/icons-material";

// Import Chart.js for analytics
import { Chart, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

// Register cell types and plugins
registerCellType(CheckboxCellType);
registerCellType(NumericCellType);
registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);

// 스타일 코드
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx";

const useStyles = makeStyles(styles);

// muiDatatableTheme을 미리 설정해서 불러온다.
const muiDatatableTheme = createTheme({
  components: {
    MuiTableBody: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            maxHeight: "400px !important", // Set your desired max height here
          },
        },
      },
    },
    MUIDataTable: {
      styleOverrides: {
        responsiveScroll: {
          maxHeight: "80vh !important", // Set your desired max height here
        },
      },
    },
  },
});

const MyContainerProduct = ({ storeId, stores, storeTitle }) => {
  // 라우팅, 스타일 설정
  const router = useRouter();
  const classes = useStyles();

  // Find the selected warehouse from the cards array
  const selectedWarehouse = stores.find(
    (store) => store.id === parseInt(storeId)
  );

  // If a warehouse is found, get its title
  const selectedWarehouseTitle = selectedWarehouse
    ? selectedWarehouse.title
    : "Warehouse not found";

  const notify = (message) =>
    toast(message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const [tableData, setTableData] = useState([]);;
  const hotTableRef = useRef(null); // HandsonTable 객체 참조
  const [openModal, setOpenModal] = useState(false); // 입고 모달 열기/닫기 상태
  // HandsonTable 엑셀 형식에서 수정하기 위한 Modal State
  const [openEditModal, setOpenEditModal] = useState(false); // 수정용 모달 열기/닫기
  const [editData, setEditData] = useState([]); // State to track edited data


  // 선택된 열을 추적하기 위한 State
  const [selectedRows, setSelectedRows] = useState([]);
  const [openMoveModal, setOpenMoveModal] = useState(false); // State for move modal

  const [newProductData, setNewProductData] = useState({
    barcode: "",
    name: "",
    quantity: "",
    originalPrice: "",
    salesPrice: "",
  });


  // Analytics state
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(false); // 수정필수 : true 바꿀 것
  const [notificationsFetched, setNotificationsFetched] = useState(false);
  const [analyticsFetched, setAnalyticsFetched] = useState(false);

  const [activeButton, setActiveButton] = useState(0);
  const handleButtonClick = (index) => {
    setActiveButton(index);
    handleNextComponent(index);
  };


  // 엑셀을 통해 상품 데이터를 다운로드하는 메서드
  const downloadExcel = (columns, tableData) => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      columns.map((col) => col.label),
      ...tableData,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "FIT-BOX-엑셀.xlsx");
  };


  // 루트 프린트를 위한 State
  const [printableContent, setPrintableContent] = useState({
    columns: [],
    data: [],
  });

  // 출고 프린트 모달
  const [exportPrintModalOpen, setExportPrintModalOpen] = useState(false);

  const [productColumns, setProductColumns] = useState([]);

  // 해당 매장의 모든 상품들을 가져오는 API
  const getStoreProductAPI = async () => {
    // 토큰에서 유저정보를 가져온다.(중요)
    const token = localStorage.getItem("token");

    // 로그인 여부 검증 절차
    if (!token) {
      router.push("/signIn");
      return;
    }

    console.log(token);

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/products?storeId=${storeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include the token in the Authorization header
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        //성공
        const apiConnection = await response.clone().json(); // clone the response to avoid consuming the body
        const products = apiConnection.result;

        console.log("사장님의 해당 매장 상품 데이터");
        console.log("Parsed response:", apiConnection);

        // Map backend fields to frontend fields
        const formattedData = products.map((product) => ({
          hiddenId: product.productId,
          name: product.productName,
          barcode: product.barcode,
          quantity: product.quantity,
          locationName:
            product.locationName === "00-00" ? "임시" : product.locationName,
          floorLevel: product.floorLevel,
          warehouseId: product.storeId,
          originalPrice: product.originalPrice,
          sellingPrice: product.sellingPrice,
        }));

        // Define the columns
        const formattedColumns = [
          { name: "hiddenId", label: "식별자", options: { display: false } },
          { name: "name", label: "상품명" },
          { name: "barcode", label: "바코드" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함" },
          { name: "floorLevel", label: "층수" },
          { name: "warehouseId", label: "매장" },
          { name: "originalPrice", label: "원가" },
          { name: "sellingPrice", label: "판매가" },
        ];

        // Prepare the data for Handsontable
        const data = formattedData.map((product) => [
          product.hiddenId,
          product.name,
          product.barcode,
          product.quantity,
          product.locationName,
          product.floorLevel,
          product.warehouseId,
          product.originalPrice,
          product.sellingPrice,
        ]);

        setProductColumns(formattedColumns);
        setTableData(data);
        setEditData(data); // 둘을 분리할 필요가 있을까?
        setLoading(false);
      } else {
        //에러
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      //에러
      setLoading(false);
    }
  };

  const [allChangingTableData, setAllChangingTableData] = useState([]);
  const [allChangingTableColumns, setAllChangingTableColumns] = useState([]);

  // 영어-한글 변환 - 입고-출고-이동
  const translationMap = {
    IMPORT: "입고",
    EXPORT: "출고",
    FLOW: "이동",
  };

  // 알림 API - 신버젼
  const getNotificationsAPI = async () => {
    // 토큰에서 유저정보를 가져온다.(중요)
    const token = localStorage.getItem("token");

    // 로그인 여부 검증 절차
    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/notifications/${storeId}/PRODUCT_FLOW`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include the token in the Authorization header
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(true);

      if (response.ok) {
        //성공
        const apiConnection = await response.clone().json(); // clone the response to avoid consuming the body
        const products = apiConnection.result;

        console.log("알림 내역");
        console.log("Parsed response:", apiConnection);

        setLoading(false)
      } else {
        //에러
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      //에러
      setLoading(false);
    }
  };

  // 알림 API - 구버젼
  // const getNotificationsAPI_old = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://j11a302.p.ssafy.io/api/products/notification?businessId=${businessId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       const apiConnection = await response.json();
  //       const { productFlowResponseDtos, expirationProductResponseDtos } =
  //         apiConnection.result;

  //       // Combine all notifications
  //       const combinedData = [...productFlowResponseDtos];

  //       // Sort combined data by date
  //       const sortedData = combinedData.sort(
  //         (a, b) => new Date(a.date) - new Date(b.date)
  //       );

  //       // Set the detailed data state
  //       setDetailedData(sortedData);

  //       // Map to formatted data for initial display
  //       const formattedData = sortedData.map((item) => {
  //         // Determine the content for the 'trackingNumber' field based on 'productFlowType'
  //         let trackingOrNote = "";
  //         if (item.productFlowType === "EXPORT") {
  //           trackingOrNote = item.trackingNumber || "송장없음";
  //         } else if (item.productFlowType === "IMPORT") {
  //           trackingOrNote = "입고품목";
  //         } else if (item.productFlowType === "FLOW") {
  //           trackingOrNote = "이동품목";
  //         }

  //         return {
  //           date: new Date(item.date).toLocaleDateString(),
  //           type: translationMap[item.productFlowType] || item.productFlowType, // Translate type
  //           barcode: item.barcode,
  //           name: item.name,
  //           quantity: item.quantity,
  //           locationName: item.currentLocationName,
  //           floorLevel: item.currentFloorLevel,
  //           trackingOrNote, // Use the new variable here
  //         };
  //       });

  //       setAllChangingTableData(formattedData);

  //       setAllChangingTableColumns([
  //         { name: "date", label: "날짜" },
  //         { name: "type", label: "유형" },
  //         { name: "barcode", label: "바코드" },
  //         { name: "name", label: "상품명" },
  //         { name: "quantity", label: "수량" },
  //         { name: "locationName", label: "적재함" },
  //         { name: "floorLevel", label: "층수" },
  //         { name: "trackingOrNote", label: "송장번호/비고" },
  //       ]);

  //       // Precompute flow by date data
  //       const flowData = sortedData.reduce((acc, item) => {
  //         const dateKey = new Date(item.date).toLocaleDateString();
  //         if (!acc[dateKey]) {
  //           acc[dateKey] = { import: 0, export: 0, flow: 0 };
  //         }
  //         if (item.productFlowType === "IMPORT") {
  //           acc[dateKey].import += item.quantity;
  //         } else if (item.productFlowType === "EXPORT") {
  //           acc[dateKey].export += item.quantity;
  //         } else {
  //           acc[dateKey].flow += item.quantity;
  //         }
  //         return acc;
  //       }, {});

  //       const flowLabels = Object.keys(flowData);
  //       const importData = flowLabels.map((label) => flowData[label].import);
  //       const exportData = flowLabels.map((label) => flowData[label].export);
  //       const flowDataValues = flowLabels.map((label) => flowData[label].flow);

  //       setFlowByDateData({
  //         labels: flowLabels,
  //         datasets: [
  //           {
  //             label: translationMap["IMPORT"],
  //             data: importData,
  //             backgroundColor: "rgba(54, 162, 235, 0.2)",
  //             borderColor: "rgba(54, 162, 235, 1)",
  //             borderWidth: 1,
  //           },
  //           {
  //             label: translationMap["EXPORT"],
  //             data: exportData,
  //             backgroundColor: "rgba(255, 99, 132, 0.2)",
  //             borderColor: "rgba(255, 99, 132, 1)",
  //             borderWidth: 1,
  //           },
  //           {
  //             label: translationMap["FLOW"],
  //             data: flowDataValues,
  //             backgroundColor: "rgba(153, 102, 255, 0.2)",
  //             borderColor: "rgba(153, 102, 255, 1)",
  //             borderWidth: 1,
  //           },
  //         ],
  //       });
  //       setNotificationsFetched(true);
  //       setAnalyticsFetched(true);
  //       //알림 호출 성공

  //       /**
  //        * 알림을 정리해서 날짜별로 분류하는 부분
  //        */

  //       // Group data by date and type
  //       const groupedData = sortedData.reduce((acc, item) => {
  //         const dateKey = new Date(item.date).toLocaleDateString();
  //         const typeKey =
  //           translationMap[item.productFlowType] || item.productFlowType;
  //         const key = `${dateKey}-${typeKey}`;

  //         if (!acc[key]) {
  //           acc[key] = {
  //             date: dateKey,
  //             type: typeKey,
  //             count: 0,
  //           };
  //         }

  //         acc[key].count += 1;
  //         return acc;
  //       }, {});

  //       // Format grouped data for table display
  //       const SameformattedData = Object.values(groupedData).map((entry) => ({
  //         date: entry.date,
  //         type: entry.type,
  //         count: entry.count,
  //       }));

  //       setNotificationTableData(SameformattedData);
  //       setNotificationTableColumns([
  //         { name: "date", label: "날짜" },
  //         { name: "type", label: "유형" },
  //         { name: "count", label: "수량" },
  //       ]);

  //       // 알림 호출 완료
  //     } else {
  //       // 에러
  //       setNotificationsFetched(true);
  //       setAnalyticsFetched(true);
  //     }
  //   } catch (error) {
  //     // 에러
  //     setNotificationsFetched(true);
  //     setAnalyticsFetched(true);
  //   }
  // };

  // 변동 내역 / 알림함에서 쓰이는 data Table state
  const [notificationTableColumns, setNotificationTableColumns] = useState([]);
  const [notificationTableData, setNotificationTableData] = useState([]);

  // 알림 상세에 쓰이는 것들
  const [notificationDetailTableColumns, setNotificationDetailTableColumns] =
    useState([]);
  const [notificationDetailTableData, setNotificationDetailTableData] =
    useState([]);

  // 알림함에서 상세 내역을 보기 위해 해당 열을 클릭했을 시에 작동하는 메서드
  const handleRowClick = (rowData) => {
    const [selectedDate, selectedType] = rowData;

    let transType;
    if (selectedType === "입고") {
      transType = "IMPORT";
    } else if (selectedType === "출고") {
      transType = "EXPORT";
    } else if (selectedType === "이동") {
      transType = "FLOW";
    } else {
      transType = selectedType;
    }

    // Filter detailed data for the selected date and type
    const filteredData = detailedData.filter(
      (item) =>
        new Date(item.date).toLocaleDateString() === selectedDate &&
        item.productFlowType === transType
    );

    // Define columns for the detailed view
    const detailedColumns = [
      { name: "date", label: "날짜" },
      { name: "type", label: "유형" },
      { name: "barcode", label: "바코드" },
      { name: "name", label: "상품명" },
      { name: "quantity", label: "수량" },
      { name: "locationName", label: "적재함" },
      { name: "floorLevel", label: "층수" },
      { name: "trackingNumber", label: "송장번호" },
    ];

    // Map filtered data to the table format
    const formattedData = filteredData.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      type: translationMap[item.productFlowType] || item.productFlowType, // Translate type
      barcode: item.barcode,
      name: item.name,
      quantity: item.quantity,
      locationName: item.currentLocationName,
      floorLevel: item.currentFloorLevel,
      trackingNumber: item.trackingNumber,
    }));

    // Update table with detailed data
    setNotificationDetailTableData(formattedData);
    setNotificationDetailTableColumns(detailedColumns);
    setCurrentIndex(4);
  };

  // 상품 정보를 수정하는 API 호출 메서드
  const productEditAPI = async (productsArray) => {
    setLoading(true);
    try {
      const response = await fetch(`https://j11a302.p.ssafy.io/api/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productsArray),
      });

      if (response.ok) {
        setLoading(false);
        // 수정 성공
        getStoreProductAPI();
        notify(`데이터를 수정하였습니다.`);
        handleNextComponent(0);
      } else {
        notify(`수정에 실패했습니다.`);
        handleNextComponent(0);
      }
    } catch (error) {
      notify(`수정에 실패했습니다.`);
      handleNextComponent(0);
    }
  };

  // 수정된 상품 정보를 저장하고 이를 API로 반복호출하는 메서드
  const handleSaveEdits = () => {
    const hotInstance = hotTableRef.current.hotInstance;
    const updatedData = hotInstance.getData();

    // 수정을 위한 데이터를 updatedData를 통해 가져온다.
    const productsArray = updatedData.map((row) => ({
      productId: String(row[0]), // Get From HiddenId
      locationName: row[4] !== "임시" ? row[4] : "00-00",
      floorLevel: String(row[5]),
      productRequestDto: {
        name: row[1],
        barcode: row[2],
        quantity: row[3],
        expirationDate: row[6] === "없음" ? null : row[6],
        warehouseId: parseInt(row[7]),
      },
    }));

    // Send the array of products to the API
    productEditAPI(productsArray);

    // Use router.replace with shallow routing
    router.replace(
      {
        pathname: `/user/${storeId}`,
        query: { component: "product" },
      },
      undefined,
      { shallow: true }
    );

    setOpenEditModal(false); // Close modal after saving
  };

  // 이동하기 모달을 여는 함수
  const handleMoveButtonClick = () => {
    setOpenMoveModal(true);
  };


  // 선택 시에 테이블이 바뀐다.
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이동 테이블을 위한 옵션
  const moveOptions = {
    textLabels: {
      body: {
        noMatch: "데이터가 없습니다.",
      },
      selectedRows: {
        text: "행이 선택되었습니다", // Change this to your desired text
      },
    },
    responsive: "scroll",
    viewColumns: false,
    download: false,
    print: false, // Disable default print
    selectableRows: "multiple", // Enable checkboxes for moving products
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected.map((row) => row.dataIndex));
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <div>
        <Tooltip title="이동">
          <IconButton onClick={handleMoveButtonClick}>
            <MoveIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  };

  // 기본적으로 프린트와 다운로드가 되는 옵션
  const listOptions = {
    fixedHeader: true,
    filterType: "multiselect",
    responsive: "scroll",
    download: false,
    print: false, // Disable default print
    viewColumns: true,
    filter: true,
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 10,
    pagination: true,
    rowsPerPageOptions: [10, 30, 60, 100, 10000],
    textLabels: { body: { noMatch: "데이터가 없습니다." } },

    // Custom toolbar with custom print button
    customToolbar: () => {
      return (
        <React.Fragment>
          <Tooltip title="Print">
            <IconButton onClick={() => setPrintModalOpen(true)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              onClick={() => downloadExcel(productColumns, tableData)}
            >
              <Download />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      );
    },
  };

  const importExportOptions = {
    onRowClick: (rowData) => handleRowClick(rowData), // Handle row click

    filterType: "multiselect",
    responsive: "scroll",
    download: false,
    print: false, // Disable default print
    viewColumns: true,
    filter: true,
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 10,
    pagination: true,
    rowsPerPageOptions: [10, 30, 60, 100, 10000],
    textLabels: { body: { noMatch: "알림이 없습니다." } },
    // Custom toolbar with custom print button
    customToolbar: () => {
      return (
        <React.Fragment>
          <Tooltip title="Print">
            <IconButton onClick={() => setPrintModalOpen(true)}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              onClick={() => downloadExcel(productColumns, tableData)}
            >
              <Download />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      );
    },
  };

  // 컴포넌트 행렬
  const componentsArray = [
    // Index 0: 상품 목록
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="productList"
        title={"상품 목록"}
        data={tableData}
        columns={productColumns}
        options={listOptions}
      />
    </ThemeProvider>,
    // Index 1: 입고하기
    <ImportSection
      key="importSection"
      storeId={storeId}
      notify={notify}
      refreshData={getStoreProductAPI}
    />,
    // Index 2: 결제내역
    <div>
      <h2> Not now </h2>
    </div>
    ,
    // Index 3: 이동하기
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="moveProductList"
        title={"상품 이동하기"}
        data={tableData}
        columns={productColumns}
        options={moveOptions}
      />
    </ThemeProvider>,
    // Index 4: 변동내역
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="notificationList"
        title={"모든 변동 내역"}
        data={allChangingTableData}
        columns={allChangingTableColumns}
        options={listOptions}
      />
    </ThemeProvider>,
    // Index 5: ML분석
    <MLAnalysis key="mlAnalysis" />,
    // Index 6: 알림함
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="dateTypeList"
        title={"알림함"}
        data={notificationTableData}
        columns={notificationTableColumns}
        options={importExportOptions}
      />
    </ThemeProvider>,
    // Index 7: 알림 상세 내역
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="selectedNotificationList"
        title={"알림 상세 내역"}
        data={notificationDetailTableData}
        columns={notificationDetailTableColumns}
        options={listOptions}
      />
    </ThemeProvider>,
  ];


  // 해당하는 Section Table을 보여준다.
  const handleNextComponent = async (index) => {
    if (index === 2 && !notificationsFetched) {
      // Show loading if notifications not yet fetched and user enters '변동내역'
      setLoading(true);
      try {
        await getNotificationsAPI(); // 새로운 알림 API 들어와야 함
        setNotificationsFetched(true);
      } catch (error) {
        //에러
      } finally {
        setLoading(false);
        setCurrentIndex(index);
      }
    } else if ((index === 3 || index === 5) && !analyticsFetched) {
      // Show loading if analytics not yet fetched and user enters '알림함' or '분석'
      setLoading(true);
      try {
        await getNotificationsAPI(); // 새로운 알림 API 들어와야 함
        setAnalyticsFetched(true);
      } catch (error) {
        // 에러
      } finally {
        setLoading(false);
        setCurrentIndex(index);
        setShowAnalytics(index === 5);
      }
    } else {
      setCurrentIndex(index);
      setShowAnalytics(index === 5);
    }
  };


  // Printing logic
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const PrintableTable = ({ columns, data }) => (
    <div style={{ padding: "20px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                  backgroundColor: "#f2f2f2",
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

/**
 * UseEffect Part
 */
  // 재고 목록을 불러온다.
  useEffect(() => {
    getStoreProductAPI(); // 실행되면서 같이 부른다.
    // openModal 기점으로 함으로써 변동 내역이 생길 때마다 불러온다.
  }, [openModal]);

// 프린트 모달을 위한 UseEffect
  useEffect(() => {
    if (printModalOpen) {
      const timer = setTimeout(() => {
        window.print();
        setPrintModalOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printModalOpen]);
  useEffect(() => {
    if (exportPrintModalOpen) {
      const timer = setTimeout(() => {
        window.print();
        setExportPrintModalOpen(false);
        notify(`출고처리가 완료되었습니다.`);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [exportPrintModalOpen]);


  return (
    <div className={classes.productContainer}>
      <div className={classes.leftsidebar}>
        <div className={classes.topButtonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(0);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 0,
            })}
          >
            제품 목록
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(1);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 1,
            })}
          >
            입고하기
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(2);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 2,
            })}
          >
            결제내역
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(3);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 3,
            })}
          >
            이동하기
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(4);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 4,
            })}
          >
            변동내역
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(5);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 5,
            })}
          >
            ML분석
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(6);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 6,
            })}
          >
            알림함
          </Button>
        </div>
      </div>
      {/* 모달들 */}
      {/* 상품 데이터 수정 Modal */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>데이터를 수정하고 저장하세요.</DialogTitle>
        <DialogContent>
          <HotTable
            height={600}
            ref={hotTableRef}
            data={editData}
            colWidths={[
              `120vw`,
              `130vw`,
              `130vw`,
              `130vw`,
              `130vw`,
              `130vw`,
              `130vw`,
            ]}
            colHeaders={productColumns.map((col) => col.label)}
            dropdownMenu={true}
            hiddenColumns={{
              columns: [0], // Hide the first column (hiddenId) during editing
              indicators: true,
            }}
            contextMenu={true}
            multiColumnSorting={true}
            filters={true}
            rowHeaders={true}
            autoWrapCol={true}
            autoWrapRow={true}
            afterGetColHeader={alignHeaders}
            beforeRenderer={addClassesToRows}
            manualRowMove={true}
            navigableHeaders={true}
            licenseKey="non-commercial-and-evaluation"
          />
        </DialogContent>
        <DialogActions>
          <Button className={classes.importButton} onClick={handleSaveEdits}>
            저장하기
          </Button>
          <Button
            className={classes.importButton}
            onClick={() => setOpenEditModal(false)}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      {/* 상품 이동 Modal */}
      <MoveProduct
        open={openMoveModal}
        onClose={() => setOpenMoveModal(false)}
        selectedRows={selectedRows}
        tableData={tableData}
        stores={stores}
        getStoreProductAPI={getStoreProductAPI}
        notify={notify}
      />
      {/* 일반 프린트 Print Modal */}
      <Dialog
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        fullScreen
      >
        <DialogContent>
          <PrintableTable columns={productColumns} data={tableData} />
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.printButton}
            onClick={() => setPrintModalOpen(false)}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* 출고 목록 프린트 Print Modal */}
      <Dialog
        open={exportPrintModalOpen}
        onClose={() => setExportPrintModalOpen(false)}
        fullScreen
      >
        <DialogContent>
          <PrintableTable
            columns={printableContent.columns}
            data={printableContent.data}
          />
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.printButton}
            onClick={() => setExportPrintModalOpen(false)}
            autoFocus
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
      {/* Section 시작 */}
      <div className={classes.baseSection}>
        <Grid item xs={12} style={{ width: "100%" }}>
          {/* 메인 영역 */}
          {currentIndex >= 0 && componentsArray[currentIndex]}
        </Grid>
      </div>
    </div>
  );
};

export default MyContainerProduct;
