// MyContainerProduct.jsx
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
// 알림창을 위한 import
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Section components
import ImportSection from "../../components/Product/ImportSection";
import ExportSection from "../../components/Product/ExportSection"; // 사용 X
import PaymentRecord from "../../components/Product/PaymentRecord";
// 분석을 위한 Import
import ProductAnalysis from "../../components/Product/ProductAnalysis";
import Reports from "../../components/Product/Reports";
import allowedBarcodes from "../../components/Product/allowedBarcodes";
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
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";

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

  const [tableData, setTableData] = useState([]);
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

  // 선택된 상품의 바코드를 저장한다.
  const [selectedProductBarcode, setSelectedProductBarcode] = useState(null);

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

        // Map backend fields to frontend fields
        const formattedData = products.map((product) => ({
          hiddenId: product.productId,
          name: product.productName,
          barcode: product.barcode,
          quantity: product.quantity,
          locationName:
            product.locationName === "00-00" ? "임시" : product.locationName,
          floorLevel: product.floorLevel === -1 ? "임시" : product.floorLevel,
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
      //에러
      setLoading(false);
    }
  };

  const [allChangingTableData, setAllChangingTableData] = useState([]);
  const [allChangingTableColumns, setAllChangingTableColumns] = useState([]);
  // Store the selected product data
  const [selectedProduct, setSelectedProduct] = useState(null);
  // 제품목록에서 클릭함에 따라 API를 불러오는 거시기
  const handleProductRowClick = (rowData, rowMeta) => {
    const rowIndex = rowMeta.dataIndex;
    const productRow = tableData[rowIndex];
    const barcode = productRow[2]; // Assuming the barcode is at index 2 in tableData

    // Remove any '.0' at the end if present
    let barcodeStr = barcode.toString();
    if (barcodeStr.endsWith(".0")) {
      barcodeStr = barcodeStr.slice(0, -2);
    }

    if (allowedBarcodes.includes(barcodeStr)) {
      // Store the entire selected product
      const product = {
        hiddenId: productRow[0],
        name: productRow[1],
        barcode: barcodeStr,
        quantity: productRow[3],
        locationName: productRow[4],
        floorLevel: productRow[5],
        warehouseId: productRow[6],
        originalPrice: productRow[7],
        sellingPrice: productRow[8],
      };

      // Set the selected product and proceed to analysis
      setSelectedProduct(product);
      setSelectedProductBarcode(barcodeStr);
      setCurrentIndex(8); // Assuming the analysis component is at index 8
    } else {
      notify("최소 1달 이상의 판매데이터가 필요합니다.");
    }
  };

  // 알림 API - 신버젼
  /**
   * Fetch notifications from the backend using the updated API
   */
  const [detailedData, setDetailedData] = useState([]);

  const getNotificationsAPI = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      setLoading(true);
      // Build the query parameters
      let query = `?storeId=${storeId}`;

      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/notifications${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const notifications = apiConnection.result;

        // 알림함에 넣기 위한 정제과정
        const formattedNotifications = notifications.map((notification) => ({
          id: notification.id,
          date: notification.createdDate
            ? new Date(notification.createdDate).toLocaleDateString()
            : "N/A",
          type: mapEnumToKorean(notification.notificationTypeEnum),
          message: notification.message,
          isRead: notification.isRead ? "읽음" : "안읽음",
          isImportant: notification.isImportant ? "중요" : "",
        }));

        // Store notifications in state
        setDetailedData(formattedNotifications);

        // 알림 상세 내역에 대한 설정
        setNotificationTableData(formattedNotifications);
        setNotificationTableColumns([
          { name: "id", label: "ID", options: { display: false } },
          { name: "date", label: "날짜" },
          { name: "type", label: "유형" },
          { name: "message", label: "메시지" },
          { name: "isRead", label: "읽음 여부" },
          {
            name: "isImportant",
            label: "중요 여부",
            options: { display: false },
          },
        ]);

        setLoading(false);
      } else {
        // Handle error
        setLoading(false);
        notify("알림을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      setLoading(false);
      notify("알림을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 선택된 알림
  const [selectedNotificationInfo, setSelectedNotificationInfo] =
    useState(null);
  //해당 알림에 대한 상세 내역 불러오기
  const fetchDetailedNotification = async (notificationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/product-flows/batch?notificationId=${notificationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const productFlows = apiConnection.result;

        // Map productFlows to a format suitable for the table
        const formattedProductFlows = productFlows.map((flow) => ({
          productName: flow.productName,
          barcode: flow.barcode,
          quantity: flow.quantity,
          previousLocationName: flow.previousLocationName,
          previousFloorLevel:
            flow.previousFloorLevel === -1 ? "임시" : flow.previousFloorLevel,
          presentLocationName: flow.presentLocationName,
          presentFloorLevel:
            flow.presentFloorLevel === -1 ? "임시" : flow.presentFloorLevel,
          productFlowType: mapEnumToKorean(flow.productFlowTypeEnum),
          storeName: flow.storeName,
        }));

        // Set notificationDetailTableData and columns
        setNotificationDetailTableData(formattedProductFlows);
        setNotificationDetailTableColumns([
          { name: "productName", label: "상품명" },
          { name: "barcode", label: "바코드" },
          { name: "quantity", label: "수량" },
          { name: "previousLocationName", label: "이전 위치" },
          { name: "previousFloorLevel", label: "이전 층수" },
          { name: "presentLocationName", label: "현재 위치" },
          { name: "presentFloorLevel", label: "현재 층수" },
          { name: "productFlowType", label: "유형" },
          { name: "storeName", label: "매장 이름" },
        ]);

        // Move to the detailed notification component
        setCurrentIndex(7); // Assuming index 7 is the detailed notification component
        setLoading(false);
      } else {
        // Handle error
        setLoading(false);
        notify("상세 정보를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      setLoading(false);
      notify("상세 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };
  // 알림을 읽으면 자동으로 읽음 처리하기 위한 수정 API
  const updateNotificationIsRead = async (notificationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      const requestBody = [
        {
          notificationId: notificationId,
          isRead: true,
          isImportant: false, // You can set this based on your needs
        },
      ];

      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/notifications/batch`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        // Update the local state to reflect the change
        setNotificationTableData((prevData) =>
          prevData.map((item) =>
            item.id === notificationId ? { ...item, isRead: "읽음" } : item
          )
        );
      } else {
      }
    } catch (error) {
    }
  };

  // 변동 내역 / 알림함에서 쓰이는 data Table state
  const [notificationTableColumns, setNotificationTableColumns] = useState([]);
  const [notificationTableData, setNotificationTableData] = useState([]);

  // 알림 상세에 쓰이는 것들
  const [notificationDetailTableColumns, setNotificationDetailTableColumns] =
    useState([]);
  const [notificationDetailTableData, setNotificationDetailTableData] =
    useState([]);

  /**
   * 알림함에서 상세 내역을 조회할 때 사용되는 것들
   */
  const handleRowClick = (rowData, rowMeta) => {
    const rowIndex = rowMeta.dataIndex;
    const notification = notificationTableData[rowIndex];
    const notificationId = notification.id;

    // Store the notification's type and date
    setSelectedNotificationInfo({
      type: notification.type,
      date: notification.date,
    });

    // Check if the notification is unread
    if (notification.isRead === "안읽음") {
      updateNotificationIsRead(notificationId);
    }

    // Fetch detailed data for this notification
    fetchDetailedNotification(notificationId);
  };

  /**
   * 상품 정보 수정
   */

  const handleEditButtonClick = () => {
    setEditData(tableData); // Use the current table data for editing
    setOpenEditModal(true);
  };

  // 상품 정보를 수정하는 API 호출 메서드
  const productEditAPI = async (productsArray) => {
    const token = localStorage.getItem("token");

    setLoading(true);
    try {
      const response = await fetch(`https://j11a302.p.ssafy.io/api/products`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productsArray),
      });

      if (response.ok) {
        setLoading(false);
        getStoreProductAPI(); // Refresh data
        notify(`데이터를 수정하였습니다.`);
      } else {
        setLoading(false);
        notify(`수정에 실패했습니다.`);
      }
    } catch (error) {
      setLoading(false);
      notify(`수정에 실패했습니다.`);
    }
  };

  // 수정된 상품 정보를 저장하고 이를 API로 반복호출하는 메서드
  const handleSaveEdits = () => {
    const hotInstance = hotTableRef.current.hotInstance;
    const updatedData = hotInstance.getData();

    // Prepare the data for the API
    const productsArray = updatedData.map((row) => ({
      productId: row[0],
      barcode: row[2],
      productName: row[1],
      quantity: row[3],
      locationName: row[4] !== "임시" ? row[4] : "00-00",
      floorLevel: row[5],
      originalPrice: row[7],
      sellingPrice: row[8],
    }));

    // Call the API to update products
    productEditAPI(productsArray);

    setOpenEditModal(false);
  };

  /**
   * 상품 삭제 API
   */

  const deleteProductsAPI = async (productIds) => {
    const token = localStorage.getItem("token");

    setLoading(true);
    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/products/batch?productIdList=${productIds.join(
          ","
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setLoading(false);
        getStoreProductAPI(); // Refresh data
        notify(`선택한 상품을 삭제하였습니다.`);
        setDeleteMode(false);
      } else {
        setLoading(false);
        notify(`상품 삭제에 실패했습니다.`);
      }
    } catch (error) {
      setLoading(false);
      notify(`상품 삭제 중 오류가 발생했습니다.`);
    }
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
            이동
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
          <Tooltip title="Edit">
            <IconButton onClick={handleEditButtonClick}>
              <EditIcon />
            </IconButton>
          </Tooltip>
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
          <Tooltip title="Delete">
            <IconButton
              onClick={handleDeleteModeToggle}
              style={{ color: deleteMode ? "red" : "inherit" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      );
    },
  };

  // 분석을 위한
  const productListOptions = {
    ...listOptions,
    onRowClick: handleProductRowClick,
  };

  const importExportOptions = {
    onRowClick: handleRowClick, // Handle row click
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
              onClick={() =>
                downloadExcel(notificationTableColumns, notificationTableData)
              }
            >
              <Download />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      );
    },
  };

  const [deleteMode, setDeleteMode] = useState(false);

  const handleDeleteModeToggle = () => {
    setDeleteMode(!deleteMode);
    setSelectedRows([]); // Clear any selected rows
  };

  const deleteOptions = {
    ...listOptions,
    selectableRows: "multiple",
    onRowSelectionChange: (currentRowsSelected, allRowsSelected) => {
      setSelectedRows(allRowsSelected.map((row) => row.dataIndex));
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <div>
        <Tooltip title="Delete Selected">
          <IconButton onClick={handleDeleteSelected}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  };
  const handleDeleteSelected = () => {
    const productIdsToDelete = selectedRows.map(
      (rowIndex) => tableData[rowIndex][0]
    ); // Assuming the first column is the product ID

    deleteProductsAPI(productIdsToDelete);
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
        options={deleteMode ? deleteOptions : productListOptions}
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
    <PaymentRecord key="PaymentRecord" storeId={storeId} notify={notify} />,
    // Index 3: 이동하기
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="moveProductList"
        title={"상품 이동하기 - (이동할 상품을 선택하세요)"}
        data={tableData}
        columns={productColumns}
        options={moveOptions}
      />
    </ThemeProvider>,
    // Index 4: 변동내역
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="changeHistory"
        title={"모든 변동 내역"}
        data={allChangingTableData}
        columns={allChangingTableColumns}
        options={listOptions}
      />
    </ThemeProvider>,
    // Index 5: ML분석
    <Reports key="reports" />,
    // Index 6: 알림함
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="dateTypeList"
        title={"알림함 - 원하는 알림을 눌러 상세내역을 확인하세요"}
        data={notificationTableData}
        columns={notificationTableColumns}
        options={importExportOptions}
      />
    </ThemeProvider>,
    // Index 7: 알림 상세 내역
    <div key="notificationDetails">
      <Button
        variant="contained"
        onClick={() => {
          setSelectedNotificationInfo(null);
          setCurrentIndex(6);
        }}
        className={classes.backButton}
      >
        알림 목록으로 돌아가기
      </Button>
      {selectedNotificationInfo && (
        <div className={classes.notificationInfo}>
          <h2>{selectedNotificationInfo.type}</h2>
          <p>{selectedNotificationInfo.date}</p>
        </div>
      )}
      <ThemeProvider theme={muiDatatableTheme}>
        <MUIDataTable
          key="selectedNotificationList"
          title={"알림 상세 내역"}
          data={notificationDetailTableData}
          columns={notificationDetailTableColumns}
          options={listOptions}
        />
      </ThemeProvider>
    </div>,
    <ProductAnalysis
      key="productAnalysis"
      barcode={selectedProductBarcode}
      product={selectedProduct} // Pass the selected product data
      onBack={() => setCurrentIndex(0)}
    />,
  ];

  // 해당하는 Section Table을 보여준다.
  const handleNextComponent = async (index) => {
    if (index === 4 && !notificationsFetched) {
      // Show loading if notifications not yet fetched and user enters '변동내역'
      setLoading(true);
      try {
        await getNotificationsAPI();
        setNotificationsFetched(true);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
        setCurrentIndex(index);
      }
    } else {
      setCurrentIndex(index);
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
    getNotificationsAPI();
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

  // 영한 번역
  const mapEnumToKorean = (enumValue) => {
    switch (enumValue) {
      case "FLOW":
        return "이동";
      case "IMPORT":
        return "입고";
      case "MODIFY":
        return "수정";
      case "CRIME_PREVENTION":
        return "방범";
      case "PAYMENT":
        return "결제";
      case "EXPORT":
        return "출고";
      default:
        return enumValue;
    }
  };

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