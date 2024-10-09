// ExportSection.jsx

import React, { useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import * as XLSX from "xlsx";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import {
  alignHeaders,
  addClassesToRows,
} from "/components/Test/hooksCallbacks.jsx";
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

// Import necessary Material-UI components
import {
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Register cell types and plugins for Handsontable
registerCellType(CheckboxCellType);
registerCellType(NumericCellType);
registerPlugin(AutoColumnSize);
registerPlugin(Autofill);
registerPlugin(ContextMenu);
registerPlugin(CopyPaste);
registerPlugin(DropdownMenu);
registerPlugin(Filters);
registerPlugin(HiddenRows);

// MyContainerProductStyle에 모든 스타일을 공유한다.
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx";

const useStyles = makeStyles(styles);

const ExportSection = ({ storeId, notify, refreshData }) => {
  const classes = useStyles();

  // State variables
  const [newExportData, setNewExportData] = useState({
    barcode: "",
    quantity: "",
    trackingNumber: "",
  });

  const [expectedExportList, setExpectedExportList] = useState([]);

  const [openExportModal, setOpenExportModal] = useState(false);

  const [exportColumns, setExportColumns] = useState([]);

  const [ModalTableExportData, setModalTableExportData] = useState([]);

  const [selectedExportColumns, setSelectedExportColumns] = useState({
    barcode: null,
    quantity: null,
  });

  const [columnExportSelectionStep, setExportColumnSelectionStep] = useState(0);

  const hotExportTableRef = useRef(null);

  // Functions

  // Handle input changes in the export input form
  const handleNewExportInputChange = (field, value) => {
    setNewExportData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Add new export to the expected export list
  const handleAddNewExport = () => {
    const exportData = {
      ...newExportData,
    };

    setExpectedExportList((prevList) => [...prevList, exportData]);
    setNewExportData({
      barcode: "",
      quantity: "",
      trackingNumber: "",
    });
  };

  // Delete a export from the expected export list
  const handleDeleteExportProduct = (index) => {
    setExpectedExportList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Import Excel file and read data
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
      setModalTableExportData(fileData);
      setOpenExportModal(true); // Open the modal after importing the file
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle column click in the modal to select data columns
  const handleExportColumnClick = (event, coords) => {
    if (columnExportSelectionStep >= 0) {
      const colorMap = ["blue", "green"];
      const columnKeys = ["barcode", "quantity"];
      // Apply color to the selected column
      // ... (Implement the function to apply color)
      setSelectedExportColumns((prevSelected) => ({
        ...prevSelected,
        [columnKeys[columnExportSelectionStep]]: coords.col,
      }));
      setExportColumnSelectionStep(columnExportSelectionStep + 1);
    }
  };

  // Finalize the column selection and extract data
  const finalizeSelectionExport = () => {
    // Map the selected columns to export data
    const postData = ModalTableExportData.map((row) => ({
      barcode: row[selectedExportColumns.barcode],
      quantity: row[selectedExportColumns.quantity],
      trackingNumber: "121351203", // Default or input as needed
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

  // Call the API to export products
  const handleFinalExport = async () => {
    // Implement the exportAPI function here or call it if it's globally available
    try {
      // Implement export API logic
      // For example:

      const token = localStorage.getItem("token");
      if (!token) {
        // Handle unauthorized access
        return;
      }

      const ExportArray = expectedExportList.map((product) => ({
        barcode: parseInt(product.barcode),
        quantity: parseInt(product.quantity),
        trackingNumber: product.trackingNumber || null,
        storeId: parseInt(storeId),
      }));

      const response = await fetch(
        "https://j11a302.p.ssafy.io/api/products/export",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ExportArray),
        }
      );

      if (response.ok) {
        const result = await response.json();
        notify(`출고가 완료되었습니다.`);
        refreshData(); // Refresh data in the main component
        setExpectedExportList([]); // Clear the list after export
      } else {
        notify(`출고에 실패했습니다.`);
      }
    } catch (error) {
      console.log(error);
      notify(`출고에 실패했습니다.`);
    }
  };

  return (
    <div className={classes.exportSection}>
      <div className={classes.exportProduct}>
        <Typography variant="h6" gutterBottom>
          출고 데이터 입력
        </Typography>
        <table className={classes.exportingTable}>
          <tbody>
            <tr>
              <td className={classes.tdExportingTable}>
                <TextField
                  label="바코드"
                  value={newExportData.barcode}
                  onChange={(e) =>
                    handleNewExportInputChange("barcode", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              </td>
              <td className={classes.tdExportingTable}>
                <TextField
                  label="수량"
                  value={newExportData.quantity}
                  onChange={(e) =>
                    handleNewExportInputChange("quantity", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              </td>
              <td className={classes.tdExportingTable}>
                <TextField
                  label="송장번호"
                  value={newExportData.trackingNumber}
                  onChange={(e) =>
                    handleNewExportInputChange("trackingNumber", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />
              </td>
              <td className={classes.tdExportingTable}>
                <Button
                  variant="contained"
                  onClick={handleAddNewExport}
                  className={classes.buttonStyle}
                >
                  제품 추가
                </Button>
              </td>
            </tr>
            <tr>
              <td className={classes.tdExportingTable} colSpan={4}>
                <label htmlFor="upload-export">
                  <input
                    required
                    style={{ display: "none" }}
                    id="upload-export"
                    name="upload-export"
                    type="file"
                    onChange={exportExcel}
                  />
                  <Fab
                    className={classes.exportingButton}
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
                  onClick={handleFinalExport}
                  className={classes.exportingButton}
                >
                  출고하기
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={classes.expectedExportList}>
        <Typography variant="h6">출고 예정 목록</Typography>
        <table className={classes.expectedExportTable}>
          <thead>
            <tr>
              <th className={classes.thExpectedExportTable}>바코드</th>
              <th className={classes.thExpectedExportTable}>수량</th>
              <th className={classes.thExpectedExportTable}>송장번호</th>
              <th className={classes.thExpectedExportTable}>비고</th>
            </tr>
          </thead>
          <tbody>
            {expectedExportList.map((product, index) => (
              <tr key={index}>
                <td className={classes.thExpectedExportTable}>
                  {product.barcode}
                </td>
                <td className={classes.thExpectedExportTable}>
                  {product.quantity}
                </td>
                <td className={classes.thExpectedExportTable}>
                  {product.trackingNumber}
                </td>
                <td className={classes.thExpectedExportTable}>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteExportProduct(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Modal */}
      <Dialog
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {columnExportSelectionStep === 0 && "바코드가 있는 열을 선택하세요."}
          {columnExportSelectionStep === 1 && "수량이 있는 열을 선택하세요."}
          {columnExportSelectionStep === 2 &&
            "최종적으로 선택된 데이터를 확인하세요."}
        </DialogTitle>
        <DialogContent>
          {/* Handsontable to display Excel data */}
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
          {columnExportSelectionStep >= 1 && (
            <Button
              className={classes.exportButton}
              onClick={finalizeSelectionExport}
            >
              확인
            </Button>
          )}
          <Button
            className={classes.exportButton}
            onClick={() => setOpenExportModal(false)}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExportSection;
