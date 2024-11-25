// MoveProduct.jsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

// 날짜 선택을 위한 dayjs
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// MyContainerProductStyle에 모든 스타일을 공유한다.
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/MyContainerProductStyle.jsx";

const useStyles = makeStyles(styles);

const MoveProduct = ({
  open,
  onClose,
  selectedRows,
  tableData,
  stores,
  getStoreProductAPI,
  notify,
}) => {
  const classes = useStyles();
  const router = useRouter();

  // State variables
  const [moveData, setMoveData] = useState([]);
  const [bulkMoveDetails, setBulkMoveDetails] = useState({
    warehouseId: "",
    locationName: "",
    floorLevel: "",
    movementDate: dayjs(), // Initialize with current date
    locationId: "",
  });
  const [errors, setErrors] = useState({});
  const [isBulkMove, setIsBulkMove] = useState(true);
  const [locations, setLocations] = useState([]);
  const [floorLevels, setFloorLevels] = useState([]);

  useEffect(() => {
    if (open && selectedRows && tableData) {
      const selectedData = selectedRows.map((rowIndex) => ({
        productId: tableData[rowIndex][0],
        name: tableData[rowIndex][1],
        barcode: tableData[rowIndex][2],
        quantityNow: tableData[rowIndex][3],
        warehouseIdNow: tableData[rowIndex][7],
        locationNameNow: tableData[rowIndex][4],
        floorLevelNow: tableData[rowIndex][5],
        // Initialize new values
        warehouseId: "",
        locationName: "",
        floorLevel: "",
        movementDate: dayjs(), // Initialize with current date
        errors: {},
      }));
      setMoveData(selectedData);
    }
  }, [open, selectedRows, tableData]);

  const handleBulkInputChange = (field, value) => {
    setBulkMoveDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleNewLocationChange = (index, field, value) => {
    setMoveData((prevMoveData) => {
      const newData = [...prevMoveData];
      const product = newData[index];
      const errors = { ...product.errors };

      if (field === "movementDate") {
        if (!value || !dayjs(value).isValid()) {
          errors.movementDate = "유효한 날짜를 선택하세요.";
        } else {
          errors.movementDate = "";
        }
      }

      product[field] = value;
      product.errors = errors;
      return newData;
    });
  };

  const handleFinalizeBulkMove = () => {
    const moveDetails = moveData.map((product) => ({
      productId: product.productId,
      locationId: parseInt(bulkMoveDetails.locationId),
      floorLevel: parseInt(bulkMoveDetails.floorLevel),
      movementDate: bulkMoveDetails.movementDate.format("YYYY-MM-DD"),
    }));

    // Perform API call to move products
    moveProductAPI(moveDetails);
    onClose();
  };

  const handleFinalizeDetailMove = () => {
    const isValid = moveData.every((product) => !product.errors.movementDate);
    if (!isValid) return;

    const moveDetails = moveData.map((product) => ({
      productId: product.productId,
      locationId: parseInt(product.locationId),
      floorLevel: parseInt(product.floorLevel),
      movementDate: product.movementDate.format("YYYY-MM-DD"),
    }));

    // Perform API call to move products
    moveProductAPI(moveDetails);
    onClose();
  };

  const handleWarehouseSelectChange = (field, value, index = null) => {
    if (isBulkMove) {
      setBulkMoveDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
        locationName: "",
        floorLevel: "", // Reset location and floor level when warehouse changes
      }));
      setFloorLevels([]); // Clear floor levels
      getStoreStructureAPI(value); // Fetch locations for the selected warehouse
    } else {
      setMoveData((prevMoveData) => {
        const newData = [...prevMoveData];
        newData[index][field] = value;
        newData[index].locationName = "";
        newData[index].floorLevel = ""; // Reset location and floor level
        return newData;
      });
      setFloorLevels([]); // Clear floor levels
      getStoreStructureAPI(value); // Fetch locations for the selected warehouse
    }
  };

  const getStoreStructureAPI = async (value) => {
    // 토큰에서 유저정보를 가져온다.(로그인 확인)
    const token = localStorage.getItem("token");

    if (!token) {
      // Handle the case where the token is missing (e.g., redirect to signIn)
      router.push("/signIn");
      return;
    }

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/stores/${value}`,
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
        const apiConnection = await response.json();
        const warehouseData = apiConnection.result; // Extract data

        // Process location data from the API response
        const locations = warehouseData.locations;

        if (!locations) {
          //에러
          console.log("아무것도 없습니다.");
          return;
        }
        const newLocations = locations.map((location, index) => {
          return {
            id: location.id.toString(),
            x: location.xposition,
            y: location.yposition,
            width: location.xsize || 50,
            height: location.ysize || 50,
            z: location.zsize,
            draggable: true,
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
      // Find the selected location to get the locationId and available floor levels
      const selectedLocation = locations.find(
        (location) => location.name === value
      );
      if (selectedLocation) {
        const newFloorLevels = Array.from(
          { length: selectedLocation.z },
          (_, i) => i + 1
        );
        setFloorLevels(newFloorLevels);
        // Assign the locationId for bulk move
        setBulkMoveDetails((prevDetails) => ({
          ...prevDetails,
          locationId: selectedLocation.id, // Assign locationId here
        }));
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
          // Assign the locationId for individual move
          newData[index].locationId = selectedLocation.id; // Assign locationId here
        }
        return newData;
      });
    }
  };

  const moveProductAPI = async (moveDetails) => {
    //토큰 검증 과정
    const token = localStorage.getItem("token");
    if (!token) {
      // 토큰 유무로 로그인 여부를 판단하여 로그인 상태가 아닐 경우 로그인 창으로
      router.push("/signIn");
      return;
    }

    console.log(moveDetails);

    try {
      const response = await fetch(
        `https://j11a302.p.ssafy.io/api/products/batch`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(moveDetails),
        }
      );

      console.log(response);

      if (response.ok) {
        // 성공
        const result = await response.json();
        notify(`상품을 이동했습니다.`);
        getStoreProductAPI(); // 정보가 반영된 테이블을 새로 불러온다.
      } else {
        notify(`이동에 실패했습니다.`);
      }
    } catch (error) {
      console.log(error);
      notify(`이동에 실패했습니다.`);
    }
  };

  const isBulkMoveEnabled =
    bulkMoveDetails.warehouseId &&
    bulkMoveDetails.locationName &&
    bulkMoveDetails.floorLevel &&
    bulkMoveDetails.movementDate;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>상품을 원하는 장소로 옮기세요</DialogTitle>
      <DialogContent>
        {/* Place the mode change button above the form */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            className={classes.modeButton}
            onClick={() => setIsBulkMove(!isBulkMove)}
            variant="text"
            color="primary"
          >
            {isBulkMove ? "모드 변경(전체 -> 개별)" : "모드 변경(개별 -> 전체)"}
          </Button>
        </div>
        {/* Wrap your content with LocalizationProvider */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {isBulkMove ? (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>매장 선택</InputLabel>
                <Select
                  value={bulkMoveDetails.warehouseId}
                  onChange={(e) =>
                    handleWarehouseSelectChange("warehouseId", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.storeName}
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
              <DatePicker
                label="이동 날짜 선택"
                value={bulkMoveDetails.movementDate}
                onChange={(newValue) =>
                  handleBulkInputChange("movementDate", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={!bulkMoveDetails.movementDate}
                    helperText={
                      !bulkMoveDetails.movementDate && "날짜를 선택하세요"
                    }
                  />
                )}
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
                  <InputLabel>물건이 옮겨질 매장 선택</InputLabel>
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
                    {stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.storeName}
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
                <DatePicker
                  label="이동 날짜 선택"
                  value={product.movementDate}
                  onChange={(newValue) =>
                    handleNewLocationChange(index, "movementDate", newValue)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!product.errors.movementDate}
                      helperText={product.errors.movementDate}
                    />
                  )}
                />
              </div>
            ))
          )}
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        {isBulkMove ? (
          <Button
            className={classes.moveButton}
            onClick={handleFinalizeBulkMove}
            disabled={!isBulkMoveEnabled}
          >
            옮기기
          </Button>
        ) : (
          <Button
            className={classes.moveButton}
            onClick={handleFinalizeDetailMove}
            disabled={!moveData.every((product) => product.floorLevel)}
          >
            옮기기
          </Button>
        )}
        <Button className={classes.cancelButton} onClick={onClose}>
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveProduct;
