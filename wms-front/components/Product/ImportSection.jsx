// ImportSection.jsx
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


const ImportSection = ({ storeId, notify, refreshData }) => {
    const classes = useStyles();

    // State variables
    const [newProductData, setNewProductData] = useState({
        barcode: "",
        name: "",
        quantity: "",
        originalPrice: "",
        salesPrice: "",
    });

    const [expectedImportList, setExpectedImportList] = useState([]);

    const [openModal, setOpenModal] = useState(false);

    const [columns, setColumns] = useState([]);

    const [ModalTableData, setModalTableData] = useState([]);

    const [selectedColumns, setSelectedColumns] = useState({
        barcode: null,
        name: null,
        quantity: null,
        expiration_date: null,
    });

    const [columnSelectionStep, setColumnSelectionStep] = useState(0);

    const hotTableRef = useRef(null);

    /**
     * 함수 파트
     */

    // Handle input changes in the product input form
    const handleNewProductInputChange = (field, value) => {
        setNewProductData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Add new product to the expected import list
    const handleAddNewProduct = () => {
        const productData = {
            ...newProductData,
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

    // Delete a product from the expected import list
    const handleDeleteImportProduct = (index) => {
        setExpectedImportList((prevList) => prevList.filter((_, i) => i !== index));
    };

    // Import Excel file and read data
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
            setModalTableData(fileData);
            setOpenModal(true); // Open the modal after importing the file
        };
        reader.readAsArrayBuffer(file);
    };

    // Apply gray color to selected column
    const applyColumnColor = (columnIndex) => {
        const hotInstance = hotTableRef.current.hotInstance;

        hotInstance.batch(() => {
            for (let rowIndex = 0; rowIndex < hotInstance.countRows(); rowIndex++) {
                hotInstance.setCellMeta(
                    rowIndex,
                    columnIndex,
                    "className",
                    `selected-column-${columnIndex}`
                );
            }
        });

        const styleElement = document.createElement("style");
        styleElement.textContent = `
                .selected-column-${columnIndex} { background-color: #d3d3d3 !important; }
            `;
        document.head.append(styleElement);

        hotInstance.render();
    };

    // Handle column click in the modal to select data columns
    const handleColumnClick = (event, coords) => {
        const totalSteps = 5; // Total number of columns to select

        if (columnSelectionStep < totalSteps) {
            const columnKeys = ["barcode", "name", "quantity", "originalPrice", "salesPrice"];
            // Apply gray color to the selected column
            applyColumnColor(coords.col);
            setSelectedColumns((prevSelected) => ({
                ...prevSelected,
                [columnKeys[columnSelectionStep]]: coords.col,
            }));
            setColumnSelectionStep(columnSelectionStep + 1);
        }
    };

    // Finalize the column selection and extract data
    const finalizeSelectionImport = () => {
        // Map the selected columns to product data
        const postData = ModalTableData.map((row) => ({
            barcode: row[selectedColumns.barcode],
            name: row[selectedColumns.name],
            quantity: row[selectedColumns.quantity],
            originalPrice: row[selectedColumns.originalPrice] || "",
            salesPrice: row[selectedColumns.salesPrice] || "",
        }));

        // Append to expected import list
        setExpectedImportList((prevList) => [...prevList, ...postData]);

        setOpenModal(false);
        setColumnSelectionStep(0);
        setSelectedColumns({
            barcode: null,
            name: null,
            quantity: null,
            originalPrice: null,
            salesPrice: null,
        });
    };

    // Call the API to import products
    const handleFinalImport = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                // Handle unauthorized access
                return;
            }

            const ImportArray = expectedImportList.map((product) => ({
                barcode: parseInt(product.barcode),
                originalPrice: parseInt(product.originalPrice) || 0,
                productName: product.name,
                quantity: parseInt(product.quantity),
                sellingPrice: parseInt(product.salesPrice) || 0,
                sku: product.sku || null,
                storeId: parseInt(storeId),
            }));

            const response = await fetch(
                "https://j11a302.p.ssafy.io/api/products/import",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(ImportArray),
                }
            );

            if (response.ok) {
                const result = await response.json();
                notify(`입고가 완료되었습니다.`);
                refreshData(); // Refresh data in the main component
                setExpectedImportList([]); // Clear the list after import
            } else {
                notify(`입고에 실패했습니다.`);
            }
        } catch (error) {
            console.log(error);
            notify(`입고에 실패했습니다.`);
        }
    };

    return (
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
                                        handleNewProductInputChange("quantity", e.target.value)
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
                                        handleNewProductInputChange("originalPrice", e.target.value)
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
                                        handleNewProductInputChange("salesPrice", e.target.value)
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

            {/* Import Modal */}
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
                    {columnSelectionStep === 3 && "원가가 있는 열을 선택하세요."}
                    {columnSelectionStep === 4 && "판매가가 있는 열을 선택하세요."}
                    {columnSelectionStep === 5 && "최종적으로 선택된 데이터를 확인하세요."}
                </DialogTitle>
                <DialogContent>
                    {/* Handsontable to display Excel data */}
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
                    {columnSelectionStep >= 2 && (
                        <Button
                            className={classes.importButton}
                            onClick={finalizeSelectionImport}
                        >
                            확인
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
        </div>
    );
};

export default ImportSection;
