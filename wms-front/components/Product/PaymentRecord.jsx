// PaymentRecords.jsx
import React, { useState } from "react";
import { useRouter } from "next/router";

// Material-UI components
import { makeStyles } from "@mui/styles";
import {
  Button,
  Grid,
  TextField,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MUIDataTable from "mui-datatables";
import { Download, Print } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Date picker components
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ko } from "date-fns/locale";

// Import styles
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx";

const useStyles = makeStyles(styles);

// Create a theme for MUIDataTable
const muiDatatableTheme = createTheme({
  components: {
    MUIDataTable: {
      styleOverrides: {
        responsiveScroll: {
          maxHeight: "80vh !important",
        },
      },
    },
  },
});

const PaymentRecords = ({ storeId, notify }) => {
  const classes = useStyles();
  const router = useRouter();

  // Initialize dates
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Set time to 00:00:00
  today.setHours(0, 0, 0, 0);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [startDateTime, setStartDateTime] = useState(thirtyDaysAgo);
  const [endDateTime, setEndDateTime] = useState(today);
  const [paymentData, setPaymentData] = useState([]);
  const [paymentColumns, setPaymentColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle date change
  const handleStartDateChange = (newValue) => {
    if (newValue) {
      const adjustedDate = new Date(newValue);
      adjustedDate.setHours(0, 0, 0, 0);
      setStartDateTime(adjustedDate);
    }
  };

  const handleEndDateChange = (newValue) => {
    if (newValue) {
      const adjustedDate = new Date(newValue);
      adjustedDate.setHours(0, 0, 0, 0);
      setEndDateTime(adjustedDate);
    }
  };

  // Fetch payment records from the backend
  const fetchPaymentRecords = async () => {
    if (!startDateTime || !endDateTime) {
      notify("시작 날짜와 종료 날짜를 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      setLoading(true);

      // Format dates to 'yyyy-MM-ddTHH:mm:ss'
      const formatDateTime = (date) => {
        const pad = (num) => num.toString().padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day}T00:00:00`;
      };

      const formattedStartDateTime = formatDateTime(startDateTime);
      const formattedEndDateTime = formatDateTime(endDateTime);

      // Build the query parameters
      const queryParams = new URLSearchParams({
        storeId: storeId,
        startDateTime: formattedStartDateTime,
        endDateTime: formattedEndDateTime,
      });

      console.log(queryParams.toString());

      // Fetch data from the backend
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/payments?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        const payments = apiResponse.result;

        // Map backend fields to frontend fields
        const formattedData = payments.map((payment) => ({
          id: payment.id,
          orderId: payment.orderId,
          barcode: payment.barcode,
          productName: payment.productName,
          quantity: payment.quantity,
          sellingPrice: payment.sellingPrice,
          paidAt: payment.createdDate,
        }));

        // Define the columns
        const columns = [
          { name: "id", label: "결제 ID", options: { display: false } },
          { name: "orderId", label: "주문 ID" },
          { name: "barcode", label: "바코드" },
          { name: "productName", label: "상품명" },
          { name: "quantity", label: "수량" },
          { name: "sellingPrice", label: "판매가" },
          { name: "paidAt", label: "결제 일시" },
        ];

        // Prepare the data for MUIDataTable
        const data = formattedData.map((payment) => [
          payment.id,
          payment.orderId,
          payment.barcode,
          payment.productName,
          payment.quantity,
          payment.sellingPrice,
          payment.paidAt,
        ]);

        setPaymentColumns(columns);
        setPaymentData(data);
        setLoading(false);
      } else {
        setLoading(false);
        notify("결제 내역을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      notify("결제 내역을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // Options for MUIDataTable
  const options = {
    fixedHeader: true,
    filterType: "multiselect",
    responsive: "standard",
    download: false,
    print: false,
    viewColumns: true,
    filter: true,
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 10,
    pagination: true,
    rowsPerPageOptions: [10, 30, 60, 100],
    textLabels: { body: { noMatch: "데이터가 없습니다." } },
    // Custom toolbar
    customToolbar: () => {
      return (
        <React.Fragment>
          <Tooltip title="Print">
            <IconButton onClick={() => window.print()}>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download">
            <IconButton
              onClick={() => downloadExcel(paymentColumns, paymentData)}
            >
              <Download />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      );
    },
  };

  // Function to download data as Excel
  const downloadExcel = (columns, data) => {
    import("xlsx").then((XLSX) => {
      const worksheet = XLSX.utils.aoa_to_sheet([
        columns.map((col) => col.label),
        ...data,
      ]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "결제내역.xlsx");
    });
  };

  return (
    <div className={classes.paymentContainer}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ko}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="시작 날짜"
              value={startDateTime}
              onChange={handleStartDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="종료 날짜"
              value={endDateTime}
              onChange={handleEndDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchPaymentRecords}
              className={classes.searchButton}
              fullWidth
            >
              조회
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>

      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        paymentData.length > 0 && (
          <ThemeProvider theme={muiDatatableTheme}>
            <MUIDataTable
              title={"결제 내역"}
              data={paymentData}
              columns={paymentColumns}
              options={options}
            />
          </ThemeProvider>
        )
      )}
    </div>
  );
};

export default PaymentRecords;
