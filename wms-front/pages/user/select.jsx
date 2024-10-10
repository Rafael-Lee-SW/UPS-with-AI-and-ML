import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import Header from "../../components/Header/HomeHeader";
import HeaderLinks from "/components/Header/LogInHomeHeaderLinks.js";
import { makeStyles } from "@material-ui/core/styles";
// 아이콘 호출
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
//그리드
import GridContainer from "/components/Grid/GridContainer.js";
import GridItem from "/components/Grid/GridItem.js";
import CardSelect from "/components/Card/CardSelect.js";
import {
  Modal,
  Fade,
  Button,
  TextField,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/router";
import styles from "/styles/jss/nextjs-material-kit/pages/selectStyle.js";
import Cookies from "cookies"; // Cookie에 저장하기 위해서

const useStyles = makeStyles(styles);

const Select = ({ fetchedStores, ...rest }) => {
  const classes = useStyles();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  // 선택한 카드
  const [clickedCardId, setClickedCardId] = useState(null);
  const [formData, setFormData] = useState({
    storeName: "",
  });

  const [cards, setCards] = useState(fetchedStores || []); // Use fetchedStores as initial state
  const [currentWarehouseCount, setCurrentWarehouseCount] = useState(
    fetchedStores.length || 0
  );
  const [allowedWarehouseCount, setAllowedWarehouseCount] = useState(0);

  const [validationErrors, setValidationErrors] = useState({});

  // 삭제시 발생하는 경고
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [checkedWarning, setCheckedWarning] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpen = async () => {
    // const { presentCount, MaxCount } = await fetchWarehouseCounts(businessId);

    // if (presentCount >= MaxCount) {
    //   alert("추가 생성을 위한 결제가 필요합니다.");
    //   router.push("/payment");
    // } else {
    //   setOpen(true);
    // }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateForm({ ...formData, [name]: value });
  };

  // 유효값 검증
  const validateForm = (data) => {
    const errors = {};

    if (data.storeName.length > 20) {
      errors.storeName = "20글자를 초과했습니다.";
    } else if (data.storeName.trim() === "") {
      errors.storeName = "매장 이름을 입력해주세요.";
    }

    setValidationErrors(errors);
  };

  // 창고 생성 이후에 보내는 API functions
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    //창고 생성을 위한 데이터
    const postData = {
      size: 1000, // Fixed size at 1000
      storeName: formData.storeName || `Store ${cards.length + 1}`,
    };

    // 토큰에서 유저정보를 가져온다.(SSR이 아니기에 local에서 그냥 가져온다)
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      const response = await fetch("https://j11a302.p.ssafy.io/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the token in the Authorization header
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      console.log(response);

      if (response.ok) {
        const apiConnection = await response.json();
        const newStore = apiConnection.result;

        const newCard = {
          id: newStore.id,
          storeName: newStore.storeName,
          image: "/img/sign.jpg",
        };

        await setCards((prev) => [...prev, newCard]);

        handleClose();
      } else {
        router.push("/404");
      }
    } catch (error) {
      console.log(error);
      router.push("/404");
    }
  };

  // warehouseColor에 따른 배경 색상 및 usagePercent에 따른 색상 높이
  const getBackgroundColor = (color) => {
    switch (color) {
      case 1:
        return "#459ab6";
      case 2:
        return "#459ab6";
      case 3:
        return "#459ab6";
      default:
        return "#459ab6";
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

  const handleDeleteWarningOpen = (storeId) => {
    setStoreToDelete(storeId);
    setOpenDeleteDialog(true);
  };

  // 매장 삭제
  const handleDelete = async () => {
    //토큰 검증
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signIn");
      return;
    }

    try {
      await axios.patch(
        `https://j11a302.p.ssafy.io/api/stores/${storeToDelete}`,
        {}, // Empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Remove the deleted store from the cards array
      setCards((prevCards) =>
        prevCards.filter((card) => card.id !== storeToDelete)
      );
      setStoreToDelete(""); // 초기화
      setOpenDeleteDialog(false);
      setCheckedWarning(false);
      setOpenSnackbar(true); // Show notification
    } catch (error) {
      console.error("Error deleting store:", error);
      router.push("/user/select");
    }
  };

  // 카드 선택 시에 발생하는 function
  const handleCardClick = (e, cardId) => {
    e.preventDefault();
    if (clickedCardId === cardId) {
      setClickedCardId(null); // Deselect if clicked again
    } else {
      setClickedCardId(cardId); // Select the card
    }
  };

  const handleGetIn = (storeId) => {
    router.push(`/user/${storeId}`);
  };

  const handleEdit = (storeId) => {
    console.log("수정");
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
          <div className={classes.selectContainer}>
            {currentWarehouseCount === 0
              ? `매장을 생성하세요 (현재 매장 ${currentWarehouseCount}개)`
              : `매장을 선택하세요 (현재 매장 ${currentWarehouseCount}개)`}
          </div>
          <GridContainer>
            {cards.map((card) => (
              <GridItem
                key={card.id}
                xs={12}
                sm={4}
                md={4}
                className={classes.cardGrid}
              >
                <CardSelect
                  className={classes.cardLink}
                  onClick={(e) => handleCardClick(e, card.id)}
                >
                  <div
                    className={classes.cardHeader}
                    style={{
                      backgroundColor: getBackgroundColor(card.warehouseColor),
                    }}
                  >
                    <img
                      src={getWarehouseImage(card.warehouseColor)}
                      alt="warehouse"
                      className={classes.cardImage}
                    />
                  </div>
                  <div className={classes.cardBody}>
                    <h3>{card.storeName}</h3>
                    <div className={classes.cardMain}>
                      <div
                        className={classes.cardProgress}
                        style={{
                          width: `${card.usagePercent}%`,
                          backgroundColor: getBackgroundColor(
                            card.warehouseColor
                          ),
                        }}
                      ></div>
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
                      <div className="locationCnt">{card.locationCount}</div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  {clickedCardId === card.id && (
                    <div className={classes.actionButtons}>
                      <Button
                        className={classes.actionButtonSee}
                        variant="contained"
                        startIcon={<OpenInNewIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetIn(card.id);
                        }}
                      >
                        보기
                      </Button>
                      <Button
                        className={classes.actionButtonEdit}
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(card.id);
                        }}
                      >
                        수정
                      </Button>
                      <Button
                        className={classes.actionButtonDel}
                        variant="contained"
                        startIcon={<DeleteIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWarningOpen(card.id);
                        }}
                      >
                        삭제
                      </Button>
                    </div>
                  )}
                </CardSelect>
              </GridItem>
            ))}
            <GridItem xs={12} sm={4} md={4} className={classes.plusCardGrid}>
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
                <h2>새 매장 정보 입력</h2>
                <form onSubmit={handleSubmit}>
                  <TextField
                    name="storeName"
                    label="매장 이름"
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    value={formData.storeName}
                    onChange={handleChange}
                    error={Boolean(validationErrors.storeName)}
                    helperText={
                      validationErrors.storeName || "20글자까지 가능합니다."
                    }
                    FormHelperTextProps={{
                      style: {
                        color: validationErrors.storeName ? "red" : "blue",
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={Object.keys(validationErrors).length > 0}
                  >
                    완료
                  </Button>
                </form>
              </div>
            </Fade>
          </Modal>
          <Dialog
            open={openDeleteDialog}
            onClose={() => {
              setOpenDeleteDialog(false);
              setCheckedWarning(false);
            }}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">매장 삭제 확인</DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                매장을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은
                되돌릴 수 없습니다.
              </DialogContentText>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedWarning}
                    onChange={(e) => setCheckedWarning(e.target.checked)}
                    color="primary"
                  />
                }
                label="위 내용을 이해하였으며, 삭제를 진행합니다."
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenDeleteDialog(false);
                  setCheckedWarning(false);
                }}
                color="primary"
              >
                취소
              </Button>
              <Button
                onClick={handleDelete}
                color="secondary"
                disabled={!checkedWarning}
              >
                삭제
              </Button>
            </DialogActions>
          </Dialog>
          {/* Snackbar Notification */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={() => setOpenSnackbar(false)}
            message="매장이 삭제되었습니다"
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          />
        </div>
      </div>
    </div>
  );
};

// SSR part
export async function getServerSideProps({ req, res }) {
  //쿠키에서 토큰을 추출한다.
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  console.log(token);

  if (!token) {
    return {
      redirect: {
        destination: "/signIn",
        permanent: false,
      },
    };
  }

  try {
    const response = await fetch("https://j11a302.p.ssafy.io/api/stores", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const stores = data.result;

      const storeCards = stores.map((store) => ({
        id: store.id,
        storeName: store.storeName,
        image: "/img/storeroom.webp",
      }));

      return {
        props: { fetchedStores: storeCards }, // Pass data as props to the page
      };
    } else {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default Select;
