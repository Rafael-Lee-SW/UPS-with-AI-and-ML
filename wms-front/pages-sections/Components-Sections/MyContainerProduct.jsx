import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
// 알림창을 위한 import
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import MUI components
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
//시간 보여주기
import { format } from "date-fns";
import dayjs from "dayjs";

// 모달 페이지를 위한 Import
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControlLabel } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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

import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx";

const useStyles = makeStyles(styles);

// Create the theme with the desired overrides
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

const MyContainerProduct = ({ WHId, businessId, warehouses }) => {
  // 라우팅, 스타일 설정
  const router = useRouter();
  const classes = useStyles();

  // Find the selected warehouse from the cards array
  const selectedWarehouse = warehouses.find(
    (warehouse) => warehouse.id === parseInt(WHId)
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
  const [detailedData, setDetailedData] = useState([]); // Store all import/export data
  const [ModalTableData, setModalTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const hotTableRef = useRef(null); // HandsonTable 객체 참조
  const [openModal, setOpenModal] = useState(false); // 입고 모달 열기/닫기 상태
  const [columnSelectionStep, setColumnSelectionStep] = useState(0); // 데이터 선택
  const [selectedColumns, setSelectedColumns] = useState({
    barcode: null,
    name: null,
    quantity: null,
    expiration_date: null,
  });
  // HandsonTable 엑셀 형식에서 수정하기 위한 Modal State
  const [openEditModal, setOpenEditModal] = useState(false); // 수정용 모달 열기/닫기
  const [editData, setEditData] = useState([]); // State to track edited data

  // 출고 데이터를 받기 위한 State
  const [ModalTableExportData, setModalTableExportData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);
  const hotExportTableRef = useRef(null); // HandsonTable 객체 참조
  const [openExportModal, setOpenExportModal] = useState(false); // 입고 모달 열기/닫기 상태
  const [columnExportSelectionStep, setExportColumnSelectionStep] = useState(0); // 데이터 선택
  const [selectedExportColumns, setSelectedExportColumns] = useState({
    barcode: null,
    name: null,
    quantity: null,
    expiration_date: null,
  });

  // 선택된 열을 추적하기 위한 State
  const [selectedRows, setSelectedRows] = useState([]);
  const [openMoveModal, setOpenMoveModal] = useState(false); // State for move modal
  const [moveData, setMoveData] = useState([]); // State to track data for moving products

  // '상품별로 선택 이동하기' 를 위한 State
  const [bulkMoveDetails, setBulkMoveDetails] = useState({
    warehouseId: "",
    locationName: "",
    floorLevel: "",
    quantity: "",
  });
  // 에러 메세지 출력을 위한 State
  const [errors, setErrors] = useState([]);
  // '상품 한번에 이동하기' 를 위한 State
  const [isBulkMove, setIsBulkMove] = useState(true);

  // Input Section을 관리하기 위한 State
  const [showProductInputSection, setShowProductInputSection] = useState(false); // State for showing/hiding product input section
  const [newProductData, setNewProductData] = useState({
    barcode: "",
    name: "",
    quantity: "",
    originalPrice: "",
    salesPrice: "",
  });
  const [expectedImportList, setExpectedImportList] = useState([]); // Store expected import list

  // Export input section
  const [showProductExportSection, setShowProductExportSection] =
    useState(false); // State for showing/hiding product export section
  const [newExportData, setNewExportData] = useState({
    barcode: "",
    quantity: "",
    trackingNumber: "",
  });
  const [expectedExportList, setExpectedExportList] = useState([]); // Store expected export list

  // Analytics state
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Precomputed data for analytics
  const [quantityByLocationData, setQuantityByLocationData] = useState(null);
  const [flowByDateData, setFlowByDateData] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(false); // 수정필수 : true 바꿀 것
  const [notificationsFetched, setNotificationsFetched] = useState(false);
  const [analyticsFetched, setAnalyticsFetched] = useState(false);

  const [activeButton, setActiveButton] = useState(0);
  const handleButtonClick = (index) => {
    setActiveButton(index);
  };

  // 엑셀로 입고(import)데이터를 받았을 때 이를 변환하는 메서드
  const convertToArrayOfArraysModal = (data) => {
    setModalTableData(data);
    return data;
  };

  // 엑셀로 출고(export)데이터를 받았을 때 이를 변환하는 메서드
  const convertToArrayOfArraysExportModal = (data) => {
    setModalTableExportData(data);
    return data;
  };

  // 엑셀을 통해 입고(import)했을 때의 모든 절차를 밟는 메서드
  const importExcel = (input) => {
    let file;
    if (input.target && input.target.files) {
      file = input.target.files[0];
    } else {
      file = input;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const formattedColumns = headers.map((head) => ({
        name: head,
        label: head,
      }));
      setColumns(formattedColumns);
      fileData.splice(0, 1);
      convertToArrayOfArraysModal(fileData);
      setOpenModal(true); // Open the modal after importing the file
    };
    reader.readAsArrayBuffer(file);
  };

  // 엑셀을 통해 출고(export)했을 때의 모든 절차를 밟는 메서드
  const exportExcel = (input) => {
    let file;
    if (input.target && input.target.files) {
      file = input.target.files[0];
    } else {
      file = input;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const formattedColumns = headers.map((head) => ({
        name: head,
        label: head,
      }));
      setExportColumns(formattedColumns);
      fileData.splice(0, 1);
      convertToArrayOfArraysExportModal(fileData);
      setOpenExportModal(true); // Open the modal after exporting
    };
    reader.readAsArrayBuffer(file);
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

  // 열의 색상을 바꾸는 메서드
  const applyColumnColor = (columnIndex, color) => {
    const hotInstance = hotTableRef.current.hotInstance;

    hotInstance.batch(() => {
      ModalTableData.forEach((row, rowIndex) => {
        hotInstance.setCellMeta(
          rowIndex,
          columnIndex,
          "className",
          `background-color-${columnIndex}`
        );
      });
    });

    const styleElement = document.createElement("style");
    styleElement.textContent = `.background-color-${columnIndex} { background-color: ${color} !important; }`;
    document.head.append(styleElement);

    hotInstance.render();
  };

  // 열을 클릭하면 해당하는 열의 색상을 바꾸는 메서드
  const handleColumnClick = (event, coords) => {
    if (columnSelectionStep >= 0) {
      const colorMap = ["blue", "green", "red", "orange"];
      const columnKeys = ["barcode", "name", "quantity", "expiry"];
      applyColumnColor(coords.col, colorMap[columnSelectionStep]);
      setSelectedColumns((prevSelected) => ({
        ...prevSelected,
        [columnKeys[columnSelectionStep]]: coords.col,
      }));
      setColumnSelectionStep(columnSelectionStep + 1);
    }
  };

  // 출고 열의 색상을 바꾸는 메서드
  const applyExportColumnColor = (columnIndex, color) => {
    const hotInstance = hotExportTableRef.current.hotInstance;

    hotInstance.batch(() => {
      ModalTableExportData.forEach((row, rowIndex) => {
        hotInstance.setCellMeta(
          rowIndex,
          columnIndex,
          "className",
          `background-color-${columnIndex}`
        );
      });
    });

    const styleElement = document.createElement("style");
    styleElement.textContent = `.background-color-${columnIndex} { background-color: ${color} !important; }`;
    document.head.append(styleElement);

    hotInstance.render();
  };

  // 출고 열을 클릭하면 해당하는 열의 색상을 바꾸는 메서드
  const handleExportColumnClick = (event, coords) => {
    if (columnExportSelectionStep >= 0) {
      const colorMap = ["blue", "green"];
      const columnKeys = ["barcode", "quantity"];
      applyExportColumnColor(coords.col, colorMap[columnExportSelectionStep]);
      setSelectedExportColumns((prevSelected) => ({
        ...prevSelected,
        [columnKeys[columnExportSelectionStep]]: coords.col,
      }));
      setExportColumnSelectionStep(columnExportSelectionStep + 1);
    }
  };

  // 선별된 엑셀 데이터를 입고 예상 목록에 추가하는 메서드
  const finalizeSelectionImport = () => {
    // 선택된 열의 데이터를 postData에 담는 과정
    const postData = ModalTableData.map((row) => ({
      barcode: row[selectedColumns.barcode],
      name: row[selectedColumns.name],
      quantity: row[selectedColumns.quantity],
      expirationDate: null,
      productStorageTypeEnum: "상온",
    }));

    // Append to expected import list
    setExpectedImportList((prevList) => [...prevList, ...postData]);

    setOpenModal(false);
    setColumnSelectionStep(0);
    setSelectedColumns({
      barcode: null,
      name: null,
      quantity: null,
      expiry: null,
    });
  };

  // 선별된 엑셀 데이터를 입고 예상 목록에 추가하는 메서드
  const finalizeSelectionExport = () => {
    // 선택된 열의 데이터를 postData에 담는 과정
    const postData = ModalTableExportData.map((row) => ({
      barcode: row[selectedExportColumns.barcode],
      quantity: row[selectedExportColumns.quantity],
      trackingNumber: "121351203",
    }));

    // Append to expected export list
    setExpectedExportList((prevList) => [...prevList, ...postData]);

    setOpenExportModal(false);
    setExportColumnSelectionStep(0);
    setSelectedExportColumns({
      barcode: null,
      quantity: null,
    });
  };

  // 새로운 엑셀 상품들을 입고시키는 API 메서드
  const importAPI = async (postData) => {
    try {
      //  // 입고 시에 사용되는 데이터 양식
      const ImportArray = postData.map((product) => ({
        name: product.name,
        barcode: parseInt(product.barcode),
        quantity: parseInt(product.quantity),
        productStorageType: "상온",
        expirationDate: product.expirationDate || null,
        warehouseId: parseInt(WHId),
      }));

      console.log(ImportArray);

      const response = await fetch(
        "https://j11a302.p.ssafy.io/api/products/import",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ImportArray),
        }
      );

      if (response.ok) {
        const result = await response.json();
        notify(`${selectedWarehouseTitle} 창고에 입고되었습니다.`);
        productGetAPI(businessId);
        handleNextComponent(0);
      } else {
        notify(`입고에 실패했습니다.`);
        handleNextComponent(0);
      }
    } catch (error) {
      notify(`입고에 실패했습니다.`);
      handleNextComponent(0);
    }
  };

  // 루트 프린트를 위한 State
  const [printableContent, setPrintableContent] = useState({
    columns: [],
    data: [],
  });

  // 출고 프린트 모달
  const [exportPrintModalOpen, setExportPrintModalOpen] = useState(false);

  // 새로운 엑셀 상품들을 출고고시키는 API 메서드
  const exportAPI = async (postData) => {
    try {
      // postData에 businessId와 warehouseId를 추가한다.
      const newPostData = {
        warehouseId: WHId,
        businessId: businessId,
        data: postData,
      };
      const response = await fetch(
        "https://j11a302.p.ssafy.io/api/products/export",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPostData),
        }
      );

      if (response.ok) {
        const accept = await response.json();
        const pathData = accept.result;

        // Convert the path data to the format required for the printable table
        const printData = Object.keys(pathData[0].path)
          .map((warehouseName) => {
            return pathData[0].path[warehouseName].map((item) => [
              item.warehouseName,
              item.productName,
              item.barcode,
              item.quantity,
              item.locationName,
              item.floorLevel,
              item.trackingNumber,
              new Date(item.date).toLocaleDateString(),
              item.expirationDate
                ? new Date(item.expirationDate).toLocaleDateString()
                : "N/A",
              item.productStorageType,
            ]);
          })
          .flat();

        // Prepare columns for printing
        const printColumns = [
          { name: "warehouseName", label: "창고 이름" },
          { name: "productName", label: "상품명" },
          { name: "barcode", label: "바코드" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함 이름" },
          { name: "floorLevel", label: "층수" },
          { name: "trackingNumber", label: "송장 번호" },
          { name: "date", label: "출고 날짜" },
          { name: "expirationDate", label: "유통기한" },
          { name: "productStorageType", label: "보관 상태" },
        ];

        // Trigger the print dialog
        setPrintableContent({ columns: printColumns, data: printData });
        setExportPrintModalOpen(true);

        productGetAPI(businessId); // 새로 데이터를 불러오고
        handleNextComponent(0); // Redirect 처리한다.
      } else {
        notify(`출고에 실패했습니다.`);
        handleNextComponent(0);
      }
    } catch (error) {
      notify(`출고에 실패했습니다.`);
      handleNextComponent(0);
    }
  };

  // 상품 이동 API
  const productMoveAPI = async (moveDetails) => {
    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/products/move`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(moveDetails),
        }
      );

      if (response.ok) {
        // 성공
        const result = await response.json();
        notify(`상품을 이동했습니다.`);
        productGetAPI(businessId); // 정보가 반영된 테이블을 새로 불러온다.
      } else {
        notify(`이동에 실패했습니다.`);
        handleNextComponent(0);
      }
    } catch (error) {
      notify(`이동에 실패했습니다.`);
      handleNextComponent(0);
    }
  };

  const [productColumns, setProductColumns] = useState([]);

  // 사장님이 갖고 있는 상품들을 가져오는 API
  const productGetAPI = async () => {
    
    // 토큰에서 유저정보를 가져온다.(중요)
    const token = localStorage.getItem("token");

    if (!token) {
      // Handle the case where the token is missing (e.g., redirect to login)
      router.push("/login");
      return;
    }

    console.log(token)

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/stores/13/products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include the token in the Authorization header
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      if (response.ok) {
        //성공
        const apiConnection = await response.json();
        const products = apiConnection.result;

        // Extract only the required columns
        const formattedData = products.map((product) => ({
          hiddenId: product.id,
          name: product.name,
          barcode: product.barcode,
          quantity: product.quantity,
          locationName:
            product.locationName === "00-00" ? "임시" : product.locationName,
          floorLevel: product.floorLevel,
          expirationDate: product.expirationDate || "없음",
          warehouseId: product.warehouseId,
        }));

        // Define the columns
        const headers = [
          "식별자",
          "이름",
          "바코드(식별번호)",
          "수량",
          "적재함",
          "단(층)수",
          "유통기한",
          "창고",
        ];

        const formattedColumns = [
          { name: "hiddenId", label: "식별자", options: { display: false } },
          { name: "name", label: "상품명" },
          { name: "barcode", label: "바코드" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함" },
          { name: "floorLevel", label: "층수" },
          { name: "expirationDate", label: "유통기한" },
          { name: "warehouseId", label: "창고" },
        ];

        // Prepare the data for Handsontable
        const data = formattedData.map((product) => [
          product.hiddenId,
          product.name,
          product.barcode,
          product.quantity,
          product.locationName,
          product.floorLevel,
          product.expirationDate,
          product.warehouseId,
        ]);

        setProductColumns(formattedColumns);
        setTableData(data);
        setEditData(data); // 둘을 분리할 필요가 있을까?

        // 각 재고함별로 몇개의 데이터가 있는지 계산하는 로직
        const locationData = products.reduce((acc, product) => {
          if (product.warehouseId === parseInt(WHId)) {
            const locationName = product.locationName || "임시";
            acc[locationName] = (acc[locationName] || 0) + product.quantity;
          }
          return acc;
        }, {});

        const locationLabels = Object.keys(locationData);
        const locationDataValues = Object.values(locationData);

        setQuantityByLocationData({
          labels: locationLabels,
          datasets: [
            {
              label: "Total Quantity",
              data: locationDataValues,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
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

  // 모든 알림(변동내역)을 가져오는 메서드
  const getNotificationsAPI = async (businessId) => {
    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/products/notification?businessId=${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const { productFlowResponseDtos, expirationProductResponseDtos } =
          apiConnection.result;

        // Combine all notifications
        const combinedData = [...productFlowResponseDtos];

        // Sort combined data by date
        const sortedData = combinedData.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        // Set the detailed data state
        setDetailedData(sortedData);

        // Map to formatted data for initial display
        const formattedData = sortedData.map((item) => {
          // Determine the content for the 'trackingNumber' field based on 'productFlowType'
          let trackingOrNote = "";
          if (item.productFlowType === "EXPORT") {
            trackingOrNote = item.trackingNumber || "송장없음";
          } else if (item.productFlowType === "IMPORT") {
            trackingOrNote = "입고품목";
          } else if (item.productFlowType === "FLOW") {
            trackingOrNote = "이동품목";
          }

          return {
            date: new Date(item.date).toLocaleDateString(),
            type: translationMap[item.productFlowType] || item.productFlowType, // Translate type
            barcode: item.barcode,
            name: item.name,
            quantity: item.quantity,
            locationName: item.currentLocationName,
            floorLevel: item.currentFloorLevel,
            trackingOrNote, // Use the new variable here
          };
        });

        setAllChangingTableData(formattedData);

        setAllChangingTableColumns([
          { name: "date", label: "날짜" },
          { name: "type", label: "유형" },
          { name: "barcode", label: "바코드" },
          { name: "name", label: "상품명" },
          { name: "quantity", label: "수량" },
          { name: "locationName", label: "적재함" },
          { name: "floorLevel", label: "층수" },
          { name: "trackingOrNote", label: "송장번호/비고" },
        ]);

        // Precompute flow by date data
        const flowData = sortedData.reduce((acc, item) => {
          const dateKey = new Date(item.date).toLocaleDateString();
          if (!acc[dateKey]) {
            acc[dateKey] = { import: 0, export: 0, flow: 0 };
          }
          if (item.productFlowType === "IMPORT") {
            acc[dateKey].import += item.quantity;
          } else if (item.productFlowType === "EXPORT") {
            acc[dateKey].export += item.quantity;
          } else {
            acc[dateKey].flow += item.quantity;
          }
          return acc;
        }, {});

        const flowLabels = Object.keys(flowData);
        const importData = flowLabels.map((label) => flowData[label].import);
        const exportData = flowLabels.map((label) => flowData[label].export);
        const flowDataValues = flowLabels.map((label) => flowData[label].flow);

        setFlowByDateData({
          labels: flowLabels,
          datasets: [
            {
              label: translationMap["IMPORT"],
              data: importData,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: translationMap["EXPORT"],
              data: exportData,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
            {
              label: translationMap["FLOW"],
              data: flowDataValues,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        });
        setNotificationsFetched(true);
        setAnalyticsFetched(true);
        //알림 호출 성공

        /**
         * 알림을 정리해서 날짜별로 분류하는 부분
         */

        // Group data by date and type
        const groupedData = sortedData.reduce((acc, item) => {
          const dateKey = new Date(item.date).toLocaleDateString();
          const typeKey =
            translationMap[item.productFlowType] || item.productFlowType;
          const key = `${dateKey}-${typeKey}`;

          if (!acc[key]) {
            acc[key] = {
              date: dateKey,
              type: typeKey,
              count: 0,
            };
          }

          acc[key].count += 1;
          return acc;
        }, {});

        // Format grouped data for table display
        const SameformattedData = Object.values(groupedData).map((entry) => ({
          date: entry.date,
          type: entry.type,
          count: entry.count,
        }));

        setNotificationTableData(SameformattedData);
        setNotificationTableColumns([
          { name: "date", label: "날짜" },
          { name: "type", label: "유형" },
          { name: "count", label: "수량" },
        ]);

        // 알림 호출 완료
      } else {
        // 에러
        setNotificationsFetched(true);
        setAnalyticsFetched(true);
      }
    } catch (error) {
      // 에러
      setNotificationsFetched(true);
      setAnalyticsFetched(true);
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
        productGetAPI(businessId);
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
        pathname: `/user/${WHId}`,
        query: { component: "product" },
      },
      undefined,
      { shallow: true }
    );

    setOpenEditModal(false); // Close modal after saving
  };

  // Function to open move modal and set selected rows
  const handleMoveButtonClick = () => {
    const selectedData = selectedRows.map((rowIndex) => ({
      productId: tableData[rowIndex][0],
      name: tableData[rowIndex][1],
      barcode: tableData[rowIndex][2],
      quantityNow: tableData[rowIndex][3],
      warehouseIdNow: tableData[rowIndex][7],
      locationNameNow: tableData[rowIndex][4],
      floorLevelNow: tableData[rowIndex][5],
      //옮길 값들
      warehouseId: bulkMoveDetails.warehouseId, // Default to bulk move values
      locationName: bulkMoveDetails.locationName, // Default to bulk move values
      floorLevel: bulkMoveDetails.floorLevel, // Default to bulk move values
      quantity: bulkMoveDetails.quantity, // Default to bulk move values
      errors: {}, // 에러값 초기화
    }));

    setMoveData(selectedData);
    setOpenMoveModal(true);
  };

  // Function to handle bulk move input change
  const handleBulkInputChange = (field, value) => {
    setBulkMoveDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));

    if (field === "quantity") {
      const minQuantity = Math.min(
        ...selectedRows.map((rowIndex) => tableData[rowIndex][3])
      );

      // Check if the input is not a number
      if (!/^\d*$/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          bulkQuantity: "수량은 숫자만 입력 가능합니다.",
        }));
      } else if (parseInt(value) > minQuantity) {
        // Check if entered quantity is greater than the minimum available
        setErrors((prevErrors) => ({
          ...prevErrors,
          bulkQuantity:
            "일부 상품들의 수량보다 많습니다 : 일부 상품은 모든 상품이 옮겨집니다.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          bulkQuantity: "",
        }));
      }
    }
  };

  // Function to handle change in new location details for detailed move
  const handleNewLocationChange = (index, field, value) => {
    setMoveData((prevMoveData) => {
      const newData = [...prevMoveData];
      const product = newData[index];
      const errors = { ...newData[index].errors };

      if (field === "quantity") {
        // Check if the input is not a number
        if (!Number.isInteger(parseInt(value)) || parseInt(value) < 0) {
          errors.quantity = "잘못된 수량입니다. 유효한 정수를 입력하세요.";
        } else if (parseInt(value) > product.quantityNow) {
          errors.quantity = `수량이 너무 큽니다. 최대 ${product.quantityNow}개 가능합니다.`;
          value = product.quantityNow; // Auto-correct the value
        } else {
          errors.quantity = "";
        }
      }

      product[field] = value;
      product.errors = errors;
      return newData;
    });
  };

  // Function to finalize move in bulk mode
  const handleFinalizeBulkMove = () => {
    const quantity = parseInt(bulkMoveDetails.quantity);

    const moveDetails = selectedRows.map((rowIndex) => {
      const product = tableData[rowIndex];
      return {
        productId: product[0],
        locationName: bulkMoveDetails.locationName,
        floorLevel: bulkMoveDetails.floorLevel,
        warehouseId: parseInt(bulkMoveDetails.warehouseId),
        quantity: Math.min(quantity, product[3]), // Move max available if over
      };
    });

    // 대량 이동 성공
    productMoveAPI(moveDetails);
    setOpenMoveModal(false);
  };

  // Function to finalize move in detailed mode
  const handleFinalizeDetailMove = () => {
    const isValid = moveData.every((product) => !product.errors.quantity);
    if (!isValid) return;

    const moveDetails = moveData.map((product) => ({
      productId: product.productId,
      locationName: product.locationName,
      floorLevel: product.floorLevel,
      warehouseId: parseInt(product.warehouseId),
      quantity: parseInt(product.quantity),
    }));

    // 상세 이동 성공
    productMoveAPI(moveDetails);
    setOpenMoveModal(false);
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

  // Define the componentsArray with separate options
  const componentsArray = [
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="productList"
        title={"상품 목록"}
        data={tableData}
        columns={productColumns}
        options={listOptions}
      />
    </ThemeProvider>,
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="moveProductList"
        title={"상품 이동하기"}
        data={tableData}
        columns={productColumns}
        options={moveOptions}
      />
    </ThemeProvider>,
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="notificationList"
        title={"모든 변동 내역"}
        data={allChangingTableData}
        columns={allChangingTableColumns}
        options={listOptions}
      />
    </ThemeProvider>,
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="dateTypeList"
        title={"알림함"}
        data={notificationTableData}
        columns={notificationTableColumns}
        options={importExportOptions}
      />
    </ThemeProvider>,
    <ThemeProvider theme={muiDatatableTheme}>
      <MUIDataTable
        key="selectedNotificationList"
        title={"알림 상세 내역"}
        data={notificationDetailTableData}
        columns={notificationDetailTableColumns}
        options={listOptions}
      />
    </ThemeProvider>,
    showAnalytics && (
      <div key="analyticsSection" style={{ padding: "20px" }}>
        <Typography variant="h6">재고 분석</Typography>
        <div style={{ marginTop: "20px" }}>
          <Typography variant="subtitle1">
            로케이션별 재고 현황 (창고 : {selectedWarehouseTitle})
          </Typography>
          {quantityByLocationData && <Bar data={quantityByLocationData} />}
        </div>
        <div style={{ marginTop: "40px" }}>
          <Typography variant="subtitle1">일자별 입-출고-이동 추이</Typography>
          {flowByDateData && (
            <Bar
              data={flowByDateData}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const total = flowByDateData.datasets.reduce(
                          (sum, dataset) =>
                            sum + dataset.data[context.dataIndex],
                          0
                        );
                        const percentage = (
                          (context.raw / total) *
                          100
                        ).toFixed(2);
                        return `${context.dataset.label}: ${context.raw} (${percentage}%)`;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
              }}
            />
          )}
        </div>
      </div>
    ),
  ];

  // 해당하는 Section Table을 보여준다.
  const handleNextComponent = async (index) => {
    if (index === 2 && !notificationsFetched) {
      // Show loading if notifications not yet fetched and user enters '변동내역'
      setLoading(true);
      try {
        await getNotificationsAPI(businessId);
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
        await getNotificationsAPI(businessId);
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

  // Handle new product data input change
  const handleNewProductInputChange = (field, value) => {
    setNewProductData((prevData) => ({
      ...prevData,
      [field]: field === "expirationDate" ? dayjs(value) : value,
    }));
  };

  // Add new product to expected import list
  const handleAddNewProduct = () => {
    let formattedDate = null;
    let formattedDisplayDate = null;

    if (
      newProductData.expirationDate &&
      dayjs(newProductData.expirationDate).isValid()
    ) {
      formattedDate = format(
        new Date(newProductData.expirationDate),
        "yyyy-MM-dd'T'HH:mm"
      );

      formattedDisplayDate = format(
        new Date(newProductData.expirationDate),
        "yyyy년 M월 d일 HH시 mm분"
      );
    }

    const productData = {
      ...newProductData,
      expirationDate: formattedDate,
      expirationDateDisplay: formattedDisplayDate, // For display purposes
    };

    setExpectedImportList((prevList) => [...prevList, productData]);
    setNewProductData({
      barcode: "",
      name: "",
      quantity: "",
      originalPrice: "",
      salesPrice: "",
    });
  };

  // Delete product from expected import list
  const handleDeleteImportProduct = (index) => {
    setExpectedImportList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Finalize import from expected import list
  const handleFinalImport = () => {
    importAPI(expectedImportList);
    setExpectedImportList([]); // Clear the list after import
    setShowProductInputSection(false);
  };

  // Handle new export data input change
  const handleNewExportInputChange = (field, value) => {
    setNewExportData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Add new export to expected export list
  const handleAddNewExport = () => {
    setExpectedExportList((prevList) => [...prevList, newExportData]);
    setNewExportData({
      barcode: "",
      quantity: "",
      trackingNumber: "",
    });
  };

  // Delete export from expected export list
  const handleDeleteExportProduct = (index) => {
    setExpectedExportList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Finalize export from expected export list
  const handleFinalExport = () => {
    exportAPI(expectedExportList);
    setExpectedExportList([]); // Clear the list after export
    setShowProductExportSection(false);
  };

  // 압축하기
  const handleEncapsulation = () => {
    EncapsuleAPI();
  };

  // 상품 압축기능 - 산재되어있는 각 상품들을 하나로 모은다.
  const EncapsuleAPI = async () => {
    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/products/compress?businessId=${businessId}&warehouseId=${WHId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        //성공
        const result = await response.json();
        productGetAPI(businessId); // 새로 상품 불러오기
        notify(`상품들을 정렬하였습니다.`);
        handleNextComponent(0);
        // 압축 성공 모달 띄우기
      } else {
        notify(`압축에 실패하였습니다.`);
        handleNextComponent(0);
      }
    } catch (error) {
      notify(`압축에 실패하였습니다.`);
      handleNextComponent(0);
    }
  };

  /**
   * UseEffect를 통해 새로고침 때마다 api로 사장님의 재고를 불러옴
   * + 유저정보
   */

  useEffect(() => {
    //재고 목록과 알림 내역을 불러온다.
    productGetAPI(); // 실행되면서 같이 부른다.
  }, [openModal]);

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

  // Effect to trigger print on modal open
  useEffect(() => {
    if (printModalOpen) {
      const timer = setTimeout(() => {
        window.print();
        setPrintModalOpen(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printModalOpen]);

  // Effect to trigger print on modal open
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

  /**
   * 상품 이동 시에 토글로 제약
   */

  // 창고를 선택할 수 있다.
  const handleWarehouseSelectChange = (field, value, index = null) => {
    if (isBulkMove) {
      setBulkMoveDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
        locationName: "",
        floorLevel: "", // Reset location and floor level when warehouse changes
      }));
      setFloorLevels([]); // Clear floor levels
      getWarehouseAPI(value); // Fetch locations for the selected warehouse
    } else {
      setMoveData((prevMoveData) => {
        const newData = [...prevMoveData];
        newData[index][field] = value;
        newData[index].locationName = "";
        newData[index].floorLevel = ""; // Reset location and floor level
        return newData;
      });
      setFloorLevels([]); // Clear floor levels
      getWarehouseAPI(value); // Fetch locations for the selected warehouse
    }
  };

  //선택된 창고를 바탕으로 로케이션과 층수를 선택한다.
  const [locations, setLocations] = useState([]);
  const [floorLevels, setFloorLevels] = useState([]);

  // API call to fetch locations for a specific warehouse
  const getWarehouseAPI = async (warehouseId) => {
    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/warehouses/${warehouseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const warehouseData = apiConnection.result; // Extract data

        // Process location data from the API response
        const locations = warehouseData.locations;
        if (!locations) {
          //에러
          return;
        }
        const newLocations = locations.map((location, index) => {
          // Calculate the red and blue components based on the fill value
          const red = Math.round((location.fill / 100) * 255); // Increase from 0 to 255
          const blue = Math.round(((100 - location.fill) / 100) * 255); // Decrease from 255 to 0

          return {
            id: location.id.toString(),
            x: location.xposition,
            y: location.yposition,
            width: location.xsize || 50,
            height: location.ysize || 50,
            z: location.zsize,
            fill: `rgba(${red}, 0, ${blue}, 1)`, // Calculate RGB with alpha as 1

            order: index,
            name: location.name || `적재함 ${index}`,
            type: "location",
            rotation: 0,
          };
        });

        setLocations(newLocations);
      } else {
        //에러
      }
    } catch (error) {
      //에러
    }
  };

  const handleLocationSelectChange = (field, value, index = null) => {
    if (isBulkMove) {
      setBulkMoveDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
        floorLevel: "", // Reset floor level when location changes
      }));
      // Find the location to get available floor levels
      const selectedLocation = locations.find(
        (location) => location.name === value
      );
      if (selectedLocation) {
        const newFloorLevels = Array.from(
          { length: selectedLocation.z },
          (_, i) => i + 1
        );
        setFloorLevels(newFloorLevels);
      }
    } else {
      setMoveData((prevMoveData) => {
        const newData = [...prevMoveData];
        newData[index][field] = value;
        newData[index].floorLevel = ""; // Reset floor level
        const selectedLocation = locations.find(
          (location) => location.name === value
        );
        if (selectedLocation) {
          const newFloorLevels = Array.from(
            { length: selectedLocation.z },
            (_, i) => i + 1
          );
          setFloorLevels(newFloorLevels);
        }
        return newData;
      });
    }
  };

  const [noExpirationDate, setNoExpirationDate] = useState(false);

  const toggleNoExpirationDate = () => {
    setNoExpirationDate(!noExpirationDate);
    handleNewProductInputChange(
      "expirationDate",
      noExpirationDate ? dayjs() : null
    );
  };

  const isBulkMoveEnabled =
    bulkMoveDetails.warehouseId &&
    bulkMoveDetails.locationName &&
    bulkMoveDetails.floorLevel &&
    bulkMoveDetails.quantity;

  return (
    <div className={classes.productContainer}>
      <div className={classes.leftsidebar}>
        <div className={classes.topButtonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(0);
              handleNextComponent(0);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
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
              setShowProductInputSection(true);
              setShowProductExportSection(false);
              handleNextComponent(6); // Close other sections
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
              setShowProductInputSection(false);
              setShowProductExportSection(true);
              handleNextComponent(6); // Close other sections
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
              setShowProductInputSection(false);
              setShowProductExportSection(false);
              setOpenEditModal(true);
              handleNextComponent(0);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 3,
            })}
          >
            수정하기
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(4);
              handleNextComponent(1);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 4,
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
              handleNextComponent(2);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 5,
            })}
          >
            변동내역
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(6);
              handleNextComponent(5);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 6,
            })}
          >
            ML분석
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            onClick={() => {
              handleButtonClick(7);
              handleNextComponent(3);
              setShowProductInputSection(false);
              setShowProductExportSection(false);
            }}
            className={classNames(classes.sidebarButton, {
              [classes.activeButton]: activeButton === 7,
            })}
          >
            알림함
          </Button>
        </div>
      </div>
      {/* 모달들 */}
      {/* 입고 Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {columnSelectionStep === 0 && "바코드가 있는 열을 선택하세요."}
          {columnSelectionStep === 1 && "상품 이름이 있는 열을 선택하세요."}
          {columnSelectionStep === 2 && "수량이 있는 열을 선택하세요."}
          {columnSelectionStep === 3 && "유통기한이 있는 상품들입니까?"}
          {columnSelectionStep === 4 && "유통 기한 칼럼을 선택하세요."}
          {columnSelectionStep === 5 &&
            "최종적으로 선택된 데이터를 확인하세요."}
        </DialogTitle>
        <DialogContent>
          {columnSelectionStep < 3 && (
            <div>
              <p>
                {columnSelectionStep === 0 && "바코드가 있는 열을 선택하세요."}
                {columnSelectionStep === 1 &&
                  "상품 이름이 있는 열을 선택하세요."}
                {columnSelectionStep === 2 && "수량이 있는 열을 선택하세요."}
              </p>
            </div>
          )}
          {columnSelectionStep === 3 && (
            <div>
              <Button
                className={classes.importButton}
                onClick={() => setColumnSelectionStep(4)}
              >
                Yes
              </Button>
              <Button
                className={classes.importButton}
                onClick={() => setColumnSelectionStep(5)}
              >
                No
              </Button>
            </div>
          )}
          <HotTable
            height={600}
            ref={hotTableRef}
            data={ModalTableData}
            colHeaders={columns.map((col) => col.label)}
            dropdownMenu={true}
            hiddenColumns={{
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
            afterOnCellMouseDown={handleColumnClick}
          />
        </DialogContent>
        <DialogActions>
          {columnSelectionStep === 5 && (
            <Button
              className={classes.importButton}
              onClick={finalizeSelectionImport}
            >
              네
            </Button>
          )}
          <Button
            className={classes.importButton}
            onClick={() => setOpenModal(false)}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      {/* 출고 Modal */}
      <Dialog
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <h1>출고 데이터</h1>
          {columnExportSelectionStep === 0 && "바코드가 있는 열을 선택하세요."}
          {columnExportSelectionStep === 1 && "수량이 있는 열을 선택하세요."}
          {columnExportSelectionStep === 2 &&
            "최종적으로 선택된 데이터를 확인하세요."}
        </DialogTitle>
        <DialogContent>
          {columnExportSelectionStep < 1 && (
            <div>
              <p>데이터가 충분하지 않습니다.</p>
            </div>
          )}
          <HotTable
            height={600}
            ref={hotExportTableRef}
            data={ModalTableExportData}
            colHeaders={exportColumns.map((col) => col.label)}
            dropdownMenu={true}
            hiddenColumns={{
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
            afterOnCellMouseDown={handleExportColumnClick}
          />
        </DialogContent>
        <DialogActions>
          {columnExportSelectionStep === 2 && (
            <Button
              className={classes.importButton}
              onClick={finalizeSelectionExport}
            >
              네
            </Button>
          )}
          <Button
            className={classes.importButton}
            onClick={() => setOpenExportModal(false)}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
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
      <Dialog
        open={openMoveModal}
        onClose={() => setOpenMoveModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>상품을 원하는 장소로 옮기세요</DialogTitle>
        <DialogContent>
          {isBulkMove ? (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>창고 선택</InputLabel>
                <Select
                  value={bulkMoveDetails.warehouseId}
                  onChange={(e) =>
                    handleWarehouseSelectChange("warehouseId", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {warehouses.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                disabled={!locations.length}
              >
                <InputLabel>적재함 이름 선택</InputLabel>
                <Select
                  value={bulkMoveDetails.locationName}
                  onChange={(e) =>
                    handleLocationSelectChange("locationName", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.id} value={location.name}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                disabled={!floorLevels.length}
              >
                <InputLabel>층수 선택</InputLabel>
                <Select
                  value={bulkMoveDetails.floorLevel}
                  onChange={(e) =>
                    handleBulkInputChange("floorLevel", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {floorLevels.map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      {floor}층
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="수량"
                value={bulkMoveDetails.quantity}
                onChange={(e) =>
                  handleBulkInputChange("quantity", e.target.value)
                }
                fullWidth
                margin="normal"
                error={!!errors.bulkQuantity}
                helperText={errors.bulkQuantity}
              />
            </>
          ) : (
            moveData.map((product, index) => (
              <div key={product.productId} className={classes.eachProductMove}>
                <h3>
                  {product.name} (바코드: {product.barcode}) - 수량 :{" "}
                  {product.quantityNow}개
                </h3>
                <FormControl fullWidth margin="normal">
                  <InputLabel>물건이 옮겨질 창고 선택</InputLabel>
                  <Select
                    value={product.warehouseId}
                    onChange={(e) =>
                      handleWarehouseSelectChange(
                        "warehouseId",
                        e.target.value,
                        index
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  margin="normal"
                  disabled={!locations.length}
                >
                  <InputLabel>물건이 옮겨질 적재함 이름 선택</InputLabel>
                  <Select
                    value={product.locationName}
                    onChange={(e) =>
                      handleLocationSelectChange(
                        "locationName",
                        e.target.value,
                        index
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {locations.map((location) => (
                      <MenuItem key={location.id} value={location.name}>
                        {location.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  margin="normal"
                  disabled={!floorLevels.length}
                >
                  <InputLabel>옮겨질 적재함의 층 선택</InputLabel>
                  <Select
                    value={product.floorLevel}
                    onChange={(e) =>
                      handleNewLocationChange(
                        index,
                        "floorLevel",
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="">
                      <em>선택하세요</em>
                    </MenuItem>
                    {floorLevels.map((floor) => (
                      <MenuItem key={floor} value={floor}>
                        {floor}층
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="옮길 수량"
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleNewLocationChange(index, "quantity", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  error={!!product.errors.quantity}
                  helperText={product.errors.quantity}
                />
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          {isBulkMove ? (
            <Button
              className={classes.movbeButton}
              onClick={handleFinalizeBulkMove}
              disabled={!isBulkMoveEnabled}
            >
              전부 옮기기
            </Button>
          ) : (
            <Button
              className={classes.movbeButton}
              onClick={handleFinalizeDetailMove}
              disabled={!moveData.every((product) => product.floorLevel)}
            >
              각각 옮기기
            </Button>
          )}
          <Button
            className={classes.movbeButton}
            onClick={() => setIsBulkMove(!isBulkMove)}
          >
            {isBulkMove ? "각각 옮기기 모드" : "전부 옮기기 모드"}
          </Button>
          <Button
            className={classes.movbeButton}
            onClick={() => setOpenMoveModal(false)}
          >
            취소
          </Button>
        </DialogActions>
      </Dialog>
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
        {/* 입고하기 Section */}
        {showProductInputSection && (
          <div className={classes.importSection}>
            <div className={classes.importProduct}>
              <Typography variant="h6" gutterBottom>
                제품 데이터 입력
              </Typography>
              <table className={classes.importingTable}>
                <tbody>
                  <tr>
                    <td className={classes.tdImportingTable}>
                      <TextField
                        label="바코드"
                        value={newProductData.barcode}
                        onChange={(e) =>
                          handleNewProductInputChange("barcode", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td className={classes.tdImportingTable}>
                      <TextField
                        label="상품명"
                        value={newProductData.name}
                        onChange={(e) =>
                          handleNewProductInputChange("name", e.target.value)
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td className={classes.tdImportingTable}>
                      <TextField
                        label="수량"
                        value={newProductData.quantity}
                        onChange={(e) =>
                          handleNewProductInputChange(
                            "quantity",
                            e.target.value
                          )
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td className={classes.tdImportingTablePrice}>
                      <TextField
                        label="원가"
                        value={newProductData.originalPrice}
                        onChange={(e) =>
                          handleNewProductInputChange(
                            "originalPrice",
                            e.target.value
                          )
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td className={classes.tdImportingTablePrice}>
                      <TextField
                        label="판매가"
                        value={newProductData.salesPrice}
                        onChange={(e) =>
                          handleNewProductInputChange(
                            "salesPrice",
                            e.target.value
                          )
                        }
                        fullWidth
                        margin="normal"
                      />
                    </td>
                    <td className={classes.tdImportingTable}>
                      <Button
                        variant="contained"
                        onClick={handleAddNewProduct}
                        className={classes.buttonStyle}
                      >
                        제품 추가
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    {/* colspan : 몇 개의 열을 하나로 보여줄 지 결정/ 5개의 열이 한개로 표현 */}
                    <td className={classes.tdImportingTable} colSpan={5}>
                      <label htmlFor="upload-import">
                        <input
                          required
                          style={{ display: "none" }}
                          id="upload-import"
                          name="upload-import"
                          type="file"
                          onChange={importExcel}
                        />
                        <Fab
                          className={classes.importingButton}
                          size="small"
                          component="span"
                          aria-label="add"
                          variant="extended"
                        >
                          엑셀 업로드
                        </Fab>
                      </label>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleFinalImport}
                        className={classes.importingButton}
                      >
                        입고하기
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={classes.expectedImportList}>
              <Typography variant="h6">입고 예정 목록</Typography>
              <table className={classes.expectedImportTable}>
                <thead>
                  <tr>
                    <th className={classes.thExpectedImportTable}>이름</th>
                    <th className={classes.thExpectedImportTable}>바코드</th>
                    <th className={classes.thExpectedImportTable}>수량</th>
                    <th className={classes.thExpectedImportTable}>원가</th>
                    <th className={classes.thExpectedImportTable}>판매가</th>
                    <th className={classes.thExpectedImportTable}>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {expectedImportList.map((product, index) => (
                    <tr key={index}>
                      <td className={classes.thExpectedImportTable}>
                        {product.name}
                      </td>
                      <td className={classes.thExpectedImportTable}>
                        {product.barcode}
                      </td>
                      <td className={classes.thExpectedImportTable}>
                        {product.quantity}
                      </td>
                      <td className={classes.thExpectedImportTable}>
                        {product.originalPrice}
                      </td>
                      <td className={classes.thExpectedImportTable}>
                        {product.salesPrice}
                      </td>
                      <td className={classes.thExpectedImportTable}>
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteImportProduct(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!(showProductExportSection || showProductInputSection) && (
          <Grid item xs={12} style={{ width: "100%" }}>
            {/* 메인 영역 */}
            {currentIndex >= 0 && componentsArray[currentIndex]}
          </Grid>
        )}
      </div>
    </div>
  );
};

export default MyContainerProduct;
