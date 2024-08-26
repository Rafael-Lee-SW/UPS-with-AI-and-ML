import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Header from "../../components/Header/HomeHeader";
import HeaderLinks from "/components/Header/HomeHeaderLinks.js";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import CardSelect from "/components/Card/CardSelect.js";
import {
  Modal,
  Fade,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import styles from "/styles/jss/nextjs-material-kit/pages/componentsSections/selectStyle.js";

const useStyles = makeStyles(styles);

const Select = (props) => {
  const { ...rest } = props;
  const classes = useStyles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    containerName: "",
    containerSize: "",
    locationX: "",
    locationY: "",
    locationZ: "",
    row: "",
    column: "",
  });

  const [facilityType, setFacilityType] = useState("STORE");
  const [priority, setPriority] = useState(1);

  const [cards, setCards] = useState([]);
  const [userData, setUserData] = useState(null);
  const [businessData, setBusinessData] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [currentWarehouseCount, setCurrentWarehouseCount] = useState(0);
  const [allowedWarehouseCount, setAllowedWarehouseCount] = useState(0);

  const [validationErrors, setValidationErrors] = useState({});

  const handleOpen = async () => {
    const { presentCount, MaxCount } = await fetchWarehouseCounts(businessId);

    if (presentCount >= MaxCount) {
      alert("추가 생성을 위한 결제가 필요합니다.");
      router.push("/payment");
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm({ ...formData, [name]: value });
  };

  const handleFacilityTypeChange = (e) => {
    setFacilityType(e.target.value);
    if (e.target.value === "STORE") {
      setPriority(1);
    }
  };

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  };

  const validateForm = (data) => {
    const errors = {};

    if (data.containerName.length > 20) {
      errors.containerName = "20글자를 초과했습니다.";
    }

    const containerSize = parseInt(data.containerSize, 10);
    if (isNaN(containerSize) || containerSize < 300 || containerSize > 10000) {
      errors.containerSize = "잘못된 입력입니다.";
    }

    const locationZ = parseInt(data.locationZ, 10);
    if (isNaN(locationZ) || locationZ < 1 || locationZ > 10) {
      errors.locationZ = "잘못된 입력입니다.";
    }

    const locationX = parseInt(data.locationX, 10);
    const locationY = parseInt(data.locationY, 10);
    const row = parseInt(data.row, 10);
    const column = parseInt(data.column, 10);

    if (
      isNaN(locationX) ||
      isNaN(locationY) ||
      isNaN(row) ||
      isNaN(column) ||
      locationX <= 0 ||
      locationY <= 0 ||
      row <= 0 ||
      column <= 0
    ) {
      errors.locations = "잘못된 입력입니다.";
    } else {
      const totalWidth = column * locationX;
      const totalHeight = row * locationY;
      if (totalWidth > containerSize || totalHeight > containerSize) {
        errors.locations = "적재함이 창고 크기를 초과합니다.";
      }
    }

    setValidationErrors(errors);
  };

  const fetchWarehouseCounts = async (businessId) => {
    try {
      const warehouseCountResponse = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses/cnt/${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const subscriptionResponse = await fetch(
        `https://i11a508.p.ssafy.io/api/subscriptions?businessId=${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (warehouseCountResponse.ok && subscriptionResponse.ok) {
        const warehouseCountData = await warehouseCountResponse.json();
        const subscriptionData = await subscriptionResponse.json();
        const subscriptionCntDat = subscriptionData.result;

        const presentCount = warehouseCountData.result;
        const MaxCount = subscriptionCntDat[0].warehouseCount;

        setCurrentWarehouseCount(warehouseCountData.result);
        setAllowedWarehouseCount(subscriptionCntDat[0].warehouseCount);

        return { presentCount, MaxCount };
      } else {
        router.push('/404');
      }
    } catch (error) {
      router.push('/404');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!businessId) {
      router.push('/404');
      return;
    }

    const postData = {
      businessId,
      size: parseInt(formData.containerSize),
      columnCount: parseInt(formData.column),
      rowCount: parseInt(formData.row),
      name: formData.containerName || `Container ${cards.length + 1}`,
      priority: facilityType === "STORE" ? 1 : parseInt(priority),
      facilityTypeEnum: facilityType,
    };

    const { locationX, locationY, locationZ, row, column } = formData;

    // Calculate fixed spacing between columns and rows
    const columnSpacing = 10; // Fixed spacing of 10px between columns
    const rowSpacing = parseInt(locationY); // Distance between rows equal to the height of each location

    const locationData = [];
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        // Format row and column numbers as two-digit strings
        const rowNumber = (i + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros
        const columnNumber = (j + 1).toString().padStart(2, "0"); // Convert to string and pad with zeros

        // Calculate x and y positions with new spacing logic
        const xPosition = j * (parseInt(locationX) + columnSpacing);
        const yPosition = i * (parseInt(locationY) + rowSpacing);

        locationData.push({
          xPosition: xPosition,
          yPosition: yPosition,
          zSize: parseInt(locationZ),
          xSize: Math.round(parseInt(locationX)),
          ySize: Math.round(parseInt(locationY)),
          name: `${rowNumber}-${columnNumber}`,
          productStorageType: "상온",
          rotation: 0,
          touchableFloor: 2,
        });
      }
    }

    const wallData = generateWalls(locationData);

    try {
      const response = await fetch(
        "https://i11a508.p.ssafy.io/api/warehouses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        const newWarehouse = await response.json();
        const warehouses = newWarehouse.result;

        const warehousesId = warehouses.id;

        await postLocationAPI(locationData, warehousesId);
        await postWallAPI(wallData, warehousesId);

        const newCard = {
          id: newWarehouse.result.id,
          title: newWarehouse.result.name,
          image: "/img/sign.jpg",
        };

        await setCards((prev) => [...prev, newCard]);

        // 각 창고 카드에 대한 pcsCount 및 locationCount 요청
        fetchCounts(newCard.id);

        handleClose();
      } else {
        router.push('/404');
      }
    } catch (error) {
      router.push('/404');
    }
  };

  const generateWalls = (generatedLocations) => {
    if (generatedLocations.length === 0) return null;

    let minX = Number.MAX_VALUE,
      minY = Number.MAX_VALUE,
      maxX = 0,
      maxY = 0;

    generatedLocations.forEach((location) => {
      minX = Math.min(minX, location.xPosition);
      minY = Math.min(minY, location.yPosition);
      maxX = Math.max(maxX, location.xPosition + location.xSize);
      maxY = Math.max(maxY, location.yPosition + location.ySize);
    });

    const wallData = [
      { startX: minX, startY: minY, endX: maxX, endY: minY },
      { startX: maxX, startY: minY, endX: maxX, endY: maxY },
      { startX: maxX, startY: maxY, endX: minX, endY: maxY },
      { startX: minX, startY: maxY, endX: minX, endY: minY },
    ];

    return wallData;
  };

  const postLocationAPI = async (requests, warehouseId) => {

    const total = { requests, warehouseId };

    try {
      const response = await fetch(`https://i11a508.p.ssafy.io/api/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(total),
      });

      if (response.ok) {
      } else {
        router.push('/404');
      }
    } catch (error) {
      router.push('/404');
    }
  };

  const postWallAPI = async (wallDtos, warehouseId) => {
    const total = { wallDtos, warehouseId };

    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses/walls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(total),
        }
      );

      if (response.ok) {
      } else {
        router.push('/404');
      }
    } catch (error) {
      router.push('/404');
    }
  };

  const getAllWarehouseInfoAPI = async (businessId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/warehouses?businessId=${businessId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const apiConnection = await response.json();
        const warehouses = apiConnection.result;

        const warehouseCards = await warehouses.map((warehouse) => ({
          id: warehouse.id,
          title: warehouse.name,
          image: "/img/storeroom.webp",
        }));

        await setCards(warehouseCards);
        //모든 카드 정보를 받은 다음에 움직인다.
        // 각 창고 카드에 대한 pcsCount 및 locationCount 요청
        warehouseCards.forEach((card) => {
          fetchCounts(card.id);
        });

      } else {
        router.push('/404');
      }
    } catch (error) {
      router.push('/404');
    }
  };

  const fetchBusinessData = async (userId) => {
    try {
      const response = await fetch(
        `https://i11a508.p.ssafy.io/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        const businessInfo = userData.result;
        setBusinessData(businessInfo);
        setBusinessId(businessInfo.businessId);

        fetchWarehouseCounts(businessInfo.businessId);
        getAllWarehouseInfoAPI(businessInfo.businessId);
        
      } else {
        router.push('/404');
      }
    } catch (error) {
      router.push('/404');
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);

        fetchBusinessData(parsedUser.id);
      } catch (error) {
        router.push('/404');
      }
    }
  }, []);

  const fetchCounts = async (warehouseId) => {
    try {
      const pcsResponse = await axios.get(
        `https://i11a508.p.ssafy.io/api/warehouses/pcscnt/${warehouseId}`
      );
      const locationResponse = await axios.get(
        `https://i11a508.p.ssafy.io/api/warehouses/locationcnt/${warehouseId}`
      );
      const usageResponse = await axios.get(
        `https://i11a508.p.ssafy.io/api/warehouses/usage/${warehouseId}`
      );
      const warehouseTypeResponse = await axios.get(
        `https://i11a508.p.ssafy.io/api/warehouses/purpose/${warehouseId}`
      );

      const pcsCount = pcsResponse.data.result;
      const locationCount = locationResponse.data.result;
      const usagePercent = usageResponse.data.result; // 1부터 100까지
      const warehouseColor = warehouseTypeResponse.data.result; // 1부터 3까지

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === warehouseId
            ? {
                ...card,
                pcsCount,
                locationCount,
                usagePercent,
                warehouseColor,
              }
            : card
        )
      );
    } catch (error) {
      router.push('/404');
    }
  };

  // warehouseColor에 따른 배경 색상 및 usagePercent에 따른 색상 높이
  const getBackgroundColor = (color) => {
    switch (color) {
      case 1:
        return "#D6CABA";
      case 2:
        return "#C2B6A1";
      case 3:
        return "#918166";
      default:
        return "#D6CABA";
    }
  };

  const getWarehouseImage = (color) => {
    switch (color) {
      case 1:
        return "/img/warehouse1.png";
      case 2:
        return "/img/warehouse2.png";
      case 3:
        return "/img/warehouse3.png";
      default:
        return "/img/warehouse1.png";
    }
  };

  const handleDelete = async (warehouseId) => {
    try {
      await axios.patch(`https://i11a508.p.ssafy.io/api/warehouses/${warehouseId}`, {
        isDeleted: true,
      });

      // 삭제 후 카드 목록에서 해당 창고 제거
      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== warehouseId)
      );
    } catch (error) {
      router.push('/404');
    }
  };

  return (
    <div>
      <Header
        brand="FIT-BOX"
        rightLinks={<HeaderLinks />}
        fixed
        color="white"
        opacity="0.5"
        changeColorOnScroll={{
          height: 400,
          color: "white",
        }}
        {...rest}
      />

      <div className={classes.section}>
        <div className={classes.container}>
          <h3>
            창고를 선택하세요. ({currentWarehouseCount}/{allowedWarehouseCount})
          </h3>
          <GridContainer>
            {cards.map((card) => (
              <GridItem key={card.id} xs={12} sm={12} md={4}>
                <Link href={`/user/${card.id}`} passHref>
                  <CardSelect
                    component="a"
                    className={`${classes.cardLink} ${classes.imageCard}`}
                  >
                    <div className={classes.cardSelect}>
                      <div
                        className={classes.cardHeader}
                        style={{
                          backgroundColor: getBackgroundColor(
                            card.warehouseColor
                          ),
                          position: "relative",
                        }}
                      >
                        <img
                          src={getWarehouseImage(card.warehouseColor)}
                          alt="warehouse"
                          style={{
                            position: "absolute",
                            bottom: 0,
                            width: "30%", // 이미지 너비를 30%로 조정
                            height: "auto", // 높이를 자동으로 조정하여 비율 유지
                            borderLeft: "4px solid #000", // 왼쪽 테두리
                            borderRight: "4px solid #000", // 오른쪽 테두리
                            borderTop: "4px solid #000", // 위쪽 테두리
                            borderBottom: "none", // 아래쪽 테두리는 없음
                          }}
                        />
                        <img
                          src="/img/delete.png"
                          alt="delete"
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: "20px",
                            height: "20px",
                          }}
                          onClick={(e) => {
                            e.preventDefault(); // 링크 이동 방지
                            handleDelete(card.id);
                          }}
                        />
                      </div>
                      <div className={classes.cardBody}>
                        <h3>{card.title}</h3>
                        <div
                          style={{
                            width: "80%",
                            height: "30px",
                            backgroundColor: "lightgray",
                            borderRadius: "20px",
                            overflow: "hidden",
                            marginTop: "10px",
                            border: "2px solid #ccc",
                          }}
                        >
                          <div
                            style={{
                              width: `${card.usagePercent}%`,
                              height: "100%",
                              backgroundColor: getBackgroundColor(
                                card.warehouseColor
                              ),
                              display: "flex", // 플렉스 박스를 사용하여 중앙 정렬
                              justifyContent: "center", // 수평 중앙 정렬
                              alignItems: "center", // 수직 중앙 정렬
                              color: "white", // 텍스트 색상 (배경과 대비되도록 설정)
                              fontWeight: "bold", // 텍스트 굵게
                            }}
                          >
                            {" "}
                            {`${card.usagePercent}%`}
                          </div>
                        </div>
                      </div>

                      <div className={classes.cardFooter}>
                        <div className={classes.pcsContainer}>
                          <img
                            src="/img/box.png"
                            alt="pcsContainer"
                            className={classes.containerImage}
                          />
                          <div className="pcsCnt">{card.pcsCount}</div>
                        </div>

                        <div className={classes.locationContainer}>
                          <img
                            src="/img/location.png"
                            alt="location"
                            className={classes.containerImage}
                          />
                          <div className="locationCnt">
                            {card.locationCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardSelect>
                </Link>
              </GridItem>
            ))}
            <GridItem xs={12} sm={12} md={4} className={classes.plusCard}>
              <div className={classes.buttonCard} onClick={handleOpen}>
                <AddCircleOutline className={classes.plusButton} />
              </div>
            </GridItem>
          </GridContainer>
          <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
          >
            <Fade
              in={open}
              style={{
                justifyContent: "center",
              }}
            >
              <div className={classes.paper}>
                <h2>새 창고 정보 입력</h2>
                <form onSubmit={handleSubmit}>
                  <TextField
                    name="containerName"
                    label="창고 이름"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.containerName}
                    onChange={handleChange}
                    error={Boolean(validationErrors.containerName)}
                    helperText={
                      validationErrors.containerName || "20글자까지 가능합니다."
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.containerName ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="containerSize"
                    label="창고 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.containerSize}
                    onChange={handleChange}
                    error={Boolean(validationErrors.containerSize)}
                    helperText={
                      validationErrors.containerSize ||
                      `창고 부지의 크기: ${formData.containerSize} * ${
                        formData.containerSize
                      } = ${Math.pow(parseInt(formData.containerSize) || 0, 2)}`
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.containerSize ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="locationX"
                    label="Location(적재함) 가로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationX}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                  />
                  <TextField
                    name="locationY"
                    label="Location(적재함) 세로 크기"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationY}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                  />
                  <TextField
                    name="locationZ"
                    label="Location(적재함) 층수"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.locationZ}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locationZ)}
                    helperText={
                      validationErrors.locationZ ||
                      "1~10층까지 설정 가능합니다."
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.locationZ ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="row"
                    label="행"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.row}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                    helperText={
                      validationErrors.locations ||
                      "적재함 크기와 개수가 창고 크기를 초과할 수 없습니다."
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.locations ? "red" : "blue",
                      },
                    }}
                  />
                  <TextField
                    name="column"
                    label="열"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.column}
                    onChange={handleChange}
                    error={Boolean(validationErrors.locations)}
                  />
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormLabel component="legend">시설 유형</FormLabel>
                    <RadioGroup
                      aria-label="facilityType"
                      name="facilityType"
                      value={facilityType}
                      onChange={handleFacilityTypeChange}
                    >
                      <FormControlLabel
                        value="STORE"
                        control={<Radio />}
                        label="매장"
                      />
                      <FormControlLabel
                        value="WAREHOUSE"
                        control={<Radio />}
                        label="창고"
                      />
                    </RadioGroup>
                  </FormControl>
                  {facilityType === "WAREHOUSE" && (
                    <TextField
                      name="priority"
                      label="창고 출고 우선순위"
                      fullWidth
                      variant="outlined"
                      className={classes.formControl}
                      value={priority}
                      onChange={handlePriorityChange}
                      type="number"
                    />
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={Object.keys(validationErrors).length > 0}
                  >
                    Finish
                  </Button>
                </form>
              </div>
            </Fade>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Select;
